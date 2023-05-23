import { Outlet } from 'react-router-dom';
import Header from './header';

const MainLayout = () => {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
}

export default MainLayout;
