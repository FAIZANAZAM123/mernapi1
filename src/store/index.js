import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './slices/blogSlice';
import userReducer from './slices/userSlice';
const store = configureStore({
    reducer: {
        blogs: blogReducer,
        user: userReducer

    },
   
});

export default store;