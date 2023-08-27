import React, { useEffect, useState, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchblogsbyID } from '../store/slices/blogSlice';
import { RotatingSquare as Loader } from 'react-loader-spinner';
import { Circles as Loader1 } from 'react-loader-spinner';
import { UserContext } from '../App';
import { useNavigate, Link } from 'react-router-dom';
import { fetchUserProfile } from '../store/slices/userSlice';
import './Styles/BlogDetails.css'
const BlogDetails = () => {
  const { blogId } = useParams();
  const ref = useRef(null);
  const { state } = useContext(UserContext);
  const { userId, userName } = state;
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blog.items);
  const blogStatus = useSelector((state) => state.blogs.blog.status);
  const blogError = useSelector((state) => state.blogs.blog.error);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [clapsCount, setClapsCount] = useState({});
  const [color, setcolor] = useState({})
  const userdata = useSelector((state) => state.user.profile);
  const userStatus = useSelector((state) => state.user.status);
  const userError = useSelector((state) => state.user.error);
let isloading=false;
  const bloggeremail = blogs && blogs.user ? blogs.user.email : '';
  console.log("This is the name", userName);
//   const handleImageError = (e,imageid) => {
//     console.log("comed here");
//     console.log(userdata?userdata._id:'not fond')
//     if (userdata) {
//       console.log("comed here in if");

//         e.target.src = `https://mernapi-fle4.vercel.app/${userdata.profileImage}`;
//     } else {
//         e.target.src = 'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png';
//     }
// }


