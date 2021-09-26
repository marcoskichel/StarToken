import React from 'react';
import { FirebaseProvider, useFirebase } from './FirebaseContext';
import { render, screen } from '@testing-library/react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

jest.mock('firebase/app');
jest.mock('firebase/analytics');

describe('FirebaseContext', () => {
  const App = () => {
    const { firebaseApp, firebaseAnalytics } = useFirebase();

    return (
      <div>
        <span>{firebaseApp && 'Firebase app is defined'}</span>
        <span>{firebaseAnalytics && 'Firebase analytics is defined'}</span>
      </div>
    );
  };

  const AppWithProviders = () => (
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  );

  const mockInitializeApp = initializeApp as jest.Mock;
  mockInitializeApp.mockReturnValue(true);

  const mockGetAnalytics = getAnalytics as jest.Mock;
  mockGetAnalytics.mockReturnValue(true);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize firebase app just once', () => {
    render(<AppWithProviders />);
    expect(initializeApp).toHaveBeenCalledTimes(1);
  });

  it('should initialize firebase analytics just once', () => {
    render(<AppWithProviders />);
    expect(getAnalytics).toHaveBeenCalledTimes(1);
  });

  it('should expose firebase app', async () => {
    render(<AppWithProviders />);
    const el = await screen.findByText('Firebase app is defined');
    await expect(el).toBeInTheDocument();
  });

  it('should expose firebase analytics', async () => {
    render(<AppWithProviders />);
    const el = await screen.findByText('Firebase analytics is defined');
    await expect(el).toBeInTheDocument();
  });
});
