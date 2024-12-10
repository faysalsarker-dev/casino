import { useContext } from "react";
import { ContextData } from './../../utility/ContextData';



const useAuth = () => {
  const auth = useContext(ContextData);
  return auth;
};

export default useAuth;