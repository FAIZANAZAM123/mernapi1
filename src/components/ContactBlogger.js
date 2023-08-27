import React, { useEffect, useState } from 'react';
import './Styles/ContactBlogger.css';
import { useParams } from "react-router-dom";
import { RotatingSquare as Loader } from 'react-loader-spinner';
const ContactBlogger = () => {
    const { email } = useParams();
    const bloggeremail = email;

    const [userdata, setuserdata] = useState({});
    const [contactdata, setcontactdata] = useState({
        name: '',
        email: '',
        message: ' '
    });
    const [loading, setLoading] = useState(false); 
    const handleinput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setcontactdata({ ...contactdata, [name]: value });
    };

    const senddata = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { name, email, message } = contactdata;
        const response = await fetch('/sendEmail', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name, email, message, bloggeremail
            })
        });

        setLoading(false);

        const data = await response.json();
        if (!data || response.status !== 200) {
            console.log('message not send');
        } else {
            setcontactdata(prevState => ({ ...prevState, message: ' ' }));
            alert("MESSAGE IS SENT");
        }
    };
    const Contactuser = async () => {
        try {
            const response = await fetch('/contact', {
                method: 'GET',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
    
            const data = await response.json();
            setuserdata(data);
            setcontactdata({ name: data.name, email: data.email })
    
            if (response.status !== 200 || !data) {
                console.error("Error in response:", data);
                throw new Error(response.error);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    
    useEffect(() => {
        Contactuser();
    }, []);

    return (
        <>
            {loading && (
                <div className="loader-containercontact">
                    <Loader color="pink" height={100} width={100} />
                </div>
            )}
    
            <div  className={`container mt-5 ${loading ? 'loading-contentcontact' : ''}`}>
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/image.jpeg'})` }} className="card p-5 shadow animated-form">
                            <h2 className="text-center mb-4 text-light">Contact Blogger</h2>
                            <p className="text-center text-light">We'd love to hear from you! Drop us a message and we'll get back to you as soon as possible.</p>
                            <form method='POST'>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label"><i className="fas fa-user"></i> Name</label>
                                    <input name='name' onChange={handleinput} value={userdata.name || ''} type="text" className="form-control input-field" id="name" placeholder="Your name" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label"><i className="fas fa-envelope"></i> Email</label>
                                    <input name='email' onChange={handleinput} value={userdata.email || ''} type="email" className="form-control input-field" id="email" placeholder="Your email" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label"><i className="fas fa-comment"></i> Message</label>
                                    <textarea onChange={handleinput} value={contactdata.message} name='message' className="form-control input-field" id="message" rows="5" placeholder="Your message"></textarea>
                                </div>
                                <button type="submit" onClick={senddata} className="btn btn-primary w-100 mt-3">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
    
};

export default ContactBlogger;











