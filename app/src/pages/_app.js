// Exemplo em uma página, como src/pages/index.js

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import styles from '@/styles/globals.css'


function HomePage() {
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
        <div >
            <div>
            <Sidebar isOpen={isSidebarOpen} />
            </div>
            {/* Resto do conteúdo da página */}
        </div>
    );
}

export default HomePage;
