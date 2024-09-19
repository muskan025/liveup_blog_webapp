import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import BlogCards from "../components/blogCards/BlogCards";
import ProfileCard from "../components/profileCard/ProfileCard";
import { toast } from 'react-toastify';
import { useGetUserBlogsMutation, useLogoutFromAllDevicesMutation, useLogoutMutation } from '../reduxToolkit/slices/apiSlice';
import { clearUser, setAuthStatus } from '../reduxToolkit/slices/userSlice';
import { setMyBlogs } from '../reduxToolkit/slices/blogSlice';
import { BiUser } from 'react-icons/bi';
import { ImFileEmpty } from 'react-icons/im';
import indexStyles from "../styles/index.module.scss";

const ViewerProfile = () => {

  const [isSettings, setIsSettings] = useState(false);
  const { author,isAuth } = useSelector((state) => state.userData)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { state } = useLocation();
  const userId = state?.userId || state?._id
   
  const [logout, { isLogoutLoading }] = useLogoutMutation();
  const [logoutFromAllDevices, { isLogoutDevicesloading }] = useLogoutFromAllDevicesMutation();
  const [getUserBlogs, { isBlogsLoading }] = useGetUserBlogsMutation()
  const [fetchedBlogs, setFetchedBlogs] = useState([])
  const isOwnProfile = isAuth && author?.username === state?.username;
 
  async function fetchUserBlogs() {

    try {

      const response = await getUserBlogs(userId).unwrap()
      const data = response.data
       if (response.status === 200) {
        setFetchedBlogs(data)

        if (userId === author?._id) dispatch(setMyBlogs(data))
      }
      else if (response.status === 401) {
        toast.info(response.message)
        navigate(-1)
      }
      else {
        console.log('place of origin:' ,response.message)
        toast.error(response.message)
      }

    }
    catch (error) {
      toast.error("Something went wrong")
    }

  }

  async function handleLogout(func) {
 
    try {
      const response = await func().unwrap()

      if (response.status === 200) {
        dispatch(clearUser());
        navigate('/')
        toast.success("Logout successful!")
      }
      else {
        console.log(response)
        toast.error(response.message || "Logout failed!")
      }
    }
    catch (error) {
      toast.error("Logout failed!")
    }
  }

  useEffect(() => {
   fetchUserBlogs()
  }, [userId]);

  if (!state) {
    dispatch(setAuthStatus(false));
    navigate(-1);
    return null;
  }

  if (isBlogsLoading) {
    return <p>Loading...</p>;
  }

  return (

    
    <section className={`${indexStyles.user_profile} ${indexStyles.wrapper}`}>
      
      {
        isOwnProfile && <aside className={`${indexStyles.settings} ${isSettings? indexStyles.open_settings: ''}`}  onClick={() => setIsSettings(!isSettings)} onMouseEnter={() => setIsSettings(!isSettings)}>
        <div className={`${indexStyles.settings_header}`}>
          <span>Account</span>
          <BiUser className={indexStyles.icon} />
        </div>
        {isSettings && (
          <div className={`${indexStyles.options_container}`}>
            <p className={`${indexStyles.logout} ${indexStyles.options}`} onClick={() => handleLogout(logout, "Logout successful!")}>Logout</p>
            <p className={`${indexStyles.logoutAll} ${indexStyles.options}`} onClick={() => handleLogout(logoutFromAllDevices, "Logout from all devices successful!")}>Logout from all devices</p>
           </div>
        )}
      </aside>
      }
    <ProfileCard user={state} blogsCount={fetchedBlogs.length} comp='profile'/>

      <section className={indexStyles.user_blogs}>
        {fetchedBlogs?.length === 0 ? <section className={indexStyles.empty_section}>
          <h2>No blogs yet, create some!</h2> 
          <ImFileEmpty className={indexStyles.empty_blog}/></section>:
          <BlogCards data={fetchedBlogs} comp="profile" isLoading={isBlogsLoading}/>
        }
      </section>
    </section>
  );
};

export default ViewerProfile;