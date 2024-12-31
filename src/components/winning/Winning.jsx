/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import winImage from '../../images/winning.png';

const Winning = ({ amount = 100 }) => {
  const [isVisible, setIsVisible] = useState(true);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
     
    }, 3000); 

    return () => clearTimeout(timer); 
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }} 
        >
          <motion.div
            style={{
              backdropFilter: 'blur(9px) saturate(139%)',
              WebkitBackdropFilter: 'blur(9px) saturate(139%)',
              backgroundColor: 'rgba(255, 255, 255, 0.59)',
            }}
            className="rounded-lg p-6 flex flex-col items-center gap-4 shadow-lg relative"
            initial={{ scale: 0.5 }} // Start scaled down
            animate={{ scale: 1 }} // Scale to normal
            exit={{ scale: 0.5 }} // Scale down on exit
            transition={{ duration: 0.3, type: 'spring', stiffness: 200 }} // Faster and snappier
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setIsVisible(false);
                
              }}
              className="absolute top-2 text-xl right-2 text-gray-600 hover:text-gray-800 font-bold"
            >
              ✕
            </button>

            {/* Winning Image */}
            <img src={winImage} alt="You win" className="w-full max-w-xs" />

            {/* Amount */}
            <p className="text-7xl -mt-16 font-extrabold text-center text-orange-500">
              {amount}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Winning;
