import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
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
      <TextField
        id="search"
        label="Search"
        variant="outlined"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-bold">Name</TableCell>
              <TableCell className="font-bold">Username</TableCell>
              <TableCell className="font-bold">Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserList;
