import React, { useState, useEffect } from 'react';
import './MainProfile.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import LockResetIcon from '@mui/icons-material/LockReset';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AddLinkIcon from '@mui/icons-material/AddLink';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import useLoggedInUser from '../../../hooks/useLoggedInUser';
import Post from './Post/Post';
import EditProfile from '../EditProfile/EditProfile';

const MainProfile = ({ user }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUser] = useLoggedInUser();
  const username = user[0]?.email?.split('@')[0];
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/userPost?email=${user[0]?.email}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
      })
      .catch(error => console.error("Error fetching posts:", error));
  }); // Run only once on component mount

  const handleUploadCoverImage = e => {
    setIsLoading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set('image', image);

    axios.post("https://api.imgbb.com/1/upload?key=ce2e4d1f58f22cdab08d0a12bec54f73", formData)
      .then(res => {
        const url = res.data.data.display_url;
        const userCoverImage = {
          email: user[0]?.email,
          coverImage: url,
        };
        setIsLoading(false);
        if (url) {
          axios.patch(`http://localhost:5000/userUpdates/${user[0]?.email}`, userCoverImage)
            .then(response => {
              console.log("Cover image updated:", response.data);
            })
            .catch(error => console.error("Error updating cover image:", error));
        }
      })
      .catch(error => {
        console.error("Error uploading cover image:", error);
        setIsLoading(false);
      });
  }

  const handleUploadProfileImage = e => {
    setIsLoading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set('image', image);

    axios.post("https://api.imgbb.com/1/upload?key=ce2e4d1f58f22cdab08d0a12bec54f73", formData)
      .then(res => {
        const url = res.data.data.display_url;
        const userProfileImage = {
          email: user[0]?.email,
          profileImage: url,
        };
        setIsLoading(false);
        if (url) {
          axios.patch(`http://localhost:5000/userUpdates/${user[0]?.email}`, userProfileImage)
            .then(response => {
              console.log("Profile image updated:", response.data);
            })
            .catch(error => console.error("Error updating profile image:", error));
        }
      })
      .catch(error => {
        console.error("Error uploading profile image:", error);
        setIsLoading(false);
      });
  }

  return (
    <div>
      <ArrowBackIcon className='arrow-icon' onClick={() => navigate('/')} />
      <h4 className='heading-4'>{username}</h4>
      <div className='mainprofile'>
        <div className='profile-bio'>
          <div>
            <div className='coverImageContainer'>
              <img src={loggedInUser[0]?.coverImage || 'https://www.proactivechannel.com/Files/BrandImages/Default.jpg'} alt="" className='coverImage' />
              <div className='hoverCoverImage'>
                <div className="imageIcon_tweetButton">
                  <label htmlFor='coverImage' className="imageIcon">
                    {isLoading ? <LockResetIcon className='photoIcon photoIconDisabled ' /> : <CenterFocusWeakIcon className='photoIcon' />}
                  </label>
                  <input
                    type="file"
                    id='coverImage'
                    className="imageInput"
                    onChange={handleUploadCoverImage}
                  />
                </div>
              </div>
            </div>
            <div className='avatar-img'>
              <div className='avatarContainer'>
                <img src={loggedInUser[0]?.profileImage || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"} className="avatar" alt='' />
                <div className='hoverAvatarImage'>
                  <div className="imageIcon_tweetButton">
                    <label htmlFor='profileImage' className="imageIcon">
                      {isLoading ? <LockResetIcon className='photoIcon photoIconDisabled ' /> : <CenterFocusWeakIcon className='photoIcon' />}
                    </label>
                    <input
                      type="file"
                      id='profileImage'
                      className="imageInput"
                      onChange={handleUploadProfileImage}
                    />
                  </div>
                </div>
              </div>
              <div className='userInfo'>
                <div>
                  <h3 className='heading-3'>
                    {loggedInUser[0]?.name || user[0]?.displayName}
                  </h3>
                  <p className='usernameSection'>@{username}</p>
                </div>
                <EditProfile user={user} loggedInUser={loggedInUser} />
              </div>
              <div className='infoContainer'>
                {loggedInUser[0]?.bio && <p>{loggedInUser[0].bio}</p>}
                <div className='locationAndLink'>
                  {loggedInUser[0]?.location && <p className='subInfo'><MyLocationIcon /> {loggedInUser[0].location}</p>}
                  {loggedInUser[0]?.website && <p className='subInfo link'><AddLinkIcon /> {loggedInUser[0].website}</p>}
                </div>
              </div>
              <h4 className='tweetsText'>Tweets</h4>
              <hr />
            </div>
            {posts.map(p => <Post key={p.id} p={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainProfile;
