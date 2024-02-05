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
    <div className="flex">
            <Sidebar />
        <div className="flex-grow">
                <Component {...pageProps} />
        </div>
    </div>
    );
}

export default HomePage;
