import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8000",
        credentials: 'include' }),
        tagTypes: ["AllBlogs","FollowList"],
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (formData) => ({
                url: "/auth/register",
                method: "POST",
                body: formData,
              }),    
        }),
        login: builder.mutation({
            query: (formData) => ({
                url: "/auth/login",
                method: "POST",
                body: formData,
              }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
              }),
        }),
        logoutFromAllDevices: builder.mutation({
            query: () => ({
                url: "/auth/logout_from_all_devices",
                method: "POST",
              }),
        }),
        updateProfile: builder.mutation({
          query: ({profileData,username}) =>({
              url: `/auth/edit-profile/${username}`,
              method: "PATCH",
              body: profileData,
        }),
        }),
        uploadImg: builder.mutation({
            query: (formData) => ({
                url: "/upload/file ",
                method: "POST",
                body: formData,
                formData: true,
              }),
        }),
        createBlog: builder.mutation({
            query: (formData) => ({
                url: "/blog/create-blog",
                method: "POST",
                body: formData,
                formData: true,
            })
        }),
        getUserBlogs: builder.mutation({
            query: (userId) =>({
                url :  "/blog/user-blogs",
                method: "POST",
                body:{userId}
            }),
            transformResponse: (myBlogs) => myBlogs ,
            providesTags:  (result) =>
              result
                ? [
                    ...result.map(({ _id }) => ({ type: 'Blog', id: _id })),
                    "MyBlogs"
                  ]
                : ["MyBlogs"],
           }),
          getAllBlogs: builder.query({
            query: () => "/blog/get-blogs",
            transformResponse: (allBlogs) => allBlogs.data,
            providesTags: (result) =>
              result
                ? [
                    ...result.map(({ _id }) => ({ type: 'Blog', id: _id })),
                    "AllBlogs"
                  ]
                : ["AllBlogs"],
          }),
        likeBlogs: builder.mutation({
            query: ({blogId})=>({
                url: "/blog/like-blog",
                method: "POST",
                body: {blogId} ,
            }),
            invalidateTags:(result, error, { blogId }) => [
              "AllBlogs",
              "MyBlogs",
              { type: 'Blog', id: blogId }
            ],
             async onQueryStarted({blogId,username}, { dispatch, queryFulfilled }) {
              const updates = [
                dispatch(
                  api.util.updateQueryData("getAllBlogs", undefined, (draft) => {
                    updateBlogLike(draft, blogId, username);
                  })
                ),
                dispatch(
                  api.util.updateQueryData("getUserBlogs", undefined, (draft) => {
                    updateBlogLike(draft, blogId, username);
                  })
                )
              ];
        
                try {
                  await queryFulfilled;
                } catch {
                  updates.forEach(update => update.undo());
                }
              },
        }),
        updateBlog: builder.mutation({
          query: ({data,blogId}) => ({
            url:`/blog/edit-blog/${blogId}`,
            method: "PUT",
            body: data,
          }),
          invalidatesTags:["AllBlogs"]
        }),
        addBlogNotes: builder.mutation({
          query: ({ blogId,userId,content }) => ({
            url: `/blog/notes/${blogId}`,
            method: 'POST',
            body: { userId,content },
          }),
          invalidatesTags: (result, error, { blogId }) => [{ type: 'Blog', id: blogId },'Notes'],
        }),
        deleteBlog: builder.mutation({
          query: (blogId) => ({
            url: `/blog/delete-blog/${blogId}`,
            method: "DELETE",
          }),
          invalidatesTags: (result, error, blogId) => [
            { type: 'Blog', id: blogId },
            "MyBlogs"
          ],
          async onQueryStarted(blogId, { dispatch, queryFulfilled }) {
            const patchResult = dispatch(
              api.util.updateQueryData("getUserBlogs", undefined, (draft) => {
                const blogIndex = draft.findIndex((blog) => blog._id === blogId);
                if (blogIndex !== -1) {
                  draft.splice(blogIndex, 1);
                }
              })
            );
        
            try {
              await queryFulfilled;
            } catch {
              patchResult.undo();
            }
          }
        }),
        getUserData: builder.mutation({
            query: (userId) => ({
                url: `/auth/user/${userId}`,
                method: "POST",
              }),
               providesTags:['FollowList'],
         }),
        follow: builder.mutation({
          query: (followingUserId) => ({
              url:"/follow/follow",
              method: "POST",
              body:{followingUserId}
          }),
          async onQueryStarted({ followingUserId, username,name, profileImg }, { dispatch, queryFulfilled }) {
            const updates = [
              dispatch(
                api.util.updateQueryData('getFollowingList', undefined, (draft) => {
                  draft.push({ _id: followingUserId, username,name, profileImg });
                })
              ),
              dispatch(
                api.util.updateQueryData('getUserData', undefined, (draft) => {
                  if (draft.followingsCount !== undefined) {
                    draft.followingsCount += 1;
                  }
                })
              ),
            ]
            try {
                await queryFulfilled;
            } catch {
              updates.forEach(update => update.undo());

            }
        },
        invalidatesTags: ['FollowList']
      }),
        getFollowingList: builder.mutation({
            query: (userId) => ({
                url:"/follow/following",
                method: "POST",
                body:{userId}
            }),
            // transformResponse: (response) => response.data,
            providesTags: ['FollowList']
        }),
        getFollowerList: builder.mutation({
            query: (userId) => ({
                url:"/follow/follower",
                method:"POST",
                body:{userId}
            }),
            // transformResponse: (response) => response.data,
             providesTags: ['FollowList']
        }),
        unfollow: builder.mutation({
          query: (followingUserId) => ({
              url:"/follow/unfollow",
              method: "POST",
              body:{followingUserId}
          }),
            async onQueryStarted(followingUserId, { dispatch, queryFulfilled }) {
              const updates = [
                dispatch(
                  api.util.updateQueryData('getFollowingList', undefined, (draft) => {
                    const index = draft.findIndex(user => user._id === followingUserId);
                    if (index !== -1) {
                      draft.splice(index, 1);
                    }
                  })
                ),
                dispatch(
                  api.util.updateQueryData('getUserData', undefined, (draft) => {
                    if (draft.followingsCount !== undefined && draft.followingsCount > 0) {
                      draft.followingsCount -= 1;
                    }
                  })
                )
              ]
            try {
                await queryFulfilled;
            } catch {
              updates.forEach(update => update.undo());
            }
        },
        invalidatesTags: ['FollowList']
      }),

    })
})

function updateBlogLike(draft, blogId, username) {
  const blog = Array.isArray(draft) ? draft.find((blog) => blog._id === blogId) : draft;
  if (blog) {
    const userLiked = blog.likedBy?.includes(username);
     if (userLiked) {
      blog.likesCount = Math.max(0, blog.likesCount - 1);
      blog.likedBy = blog.likedBy.filter(user => user !== username);
    } else {
      blog.likesCount = (blog.likesCount || 0) + 1;
      blog.likedBy = [...(blog.likedBy || []), username];
    }
  }
}

export const {useRegisterMutation, useLoginMutation, useLogoutMutation, useLogoutFromAllDevicesMutation,useUploadImgMutation,useGetUserDataMutation,useCreateBlogMutation,useGetUserBlogsMutation,useGetAllBlogsQuery,useLikeBlogsMutation,useUpdateBlogMutation,useAddBlogNotesMutation,useDeleteBlogMutation,useFollowMutation,useGetFollowerListMutation,useGetFollowingListMutation,useUnfollowMutation,useUpdateProfileMutation} = api