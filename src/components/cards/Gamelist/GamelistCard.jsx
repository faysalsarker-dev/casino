import { Typography } from '@material-tailwind/react';
import { Button } from '@material-tailwind/react';
import { Link } from 'react-router-dom';


const GamelistCard = ({data}) => {
    const {name,image,path ,description}= data || {}
    return (
        <>
              <div
              className="flex items-center justify-between  p-3 rounded-lg bg-background-section"
            >
              <div className="flex items-center justify-center gap-x-3">
                <img className='w-20' src={image} alt={name} />
                <div className='flex flex-col'>
                  <Typography className='text-text-primary' variant="h6">
                    {name}
                  </Typography>
               <span className='text-gray-300 p-1'>
{description}
               </span>
                </div>
              </div>
             <Link to={path}><Button className='bg-primary'>play now</Button></Link>
            </div>
        </>
    );
};

export default GamelistCard;