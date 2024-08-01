import React from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import MainProfile from './MainProfile/MailProfile';
import auth from '../../firebase.init';
import '../pages.css'

function Profile() {

    const  user  = useAuthState(auth);
    return (
        <div className='profilePage'>
            <MainProfile user={user} />
        </div>
    )
}

 export default Profile