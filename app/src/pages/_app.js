// src/pages/_app.js
import { SessionProvider } from 'next-auth/react';
import Layout from '@/layouts/Layout';
import { NotificationProvider } from '@/components/NotificationSystem';
import '@/styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <NotificationProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NotificationProvider>
    </SessionProvider>
  );
}

export default MyApp;
