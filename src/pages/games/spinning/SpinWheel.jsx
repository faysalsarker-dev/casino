import { Wheel } from 'react-custom-roulette';
import PropTypes from 'prop-types';

const SpinWheel = ({mustSpin,prizeNumber,segments,handleSpinEnd}) => {
    return (
      <div className="flex flex-col relative items-center justify-center overflow-hidden">
          <div className="p-4 ">
   <div className='relative '>
        <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={segments}
        onStopSpinning={handleSpinEnd}
        outerBorderColor="#fff"
        outerBorderWidth={5}
        radiusLineWidth={5}
        radiusLineColor="#ccc"
        textColors={['#fff']}
        fontSize={25}
        // startingOptionIndex={prizeNumber}
        disableInitialAnimation={true}
        spinDuration={mustSpin ? 0.8 : 0}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg z-10 "> . </div>
   </div>
      </div>
      </div>
    );
};
SpinWheel.propTypes = {
  mustSpin: PropTypes.bool.isRequired,
  prizeNumber: PropTypes.number.isRequired,
  segments: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSpinEnd: PropTypes.func.isRequired,
};

export default SpinWheel;
