/* eslint-disable react/prop-types */
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from "../components/blogCard/styles/styles.module.css"
 
const BannerImage = ({image}) => {
     return (
            
            // <img src={image} alt="Blog Image" className={styles.landscape_img}/>
            <LazyLoadImage
            src={image}
            alt="Blog Image"
            effect="blur"
            className={styles.landscape_img}
        />
           
    )
  }

  export default BannerImage