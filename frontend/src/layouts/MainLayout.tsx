import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div>
            <header>Header chung</header>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
