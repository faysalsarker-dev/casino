import { Button } from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth/useAuth';

const Topbar = () => {
    const {user,userInfo , userInfoloading}=useAuth()
    return (
        <div className=" bg-background-dark px-2 py-4 flex justify-between items-center shadow-xl rounded-lg">
            {/* Logo Section */}
            <div className="text-3xl font-extrabold flex items-center text-white">
                Ca<span className="text-primary">sino</span>
            </div>

            {/* Balance Information and Buttons */}
            <div className="flex gap-3">
    {!user ? (

<>
        <button 
            className="px-4 py-2 border-2 border-primary text-primary rounded-md hover:bg-secondary hover:text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-secondary"
        >
           <Link to='/login'> Login</Link>
        </button>
    
       
        <Button 
            className="bg-primary px-5 py-2 text-white rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-secondary"
        >
          <Link to='/register'>  Sign Up</Link>
        </Button>
    
    
</>
    ):(
        !userInfoloading ? (
            <div className='text-white'>
            {userInfo?.depositBalance || 0 }
            <br />
            {userInfo.winBalance || 0}
        </div>
        ):(
            <p className='text-white'>Loading...</p>
        )
     
    )}


</div>

        </div>
    );
};

export default Topbar;
