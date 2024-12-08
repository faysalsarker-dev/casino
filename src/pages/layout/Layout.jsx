
import { Outlet } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";
import Topbar from "../../components/navigation/Topbar";



const Layout = () => {
    return (
        <div className="bg-background-dark min-h-screen">
            <Topbar/>
            <Outlet/>
            <Navbar/>
        </div>
    );
};

export default Layout;