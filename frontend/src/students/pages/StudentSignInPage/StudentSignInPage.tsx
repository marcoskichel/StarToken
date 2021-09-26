import React from 'react';
import { GoogleSignInButton } from 'shared';
import { Trans } from 'react-i18next';

const StudentSignInPage = () => {
  return (
    <div>
      <h1>
        <Trans i18nKey="student_sign_in__header" />
      </h1>
      <GoogleSignInButton />
    </div>
  );
};

export { StudentSignInPage };
