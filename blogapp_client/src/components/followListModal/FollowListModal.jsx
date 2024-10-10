/* eslint-disable react/prop-types */
import styles from "./styles/styles.module.css"
import { Link } from "react-router-dom"
import { InputField } from "../../common/input/Form"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useGetFollowerListMutation, useGetFollowingListMutation, useUnfollowMutation } from "../../reduxToolkit/slices/apiSlice"
import { toast } from "react-toastify"
import { useForm } from "../../hooks/useForm"

const FollowListModal = ({ list, userId, setIsFollowing, setShowModal, setFollowCounts }) => {

    const { author } = useSelector((state) => state.userData)
    const isOwnProfile = author.userId === userId
    const [displayedList, setDisplayedList] = useState([])
    const [fullList, setFullList] = useState([])
    const initialState = { searchQuery: '' }
    const { formData, handleChange } = useForm(initialState)

    const [getFollowingList,
        { isLoading: isFollowingLoading,
            isError: isFollowingError }] = useGetFollowingListMutation()
    const [getFollowerList,
        { isLoading: isFollowerLoading,
            isError: isFollowerError }] = useGetFollowerListMutation()
    const [unfollow, { isUnfollowLoading }] = useUnfollowMutation()

    async function getList() {
        try {
             const response = await (list === 'Followers' ? getFollowerList(userId).unwrap() : getFollowingList(userId).unwrap())

            if (response.status === 200) {
                setDisplayedList(response.data)
                setFullList(response.data)
            }
            else if (response.status === 401) {
                toast.info(response.message)
            }
            else {
                toast.error(response.message)
            }
        }
        catch (error) {

            toast.error('Something went wrong, please refresh')
        }
    }

    async function handleUnfollow(unfollowUserId, username) {
        try {
            setFollowCounts(prev => ({
                ...prev,
                followingCount: prev.followingCount - 1
            }));

            const response = await unfollow(unfollowUserId).unwrap()

            if (response.status === 200) {
                toast.success(`You unfollowed ${username}`)
                setDisplayedList(prevList => prevList.filter(user => user._id !== unfollowUserId));
                if (userId === unfollowUserId) setIsFollowing(false);

            }
            else {
                setFollowCounts(prev => ({
                    ...prev,
                    followingCount: prev.followingCount + 1
                }));
                toast.error(response.message)
            }
        }
        catch (error) {
            toast.error('Something went wrong, please refresh')
        }
    }

    function filterList() {
        const searchQueryLower = formData.searchQuery.toLowerCase().trim();

        if (searchQueryLower === '') {
            setDisplayedList(fullList);
        } else {
            const newList = fullList.filter((item) => {
                const usernameLower = item.username.toLowerCase();
                const nameLower = item.name.toLowerCase();
                return usernameLower.includes(searchQueryLower) || nameLower.includes(searchQueryLower);
            });
            setDisplayedList(newList);
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (formData.searchQuery.trim() === '') {
            setDisplayedList(fullList);
        }

    }

    useEffect(() => {
        filterList()
    }, [formData.searchQuery])

    useEffect(() => {
        getList()
    }, [list]);

    if (isFollowerLoading || isFollowingLoading || isUnfollowLoading) {
        return <p>Loading...</p>
    }

    return (

        <div className={styles.followlist_container}>
            <p>{list}</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <InputField type="text" name='searchQuery' placeholder="Search" value={formData.searchQuery} onChange={handleChange} />
                </div>
            </form>
            <ul>
                {
                    displayedList?.length > 0 ? displayedList.map((item) => {

                        const { username, profileImg, _id } = item

                        if (userId === _id) setIsFollowing('Unfollow')
                        return (
                            <li key={_id}>
                                <Link to={`/profile/${username}`} state={item} onClick={() => setShowModal(false)}>
                                    <img src={`https://liveup-api.vercel.app/${profileImg}`} alt="" />
                                    <span>{item.username}</span>
                                </Link>
                                {list === 'Followings' && isOwnProfile && <div className={styles.btn}>
                                    <span onClick={() => handleUnfollow(_id, username)}>Unfollow</span>
                                </div>
                                }
                            </li>
                        )
                    }

                    ) :
                        <p>No {list}</p>
                }

            </ul>
        </div>
    )
}

export default FollowListModal

