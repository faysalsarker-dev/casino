
import { Outlet } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";
import Topbar from "../../components/navigation/Topbar";



const Layout = () => {
    return (
        <div className="bg-background min-h-screen ">
          <div className='max-w-6xl mx-auto'>
                <Topbar/>
                <Outlet/>
                <Navbar/>
          </div>
        </div>
    );
};

export default Layout;