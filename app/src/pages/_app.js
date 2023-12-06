// Exemplo em uma página, como src/pages/index.js

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Sidebar from '@/components/sidebar';
import styles from '@/styles/globals.css'
import Home from './home';


function HomePage({ Component, pageProps }) {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        function handleOutsideClick(event) {
            if (!event.target.closest('.sidebar')) {
                setSidebarOpen(false);
            }
        }

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <>
        <Head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
            {/* Outros elementos de Head que você deseja incluir */}
        </Head>
        <Sidebar />
        <main>
            <Component {...pageProps} />
        </main>
    </>
    );
}

export default HomePage;
