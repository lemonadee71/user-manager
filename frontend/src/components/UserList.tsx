import { useQuery } from '@tanstack/react-query';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import type { User } from '../types';

const UserList = () => {
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
  });

  return (
    <TableContainer className="max-w-5xl mx-auto" component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="font-bold">Name</TableCell>
            <TableCell className="font-bold">Username</TableCell>
            <TableCell className="font-bold">Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {query.data?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserList;
