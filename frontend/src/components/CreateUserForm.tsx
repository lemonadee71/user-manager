/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment */

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '../types';
import { ApiError } from '../lib/errors';
import { UserSchema } from '../lib/models';

const CreateUserForm = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { control, handleSubmit, setError, reset } = useForm({
    resolver: zodResolver(UserSchema),
  });
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof UserSchema>) => {
      const response = await fetch(
        import.meta.env.VITE_PUBLIC_API_URL + '/api/users',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );

      if (response.status === 409) {
        throw new ApiError('Duplicate email', {
          email: { message: 'Duplicate email' },
        });
      }

      const res = await response.json();

      if (!res.success) {
        throw new ApiError(res.message, res.details);
      }

      return res.user as User;
    },
    onSuccess: async () => {
      handleClose();
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (e) => {
      if (e instanceof ApiError) {
        if (e.details) {
          for (const key in e.details) {
            setError(key as keyof z.infer<typeof UserSchema>, {
              message: e.details[key].message,
            });
          }
        } else {
          setErrorMessage(e.message);
        }
      } else {
        setErrorMessage(e.message);
      }
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setErrorMessage(null);
  };

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Create User
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs">
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          {errorMessage && (
            <Alert className="mb-4" severity="error">
              {errorMessage}
            </Alert>
          )}
          <form
            id="create-user-form"
            // eslint-disable-next-line
            onSubmit={(e) => onSubmit(e)}
          >
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => {
                return (
                  <TextField
                    {...field}
                    id={field.name}
                    label="Name"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    autoFocus
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="username"
              render={({ field, fieldState }) => {
                return (
                  <TextField
                    {...field}
                    id={field.name}
                    label="Username"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    autoFocus
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => {
                return (
                  <TextField
                    {...field}
                    id={field.name}
                    label="Email"
                    type="email"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    autoFocus
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                );
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-user-form"
            variant="contained"
            loading={mutation.isPending}
            disabled={mutation.isPending}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateUserForm;
