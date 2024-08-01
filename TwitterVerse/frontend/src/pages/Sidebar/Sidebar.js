import React, { useState } from "react";
import './Sidebar.css'
import SidebarOptions from "./SidebarOptions";
import TwitterIcon from '@mui/icons-material/Twitter';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DoneIcon from '@mui/icons-material/Done';
import ListIcon from '@mui/icons-material/List';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MoreIcon from '@mui/icons-material/More';
import { Avatar, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
//import { CustomLink } from "react-router-dom";
import CustomLink from "./CustomLink";
import useLoggedInUser from "../../hooks/useLoggedInUser";

const Sidebar=({handleLogout,user})=>{
    const [anchorEl, setAnchorEl]=useState(null);
    const openMenu=Boolean(anchorEl);

    const [loggedInUser]= useLoggedInUser()
    // console.log(loggedInUser);
    const result = user[0]?.email?.split('@')[0];

    const userProfilePic = loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"

    const handleClick = e =>{
        setAnchorEl(e.currentTarget);
    }
    const handleClose=()=>{
        setAnchorEl(null);
    }
    
    // console.log(loggedInUser)
    // console.log(loggedInUser[0])
    //console.log(result)


    //  console.log(user)
    return(
     <div className="sidebar"> 
         <TwitterIcon className="sidebar_twitterIcon" />
         <CustomLink to='/home/feed'>
         <SidebarOptions active Icon={HomeIcon} text='Home'  />
         </CustomLink>
         <CustomLink to='/home/explore'>
         <SidebarOptions active Icon={SearchIcon} text='Explore'  />
         </CustomLink>
         <CustomLink to='/home/notifications'>
         <SidebarOptions active Icon={NotificationsIcon} text='Notifications'  />
         </CustomLink>
         <CustomLink to='/home/messages'>
         <SidebarOptions active Icon={MailOutlineIcon} text='Messages'  />
         </CustomLink>
         <CustomLink to='/home/bookmarks'>
         <SidebarOptions active Icon={BookmarkBorderIcon} text='Bookmarks'  />
         </CustomLink>
         <CustomLink to='/home/lists'>
         <SidebarOptions active Icon={ListAltIcon} text='Lists'  />
         </CustomLink>
         <CustomLink to='/home/profile'>
         <SidebarOptions active Icon={PermIdentityIcon} text='Profile'  />
         </CustomLink>
         <CustomLink to='/home/more'>
         <SidebarOptions active Icon={MoreIcon} text='More'  />
         </CustomLink>
    <Button variant='outlined' className="sidebar_tweet">
        Tweet
    </Button>
         <div className="Profile_info">
         <Avatar src={loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"} />
        <div className="user__info">
          <h4>
            {loggedInUser[0]?.name ? loggedInUser[0].name : user && user.displayName}
          </h4>
          <h5>@{result}</h5>
        </div>
         <IconButton size='small' 
         sx={{ml:2}}
         aria-controls={openMenu?"basic-menu":undefined}
         aria-haspopup="true"
         aria-expanded={openMenu?"true":undefined}
         onClick={handleClick}
         >

         <MoreHorizIcon/>
         </IconButton>
         <Menu id="basic-menu" anchorEl={anchorEl} open={openMenu} onClick={handleClose} onClose={handleClose}>
            <MenuItem className="profile_info1">
            <Avatar src={loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"} />
            <div className="user_info subUser_info">
                <div>
                  {/* {console.log(loggedInUser[0]?.name ? loggedInUser[0].name : user && user.displayName)} */}
                <h4>
                  {loggedInUser[0]?.name ? loggedInUser[0].name : user && user.displayName}
                </h4>
                <h5>@{result}</h5>
              </div>
                <ListItemIcon className="done_icon" color="blue"><DoneIcon/></ListItemIcon>
            </div>

            </MenuItem>
            <Divider/>
            <MenuItem onClick={handleClose}>Add an existing account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout @{result}</MenuItem>
         </Menu>

          </div>
     </div>
    );
};

export default Sidebar;
