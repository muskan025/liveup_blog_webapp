import { NavLink, Link, useLocation } from "react-router-dom"
import styles from "./styles/styles.module.css"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { RxHamburgerMenu } from "react-icons/rx"
import { useState } from "react"
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getRandomProfileColor } from "../../utils/backgroundColorGenerator"

const Header = () => {
  const { author, profileImg, isAuth } = useSelector((state) => state.userData)
   const [isHamburger, setIsHamburger] = useState(false)
   const location = useLocation()
  const username = author?.username
  const profileImage = profileImg ? `https://liveup-api.vercel.app/${profileImg}` : null
  const profileColors = getRandomProfileColor();

  function checkisAuth(e) {
    if (!isAuth) {
      e.preventDefault()
      toast.info('Session expired, please login')
    }
  }

  const getLinkState = () => {
    if (isAuth) {
      return author
    } else {

      return location.state
    }
  }

  return (
    <nav className={styles.navbar}>
      <Link to="/">
        <div className={styles.brandname}>
          Live<span className={styles.blogname}>Up</span>
        </div>
      </Link>

      <ul className={`${styles.nav_links_center} ${!isHamburger ? styles.close_menu : styles.open_menu}`}>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.active_Link : "")}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about-us" className={({ isActive }) => (isActive ? styles.active_Link : "")}>
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/explore-blogs" className={({ isActive }) => (isActive ? styles.active_Link : "")}>
            Explore Blogs
          </NavLink>
        </li>
        <li>
          <NavLink to="/sign-up" className={({ isActive }) => (isActive ? styles.active_Link : "")}>
            Sign Up
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" className={({ isActive }) => (isActive ? styles.active_Link : "")}>
            Login
          </NavLink>
        </li>
      </ul>

      <div className={styles.profile_hamburger} >
        <div className={styles.profile_img} onClick={(e) => checkisAuth(e)}>
          <Link to={isAuth ? `/profile/${username}` : location.pathname} state={getLinkState()}>
            {
              profileImage ?
                <img src={profileImage} alt="Profile Image" /> :
                <div className={styles.defaultProfile} style={{ "background": `linear-gradient(135deg, ${profileColors[0]} 0%, ${profileColors[1]} 100%)` }}>{author?.name?.charAt(0).toUpperCase()}</div>
            }
          </Link>
        </div>
        <RxHamburgerMenu className={styles.hamburger} onClick={() => setIsHamburger(!isHamburger)} />
      </div>



    </nav>

  )
}

export default Header
