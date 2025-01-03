import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAxiosSecure from './../../hooks/useAxiosSecure/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Support = () => {
  const axiosSecure = useAxiosSecure();

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['Support'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/supports');
      return data;
    },
  });

  const getThemeColor = (name) => {
    switch (name.toLowerCase()) {
      case 'facebook':
        return 'blue-600';
      case 'whatsapp':
        return 'green-500';
      case 'twitter':
        return 'blue-400';
      case 'instagram':
        return 'pink-500';
      case 'linkedin':
        return 'blue-700';
      case 'telegram':
        return 'blue-500';
      default:
        return 'gray-500';
    }
  };

  return (
    <div className="bg-background p-6 text-text-primary">
      {/* Header Section */}
      <div className="bg-background-section mt-20 p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">Support Center</h1>
        <p className="text-sm opacity-80">Connect with us through your preferred platform</p>
      </div>

      {/* Support Links */}
      <div className="bg-background-secondary shadow-md rounded-lg p-3 space-y-6">
       

        {/* Links Section */}
        <div className="space-y-4">
          {isLoading && (
            Array(5).fill().map((_, idx) => (
              <div key={idx} className="w-full flex items-center justify-between p-4 border-2">
                <Skeleton width={120} />
                <Skeleton width={60} />
              </div>
            ))
          )}

          {isError && <p className="text-red-500">Failed to load support links. Please try again later.</p>}

          {data.length === 0 && !isLoading && !isError && (
            <p className="text-red-500">No support links available at the moment.</p>
          )}

          {data?.map((support, idx) => (
            <Link key={idx} to={support.link} target="_blank" rel="noopener noreferrer">
              <div
                className={`w-full flex items-center my-4 justify-between p-4 border-2 rounded-lg border-${getThemeColor(
                  support?.name || ''
                )}`}
              >
                <img className='w-8' src={support?.icon} alt="" />
                <span className="flex items-center gap-2">
                
                  <span className="capitalize">{support?.name || 'Unknown'}</span>
                </span>
                <span className="font-semibold">Visit</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;
