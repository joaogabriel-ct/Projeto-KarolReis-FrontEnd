// src/pages/_app.js
import { SessionProvider } from 'next-auth/react';
import Layout from '@/layouts/Layout';
import AdminLayout from '@/layouts/adminLayout';
import '@/styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      {<AdminLayout><Component {...pageProps} /></AdminLayout>}
    </SessionProvider>
  );
}

export default MyApp;
