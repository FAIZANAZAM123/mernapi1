import React, { useContext } from 'react';
import { UserContext } from '../App';
import { NavLink,Link} from 'react-router-dom';
import './Styles/Navbar.css';

const Navbar = () => {
    const { state } = useContext(UserContext);

    return (
        <>
            <nav style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/image.jpeg'})` }} className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <Link className="navbar-brand animated-logo" to="/">
                        <span className="logo-icon"><i className="fas fa-blog"></i></span>
                        <span className="logo-text1 blogapp">BlogAPP</span>
                    </Link>

                    <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">

                        <li className={`nav-item ${!state.isLoggedIn ? 'hidden' : ''}`}>
                                <NavLink className="nav-link links" aria-current="page" to="/Home">
                                    <i className="fas fa-home"></i> Home
                                </NavLink>
                            </li>

                            <li className={`nav-item ${!state.isLoggedIn ? 'hidden' : ''}`}>
                                <NavLink className="nav-link links" to="/profile">
                                    <i className="fas fa-address-card"></i> My Profile
                                </NavLink>
                            </li>

                            <li className={`nav-item ${!state.isLoggedIn ? 'hidden' : ''}`}>
                                <NavLink className="nav-link links" to="/addblog">
                                    <i className="fas fa-pen"></i> Add Blog
                                </NavLink>
                            </li>

                            <li className={`nav-item ${!state.isLoggedIn ? 'hidden' : ''}`}>
                                <NavLink  activeClassName="active" className="nav-link links text-light" to="/myblogs">
                                    <i className="fas fa-book-open"></i> My Blogs
                                </NavLink>
                            </li>

                            <li className={`nav-item ${!state.isLoggedIn ? 'hidden' : ''}`}>
                                <NavLink className="nav-link links" to="/likedblogs">
                                    <i className="fas fa-heart"></i> Liked Blogs
                                </NavLink>
                            </li>

                            {state.isLoggedIn ? (
                                <li className="nav-item">
                                    <NavLink className="nav-link links " to="/logout">
                                        <i className="fas fa-sign-out-alt"></i> Logout
                                    </NavLink>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <NavLink className="nav-link links" to="/login">
                                            <i className="fas fa-sign-in-alt"></i> Login
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link links" to="/signup">
                                            <i className="fas fa-user-plus"></i> Signup
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar;
