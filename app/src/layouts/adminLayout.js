import Sidebar from "@/components/Sidebar";
import { useRouter } from 'next/router';

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const noSidebarRoutes = ['/', '/login', '/register',];
  const shouldShowSidebar = !noSidebarRoutes.includes(router.pathname);

  return (
    <div>
      {shouldShowSidebar && <Sidebar />}
      <section>{children}</section>
    </div>
  );
};

export default AdminLayout;
