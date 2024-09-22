import { useEffect, useState } from 'react';
import styles from './styles/styles.module.css';  
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { IoMdArrowUp } from 'react-icons/io';
import { Link } from 'react-router-dom';

const Footer = () => {

  const [showBackToTop, setShowBackToTop] = useState(false);

useEffect(()=>{
  window.onscroll = function() {scrollFunction()};

  function scrollFunction() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
       setShowBackToTop(true)
     }else{
      setShowBackToTop(false)
    }
  }
  return () => window.removeEventListener('scroll', scrollFunction);

},[])

const scrollToTop = (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

  return (
    <div className={styles.footer}>
      <div className={styles.fMain}>
        <Link to="/about-us">About us</Link>
      </div>
      <div className={styles.fSocialLinks}>
        <div className={styles.links}>
          <FaInstagram />
          <Link to="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</Link>
        </div>
        <div className={styles.links}>
          <FaFacebook />
          <Link to="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</Link>
        </div>
        <div className={styles.links}>
          <FaTwitter />
          <Link to="https://www.x.com" target="_blank" rel="noopener noreferrer">X</Link>
        </div>
        <div className={styles.links}>
          <FaYoutube />
          <Link to="https://www.youtube.com" target="_blank" rel="noopener noreferrer">Youtube</Link>
        </div>
      </div>
      <div className={styles.fCopyright}>
        <p>&copy; Copyright 2024  LiveUp, All Rights Reserved.</p>
        <p>UI inspired by <b><a href="https://assiagroupe.tech/noonpost/html/index.html">NoonPost</a></b></p>
        {
        showBackToTop && <div className={styles.back_to_top}><a href="#" onClick={scrollToTop}>
        <IoMdArrowUp />
        </a></div>
      }
      </div>
      
    </div>
  );
};

export default Footer;
