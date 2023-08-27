import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const [userdata, setuserdata] = useState({
        name: '', email: '', phone: '', password: '', education: '', interests: []
    });
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }
    const storedata = (event) => {
        const name = event.target.name;
        const value = event.type === "checkbox" ? event.target.checked : event.target.value;

        if (event.target.type === "checkbox") {
            if (value) {
                setuserdata(prevState => ({ ...prevState, interests: [...prevState.interests, name] }));
            } else {
                setuserdata(prevState => ({ ...prevState, interests: prevState.interests.filter(i => i !== name) }));
            }
        } else {
            setuserdata({ ...userdata, [name]: value });
        }
        console.log(userdata);
    }

    const senddata = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', userdata.name);
        formData.append('email', userdata.email);
        formData.append('phone', userdata.phone);
        formData.append('password', userdata.password);
        formData.append('education', userdata.education);
        formData.append('interests', JSON.stringify(userdata.interests));
        formData.append('profileImage', file);

        const res = await fetch('/register', {
            method: 'POST',
            body: formData
        });
        const response = await res.json();
        if (res.status === 422 || !response) {
            window.alert('Invalid Credentials');
        }
        else {
            window.alert('Registered successfully');
            navigate("/login", { replace: true });
        }


    }
    return (
        <>
            <div className="container mt-4" id="signup-container">
                <div className="row justify-content-center" id="signup-row">
                    <div className="col-8" id="signup-col">
                        <div style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/image.jpeg'})` }} className="card p-4 shadow animated-formsignup" id="signup-card">
                            <h2 className="text-center mb-4">BlogApp Signup</h2>
                            <form method="POST">

                                <div className="mb-3">
                                    <label for="name" className="form-label">Name  <i class="fas fa-user"></i>  </label>
                                    <input type="text" name='name' onChange={storedata} className="form-control input-field" id="name" placeholder="Enter your name" />
                                </div>
                                <div className="mb-3">
                                    <label for="email" className="form-label">Email <i class="fas fa-envelope"></i></label>
                                    <input type="email" name='email' onChange={storedata} className="form-control input-field" id="email" placeholder="Enter your email" />
                                </div>
                                <div className="mb-3">
                                    <label for="phone" className="form-label">Phone <i class="fas fa-phone"></i></label>
                                    <input type="tel" name='phone' onChange={storedata} className="form-control input-field" id="phone" placeholder="Enter your phone number" />
                                </div>
                                <div className="mb-3">
                                    <label for="education" className="form-label">Education <i className="fas fa-graduation-cap"></i></label>
                                    <input type="text" name='education' onChange={storedata} className="form-control input-field" id="education" placeholder="Enter Your Education (BSC,MSC etc..)" />
                                </div>

                                <label className="form-label ">Interests <i className="fas fa-heart"></i></label>

                                <div style={{ height: "43px", borderRadius: "7px" }}
                                    className=" mb-3 align-items-center justify-content-around bg-light text-dark d-flex">
                                    <div>
                                        <input type="checkbox" name='sports' onChange={storedata} id="sports" />
                                        <label for="sports" className="ms-2 interests">Sports</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" name='movies' onChange={storedata} id="movies" />
                                        <label for="movies" className="ms-2 interests">Movies</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" name='education' onChange={storedata} id="education" />
                                        <label for="education" className="ms-2 interests">Education</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" name='business' onChange={storedata} id="business" />
                                        <label for="business" className="ms-2 interests">Business</label>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label for="profileImage" className="form-label">Profile Image <i class="fas fa-image"></i></label>
                                    <input type="file" name='profileImage' onChange={handleFileChange} className="form-control input-field" id="profileImage" />
                                </div>
                                <div className="mb-3">
                                    <label for="password" className="form-label">Password <i class="fas fa-lock"></i>
                                    </label>
                                    <input type="password" name='password' onChange={storedata} className="form-control input-field" id="password" placeholder="Enter a password" />
                                </div>
                                <button onClick={senddata} type="submit" className="btn signupbtn mt-3">Sign Up</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default Signup
