import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
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

import { matchSorter } from 'match-sorter';
import type { User } from '../types';
import CreateUserForm from './CreateUserForm';
import UserRow from './UserRow';

const UserList = () => {
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
              <UserRow key={user.id} data={user} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserList;
