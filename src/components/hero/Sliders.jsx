import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import useAxios from '../../hooks/useAxios/useAxios';
import { useQuery } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton styles
import { Card, CardHeader } from '@material-tailwind/react';

export default function Sliders() {
  const axiosCommon = useAxios();

  const { data: slides = [], isLoading, isError } = useQuery({
    queryKey: ['sliders'],
    queryFn: async () => {
      const { data } = await axiosCommon.get(`/sliders`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="mt-6 w-96 space-y-4">
        {Array(1)
          .fill(null)
          .map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader
                shadow={false}
                floated={false}
                className="relative grid h-56 place-items-center bg-gray-300"
              >
                <Skeleton
                  className="h-48 w-full"
                  style={{ borderRadius: '0.75rem' }}
                />
              </CardHeader>
            </Card>
          ))}
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 text-center text-red-500">Error loading slides</div>;
  }

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination]}
      className="mySwiper p-4"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="p-3 mt-20">
            <img
              className="w-full h-64 rounded-xl"
              src={`${import.meta.env.VITE_BACKEND_BASE_URL}/images/${slide.image}`}
              alt={`Slide ${index + 1}`}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
