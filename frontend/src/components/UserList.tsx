import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { matchSorter } from 'match-sorter';
import type { User } from '../types';
import CreateUserForm from './CreateUserForm';

const UserList = () => {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState('');
  const query = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch(
        import.meta.env.VITE_PUBLIC_API_URL + '/api/users',
      );

      if (!response.ok) return [];

      const users = (await response.json()) as User[];

      return users;
    },
    placeholderData: [],
  });
  const allUsers = query.data ?? [];
  const filteredUsers = searchText
    ? matchSorter(allUsers, searchText, { keys: ['name', 'username', 'email'] })
    : allUsers;

  const deleteMutation = useMutation({
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

  const handleDelete = (id: number) => deleteMutation.mutate(id);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-row justify-between items-center">
        <TextField
          id="search"
          label="Search"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-4"
        />
        <CreateUserForm />
      </div>
      <LinearProgress
        style={{ display: query.isFetching ? 'block' : 'none' }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-bold">Name</TableCell>
              <TableCell className="font-bold">Username</TableCell>
              <TableCell className="font-bold">Email</TableCell>
              <TableCell className="font-bold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="flex flex-row gap-5">
                  <IconButton
                    size="medium"
                    color="error"
                    onClick={() => handleDelete(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserList;
