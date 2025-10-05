"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./HeroSlider.module.css";

export default function HeroSlider() {
  const slides = [
    "/hero-sliders-img/hero-1.jpg",
    "/hero-sliders-img/hero-2.jpg",
    "/hero-sliders-img/hero-3.jpg",
    "/hero-sliders-img/hero-4.jpg",
    "/hero-sliders-img/hero-5.jpg",
    "/hero-sliders-img/hero-6.jpg",
    "/hero-sliders-img/hero-7.jpg",
    "/hero-sliders-img/hero-8.jpg",
  ];

  return (
    <div className="w-full h-full md:h-[750px] rounded-2xl overflow-hidden mb-10 mt-5">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
        className={styles.heroSlider}
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
