import { FaFacebook, FaTelegram, FaWhatsapp, FaTwitter } from "react-icons/fa";
import { Button } from "@material-tailwind/react";

const Support = () => {
  return (
    <div className="bg-gray-900 p-6 text-white">
      {/* Header Section */}
      <div className="bg-primary p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">Support Center</h1>
        <p className="text-sm opacity-80">Connect with us through your preferred platform</p>
      </div>

      {/* Support Links */}
      <div className="bg-gray-800 shadow-md rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold">Support Links</h2>

        {/* Links Section */}
        <div className="space-y-4">
          <Button
            variant="outlined"
            color="blue"
            className="w-full flex items-center justify-between p-4"
            onClick={() => window.open("https://facebook.com", "_blank")}
          >
            <span className="flex items-center">
              <FaFacebook size={24} className="mr-4 text-blue-500" /> Facebook
            </span>
            <span>Visit</span>
          </Button>

          <Button
            variant="outlined"
            color="blue"
            className="w-full flex items-center justify-between p-4"
            onClick={() => window.open("https://telegram.org", "_blank")}
          >
            <span className="flex items-center">
              <FaTelegram size={24} className="mr-4 text-blue-400" /> Telegram
            </span>
            <span>Visit</span>
          </Button>

          <Button
            variant="outlined"
            color="green"
            className="w-full flex items-center justify-between p-4"
            onClick={() => window.open("https://whatsapp.com", "_blank")}
          >
            <span className="flex items-center">
              <FaWhatsapp size={24} className="mr-4 text-green-400" /> WhatsApp
            </span>
            <span>Visit</span>
          </Button>

          <Button
            variant="outlined"
            color="blue"
            className="w-full flex items-center justify-between p-4"
            onClick={() => window.open("https://twitter.com", "_blank")}
          >
            <span className="flex items-center">
              <FaTwitter size={24} className="mr-4 text-blue-300" /> Twitter
            </span>
            <span>Visit</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Support;
