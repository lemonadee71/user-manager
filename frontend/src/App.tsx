import { Typography } from '@mui/material';
import UserList from './components/UserList';

function App() {
  return (
    <div className="container mx-auto mt-20">
      <Typography
        variant="h3"
        className="text-blue-500 font-bold text-center mb-10"
      >
        User Manager
      </Typography>
      <UserList />
    </div>
  );
}

export default App;
