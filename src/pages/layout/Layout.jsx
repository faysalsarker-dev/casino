
import { Outlet } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";
import Topbar from "../../components/navigation/Topbar";



const Layout = () => {
    return (
        <div className="bg-background min-h-screen">
            <Topbar/>
            <Outlet/>
            <Navbar/>
        </div>
    );
};

export default Layout;