const handleImageError = (e) => {


           e.target.src = 'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png';

  
}


  const handleClap = async (blogId, blogclaps) => {
    setcolor(prevColors => {
      const currentColor = prevColors[blogId] || (blogclaps && blogclaps.some(clap => clap.user === userId) ? 'danger' : 'primary');
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

  const handleLike = async () => {
    setIsLiked(!isLiked);
    const url = isLiked ? '/unlikeBlog/' + blogId : '/likeBlog/' + blogId;
    const method = isLiked ? 'DELETE' : 'POST';
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
        setIsLiked(!isLiked);
      } else {
        console.error('Failed to update like status:', data.error);
      }
    } catch (error) {
      console.error('Error liking/unliking blog:', error);
    }
  };
  const addComment = async (blogId, commentInput) => {
    setIsCommentLoading(true);
    if(commentInput.length===0)
    {
      setIsCommentLoading(false);

      return window.alert('You have entered nothing in comment');
    }
    setCommentInput('');
    console.log(blogId);
    console.log(commentInput);
    const response = await fetch('/savecomment', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        blogId, commentInput, userId
      }),
      credentials: 'include',
    });

    const data = await response.json();
    if (data) {

      setComments(prevComments => [
        {
          comment: commentInput,

        },
        ...prevComments
      ]); setCommentInput('');
      
    }
    console.log("THIS IS THE DATA IN SAVECOMMENTS",data);
    if (!data) {
      console.log('comment not saved');
    }

    // dispatch(fetchblogsbyID(blogId));
 
    setIsCommentLoading(false);



  }
  const getdata = async () => {
    console.log(blogId);
    dispatch(fetchblogsbyID(blogId));
    dispatch(fetchUserProfile());


    if (blogs && blogs.comments) {
      setComments([...blogs.comments].reverse());
    }
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
          if (element._id === blogId) {
            setIsLiked(true);
          }
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

  }, [])
  useEffect(() => {
    if (blogs && blogs.comments) {

      setComments([...blogs.comments].reverse());
    }
  }, [blogs]);
  useEffect(() => {
    const clapCounts = {};
    if (blogs && blogs.claps) {
      clapCounts[blogs._id] = blogs.claps.length;
    }
    setClapsCount(clapCounts);

    setClapsCount(clapCounts);
  }, [blogs]);
  console.log("These are the blogs", blogs);
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
    return navigate('/login', { replace: true });
  }
  console.log("this is the user data", userdata)
  return (
    <>
      {console.log("these are the comments", comments)
      }
      <div className='blogContainer'>
        {
          blogs && blogs.content && blogs.content.map((blog, idx) => {
            switch (blog.type) {
              case 'heading':
                return <h1 className='blogHeading' key={idx}>{blog.value}</h1>;
              case 'paragraph':
                return <p className='blogParagraph' key={idx}>{blog.value}</p>;
              case 'image':
                return <img src={blog.value} alt="Blog related image" className='blogImage' key={idx} />;
              default:
                return null;
            }
          })}
        <svg
          onClick={handleLike}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isLiked ? "red" : "grey"}
          width="40px"
          height="40px"
          style={{ cursor: 'pointer' }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <button>
          <Link style={{ textDecoration: "none", color: 'white' }} to={`/contactblogger/${bloggeremail}`}> Contact Blogger </Link>
        </button>
        <button
          className={`bg-${color[blogId] || (blogs.claps && blogs.claps.some(clap => clap.user === userId) ? 'danger ' : 'primary ')}`}
          onClick={() => handleClap(blogId, blogs.claps, clapsCount[blogId])}
        >
          {clapsCount[blogId] || 0} Clap {clapsCount[blogId] && clapsCount[blogId] > 0 ? '👏' : ''}

        </button>


        {/* This is the card */}





      </div>

      <div className='BloggerDetails'>
        <h1 className='COMMENTS h-100 text-center bg-dark text-light '>Blogger Details</h1>
      </div>
      <div className="maincardbriefauthor">
        <div className=" cardprofileblogdetails card " style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/image.jpeg'})`, maxWidth: "540px", marginLeft: "auto", marginRight: "auto", display: "block" }} >

          {console.log(blogs && blogs.user && blogs.user.profileImage ? blogs.user.profileImage : '')}
          {console.log("this is from redux",userdata?userdata.profileImage:'not found')}

          <img
            className='img-fluid  errorimageblogdetails '

            src={` https://mernapi-fle4.vercel.app/${blogs && blogs.user && blogs.user.profileImage ? blogs.user.profileImage : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRefViTsx85xM_U01LKGg8JF353Bjkywkx8w&usqp=CAU'}`}
            alt="No pic"
            onError={handleImageError}
          />
          {
            blogs && blogs.user ?
              <div className=" mt-3 cardprofileblogdetailscard-body card-body">
                <h5 className="card-title text-center text-light">{blogs.user.name}</h5>
                <p className="card-text text-center text-light">{blogs.user.email}</p>
                <p className="card-text text-center text-light">{blogs.user.phone}</p>

                <button className='buttontocontact' style={{ marginTop: "20px", height: "100%" }}>

                  <Link style={{ textDecoration: "none", color: 'white' }} to={`mailto:${bloggeremail}?subject=Regarding Your Blog on ${blogs && blogs.content && blogs.content[0].value}`}>Contact the author</Link>

                </button>
              </div> : ''
          }
        </div>

      </div>


      <h1 className='bg-dark text-light COMMENTS '>COMMENTS</h1>
      <div className='commentsSection m-0'>

        <ul className="list-group">
          {blogs && blogs.comments && comments && comments.map((commentObj, index) => (
            < li className="list-group-item" key={index} >
              <img style={{ height: '40px', width: '30px' }}
                className='img-fluid rounded-start '
                src={`https://mernapi-fle4.vercel.app/${commentObj.user && commentObj.user.profileImage ? commentObj.user.profileImage :'' }`}
                alt="No pic"
                // onError={handleImageError}
                onError={handleImageError}

              />

            




              <span className=' spanBlogdetails' >
                {console.log("this is UserName", userName)}
                {commentObj.user ? commentObj.user.name : userName}</span>
              <br />
              {commentObj.comment}
            </li>
          ))}
        </ul>

        {isCommentLoading &&
          <div className=" d-flex justify-content-center comment-loader-container ">
            <Loader1
              color="black"
              height={80}
              width={100}
            />
          </div>
        }
        {/* Add new comment */}

        <form method="post" ref={ref}>
          <h1 className='text-danger text-center'  >LEAVE A REPLY....</h1>
          {console.log(ref)}
          <div className='addComment'>
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a comment..."
            />
            <button onClick={(e) => {
              e.preventDefault();
              addComment(blogId, commentInput);
            }}>Post Comment</button>
          </div>
        </form>
      </div >
    </>
  );
}
export default BlogDetails





