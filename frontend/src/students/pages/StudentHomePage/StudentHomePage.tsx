import { Container, Navigation, useAuth } from 'shared';

const StudentHomePage = () => {
  const { loggedUser } = useAuth();
  return (
    <>
      <Navigation title="student_home__title" />
      <Container>
        <p>{loggedUser?.email}</p>
      </Container>
    </>
  );
};

export { StudentHomePage };
