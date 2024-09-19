/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from "react"
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { UserDetails } from "../blogCard/BlogCard";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import styles from '../blogCard/styles/styles.module.scss'
import { PiCaretCircleLeftLight, PiCaretCircleRightLight } from "react-icons/pi";

const CarouselItem = React.memo(({ blog, index, totalSlides,scrollPosition,handleManualSliding }) => {

    const { _id, title, thumbnail, readTime, userId } = blog

    const { date, imageUrl, profileImageUrl } = useMemo(() => ({
        date: formatDate(blog.createdAt),
        imageUrl: `http://localhost:8000/${thumbnail}`,
        profileImageUrl: `http://localhost:8000/${userId.profileImg}`
      }), [blog]);

      function formatDate(createdAt){
        const createdAtDate = new Date(createdAt);
        const dateNum = createdAtDate.getDate();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const month = monthNames[createdAtDate.getMonth()];
        const year = createdAtDate.getFullYear();
        const date = `${dateNum} ${month}, ${year}`
        return date
      }
      const blogData = { ...blog, date, thumbnail: imageUrl }

   return (
    <div className={styles.carousel_item}  aria-label={`Slide ${index + 1} of ${totalSlides}: ${title}`}>
                                
    <LazyLoadImage
        src={imageUrl}
        alt="Blog thumbnail"
        effect="blur"
        style={{
            width: '100%',
            height: '100vh',
            opacity: 0.5,
            objectFit: 'cover',
            objectPosition: 'center' 
        }}
        width='100%'
        scrollPosition={scrollPosition}
        
    />
    <div className={styles.arrow_text_container}>
        <span className={styles.icon} aria-label="Previous slide" role="button" tabIndex={0} onClick={() => handleManualSliding('prev')}><PiCaretCircleLeftLight /></span>
        <div className={styles.text_container}>
            <Link to={`/explore-blogs`} state={userId.niche}><p className={styles.niche}>{userId.niche}</p></Link>
            <Link to={`/blog/${_id}`} state={blogData} className={styles.title}>
                <h1 >{title}</h1></Link>
            <UserDetails userId={userId._id} profileImg={profileImageUrl} username={userId.username} date={date} readTime={readTime} comp="carousel" user={userId} />
        </div>
        <span className={styles.icon} aria-label="Next slide" role="button" tabIndex={0} onClick={() => handleManualSliding('next')}><PiCaretCircleRightLight /></span>
    </div>
</div>
  )
})

export default CarouselItem
