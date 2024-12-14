import  { useState } from 'react';
import { useSpring, animated } from 'react-spring';

const SpinWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    if (!spinning) {
      setSpinning(true);
      const randomDegree = Math.floor(Math.random() * 360 + 720); // Spin at least 2 full rotations
      setRotation(randomDegree);
      setTimeout(() => {
        setSpinning(false);
      }, 4000); // Duration of spin
    }
  };

  const props = useSpring({ transform: `rotate(${rotation}deg)` });

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <animated.div
        style={props}
        className="w-64 h-64 border-8 border-gray-300 rounded-full flex items-center justify-center"
      >
        {/* Add segments here */}
        <div className="absolute w-full h-full">
          {/* Example segments */}
          <div className="absolute w-1/2 h-1/2 bg-red-500" style={{ transform: 'rotate(0deg)' }} />
          <div className="absolute w-1/2 h-1/2 bg-blue-500" style={{ transform: 'rotate(45deg)' }} />
          <div className="absolute w-1/2 h-1/2 bg-green-500" style={{ transform: 'rotate(90deg)' }} />
          <div className="absolute w-1/2 h-1/2 bg-yellow-500" style={{ transform: 'rotate(135deg)' }} />
          <div className="absolute w-1/2 h-1/2 bg-purple-500" style={{ transform: 'rotate(180deg)' }} />
          <div className="absolute w-1/2 h-1/2 bg-pink-500" style={{ transform: 'rotate(225deg)' }} />
          <div className="absolute w-1/2 h-1/2 bg-orange-500" style={{ transform: 'rotate(270deg)' }} />
          <div className="absolute w-1/2 h-1/2 bg-teal-500" style={{ transform: 'rotate(315deg)' }} />
        </div>
      </animated.div>
      <button
        onClick={spin}
        className="mt-8 p-2 bg-blue-500 text-white rounded"
        disabled={spinning}
      >
        Spin the Wheel
      </button>
    </div>
  );
};

export default SpinWheel;