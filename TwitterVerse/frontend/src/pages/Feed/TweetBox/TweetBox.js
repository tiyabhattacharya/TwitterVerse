import React, { useState} from "react";
import "./TweetBox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import axios from "axios";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../firebase.init"; // Ensure you import your Firebase auth object

function TweetBox() {
    const [post, setPost] = useState('');
    const [imageURL, setImageURL] = useState(null);
    const [videoURL, setVideoURL] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('')
    const [userOTP, setUserOTP] = useState(null)
    const [videoFile, setVideoFile] = useState(null)
    const [username, setUsername] = useState('');
    const [loggedInUser] = useLoggedInUser();
    const [authenticate, setAuthenticate] = useState(false)
    const [message, setMessage] = useState('');
    const [isUpload, setIsUpload] = useState(false)
    const [user, loading, error] = useAuthState(auth); // Pass the auth object here
    const email = user?.email;

    const userProfilePic = loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";

    const handleUploadImage = (e) => {
        setIsLoading(true);
        const image = e.target.files[0];
        const formData = new FormData();
        formData.set('image', image);

        axios.post("https://api.imgbb.com/1/upload?key=ce2e4d1f58f22cdab08d0a12bec54f73", formData)
            .then(res => {
                setImageURL(res.data.data.display_url);
                // console.log(res.data.data.display_url);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
        }

    // const [email, setEmail] = useState('');
        const generateOTP = () => {
          return Math.floor(1000 + Math.random() * 9000);
        };
        
        const requestOTP = async () => {
            try {
                const oneTime = generateOTP()
                setOtp(oneTime)
                const response = await fetch('http://localhost:5000/send-otp', { // Use the appropriate backend URL
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, oneTime}),
                });
      
                if (response.ok) {
                    const result = await response.json();
                    setMessage('OTP sent successfully!');
                } else {
                    setMessage('Failed to send OTP.');
                }
            } catch (error) {
                console.error('Error:', error);
                setMessage('An error occurred while sending the OTP.');
            }
        }     

        const validateOTP = (e) => {
            // e.preventDefault();

            if (otp === parseInt(userOTP)) {
            setAuthenticate(true)
            } else {
            alert("Wrong OTP, try again.")
            }
            setOtp(null)
        }

        const handleTweet = async (e) => {
        e.preventDefault();

        if (!user) {
            console.error("User is not authenticated");
            return;
        }
            e.target.value = null;
        try {
            if (user.providerData[0].providerId === 'password') {
                const response = await fetch(`http://localhost:5000/loggedInUser?email=${email}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setName(data[0]?.name);
                setUsername(data[0]?.username);
            } else {
                setName(user?.displayName);
                setUsername(email?.split('@')[0]);
            }

            if (name) {
                const userPost = {
                    profilePhoto: userProfilePic,
                    post: post,
                    photo: imageURL || videoURL,
                    username: username,
                    name: name,
                    email: email,
                };
                setPost('');
                setImageURL(null);
                setVideoURL(null);
                setVideoFile(null);

                const postResponse = await fetch('http://localhost:5000/post', {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(userPost),
                });

                if (!postResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const postData = await postResponse.json();
            }
        } catch (error) {
            console.error("Failed to fetch:", error);
        }
    }



    const uploadVideo = (e) => {
        requestOTP()
        alert(`OTP sent on ${email} successfully!!`)
        setIsUpload(true)
    }

    const uploadFile = async () => {  
        const data = new FormData();
        data.append("file", videoFile);
        data.append("upload_preset", 'video_preset');
        
        try {
          let CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUDNAME
          let api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;
          const res = await axios.post(api, data);
          const { secure_url } = res.data;    
          setVideoURL(secure_url)
          return secure_url;
        } catch (error) {
          console.log(error);
        }
    }
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
          if (file) {
            if (file.size > 50 * 1024 * 1024) {
              alert("File size should be less than 50MB");
              setVideoFile(null);
              e.target.value = null;
              return;
            }
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
              window.URL.revokeObjectURL(video.src);
              if (video.duration > 120) {
                alert("Video duration should be less than 2 minutes");
                e.target.value = null;
                setVideoFile(null);
              } else {
                setVideoFile(file);
              }
            };
              video.src = URL.createObjectURL(file);
          } 
        }

    return (
        <div className="tweetBox">
            <form onSubmit={handleTweet}>
                <div className="tweetBox__input">
                <Avatar src={loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"} />
                   
                    <input
                        type="text"
                        placeholder="What's happening?"
                        onChange={(e) => setPost(e.target.value)}
                        value={post}
                        required
                    />
                </div>

                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <div className="imageIcon_tweetButton">
                    <label htmlFor='image' className="imageIcon">
                        {isLoading ? <p>Uploading image</p> :<p>{imageURL ? 'Image uploaded' : <AddPhotoAlternateIcon sx={{ cursor: 'pointer' }}/>}</p>}                        
                    </label>
                    <input
                        type="file"
                        id='image'
                        className="imageInput"
                        onChange={handleUploadImage}
                        />
                    </div>

                    <div className="imageIcon" >
                        {isUpload ? (
                            !authenticate ? (
                                <div style={{ display:'flex' }}>
                                    <input
                                        type="text"
                                        onChange={(e) => setUserOTP(e.target.value)}
                                        placeholder='Enter OTP'
                                        onClick={(e) => e.stopPropagation()}
                                        style={{width:'100px'}}
                                    />
                                    <button
                                        style={{
                                            width: '50px',
                                            height: '29px',
                                            marginTop:'20px',
                                            border: 'none', color: 'white', background: '#009dff'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering uploadVideo
                                            validateOTP(); // Your validation function
                                        }}
                                    >
                                        Verify
                                    </button>
                                </div>
                            ) : (
                                <div style={{display:'flex', marginTop:'-6px'}}>
                                    <button
                                        style={{ width: '99x', height: '22px', marginTop:'25px', border: 'none', borderRadius:'15px', color: 'white', background: '#009dff' }}
                                        onClick={uploadFile}
                                    >
                                        Upload
                                    </button>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            )
                        ) : (
                            <VideoCallOutlinedIcon sx={{ cursor: 'pointer' }} style={{fontSize:'xx-large', paddingTop:'13px'}} onClick={uploadVideo}/>
                        )}
                    </div>
                    <Button className="tweetBox__tweetButton" type="submit">Tweet</Button>
                </div>
            </form>
        </div>
    );
}

export default TweetBox;

