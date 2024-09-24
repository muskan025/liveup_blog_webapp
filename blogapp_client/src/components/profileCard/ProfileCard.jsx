/* eslint-disable react/prop-types */

import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import FollowListModal from "../followListModal/FollowListModal";
import Modal from "../modal/Modal";
import EditProfile from "../editProfile/EditProfile";
import { useSelector } from "react-redux";
import { useFollowMutation, useGetFollowingListMutation, useGetUserDataMutation, useUnfollowMutation } from "../../reduxToolkit/slices/apiSlice";
import { toast } from "react-toastify";
import styles from "./styles/styles.module.scss";
import { getRandomProfileColor } from "../../utils/backgroundColorGenerator";

const ProfileCard = ({ articleCount = true, user, blogsCount,comp }) => {

  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const [showFollowerModal, setShowFollowerModal] = useState(false)
  const [editProfile, setEditProfile] = useState(false)
  const { author } = useSelector((state) => state.userData)
  const isOwnProfile = author?.username === user?.username;
  const profileColors = getRandomProfileColor();
   
  const { username, profileImg, niche, bio, _id,} = user
  const { pathname } = useLocation();
   const userId =  _id || author?.userId
   const authorProfile = pathname.includes(author.username)
     
     const profileImage = authorProfile ? `https://liveup-api.vercel.app/${author.profileImg}` : `https://liveup-api.vercel.app/${user.profileImg}`
 
     const [follow, { isFollowLoading }] = useFollowMutation()
  const [unfollow, { isunfollowLoading }] = useUnfollowMutation()
  const [isFollowing,setIsFollowing] = useState(false)
  const  [getUserData,{isLoading:fetchedUserDetailsLoading,isError:fetchedUserDetailsError}] =useGetUserDataMutation()
  const [ getFollowingList,
    {isLoading: isFollowingLoading,
    isError: isFollowingError} ] = useGetFollowingListMutation()
  const [followCounts,setFollowCounts] = useState({followingCount:0,
    followerCount:0
  })

   function onCloseFollowing() {
    setShowFollowingModal(false)
  }

  function onCloseFollower() {
    setShowFollowerModal(false)
  }

  function checkIsFollowing(data){
     const isFollowing = data.find(following => {
       return following._id === userId
    })
     setIsFollowing(isFollowing)
   }

   async function fetchFollowingList(){
   try{
    const response = await getFollowingList(author?.userId).unwrap() 

    if(response.status === 200){
        checkIsFollowing(response.data)
     }
 else if (response.status === 401){
  console.log('place of  fetchFollowingList:' ,response.message)

     toast.info(response.message)
 }
 else{
  console.log('place of origin:' ,response.message)

     toast.error(response.message)
 }
   }
   catch(error){
    console.log('place of origin: fetch fllowing list')

    toast.error('Something went wrong, please refresh')
   }

   }

  async function fetchUserDetails() {

    try {
       const response = await getUserData(userId).unwrap()

       if (response.status === 200) {
        const {followingsCount,followersCount} = response.data
      
         setFollowCounts({followingCount:followingsCount,followerCount:followersCount})
       }
      else {
        console.log('error::',response.message)
        toast.error(response.message)
      }
    }
    catch (error) {
      console.log('place of origin:' ,error)
      toast.error('Something went wrong,please try again')
    }
  }

  async function handleFollow() {

    try {
      setFollowCounts(prev => ({
        ...prev,
        followerCount: prev.followerCount + 1
      }));
      const response = await follow(_id, username,name, profileImg).unwrap()
       if (response.status === 200) {
        
        toast.success(`You started following ${user.username}`)
        setIsFollowing(true)
      }
      else{
        setFollowCounts(prev => ({
          ...prev,
          followerCount: prev.followerCount - 1
        }));
        toast.error(response.message)
      }
    }
    catch (error) {
       toast.error('Something went wrong, please try again')
     }
  }

  async function handleUnfollow() {

    try {
      setFollowCounts(prev => ({
        ...prev,
        followerCount: prev.followerCount - 1
      }));
      const response = await unfollow(_id).unwrap()

      if (response.status === 200) {
        toast.success(`You unfollowed ${user.username}`)
        setIsFollowing(false)
      }
    }
    catch (error) {
      setFollowCounts(prev => ({
        ...prev,
        followerCount: prev.followerCount + 1
      }));
       toast.error(error)
    }
  }

  function handleEditProfile() {
    setEditProfile(true)
  }

  function closeEditProfile() {
    setEditProfile(false)
  }

  useEffect(()=>{
    if(comp === 'profile'){
      fetchUserDetails()
    }
    fetchFollowingList()
  },[userId])

  return (
    <section className={styles.user_details_container}>
      <Link to={`/profile/${username}`} state={user} >
        { author.profileImg || profileImg ?
          <img src={profileImage} alt="Profile Image" className={styles.profileImg} /> :
          <div className={styles.defaultImg}
          style={{ "background": `linear-gradient(135deg, ${profileColors[0]} 0%, ${profileColors[1]} 100%)` }}>
            <p>
            {user?.name?.charAt(0).toUpperCase()}
          </p>
          </div>
        }
      </Link>
      <div className={styles.user_details}>
        <p className={styles.name}>{isOwnProfile ? author.username : username}</p>
        {articleCount && <div className={styles.article_followlist_container}>
          <span>{blogsCount} Blogs</span>
          <span className={styles.followList} onClick={() => setShowFollowingModal(true)}>{followCounts.followingCount } Followings</span>
          <span className={styles.followList} onClick={() => setShowFollowerModal(true)}>{followCounts.followerCount} Followers</span>

          <Modal isOpen={showFollowingModal} onClose={onCloseFollowing}>
            <FollowListModal onClose={onCloseFollowing} isOpen={showFollowingModal} list='Followings' userId={userId} setIsFollowing={setIsFollowing} setShowModal={setShowFollowingModal} setFollowCounts={setFollowCounts}/>
          </Modal>
          <Modal isOpen={showFollowerModal} onClose={onCloseFollower}>
            <FollowListModal onClose={onCloseFollower} isOpen={showFollowerModal} list='Followers' userId={userId} setIsFollowing={setIsFollowing} setShowModal={setShowFollowerModal} setFollowCounts={setFollowCounts}/>
          </Modal>

        </div>
        }
        <div className={styles.profile_btns}>
          {!isOwnProfile && <button className={styles.niche} onClick={!isFollowing ? handleFollow : handleUnfollow}>{!isFollowing ? 'Follow' : 
            'Unfollow'}</button>}
          <span className={styles.niche}>{(!author.niche ? 'Niche' : (isOwnProfile ? author.niche : !niche? 'Niche' : niche)) }</span>
          {isOwnProfile && <button className={styles.niche} onClick={handleEditProfile}>Edit Profile</button>}

          <Modal isOpen={editProfile} onClose={closeEditProfile}>
            <EditProfile isOpen={editProfile} onClose={closeEditProfile} />
          </Modal>

          {isOwnProfile && niche ? (
            <Link to={`/create-blog/${username}`}>
              <span className={styles.niche}>Create Blog</span>
            </Link>
          ) : (
            isOwnProfile && <button className={`${styles.niche} ${styles.disabled}`} title="Edit profile to add niche">
              Create Blog
            </button>
          )}

        </div>
        <p className={styles.bio}>{isOwnProfile ? author.bio : bio}</p>

      </div>
    </section>
  );
};

export default ProfileCard;


 
