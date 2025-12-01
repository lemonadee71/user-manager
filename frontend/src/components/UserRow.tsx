/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment */

import { useState } from 'react';
import { IconButton, TableCell, TableRow, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User } from '../types';
import { UserSchema } from '../lib/models';
import { ApiError } from '../lib/errors';
import { API_URL } from '../lib/constants';

interface UserRowProps {
  data: User;
}

const UserRow = ({ data }: UserRowProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { control, handleSubmit, setValue, setError, reset } = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: data,
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(API_URL + `/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to delete user');

      const { user } = (await response.json()) as { user: User };

      return user;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (e) => {
      alert(e.message);
    },
  });
  const updateMutation = useMutation({
    mutationFn: async (newData: z.infer<typeof UserSchema>) => {
      const response = await fetch(API_URL + `/api/users/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

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
      stopEditing();
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
          alert(e.message);
        }
      } else {
        alert(e.message);
      }
    },
  });

  const startEditing = () => {
    setIsEditing(true);
    setValue('name', data.name);
    setValue('username', data.username);
    setValue('email', data.email);
  };

  const stopEditing = () => {
    setIsEditing(false);
    reset();
  };

  const handleDelete = (id: number) => deleteMutation.mutate(id);

  // TODO: Only update if actual changes are made
  const handleSave = handleSubmit((data) => {
    updateMutation.mutate(data);
  });

  return (
    <TableRow className="min-h-12">
      <TableCell className="min-w-36">
        {isEditing ? (
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => {
              return (
                <TextField
                  {...field}
                  id={field.name}
                  size="small"
                  slotProps={{
                    input: {
                      style: { padding: '4px 8px', fontSize: 14 },
                    },
                    formHelperText: {
                      style: { margin: 0, minHeight: 18, fontSize: 12 },
                    },
                  }}
                  margin="none"
                  variant="outlined"
                  autoFocus
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              );
            }}
          />
        ) : (
          data.name
        )}
      </TableCell>
      <TableCell className="min-w-36">
        {isEditing ? (
          <Controller
            control={control}
            name="username"
            render={({ field, fieldState }) => {
              return (
                <TextField
                  {...field}
                  id={field.name}
                  size="small"
                  slotProps={{
                    input: {
                      style: { padding: '4px 8px', fontSize: 14 },
                    },
                    formHelperText: {
                      style: { margin: 0, minHeight: 18, fontSize: 12 },
                    },
                  }}
                  margin="none"
                  variant="outlined"
                  autoFocus
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              );
            }}
          />
        ) : (
          data.username
        )}
      </TableCell>
      <TableCell className="min-w-36">
        {isEditing ? (
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => {
              return (
                <TextField
                  {...field}
                  id={field.name}
                  size="small"
                  slotProps={{
                    input: {
                      style: { padding: '4px 8px', fontSize: 14 },
                    },
                    formHelperText: {
                      style: { margin: 0, minHeight: 18, fontSize: 12 },
                    },
                  }}
                  margin="none"
                  variant="outlined"
                  autoFocus
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              );
            }}
          />
        ) : (
          data.email
        )}
      </TableCell>
      <TableCell className="min-w-36 flex flex-row gap-2">
        {isEditing ? (
          <>
            <IconButton
              size="medium"
              color="primary"
              onClick={() => {
                // eslint-disable-next-line
                handleSave();
              }}
              loading={updateMutation.isPending}
              disabled={updateMutation.isPending}
            >
              <SaveIcon />
            </IconButton>
            <IconButton size="medium" color="default" onClick={stopEditing}>
              <CancelIcon />
            </IconButton>
          </>
        ) : (
          <IconButton size="medium" color="default" onClick={startEditing}>
            <EditIcon />
          </IconButton>
        )}

        <IconButton
          size="medium"
          color="error"
          onClick={() => handleDelete(data.id)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
