import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
    name:'blog',
    initialState:{
        myBlogs:null,
       
    },
    reducers:{
        setMyBlogs:(state,action)=>{
            state.myBlogs = action.payload
        },
        
    }
})


export const {setMyBlogs,setAllBlogs} = blogSlice.actions

export default blogSlice.reducer

