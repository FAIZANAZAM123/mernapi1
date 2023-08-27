import React, { createContext, useReducer } from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Profile from './components/Profile';
import Contact from './components/Contact';
import  Login from './components/Login';
import Signup from './components/Signup';
import Error404 from './components/Error404';
import Logout from './components/Logout';
import Main from './components/Main';
import AddBlog from'./components/AddBlog'
import BlogDetails from './components/BlogDetails'
import MyBlog from './components/MyBlog';
import Editprofile from './components/Editprofile'
import {initialState,reducer} from './components/reducer/useReducer'
import LikedBlogs from './components/LikedBlogs';
import ContactBlogger from './components/ContactBlogger';
export const UserContext = createContext();
const App = () => {
  const [state, dispatch] = useReducer(reducer,initialState );
  return (
    <div>
<UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routes>
        <Route exact path='/' element={<Main/>} />
          <Route exact path='/home' element={<Home />} />
          <Route exact path='/profile' element={<Profile />} /> 
           <Route exact path='/contact' element={<Contact />} />
           <Route exact path='/blogdetails/:blogId' element={<BlogDetails/>} />

           <Route exact path='/addblog' element={<AddBlog />} />
           <Route exact path='/editdata' element={<Editprofile />} />


           <Route exact path='/myblogs' element={<MyBlog />} />
           <Route exact path='/likedblogs' element={<LikedBlogs />} />
           <Route exact path='/contactblogger/:email' element={<ContactBlogger />} />
           <Route exact path='/login' element={<Login />} />
           <Route exact path='/signup' element={<Signup />} />
           <Route exact path='/logout' element={<Logout />} />


           <Route path='*' element={<Error404 />} />
        </Routes>
      </BrowserRouter>

      </UserContext.Provider>

    </div>
  )
}

export default App
