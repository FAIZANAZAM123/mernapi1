import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserBlogs } from '../store/slices/blogSlice';
import { fetchUserProfile } from '../store/slices/userSlice';

import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { RotatingSquare as Loader } from 'react-loader-spinner';
import './Styles/MyBlog.css'

const MyBlog = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const blogs = useSelector((state) => state.blogs.userBlogs.items);
    const blogStatus = useSelector((state) => state.blogs.userBlogs.status);
    const blogError = useSelector((state) => state.blogs.userBlogs.error);

    const userProfile = useSelector((state) => state.user.profile); 
    const userStatus = useSelector((state) => state.user.status);   
    const userError = useSelector((state) => state.user.error);      
    const { state } = useContext(UserContext);
    const { userId } = state;

    if(userStatus==='failed')
    {
        navigate('/login', { replace: true });
    }
    

    // const profileuser = async () => {
    //     try {
    //         const response = await fetch('/edituser', {
    //             method: 'GET',
    //             headers: {
    //                 Accept: "application/json",
    //                 "Content-Type": "application/json"
    //             },
    //             credentials: "include"
    //         });
            
    //         const data = await response.json();

    //         if (response.status !== 200 || !data) {
    //             console.error("Error in response:", data);
    //             throw new Error(response.error);
    //         }
    //     } catch (error) {
    //         navigate('/login', { replace: true });
    //     }
    // }
    useEffect(() => {
        // profileuser();
        dispatch(fetchUserProfile()); 
        dispatch(fetchUserBlogs(userId));
    }, []);

    if (blogStatus === 'loading'|| userStatus === 'loading') {
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Loader color="pink" height={100} width={100} />
            </div>
        );
    }

    if (blogStatus === 'failed' || userStatus === 'failed') {
     return (
        <div className=' maincontainermyblogouter d-flex justify-content-center align-items-center'>
            <h4 className='text-light'>You have no Blogs</h4>
        </div>
     )
    }

    return (
        <div className="maincontainermyblogouter">
        <div className="pic">
        <div  className="container containermyblog ">
        <h2  className="myblogh2 mb-4"><span className='spanMyblog'>My Blogs</span> </h2>
        {blogs && blogs.length > 0 ? (
            <ul className="list-group">
                {blogs.map((blog) => (
                    <li key={blog._id} className="list-group-item border-3 p-4">
                        {blog.content.map((item, idx) => {
                            switch (item.type) {
                                case 'heading':
                                    return <h3 key={idx} className="mb-3">{item.value}</h3>;
                                case 'paragraph':
                                    return <p key={idx} className="mb-3">{item.value}</p>;
                                case 'image':
                                    return (
                                        <img
                                            key={idx}
                                            src={item.value}
                                            alt="Blog content"
                                            className="img-fluid mb-3 rounded"
                                        />
                                    );
                                default:
                                    return null;
                            }
                        })}
                    </li>                        
                ))}
            </ul>
        ) : (
            <div className="">
                You have no blogs.
            </div>
        )}
    </div>
    </div>
    </div>
    );
};

export default MyBlog;




