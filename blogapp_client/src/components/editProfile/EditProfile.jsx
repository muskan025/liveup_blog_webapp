/* eslint-disable react/prop-types */

import { BsX } from 'react-icons/bs'
import { FileField, InputField } from '../../common/input/Form'
import { useEffect, useState } from 'react'
import { useForm } from "../../hooks/useForm";
import { toast } from 'react-toastify'
import { validateBio, validateImage, validateNiche } from '../../utils/authValidation';
import { useUpdateProfileMutation, useUploadImgMutation } from '../../reduxToolkit/slices/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../reduxToolkit/slices/userSlice';
import styles from "./styles/styles.module.scss"
import indexStyle from "../../styles/index.module.scss"

const EditProfile = ({ onClose }) => {

  const { author } = useSelector((state) => state.userData)

  const name = author?.name
  const username = author?.username
  const bio = author?.bio
  const niche = author?.niche

  const initialState = {
    name: name,
    username: username,
    bio: bio,
    niche: niche
  };
  const dispatch = useDispatch()

  const { formData, handleChange, resetForm, errors, setErrors, image, handleImage } = useForm(initialState);


  const [uploadImg, {isLoading: isImgLoading }] = useUploadImgMutation()
  const [updateProfile, { isLoading : isProfileLoading }] = useUpdateProfileMutation()

  function validateForm() {
    let newErrors = {};

    const isImageValid = image && validateImage(image.file).error;
    const isBioValid = validateBio(formData?.bio).error;
    const isNicheValid = validateNiche(formData?.niche).error;
    if (isImageValid) newErrors.profileImg = isImageValid;
    if (isBioValid) newErrors.bio = isBioValid;
    if (isNicheValid) newErrors.niche = isNicheValid;
  
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (validateForm()) {

      try {

        let imgResponse
        if (image) {
          const imgData = new FormData()
          imgData.append('file', image.file, image.file.name);
          imgResponse = await uploadImg(imgData).unwrap()
        }

        if (!image || imgResponse.status === 200) {

          const profileData = new FormData()

          profileData.append('bio', formData.bio)
          profileData.append('niche', formData.niche)
          profileData.append('name', formData.name)
          profileData.append('username', formData.username)
          image && profileData.append('profileImg', imgResponse.url)

          const profileResponse = await updateProfile({ profileData, username }).unwrap()

          if (profileResponse.status === 200) {
         
             dispatch(setUser(profileResponse.data))
            toast.success(profileResponse.message)

            resetForm()
            onClose()
          }
          else {
            toast.error(profileResponse.message)
          }
        }
        else {
          toast.error(imgResponse.message)
        }
      } catch (error) {
         toast.error("Something went wrong, please try again")
      }
    }
    else {
      toast.error("Please fill in the details")
    }
  }
    return (
    <form className={styles.form_container} >

      <span className={styles.close} onClick={onClose}><BsX title="Close" /></span>
      <div  className={styles.form}>
        <FileField name="profileImage" placeholder="Upload Picture" onChange={handleImage} />
        <p>{isImgLoading && 'Loading...' }</p>
        <span>{errors?.profileImg}</span>

        <textarea type="text" name="bio" placeholder="Bio" onChange={handleChange} value={formData.bio}></textarea>
        <span>{errors?.bio}</span>

        <InputField type="text" name="niche" placeholder="Blog Niche*" onChange={handleChange} value={formData.niche} />
        <span>{errors?.niche}</span>

        <InputField type="text" name="name" placeholder="Name" onChange={handleChange} value={formData.name} />
 
        <InputField type="text" name="username" placeholder="Username" onChange={handleChange} value={formData.username} />
       </div>
      <button className={indexStyle.btn} onClick={handleSubmit}>{isProfileLoading ? 'Loading...' : 'Update Profile'}</button>
    </form>
  )
}

export default EditProfile
