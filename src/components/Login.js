import React, { useState, useContext } from 'react'
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import './Styles/Login.css'

const Login = () => {
    const { state, dispatch } = useContext(UserContext)
    const navigate = useNavigate();
    const [cre, setcre] = useState([{
        email: '', password: ''
    }]);
    const store = (e) => {
        const name = e.target.name;
        const val = e.target.value;
        setcre({ ...cre, [name]: val });
        console.log(cre);



    }
    const authdata = async (e) => {
        e.preventDefault();
        
        const { email, password } = cre;
        const response = await fetch('/signin', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password
            }),
            credentials: 'include'
        })
        const data = await response.json();
       await  console.log(data);
        if(response.status === 201) {
            window.alert('you are loginned successfully');
            const userId = data.userId; 
            const userName=data.userName;
            const imageofuser=data.imageofuser
            dispatch({ type: "SET_USER_ID", payload: userId }); 
            dispatch({ type: "USER", payload: true });
            dispatch({ type: "USERNAME", payload:userName });
            navigate("/home", { replace: true });
        }
      else{
            return window.alert('An error occured invalid credentials')
        
      }

    }
    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-8">
                        <div style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/image.jpeg'})` }} className="cardlogin p-4  animated-form">
                            <h2 className="text-center   mb-4">BlogApp Login</h2>
                            <form method='POST'>
                                <div className="mb-3">
                                    <label for="email" className="form-label"><i className="fas fa-envelope helo"></i> Email </label>
                                    <input name='email' onChange={store} type="email" className="form-control input-field" id="email" placeholder="Enter your email" />
                                </div>
                                <div className="mb-3">
                                    <label for="password" className="form-label"><i className="fas fa-lock helo"></i> Password</label>
                                    <input onChange={store} name='password' type="password" className="form-control input-field" id="password" placeholder="Enter your password" />
                                </div>
                                <button onClick={authdata} type="submit" className="btn btn-primary  loginbtn w-25 h-50 mt-3">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>





        </>
    )
}

export default Login
