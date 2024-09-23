import Masonry from "react-masonry-css";
import BlogCard from "../blogCard/BlogCard";
import styles from "./styles/styles.module.scss";
import 'react-loading-skeleton/dist/skeleton.css';
import { trackWindowScroll } from 'react-lazy-load-image-component';

const BlogCards = ({ data, comp,scrollPosition }) => {
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className={styles.my_masonry_grid}
      columnClassName={styles.my_masonry_grid_column}
    >
      {
      
          data?.length > 0 && data.map((blog) => {
            const { _id, title, thumbnail, readTime, textBody, likes, likesCount, userId, createdAt } = blog;

            const createdAtDate = new Date(createdAt);
            const dateNum = createdAtDate.getDate();
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const month = monthNames[createdAtDate.getMonth()];
            const year = createdAtDate.getFullYear();
            const date = `${dateNum} ${month}, ${year}`;
            const image = `https://liveup-blog-webapp.vercel.app${thumbnail}`;
            const profileImage = `https://liveup-blog-webapp.vercel.app/${userId.profileImg}`;
            const blogData = { ...blog, date, thumbnail: image };

            return (
              <BlogCard
                key={_id}
                user={userId}
                profileImg={profileImage}
                blogId={_id}
                blogImage={image}
                niche={userId.niche}
                blogTitle={title}
                textBody={textBody}
                username={userId.username}
                date={date}
                readTime={readTime}
                likes={likes}
                likesCount={likesCount}
                data={blogData}
                comp={comp}
                scrollPosition={scrollPosition}
              />
            );
          })
      }
    </Masonry>
  );
};

export default trackWindowScroll(BlogCards);
