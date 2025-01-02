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
      <Card className="mt-6 w-96 animate-pulse">
      <CardHeader
        shadow={false}
        floated={false}
        className="relative grid h-56 place-items-center bg-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-12 w-12 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </CardHeader>
  
    </Card>
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
