//import React from 'react';
import React, { useState } from 'react';
import twitterImage from '../../assets/images/TwitterNew.jpg';
import  {useCreateUserWithEmailAndPassword , useSignInWithGoogle} from 'react-firebase-hooks/auth'
import TwitterIcon from '@mui/icons-material/Twitter';
import auth from '../../firebase.init';
import GoogleButton from 'react-google-button'
import { Link, useNavigate } from 'react-router-dom';
import './Login.css' 
import axios from 'axios'

const Signup = () => {
     
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate=useNavigate();

    const[
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ]= useCreateUserWithEmailAndPassword(auth);

    const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);

    if(user || googleUser){
        navigate('/');
        console.log(user);
        console.log(googleUser)
    }
    if(error || googleError){
        console.log(error.message);
        console.log(googleError.message);
    }
    if(loading || googleLoading){
        console.log(loading);
        console.log(googleLoading);
    }
    
    const handleSubmit = e => {
        e.preventDefault();
        setErrorMessage('');  // Clear any previous error messages

        if (password.length < 6) {
            setErrorMessage('Password should be at least 6 characters long.');
            return;
        }

        createUserWithEmailAndPassword(email, password).catch(err => {
            console.error("Error creating user:", err);  // Catch and log error
            setErrorMessage(err.message);  // Set error message to display to user
        });

        const user = {
            username:username,
            name:name,
            email:email,
        }
     axios.post(`http://localhost:5000/register`,user)
     
    };

    const handleGoogleSignIn = () =>{
        
        signInWithGoogle();
    }
    
    return (
        <div className='login-container'>
            <div className='image-container'>
               <img className='image' src={twitterImage} alt='' />
            </div>
            <div className='form-container'>
            <div className='form-box'>
               <TwitterIcon className='Twittericon' style={{color:'skyblue'}}/>
               <h2 className='heading'>Happening Now</h2>
               <h3 className='heading1'>Join twitter today.</h3>
               <form onSubmit={handleSubmit}>

               <input
               type='text'
               className='display-name'
               placeholder='@username'
               onChange={(e) => setUsername(e.target.value)} 

               />
                <input
                type='text'
                className='display-name'
                placeholder='Enter full name'
                onChange={(e) => setName(e.target.value)}
                />

                <input 
                    type="email" 
                    placeholder='Email-Address' 
                    className='email' 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder='Password' 
                    className='password' 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <div className='btn-login'>
                    <button type='submit' className='btn'>Sign Up</button>
                </div>
               </form>
               </div>
               {errorMessage && <p>{errorMessage}</p>}

               <hr/>
               <div className='google-button'>
                <GoogleButton
                    className='g-btn'
                    type='light'
                    onClick={handleGoogleSignIn}
                />
               </div>
               <div>
                already have an account?
                <Link to='/login' 
                style={{textDecoration:'none', color:'skyblue', fontWeight:'600', marginLeft:'5px'}}
                >
                    Login
                </Link>
               </div>
            </div>
            </div>
        
    );
};

export default Signup;
