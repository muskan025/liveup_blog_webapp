import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useNavigation } from 'react-router-dom'
import { Button, FileField, InputField } from '../../common/input/Form'
import RTE from '../RTE/RTE'

const PostForm = ({post}) => {

    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active",
        }

    })

    const navigate = useNavigate()
    // const userData = useSelector((state) => state.auth.userData)

    const submit = async(data) =>{

        // if(post){
        //     const file = data.image[0] ?
        //     appwriteService.uploadFile(data.image[0]) : null

        //     if(file){
        //         appwriteService.deleteFile(post.featuredImage)
        //     }
        // }

        // const dbPost = await appwriteService.updatePost(post.$id,{
        //     ...data,
        //     featuredImage: file ? file.$id :
        //     undefined
        // })

        // if(dbPost){
        //     navigate(`/post/${dbPost.$id}`)
        // }

        else{
            const file = await appwriteService.uploadFile(data.image[0])

            if(file){
                const fileId = file.$id
                data.featuredImage = fileId

                const dbPost = await appwriteService.createPost({...data, userId: userData.$id})

                if(dbPost){
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }
    }

    const slugTransform = useCallback((value)=>{
        if(value && typeof value === "string")
            return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g,'-').replace(/\s/g,'-')
    },[])

    useEffect(()=> {
        
        watch((value, {name}) => {
            if(name === "title"){
                setValue("slug", slugTransform(value.title), {shouldValidate: true})
            }
        })
    }, [watch, slugTransfrom, setValue])

  return (
    <form onSubmit={handleSubmit(submit)}>
        <div>
            <InputField 
            type="text" placeholde="Title" name="title"
            {...register("title",{required:true})}
            />
            <InputField 
            type="text"
            placeholde="Slug" name="title"
            {...register("slug",{required:true})}
            onInput={(e) => {
                setValue("slug", slugTransform(e.currentTarget.value),
            {shouldValidate:true})
            }}
            />
            <RTE 
            label="Content"
            name="content"
            control={control}
            defaultValue={getValues("content")}
            />
        </div>

        <div>

            <FileField
            {...register("image", {required: !post})}
            />

            {post && (
                <div>
                    <img src="" alt="" />
                </div>
            )}

             <Button

             >{post ? "Update": "Submit"}</Button>
        </div>

    </form>
  )
}

export default PostForm
