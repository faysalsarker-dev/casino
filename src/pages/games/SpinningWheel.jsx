// import React, { useState } from 'react';
// import { SpinWheel } from 'spin-wheel-game';

// const segments = [
//   { segmentText: '1x', segColor: '#FF4D4D' },
//   { segmentText: '2x', segColor: '#4D79FF' },
//   { segmentText: '0.5x', segColor: '#4DFF88' },
//   { segmentText: '10x', segColor: '#FF4D4D' },
//   { segmentText: '0.0x', segColor: '#4D79FF' },
//   { segmentText: '2x', segColor: '#4DFF88' },
//   { segmentText: '1x', segColor: '#4DFF88' },
//   { segmentText: '0.10x', segColor: '#4DFF88' },
// ];

// const SpinningWheel = () => {
//   const [spinResult, setSpinResult] = useState(null);

//   const handleSpinFinish = (result) => {
//     setSpinResult(result);
//     console.log(`Spun to: ${result}`);
//     // Additional logic for custom results (e.g., update user balance)
//   };

//   const spinWheelProps = {
//     segments,
//     onFinished: handleSpinFinish,
//     primaryColor: 'linear-gradient(45deg, #333333, #000000)', // Dark theme
//     contrastColor: '#FFFFFF', // Text color
//     buttonText: 'Spin & Win!',
//     isOnlyOnce: false,
//     size: 300,
//     upDuration: 150,
//     downDuration: 700,
//     fontFamily: 'Arial, sans-serif',
//     arrowLocation: 'top',
//     showTextOnSpin: true,
//     isSpinSound: true,
//   };

//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '100vh',
//         backgroundColor: '#1A1A1A', // Casino background
//         color: '#FFF',
//         fontFamily: 'Arial, sans-serif',
//       }}
//     >
//       <h1 style={{ marginBottom: '20px', textShadow: '0px 0px 10px #FF4D4D' }}>
//         Spin the Wheel and Win Big!
//       </h1>
//       <div
//         style={{
//           boxShadow: '0px 0px 20px 5px rgba(255, 255, 255, 0.5)',
//           borderRadius: '50%',
//           padding: '10px',
//           background: 'radial-gradient(circle, #222222, #111111)',
//         }}
//       >
//         <SpinWheel {...spinWheelProps} />
//       </div>
//       {spinResult && (
//         <div
//           style={{
//             marginTop: '20px',
//             padding: '10px 20px',
//             borderRadius: '8px',
//             background: 'rgba(255, 255, 255, 0.1)',
//             boxShadow: '0px 0px 10px #FF4D4D',
//           }}
//         >
//           <h3>Congratulations! 🎉</h3>
//           <p>
//             You won <strong>{spinResult}</strong>!
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SpinningWheel;
import React from 'react';

const SpinningWheel = () => {
  return (
    <div>
      
    </div>
  );
};

export default SpinningWheel;
