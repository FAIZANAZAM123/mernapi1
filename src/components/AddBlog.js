import React, { useState, useContext, useEffect, useRef } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import './Styles/Addblog.css';
import { validateImage } from "image-validator";
import { fetchUserProfile } from '../store/slices/userSlice';
import { useSelector, useDispatch } from 'react-redux';

import { RotatingSquare as Loader } from 'react-loader-spinner';

const AddBlog = () => {
    const [inputValue, setInputValue] = useState('');
    const [blogContent, setBlogContent] = useState([]);
    const [Loading, setLoading] = useState(false);
    const { state } = useContext(UserContext);
    const ref = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userProfile = useSelector((state) => state.user.profile);
    const userStatus = useSelector((state) => state.user.status);
    const userError = useSelector((state) => state.user.error);
    const scrollElementIntoView = () => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }
    // const validateuser = async () => {
    //     try {
    //         const response = await fetch('/contact', {
    //             method: 'GET',
    //             headers: {
    //                 Accept: "application/json",
    //                 "Content-Type": "application/json"
    //             },
    //             credentials: "include"
    //         });
    //         const data = await response.json();
    //         if (response.status !== 200 || !data) {
    //             return navigate('/login', { replace: true });
    //         }
    //     } catch (error) {
    //         return navigate('/login', { replace: true });
    //     }
    // }
    useEffect(() => {

        dispatch(fetchUserProfile());

    }, [])
    if (userStatus === 'failed') {
        return navigate('/login', { replace: true });
    }
    const isValidImageUrl = async (url) => {
        console.log(typeof (url));
        const isimage = await validateImage(url)
        // return url.match(/\.(jpeg|jpg|gif|png|bmp|svg|tiff|tif|webp|ico|avif|heic)$/) !== null || url.startsWith('data:image');
        console.log(isimage)
        return isimage;
    }
    const addHeading = () => {
        setBlogContent([...blogContent, { type: 'heading', value: inputValue }]);
        setInputValue('');
        setTimeout(() => {
            scrollElementIntoView();
        }, 0);
    };
    const addParagraph = () => {
        setBlogContent([...blogContent, { type: 'paragraph', value: inputValue }]);
        setInputValue('');
        setTimeout(() => {
            scrollElementIntoView();
        }, 0);
    };

    const addImage = async () => {
        if (await isValidImageUrl(inputValue) === true) {
            setBlogContent([...blogContent, { type: 'image', value: inputValue }]);
            setInputValue('');
            setTimeout(() => {
                scrollElementIntoView();
            }, 0);
        }
        else {
            alert('Invalid image URL.Please Enter A valid Image Url');
        }
    };
    let updatedBlogContent;
    const CheckHeading = () => {
        const titleEntry = blogContent.find(content => content.type === 'heading');
        const Paragraph = blogContent.find(content => content.type === 'paragraph');
        const str = Paragraph ? Paragraph.value.split(' ')[0] : "";
        const title = titleEntry ? titleEntry.value : str;
        updatedBlogContent = [...blogContent];
        if (!titleEntry) {
            updatedBlogContent.unshift({ type: 'heading', value: title });
        }

        return updatedBlogContent
    }
    const saveBlogToDatabase = async (e) => {
        e.preventDefault();

        if (blogContent.length === 0) {
            window.alert("Please add something to the blog before posting.");
            return;
        }
        const datatosave = await CheckHeading();
        const titleEntry = datatosave.find(content => content.type === 'heading');
        const title = titleEntry ? titleEntry.value : "";
        const user = state.userId;
        setLoading(true);
        try {
            const response = await fetch('/addblog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content: datatosave, user })
            });

            const data = await response.json();

            if (response.status !== 200) {
                return navigate('/Error404', { replace: true });
            }

            if (response.status === 200) {
                return navigate('/home', { replace: true });
            }

        } catch (error) {
            console.error('Error saving blog:', error);
        }
        setLoading(false);
    };
    return (
        <>
            <div className="mainaddblogoutercontainer" >
                {Loading && (
                    <div className="loader-containeraddblog">
                        <Loader color="pink" height={100} width={100} />
                    </div>
                )}
                <div className="mainadd">
                    <div className='allbuttons'>
                        <button type='button' className='addblogbtn' onClick={addHeading}>Heading</button>
                        <button type='button' className='addblogbtn' onClick={addParagraph}>Paragraph</button>
                        <button type='button' className='addblogbtn' onClick={() => addImage(inputValue)}>Image</button>
                        <button type='submit' className='addblogbtn' onClick={saveBlogToDatabase}>Post Blog</button>
                    </div>
                    <div className={`blog-editor ${Loading ? 'opacity-effect' : ''}`}>
                        <div className="blog-content" >
                            {blogContent.map((content, index) => {
                                if (content.type === 'heading') return <h1 ref={ref} className='blogcontenth1' key={index}>{content.value}</h1>;
                                if (content.type === 'paragraph') return <p ref={ref} className='blogcontentp' key={index}>{content.value}</p>;
                                if (content.type === 'image') return <img className='Imageinblogcontent' ref={ref} key={index} src={content.value} alt="Blog content" />;
                                return null;
                            })}
                        </div>
                    </div>
                </div>
                <div className="text">
                    <textarea
                        className='Addbloginput'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter text or image URL..."
                    />
                </div>
            </div>
        </>
    );
};
export default AddBlog;
