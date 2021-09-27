import { PropsWithChildren } from 'react';
import { AuthStatus, useAuth } from 'shared/contexts';
import { Redirect, Route } from 'react-router-dom';
import { StudentRoutes } from 'students';

interface Props {
  [key: string]: unknown;
}

const ProtectedRoute = (props: PropsWithChildren<Props>) => {
  const { children, ...rest } = props;
  const { status } = useAuth();

  const render = () => {
    if (status === AuthStatus.AUTHENTICATED) {
      return children;
    }
    if (status === AuthStatus.UNAUTHENTICATED) {
      return <Redirect to={StudentRoutes.SIGN_IN} />;
    }

    return null;
  };

  return <Route render={render} {...rest} />;
};

export { ProtectedRoute };
