import React, { useEffect, useState } from 'react'
 import './Styles/Contact.css'
const Contact = () => {
    const [userdata, setuserdata] = useState();
    const [contactdata, setcontactdata] = useState({
        name: '',
        email: '',
        message: ' '
    });
    const handleinput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setcontactdata({ ...contactdata, [name]: value })
        console.log(contactdata)
    }
    const senddata = async (e) => {
        e.preventDefault();
        const { name, email, message } = contactdata;
        const response = await fetch('/contact', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name, email, message
            })
        })
        const data=await response.json();
        if(!data){
            console.log('message not send');
        }
        else{
            console.log('Message is send');

            setcontactdata(prevState => ({
                ...prevState,
                message:' '
            }));
            console.log('after sending',contactdata);
            
        }
    }
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
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card p-5 shadow animated-form">
                            <h2 className="text-center mb-4">Contact Us</h2>
                            <p className="text-center">We'd love to hear from you! Drop us a message and we'll get back to you as soon as possible.</p>
                            <form method='POST'>
                                <div className="mb-3">
                                    <label for="name" className="form-label"><i className="fas fa-user"></i> Name</label>
                                    <input name='name' onChange={handleinput} value={userdata ? userdata.name : ''} type="text" className="form-control input-field" id="name" placeholder="Your name" />
                                </div>
                                <div className="mb-3">
                                    <label for="email" className="form-label"><i className="fas fa-envelope"></i> Email</label>
                                    <input name='email' onChange={handleinput} type="email" className="form-control input-field" id="email" value={userdata ? userdata.email : ''} placeholder="Your email" />
                                </div>
                                <div className="mb-3">
                                    <label for="message" className="form-label"><i className="fas fa-comment"></i> Message</label>
                                    <textarea onChange={handleinput} value={contactdata.message} name='message' className="form-control input-field" id="message" rows="5" placeholder="Your message"></textarea>
                                </div>
                                <button type="submit" onClick={senddata} className="btn btn-primary w-100 mt-3" >Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Contact
