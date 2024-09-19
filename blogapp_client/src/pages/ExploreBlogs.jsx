import { InputField } from "../common/input/Form"
import BlogCards from "../components/blogCards/BlogCards"
import { useEffect, useState } from "react"
import { useGetAllBlogsQuery } from "../reduxToolkit/slices/apiSlice"
import { useLocation } from "react-router-dom"
import indexStyle from "../styles/index.module.css"

const ExploreBlogs = () => {

  const {state} = useLocation()
  const passedNiche = state
  const query = passedNiche ? passedNiche :  ''
  const [niche, setNiche] = useState(query)
  const { data: allBlogs, isLoading: blogsLoading, error: blogError } = useGetAllBlogsQuery()
  const [filteredBlogs,setFilteredBlogs] = useState([])

  function handleInput(e) {
    setNiche(e.target.value)
  }
  function handleSubmit(e) {
    e.preventDefault()   
}

function filterBlogs(searchTerm) {
   
  const filtered = allBlogs.filter((blog) => {
  
    const blogNiche = blog.userId.niche.toLowerCase()
    const searchTermLower = searchTerm.toLowerCase()
    
    return blogNiche.includes(searchTermLower) || 
           searchTermLower.includes(blogNiche)
  })
  
  setFilteredBlogs(filtered)
}
 
useEffect(() => {
  if (allBlogs) {
       filterBlogs(niche)
  } 
}, [allBlogs, niche])

  if(blogError){
    return <p>Something went wrong,please refresh</p>
  }

  return (
    <section className={`${indexStyle.wrapper}`}>
      
      <section className={indexStyle.explore_blogs}>
        <form className={indexStyle.searchbar} onSubmit={handleSubmit}>
          <InputField type="text" name="niche" placeholder="Which niche interests you?" value={niche} onChange={handleInput} />
        </form>
       <div className={indexStyle.explore_content}>
       <h2><span>Category: </span><span className={indexStyle.niche_name}>{filteredBlogs.length<=0 ? 'No niche found' : niche}</span></h2><br></br>
        <p>Every story matters. Dive into our diverse community and let your creativity flourish.<br/> As you engage here, watch your influence grow—not just on our platform, but across your entire digital world.<br/>
        Join us and amplify your voice. From our community to the global stage, turn your passion into a thriving online presence.<br/> Your journey to digital influence starts here. <br/>
        <b>Check out these blogs to kickstart your creativity!</b></p>
       </div>
      </section>
      <BlogCards data={filteredBlogs} niche={niche} isLoading={blogsLoading}/>
    </section>
  )
}

export default ExploreBlogs
