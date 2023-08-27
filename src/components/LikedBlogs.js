import React, { useEffect, useState } from 'react'
import { RotatingSquare as Loader } from 'react-loader-spinner';
import './Styles/LikedBlogs.css'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '../store/slices/userSlice';

const LikedBlogs = () => {
    const [AllLiked, setAllLiked] = useState([])
    // const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userdata = useSelector((state) => state.user.profile);
    const userStatus = useSelector((state) => state.user.status);
    const userError = useSelector((state) => state.user.error);
    const [loading, setloading] = useState()
    // const isLoading = userStatus === 'loading';

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


    const GetLikedBlogs = async () => {
        try {
            setloading(true);

            const response = await fetch('/likedBlogs', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });

            if (response.ok) {
                const likedBlogs = await response.json();
                await setAllLiked(likedBlogs);


            } else {
                console.error('Failed to fetch liked blogs:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching liked blogs:', error);
        }
        setloading(false)
    }
    function truncateString(str, num) {
        if (str.length <= num) {
            return str;
        }
        return str.slice(0, num) + '...';
    }
    useEffect(() => {
        dispatch(fetchUserProfile());


        GetLikedBlogs();
    }, [])
    if (userStatus === 'failed') {
       return navigate('/login', { replace: true });


    }
    return (
        <div className="container Likedblogcontainer main-containerlikedblogs mt-3">
            <div className="row  Likedblog-card">
                {loading ? (
                    <div className="col .loader-containerlikedblogs d-flex justify-content-center">
                        <Loader color="pink" height={100} width={100} />
                    </div>
                ) : (
                    AllLiked && AllLiked.length > 0 ? AllLiked.map((blog, blogIndex) => {
                        let hasRenderedHeading = false;
                        let hasRenderedParagraph = false;
                        let hasRenderedImage = false;
                        return (
                            <div style={{ width: '20rem' }} className="ms-auto me-auto col-12 col-lg-6 col-xl-4 d-flex justify-content-center">

                                <div style={{ width: '20rem' }} className="card  ms-auto me-auto mb-4 innerLikedCard shadow" key={blogIndex}>

                                    {blog.content && blog.content.map((item, itemIndex) => {

                                        switch (item.type) {
                                            case "heading":
                                                if (!hasRenderedHeading) {
                                                    hasRenderedHeading = true;

                                                    return (
                                                        <>
                                                            <h1 className="card-title innercardliked-title" key={`${blogIndex}-${itemIndex}`}>{item.value}</h1>
                                                            <div className="line me-3 ms-2"></div>
                                                        </>
                                                    );
                                                }
                                                break;

                                            case "paragraph":
                                                if (!hasRenderedParagraph) {
                                                    hasRenderedParagraph = true;

                                                    return <p className="innercardliked-text card-text" key={`${blogIndex}-${itemIndex}`}>{item.value.length > 90 ? truncateString(item.value, 90) : item.value}</p>;
                                                }
                                                break;
                                            case "image":
                                                if (!hasRenderedImage) {
                                                    hasRenderedImage = true;
                                                    return <img className="card-img-top innercardliked-img-top" key={`${blogIndex}-${itemIndex}`} src={item.value} alt="Blog content" />;
                                                }
                                                break;
                                            default:
                                                return null;
                                        }
                                    })}
                                    <div className="innercardliked-body">
                                        <Link to={`/blogdetails/${blog._id}`} className="btn btnlikedblog">Read More</Link>
                                    </div>
                                </div>
                            </div>

                        );
                    }) : (
                        <div className="col d-flex justify-content-center">
                            <h4 className='text-light'>YOU HAVE NO LIKED BLOGS</h4>
                        </div>
                    )
                )}
            </div>
        </div>
    );

}
export default LikedBlogs;

