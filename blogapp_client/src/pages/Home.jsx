import BlogCards from "../components/blogCards/BlogCards"
import Carousel from "../components/carousel/Carousel"
import styles from "../styles/index.module.css"
import { useGetAllBlogsQuery } from "../reduxToolkit/slices/apiSlice"
import { toast } from "react-toastify"

 
const Home = () => {

  const {data:allBlogs, isLoading:blogLoading, error: blogError} = useGetAllBlogsQuery()
 
   if (blogError) {
    toast.error("Error fetching blogs");
  }

  const carouselData = allBlogs?.slice(0,5)
   return (
    <div className={styles.home}>
      <Carousel data={carouselData} isLoading={blogLoading}/>
      <BlogCards data={allBlogs} comp="home" isLoading={blogLoading}/>
    </div>
  ) 
}

export default Home
