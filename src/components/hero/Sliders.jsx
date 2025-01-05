import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import useAxios from '../../hooks/useAxios/useAxios';
import { useQuery } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton styles


export default function Sliders() {
  const axiosCommon = useAxios();

  const { data: slides = [], isLoading, isError } = useQuery({
    queryKey: ['sliders'],
    queryFn: async () => {
      const { data } = await axiosCommon.get(`/sliders`);
      return data;
    },
  });

  // Handle loading state with skeletons
  if (isLoading) {
    return (
      <div className=" mx-auto flex justify-center  items-center  space-y-4">
        {Array.from({ length: 1 }).map((_, index) => (
          <div key={index} className="animate-pulse w-full lg:h-[60vh] md:h-[40vh] sm:h-[40vh] h-64 mt-20 p-2">
        
              <Skeleton
                className="h-full  w-full"
                style={{ borderRadius: '0.75rem' }}
              />
           
          </div>
        ))}
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return <div className="p-4 text-center text-red-500">Error loading slides</div>;
  }

  // Render the Swiper component when data is ready
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination]}
      className="mySwiper p-4"
    >
      {slides.length === 0 && (
        Array.from({ length: 3 }).map((_, index) => (
          <SwiperSlide key={index}>
            <div className="p-3 mt-20 lg:h-[60vh] md:h-[40vh] sm:h-[40vh] h-64">
              <Skeleton
                className="h-full w-full"
                style={{ borderRadius: '0.75rem' }}
              />
            </div>
          </SwiperSlide>
        ))
      )}
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="p-3 mt-20 lg:h-[80vh] md:h-[40vh] sm:h-[40vh] h-64">
            <img
              className="w-full h-full rounded-xl object-cover"
              src={`${import.meta.env.VITE_BACKEND_BASE_URL}/images/${slide.image}`}
              alt={`Slide ${index + 1}`}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
