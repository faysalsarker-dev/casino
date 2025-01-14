import axios from "axios";

const axiosSecure = axios.create({

     baseURL:import.meta.env.VITE_BACKEND_BASE_URL || 'https://api.xbetbd.live',
  
    withCredentials: true, 
});



const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
