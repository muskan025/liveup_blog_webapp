/* eslint-disable react/prop-types */

import {useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { useLikeBlogsMutation } from "../../reduxToolkit/slices/apiSlice"
import { BiCalendar, BiNote, BiShare, BiSolidHeart } from "react-icons/bi"
import NoteCard from "../noteCard/NoteCard"
import Modal from "../modal/Modal"
import styles from "./styles/styles.module.css"
import Calendar from "../calendar/Calendar"
  
const SideBar = ({blog}) => {

  const [isOpen, setIsOpen] = useState(false)
  const [showCalendar,setShowCalendar] = useState(false)
  const {blogTitle,likesCount,likes,notes,_id,userId} = blog
  const [likesNum,setLikesNum] = useState(likesCount)
  const [isBlogLiked,setIsBlogLiked] = useState(false)
  const {isAuth,author} = useSelector((state)=>state.userData)
  const location = useLocation()
  
  const blogId = _id
  const username = userId.username
  const [likeBlogs, {isLikeLoading}] = useLikeBlogsMutation()

  
  function checkIsBlogLiked() {
    const userLikedBlog = likes.find((user)=>user === author?.userId)
     if(userLikedBlog) setIsBlogLiked(true)
  }

  async function handleShare() {
    const shareData = {
      title: blogTitle,
      text: `Check out this blog post: ${blogTitle}`,
      url: window.location.origin + location.pathname
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      }
      catch (error) {
        console.log("Error sharing", error)
      }
    }
    else {
      navigator.clipboard.writeText(shareData.url).then(() => {
        alert("Link copied to clipboard")
      }, (err) => {
        alert("Link couldn't be copied", err)
      })
    }

  }

  async function handleLike(){
    try{
      await likeBlogs({blogId,username}).unwrap()
      setIsBlogLiked(!isBlogLiked)
      if(isBlogLiked) setLikesNum((prev)=>prev - 1)
        else setLikesNum((prev)=>prev+1)
     }
   catch(error){
    toast.error("Something went wrong,please try again")
    setIsBlogLiked(isBlogLiked)
   }
   
}

  function checkLoginStatus(item){

    if(isAuth){
      item === "notes" ? setIsOpen(true) : handleLike()
    }
    else{
      toast.info(`Please login to add ${item}`)
    }
  }
  function onClose() {
    setIsOpen(false)
  }

  useEffect(()=>{
    checkIsBlogLiked()
  },[_id])

  return (
    <>
      <aside className={styles.sidebar_container}>
       
         <div className={styles.heart_container} aria-label={`Like blog. ${likesNum} likes`} role="button" tabIndex="0" >
          <BiSolidHeart className={`${styles.heart} ${isBlogLiked && styles.liked_heart}`} title="Like blog" onClick={()=>checkLoginStatus('like')}/>
          <p>{likesNum}</p>
        </div>
        <BiShare className={styles.share} title="Share blog" aria-label="Share blog" role="button" tabIndex="0"  onClick={handleShare} />

        <BiNote className={styles.icon} title="Note your takeaway" aria-label="Add note" role="button" tabIndex="0"onClick={()=>checkLoginStatus('notes')}>
        </BiNote>
        
        <BiCalendar className={`${styles.icon} ${styles.calendar}`} title="Schedule review" aria-label="Schedule review" role="button" tabIndex="0" onClick={()=>setShowCalendar(!showCalendar)} />
        {
        showCalendar && <Calendar isOpen={showCalendar}/>
        }
    
      </aside>
      <Modal isOpen={isOpen} onClose={onClose}>
        <NoteCard onClose={onClose} isOpen={isOpen} notes={notes} blogId={blogId}/>
      </Modal>
    </>
  )
}

export default SideBar
