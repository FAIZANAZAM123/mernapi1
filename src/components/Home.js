import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchblogs } from '../store/slices/blogSlice';
import { useNavigate, Link } from 'react-router-dom';
import { RotatingSquare as Loader } from 'react-loader-spinner';
import './Styles/Home.css';
import { UserContext } from '../App';
const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const blogs = useSelector((state) => state.blogs.allBlogs.items);
    const blogStatus = useSelector((state) => state.blogs.allBlogs.status);
    const blogError = useSelector((state) => state.blogs.allBlogs.error);
    const [searchTerm, setSearchTerm] = useState('');
    const [LikedBlogs, setLikedBlogs] = useState([]);
    const [clickedlike, setclickedlike] = useState();
    const [clapsCount, setClapsCount] = useState({});
    const [color, setcolor] = useState({})
    const { state } = useContext(UserContext);
    const { userId } = state;
    const handleClap = async (blogId, blogclaps) => {
        setcolor(prevColors => {
            const currentColor = prevColors[blogId] || (blogclaps.some(clap => clap.user === userId) ? 'danger' : 'primary');
            return {
                ...prevColors,
                [blogId]: currentColor === 'danger' ? 'primary' : 'danger'
            };
        });
        try {
            const response = await fetch(`/clapblogs/${blogId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
                credentials: 'include'
            });

            if (response.status === 200) {
                const data = await response.json();
                const updatedClapCount = data.claps.length;
                setClapsCount(prevState => ({
                    ...prevState,
                    [blogId]: updatedClapCount
                }));
            } else {
                console.log('Clap action failed');
            }
        } catch (error) {
            console.log('Error while clapping:', error);
        }
    };

    const handleLike = async (blogId) => {
        setclickedlike(blogId);
        const currentlyLiked = LikedBlogs.includes(blogId);
        const newLikedBlogs = currentlyLiked ? LikedBlogs.filter(id => id !== blogId) : [...LikedBlogs, blogId];
        setLikedBlogs(newLikedBlogs);

        const url = currentlyLiked ? '/unlikeBlog/' + blogId : '/likeBlog/' + blogId;
        const method = currentlyLiked ? 'DELETE' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setLikedBlogs(newLikedBlogs);
            } else {
                console.error('Failed to update like status:', data.error);
            }
        } catch (error) {
            console.error('Error liking/unliking blog:', error);
        }
    };

    function truncateString(str, num) {
        if (str.length <= num) {
            return str;
        }
        return str.slice(0, num) + '...';
    }
    const getdata = async () => {
        dispatch(fetchblogs());

        try {
            const response = await fetch('/likedBlogs', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });

            if (response.ok) {
                const likedBlogs = await response.json();
                console.log(likedBlogs, "These are liked bogs")

                likedBlogs.forEach(element => {
                    setLikedBlogs(prevLikedBlogs => [...prevLikedBlogs, element._id]);
                });

            } else {
                console.error('Failed to fetch liked blogs:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching liked blogs:', error);
        }

    }
    useEffect(() => {
        getdata();


    }, []);
    useEffect(() => {
        const clapCounts = {};
        console.log(blogs)
        console.log("this is user Id",userId)
        blogs.forEach(blog => {
            clapCounts[blog._id] = blog.claps ? blog.claps.length : 0;
        });
        console.log("this is clap counts",clapCounts);
        setClapsCount(clapCounts);
    }, [blogs]);

    if (blogStatus === 'loading') {
        return <div className="loader-container">
            <Loader
                color="pink"
                height={100}
                width={100}
            />
        </div>
    }

    if (blogStatus === 'failed') {
        navigate('/login', { replace: true });
        return <div>Error occurred!</div>;
    }
    const filteredBlogs = blogs.filter(blog => blog.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <>
        <div className="outer">
            <div className={blogs ? '' : 'homecontainer'}>
                <div className=" container ">

                    <div className="row mt-3">
                        <input
                            type="text"
                            className="form-control mb-4"
                            placeholder="Search blogs..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        {
                            blogs && blogs.length > 0 ? (
                                <div className="blog-card">
                                    {filteredBlogs.map((blog) => {
                                        let hasRenderedHeading = false;
                                        let hasRenderedParagraph = false;
                                        let hasRenderedImage = false;

                                        return (
                                            <div key={blog._id} className="card innerhomecard col-3 me-2 mb-4">
                                                {blog.content.map((item, idx) => {
                                                    switch (item.type) {
                                                        case 'heading':
                                                            if (!hasRenderedHeading) {
                                                                hasRenderedHeading = true;

                                                                return (
                                                                    <>
                                                                        <h1 className="card-title innercard-title" key={idx}>{item.value}</h1>
                                                                        <div className=" linehome"></div>
                                                                    </>
                                                                );
                                                            }
                                                            break;
                                                        case 'paragraph':
                                                            if (!hasRenderedParagraph) {
                                                                hasRenderedParagraph = true;
                                                                const string = item.value;
                                                                return <p className="innercard-text card-text" key={idx}>{string.length > 90 ? truncateString(string, 90) : string}</p>;
                                                            }
                                                            break;
                                                        case 'image':
                                                            if (!hasRenderedImage) {
                                                                hasRenderedImage = true;
                                                                return (
                                                                    <img key={idx} src={item.value} className="card-img-top innercard-img-top" alt="Blog Content" />
                                                                );
                                                            }
                                                            break;
                                                        default:
                                                            return null;
                                                    }
                                                    return null;
                                                })}
                                                <div className="footer">
                                                    <div className="innercard-body">
                                                        <Link to={`/blogdetails/${blog._id}`} className="btn btnhome">Read More</Link>
                                                        <svg
                                                            onClick={() => {
                                                                handleLike(blog._id);
                                                            }}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill={LikedBlogs.includes(blog._id) ? "red" : "grey"}
                                                            width="40px"
                                                            height="40px"
                                                            className={blog._id === clickedlike ? "clicked-svg" : ""}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                        </svg>

                                                        <button
                                                            className={`bg-${color[blog._id] || (blog.claps.some(clap => clap.user === userId) ? 'danger ' : 'primary ')}`}
                                                            onClick={() => handleClap(blog._id, blog.claps, clapsCount[blog._id])}
                                                        >
                                                                {clapsCount[blog._id] || 0} Clap {clapsCount[blog._id] && clapsCount[blog._id] > 0 ? '👏' : ''}

                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                               <div className="p ">
                                 <p className="text-center">No blogs To show.</p>
                               </div>
                            )
                        }
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}

export default Home;




