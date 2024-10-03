import { SessionProvider } from 'next-auth/react';

const NextAuthSessionProvider = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default NextAuthSessionProvider;