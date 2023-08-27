import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Profile.css';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '../store/slices/userSlice';
const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userdata = useSelector(state => state.user.profile);
    const status = useSelector(state => state.user.status);
    const error = useSelector(state => state.user.error);

    useEffect(() => {
    
            dispatch(fetchUserProfile());
    
    }, []);
    // const profileuser = async () => {
    //     // try {
    //     //     const response = await fetch('/edituser', {
    //     //         method: 'GET',
    //     //         headers: {
    //     //             Accept: "application/json",
    //     //             "Content-Type": "application/json"
    //     //         },
    //     //         credentials: "include"
    //     //     });

    //     //     const data = await response.json();
    //     //     setuserdata(data);

    //     //     if (response.status !== 200 || !data) {
    //     //         console.error("Error in response:", data);
    //     //         throw new Error(response.error);
    //     //     }
    //     // } catch (error) {
    //     //     navigate('/login', { replace: true });
    //     // }
    // }
  

    return (
        <>
            <section className="profile-section" id="profile-section-id">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="profile-card" id="profile-card-container">
                                <div className="card-body">
                                    <div className="text-center">

                                        {/* Profile Image */}
                                        <div className="profile-image-container imageprofilecontainer img-fluid">
                                            <img
                                                src={userdata && userdata.profileImage ? userdata.profileImage : "default-image-url-here"}
                                                alt="Profile"
                                                className="profile-image"
                                            />
                                        </div>

                                        <h3 className="profile-name" id="profile-name-text">{userdata ? userdata.name : ''}</h3>
                                    </div>
                                    <ul className="profile-details list-unstyled mt-5 text-center" id="profile-details-list">
                                        <li id="user-email"><i className="fas fa-envelope icon-email"></i> {userdata ? userdata.email : ''}</li>
                                        <li id="user-phone"><i className="fas fa-phone icon-phone"></i> {userdata ? userdata.phone : ''}</li>
                                    </ul>
                                    <div className="text-center mt-5">
                                        <button id="edit-profile-button" className="edit-button">
                                            <Link to='/editdata' id="edit-data-link">Edit data</Link>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );



}

export default Profile;
