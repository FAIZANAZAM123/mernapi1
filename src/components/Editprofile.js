import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import './Styles/Editprofile.css'
const Editprofile = () => {
    const navigate = useNavigate();
    const { state } = useContext(UserContext);
    const { userId } = state;

    const [newPassword, setNewPassword] = useState('');
    const [userdata, setuserdata] = useState({
        name: '', email: '', phone: '', education: '', password: ''
    });

    const storedata = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setuserdata({ ...userdata, [name]: value });
    }
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }
    const senddata = async (e) => {
        e.preventDefault();



        const formData = new FormData();
        formData.append('name', userdata.name);
        formData.append('email', userdata.email);
        formData.append('phone', userdata.phone);
        formData.append('education', userdata.education);
        formData.append('password', newPassword || userdata.password);

        if (file) {
            formData.append('profileImage', file);
        }



        const res = await fetch(`/editdata/${userId}`, {
            method: 'PATCH',
            body: formData,
            credentials: 'include',
        });

        const response = await res.json();
        if (res.status === 422 || !response) {
            window.alert('Invalid Credentials');
        } else {
            window.alert('Profile updated successfully');
            navigate("/home", { replace: true });
        }
    }

    const GetProfiledata = async () => {
        try {
            const response = await fetch('/edituser', {
                method: 'GET',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            const data = await response.json();
            setuserdata(data);

            if (response.status !== 200 || !data) {
                console.error("Error in response:", data);
                throw new Error(response.error);
            }
        } catch (error) {
            navigate('/login', { replace: true });
        }
    }

    useEffect(() => {
        GetProfiledata();
    }, []);

    return (
        <div className="container mt-3" id="edit-profile-container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4 shadow" id="edit-profile-card">
                        <h2 className="text-center" id="edit-profile-title">Edit User Profile</h2>
                        <form method="POST" enctype="multipart/form-data">
                            <div className="mb-3" id="edit-name-input">
                                <label htmlFor="name" className="form-label">Name <i class="fas fa-user"></i> </label>
                                <input
                                    type="text"
                                    name='name'
                                    value={userdata.name}
                                    onChange={storedata}
                                    className="form-control input-field"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="mb-3" id="edit-email-input">
                                <label htmlFor="email" className="form-label">Email <i class="fas fa-envelope"></i></label>
                                <input
                                    type="email"
                                    name='email'
                                    value={userdata.email}
                                    onChange={storedata}
                                    className="form-control input-field"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="mb-3" id="edit-phone-input">
                                <label htmlFor="phone" className="form-label">Phone <i class="fas fa-phone"></i> </label>
                                <input
                                    type="tel"
                                    name='phone'
                                    value={userdata.phone}
                                    onChange={storedata}
                                    className="form-control input-field"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <div className="mb-3" id="edit-education-input">
                                <label htmlFor="phone" className="form-label">Education <i class="fas fa-graduation-cap"></i> </label>
                                <input
                                    type="text"
                                    name='education'
                                    value={userdata.education}
                                    onChange={storedata}
                                    className="form-control input-field"
                                    placeholder="Enter your Education"
                                />
                            </div>
                            <div className="mb-3">
                                <label for="profileImage" className="form-label">Profile Image <i class="fas fa-image"></i></label>
                                <input type="file" name='profileImage' onChange={handleFileChange} className="form-control input-field" id="profileImage" />
                            </div>
                            <div className="mb-3" id="edit-newpassword-input">
                                <label htmlFor="newPassword" className="form-label">Enter New Password  <i class="fas fa-lock"></i> (If you Want To Change)</label>
                                <input
                                    type="password"
                                    name='newPassword'
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    value={newPassword}
                                    className="form-control input-field"
                                    placeholder="Enter new password if you want to change"
                                />
                            </div>
                            <button onClick={senddata} type="submit" className="btn" id="update-profile-btn">Update Profile</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Editprofile;
