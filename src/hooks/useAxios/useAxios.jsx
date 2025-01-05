import axios from "axios";

const axiosCommon = axios.create({
  baseURL: 'https://casino-ruby.vercel.app' ,

});

const useAxios = () => {
  return axiosCommon;
};

export default useAxios;