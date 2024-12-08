import { Button } from '@material-tailwind/react';
import { useState } from 'react';
import { Wheel } from 'react-custom-roulette';

const BettingSpinWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null); // For showing the result

  const data = [
    { option: '1000', style: { backgroundColor: '#FFC107', textColor: '#FFF' } },
    { option: '500', style: { backgroundColor: '#FF5722', textColor: '#FFF' } },
    { option: '400', style: { backgroundColor: '#03A9F4', textColor: '#FFF' } },
    { option: '200', style: { backgroundColor: '#8BC34A', textColor: '#FFF' } },
    { option: '100', style: { backgroundColor: '#9C27B0', textColor: '#FFF' } },
    { option: '900', style: { backgroundColor: '#E91E63', textColor: '#FFF' } },
    { option: '800', style: { backgroundColor: '#FF9800', textColor: '#FFF' } },
    { option: '700', style: { backgroundColor: '#3F51B5', textColor: '#FFF' } },
  ];

  const handleSpinClick = () => {
    if (isSpinning) return; // Prevent double spins
    const resultFromServer = Math.floor(Math.random() * data.length);
    setPrizeNumber(resultFromServer);
    setMustSpin(true);
    setIsSpinning(true);
  };

  const handleSpinEnd = () => {
    setMustSpin(false);
    setIsSpinning(false);
    setResult(data[prizeNumber].option); // Display the prize result

    // Reset the result after a delay (e.g., 3 seconds)
    setTimeout(() => {
      setResult(null);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center drop-shadow-md">
        🌰 Betting Spin Wheel 🌰
      </h1>
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
          
            onStopSpinning={handleSpinEnd}
            fontFamily="Poppins"
            innerRadius={20}
            outerBorderColor="#FFD700"
            outerBorderWidth={12}
            radiusLineColor="#FFFFFF"
            radiusLineWidth={4}
            spinDuration={0.5}
            textColors={['#FFF']}
          />
          {result && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-xl font-bold rounded-full">
              Prize: {result}
            </div>
          )}
        </div>

        <Button
          className={`btn btn-primary transition-transform ${
            isSpinning ? 'btn-disabled opacity-50' : 'hover:scale-105'
          }`}
          onClick={handleSpinClick}
          disabled={isSpinning}
        >
          {isSpinning ? 'Spinning...' : 'Spin Now'}
        </Button>
      </div>
    </div>
  );
};

export default BettingSpinWheel;
