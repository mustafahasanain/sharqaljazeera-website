"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroSlider() {
  const slides = [
    "/hero-sliders-img/hero-1.jpg",
    "/hero-sliders-img/hero-2.jpg",
    "/hero-sliders-img/hero-3.jpg",
  ];

  return (
    <div className="w-full h-full md:h-[700px] rounded-2xl overflow-hidden mb-10 mt-10">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
        className="w-full h-full rounded-2xl 
\           [&_.swiper-button-prev]:!w-8
          [&_.swiper-button-prev]:!h-8
          [&_.swiper-button-next]:!w-8
          [&_.swiper-button-next]:!h-8
          [&_.swiper-button-prev]:!text-white
          [&_.swiper-button-next]:!text-white
          [&_.swiper-button-prev:after]:!text-lg
          [&_.swiper-button-next:after]:!text-lg
          [&_.swiper-button-prev]:!ml-5
          [&_.swiper-button-next]:!mr-5
          [&_.swiper-button-prev:hover]:!text-orange-500
          [&_.swiper-button-next:hover]:!text-orange-500
          "
      >
        {slides.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
