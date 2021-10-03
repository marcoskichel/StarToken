import React from 'react';
import { Trans } from 'react-i18next';
import { Container, GoogleSignInButton } from 'shared';

const StudentSignInPage = () => {
  return (
    <Container>
      <h1>
        <Trans i18nKey="student_sign_in__header" />
      </h1>
      <GoogleSignInButton />
    </Container>
  );
};

export { StudentSignInPage };
