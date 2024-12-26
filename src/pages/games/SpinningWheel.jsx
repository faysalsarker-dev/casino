import React, { useState } from 'react';
import { Wheel } from 'react-custom-roulette';

const SpinningWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const segments = [
    { option: '0$', style: { backgroundColor: '#FFC107', textColor: '#fff' } },
    { option: '1000$', style: { backgroundColor: '#FF5722', textColor: '#fff' } },
    { option: '10$', style: { backgroundColor: '#FF9800', textColor: '#fff' } },
    { option: '5$', style: { backgroundColor: '#8BC34A', textColor: '#fff' } },
    { option: '20$', style: { backgroundColor: '#009688', textColor: '#fff' } },
    { option: '1$', style: { backgroundColor: '#3F51B5', textColor: '#fff' } },
    { option: '100$', style: { backgroundColor: '#E91E63', textColor: '#fff' } },
    { option: '50$', style: { backgroundColor: '#9C27B0', textColor: '#fff' } },
  ];

  const handleSpinClick = () => {
    const randomPrize = Math.floor(Math.random() * segments.length);
    setPrizeNumber(randomPrize);
    setMustSpin(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      {/* Ball in the center */}
      <div className="relative">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={segments}
          onStopSpinning={() => {
            setMustSpin(false);
            alert(`Congratulations! You won ${segments[prizeNumber].option}`);
          }}
          outerBorderColor="#fff"
          outerBorderWidth={10}
          radiusLineWidth={5}
          radiusLineColor="#ccc"
          textColors={['#fff']}
          fontSize={25}
          perpendicularText={'spin'}
          spinDuration={0.6} // Fast spin duration
        />
        {/* Ball */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg z-10" >spin</div>
      </div>

      <button
        onClick={handleSpinClick}
        className="mt-5 px-6 py-2 bg-blue-500 text-white font-bold rounded shadow hover:bg-blue-600 transition duration-200"
      >
        Spin
      </button>
    </div>
  );
};

export default SpinningWheel;
