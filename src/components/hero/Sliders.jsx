// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import required modules
import { Autoplay, Pagination } from 'swiper/modules';

export default function Sliders() {
  // Array of slider data
  const slides = [
    {
      url: 'https://img.freepik.com/premium-psd/casino-logo-text-effect-editable-modern-style_488814-1172.jpg?w=1060',
    },
    {
      url: 'https://img.freepik.com/free-vector/realistic-casino-background_52683-8812.jpg?t=st=1733678197~exp=1733681797~hmac=114995effa17dd8dccc2227c9a03ca540b8f17446c878d74635933f11d0bd6f2&w=900',
    },
    {
      url: 'https://img.freepik.com/free-vector/casino-background-realistic-style_52683-8399.jpg?t=st=1733678276~exp=1733681876~hmac=e5a002591ebeab59c4f42020db33c2c4647629a6481a075200994e05eea95a5f&w=900',
    },
  ];

  return (
    <>
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
          <div className='p-3'>
              <img
                className="w-full h-64 rounded-xl "
                src={slide.url}
                alt={`Slide ${index + 1}`}
              />
          </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
