import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import storage from 'redux-persist/lib/storage'
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import { api } from "./slices/apiSlice";
import blogSlice from "./slices/blogSlice";
 
const persistConfig = {
    key:'root',
    version:1,
    storage,
    blacklist: [api.reducerPath]
}

const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer,
    userData: userSlice,
    blogData: blogSlice
})

const persistedReducer = persistReducer(persistConfig,rootReducer)


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['persist/PERSIST']
        },
    }).concat(api.middleware),

})


