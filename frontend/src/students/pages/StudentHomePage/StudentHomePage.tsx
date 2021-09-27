import { useAuth } from 'shared';
import { Button } from '@material-ui/core';

const StudentHomePage = () => {
  const { loggedUser, signOut } = useAuth();
  return (
    <>
      <h1>Student Home</h1>
      <p>{loggedUser?.email}</p>
      <Button onClick={signOut} variant="outlined">
        Logout
      </Button>
    </>
  );
};

export { StudentHomePage };
