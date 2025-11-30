import type { User } from '../types';
import { IconButton, TableCell, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UserRowProps {
  data: User;
}

const UserRow = ({ data }: UserRowProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(
        import.meta.env.VITE_PUBLIC_API_URL + `/api/users/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

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

  const handleDelete = (id: number) => mutation.mutate(id);

  return (
    <TableRow>
      <TableCell>{data.name}</TableCell>
      <TableCell>{data.username}</TableCell>
      <TableCell>{data.email}</TableCell>
      <TableCell className="flex flex-row gap-5">
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
