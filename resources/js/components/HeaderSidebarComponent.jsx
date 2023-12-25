import React, { useState, useEffect } from "react";
import UserService from "../services/UserService.js";

import LogoutIcon from '@mui/icons-material/Logout';

import { useNavigate  } from 'react-router-dom';

function HeaderSidebarComponent() {
    const [ isActive, setIsActive ] = useState(false)

    const user = JSON.parse(localStorage.getItem('user'));

    const navigate = useNavigate();

    const handleClick = () => {
        setIsActive(!isActive)
    };

    const logoutClick = async () => {
        try {
            const responseData = await UserService.logoutUser()
            localStorage.removeItem('user');
            setIsActive(null);
            navigate('/login');
        } catch (error) {

        }
    }

    return (
        <div className="container-fluid">
            <button type="button" className="header-toggler ps-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon icon-lg" role="img">
                    <rect width="352" height="32" x="80" y="96" fill="var(--ci-primary-color, currentColor)"
                          className="ci-primary"></rect>
                    <rect width="352" height="32" x="80" y="240" fill="var(--ci-primary-color, currentColor)"
                          className="ci-primary"></rect>
                    <rect width="352" height="32" x="80" y="384" fill="var(--ci-primary-color, currentColor)"
                          className="ci-primary"></rect>
                </svg>
            </button>

            <ul className="header-nav d-none d-md-flex me-auto float-end" role="navigation">
                <li className="nav-item"><a className="nav-link active" href="#/dashboard"
                                            aria-current="page">Dashboard</a>
                </li>
                <li className="nav-item"><a className="nav-link" href="#">Users</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Settings</a></li>
            </ul>

            {user ? (
            <ul className="header-nav ms-3" role="navigation">
                <li className="nav-item dropdown">
                    <a className="nav-link py-0 show" data-coreui-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="true" onClick={handleClick}>
                        <div className="avatar avatar-md">
                            <img className="avatar-img" src="assets/img/avatars/8.jpg" alt="user@email.com"></img>
                        </div>
                    </a>

                    <ul className={`dropdown-menu pt-0 ${isActive ? 'show' : ''}`} role="menu" aria-hidden="true">
                        <li><h6 className="dropdown-header bg-light fw-semibold py-2">Account</h6></li>
                        <li><a className="dropdown-item" href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon me-2"
                                 role="img">
                                <path fill="var(--ci-primary-color, currentColor)"
                                      d="M411.6,343.656l-72.823-47.334,27.455-50.334A80.23,80.23,0,0,0,376,207.681V128a112,112,0,0,0-224,0v79.681a80.236,80.236,0,0,0,9.768,38.308l27.455,50.333L116.4,343.656A79.725,79.725,0,0,0,80,410.732V496H448V410.732A79.727,79.727,0,0,0,411.6,343.656ZM416,464H112V410.732a47.836,47.836,0,0,1,21.841-40.246l97.66-63.479-41.64-76.341A48.146,48.146,0,0,1,184,207.681V128a80,80,0,0,1,160,0v79.681a48.146,48.146,0,0,1-5.861,22.985L296.5,307.007l97.662,63.479h0A47.836,47.836,0,0,1,416,410.732Z"
                                      className="ci-primary"></path>
                            </svg>
                            Profile</a>
                        </li>

                        <li>
                            <hr className="dropdown-divider"></hr>
                        </li>

                        <li>
                            <a className="dropdown-item" href="#" onClick={logoutClick}>
                                <LogoutIcon className="pe-1"/>
                                Logout
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
            ) : ''}
        </div>
    )
}

export default HeaderSidebarComponent
