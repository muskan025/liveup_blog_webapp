import { createSlice } from "@reduxjs/toolkit";
 
 
const userSlice = createSlice({
    name:'user', 
    initialState:{
      author:null,
      profileImg:null,
      followersList:0,
      followingsList:0,
      isAuth:false
     },
    reducers:{
      setUser: (state,action)=>{
        state.author = action.payload
        state.profileImg = action.payload.profileImg
        state.isAuth = true
      },
      setFollowLists: (state,action)=>{
         const {type,data} = action.payload
         if(type === 'Followers') state.followersList = data
         if(type === 'Followings') state.followingsList = data
      },
      setAuthStatus: (state, action) => {
        state.isAuth = action.payload;
      },
      clearUser: (state)=>{
        state.author = null
        state.isAuth = false
      }
    }
})

export const {setUser,setAuthStatus,setFollowLists,clearUser } = userSlice.actions
export default userSlice.reducer;

 