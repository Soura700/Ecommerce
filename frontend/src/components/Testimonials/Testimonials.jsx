import React from "react";
// import "./testimonials.css";
import Hero from "../../assets/testimonialHero.png";
import { TestimonialsData } from "../../data/testimonials";
import { motion } from "framer-motion";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./testimonials.module.css"
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css"




const Testimonial = () => {
  return (
    <div className={styles.testimonials}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <span>Top Rated</span>
          <span>
            Seedily say has suitable disposal and boy. Exercise joy man children
            rejoiced.
          </span>
        </div>

        <img src={Hero} alt="" />

        <div className={styles.container}>
          <span>100k</span>
          <span>Happy Customers with us</span>
        </div>
      </div>

      <div className={styles.reviews}>Reviews</div>

      <div className={styles.carousel}>
        <Swiper
          slidesPerView={3}
          slidesPerGroup={1}
          spaceBetween={20}
          autoplay={{
            delay: 10000, // Delay in milliseconds
            disableOnInteraction: false, // Autoplay continues even when user interacts with the swiper
          }}
          className={styles.tCarousel}
          breakpoints={{
            856: {
              slidesPerView: 3,
            },
            640: {
              slidesPerView: 2,
            },
            0: {
              slidesPerView: 1,
            },
          }}
        >
          {TestimonialsData.map((testimonial, i) => (
            <SwiperSlide>
              <div className={styles.testimonial} key={i}>
                <img src={testimonial.image} alt="" />
                <span>{testimonial.comment}</span>
                <hr />
                <span>{testimonial.name}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonial;
