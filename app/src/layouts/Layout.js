import React from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';

const Layout = ({ children }) => {
    const router = useRouter();
    const noSidebarRoutes = ['/login', '/register'];

    // Verifica se deve exibir o Sidebar ou não
    const shouldShowSidebar = !noSidebarRoutes.includes(router.pathname);

    return (
        <div className="flex min-h-screen">
            {shouldShowSidebar && (
                <>
                    <Sidebar />
                </>
            )}
            <main>{children}</main>

        </div>
    );
};
export default Layout;
