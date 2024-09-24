import { useLocation } from "react-router-dom"
import BlogCard from "../components/blogCard/BlogCard"
import SideBar from "../components/sidebar/SideBar"
import ProfileCard from "../components/profileCard/ProfileCard"
import styles from "../components/blogCard/styles/styles.module.css"
import indexStyle from "../styles/index.module.scss"
 
const SingleBlog = () => {

  const { state } = useLocation()
  const { _id, title, thumbnail, readTime, textBody, likesCount,likes, userId } = state
   const profileImage = `https://liveup-api.vercel.app/${userId.profileImg}`

 
   return (
    <section className={`${styles.single_blog} ${indexStyle.wrapper}`}>
     
      <BlogCard image={false} blogHeader={true} excerpt={false} comp="singleBlog" profileImg={profileImage} titleFont="28px" blogId={_id} blogImage={thumbnail} niche={userId.niche} blogTitle={title} textBody={textBody} username={userId.username} date={state.date} likes={likes} likesCount={likesCount} readTime={readTime} user={userId} />

      <section className={styles.profile_card_sidebar}>
        <div className={styles.profile_card_container}>
          <ProfileCard articleCount={false} user={userId} />
        </div>
        <SideBar blog={state} />
      </section>
    </section>
  )
}

export default SingleBlog
