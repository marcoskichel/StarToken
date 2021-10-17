import { Container, Navigation, useAuth } from 'shared';

const StudentHomePage = () => {
  const { loggedUser } = useAuth();
  return (
    <>
      <Navigation title="shared__home" />
      <Container>
        <p>{loggedUser?.email}</p>
      </Container>
    </>
  );
};

export { StudentHomePage };
