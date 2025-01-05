import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth/useAuth";
import Loading from "../../components/loading/Loading";

const Protector = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    Swal.fire({
      title: "আপনাকে লগইন করতে হবে",
      text: "এই ফিচারটি ব্যবহারের জন্য লগইন করুন",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "লগইন",
      cancelButtonText: "বন্ধ করুন",
      customClass: {
        confirmButton: "bg-primary text-white px-4 py-2 rounded mr-4",
        cancelButton: "bg-secondary text-white px-4 py-2 rounded ",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      } else {
        navigate("/");
      }
    });

    return null; 
  }

  return children;
};

Protector.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Protector;
