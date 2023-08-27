import React from 'react'
import './Styles/Main.css'
const Main = () => {
    return (
        <>
            <div className="container-fluid home-bg">
                <div className="jumbotron bg-transparent text-center">
                    <h1 className="display-1 home-title">Welcome To BLOG APP</h1>
                    <p className="lead home-text">
                        The place where thoughts come to life.
                    </p>
                    <div className='home-divider'>

                    </div>
                    <p className="home-text">
                        Dive into the world of stories, insights, and experiences.
                    </p>
                    <p className="lead">
                        <a href="/login"id='btn' className=" btn btn-primary  btn-lg">Get Started</a>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Main