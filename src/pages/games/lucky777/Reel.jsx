import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Reel = ({ isSpinning, finalSymbol, symbolHeight, symbols }) => {
    const finalPosition = symbols.indexOf(finalSymbol);
   
    const spinVariants = {
      spinning: {
        y: [0, -symbolHeight * symbols.length],
        transition: {
          y: {
            repeat: Infinity,
            duration: 0.2, 
            ease: 'linear',
          },
        },
      },
      stopped: {
        y: -finalPosition * symbolHeight,
        transition: {
          duration: 0.3,
          ease: 'easeOut',
        },
      },
    };
  
    return (
      <div
        className="overflow-hidden h-28 w-28 border-4 rounded-lg shadow-lg neon-border"
        style={{
          height: `${symbolHeight}px`,
          backgroundColor: '#1a1a2e',
          boxShadow: '0 0 20px #e0aaff, inset 0 0 10px #e0aaff',
          border: '2px solid #e0aaff',
        }}
      >
        <motion.div
          className="flex flex-col"
          variants={spinVariants}
          animate={isSpinning ? 'spinning' : 'stopped'}
        >
          {symbols.map((symbol, index) => (
            <div
              key={index}
              className="h-28 flex items-center justify-center text-4xl font-extrabold text-yellow-400"
              style={{ height: `${symbolHeight}px` }}
            >
              {symbol}
            </div>
          ))}
        </motion.div>
      </div>
    );
    };
    Reel.propTypes = {
        isSpinning: PropTypes.bool.isRequired,
        finalSymbol: PropTypes.string.isRequired,
        symbolHeight: PropTypes.number.isRequired,
        symbols: PropTypes.arrayOf(PropTypes.string).isRequired,
      };
  
  export default Reel;
  
