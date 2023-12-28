import React, { useState, useEffect } from "react";
import UserService from "../services/UserService.js";

import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpIcon from '@mui/icons-material/Help';

import {Link, useNavigate} from 'react-router-dom';

function HeaderSidebarComponent({ onLeftSibarActive, user }) {
    const [ isActive, setIsActive ] = useState(false)

    const navigate = useNavigate();

    const handleClick = () => {
        setIsActive(!isActive)
    };
    const logoutClick = async () => {
        try {
            const responseData = await UserService.logoutUser()
            localStorage.removeItem('token');
            setIsActive(null);
            navigate('/');
        } catch (error) {

        }
    }

    return (
        <div className="container-fluid">
            <button type="button" className="header-toggler ps-1" onClick={onLeftSibarActive}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon icon-lg" role="img">
                    <rect width="352" height="32" x="80" y="96" fill="var(--ci-primary-color, currentColor)"
                          className="ci-primary"></rect>
                    <rect width="352" height="32" x="80" y="240" fill="var(--ci-primary-color, currentColor)"
                          className="ci-primary"></rect>
                    <rect width="352" height="32" x="80" y="384" fill="var(--ci-primary-color, currentColor)"
                          className="ci-primary"></rect>
                </svg>
            </button>

            {user ? (
                <div>
                <ul className="header-nav ms-auto float-start">
                    <li className="nav-item d-flex">
                        <Link to="consulation" className="nav-link link-underline">Get Consulation</Link>
                    </li>

                    {!user.is_admin && (
                        <li className="nav-item">
                            <Link to="welcome" className="nav-link p-1"><HelpIcon className="pe-1" style={{ fontSize: 30 }}/></Link>
                        </li>
                    )}
                </ul>

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
                                <PersonIcon className="pe-1"/>
                                Profile</a>
                            </li>

                            <li>
                                <hr className="dropdown-divider m-0"></hr>
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
                </div>
            ) : ''}
        </div>
    )
}

export default HeaderSidebarComponent
