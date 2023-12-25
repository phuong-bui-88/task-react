import React, { useState } from "react";
import UserService from "../services/UserService.js";

import { useNavigate } from "react-router-dom";

import MailIcon from '@mui/icons-material/Mail';
import KeyIcon from '@mui/icons-material/Key';

function LoginComponent() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        try {
            const responseData = await UserService.loginUser(formJson);

            localStorage.setItem('user', JSON.stringify(responseData.data));

            navigate('/home');
        } catch (error) {

        }

    }

    return (
        <div className="row justify-content-center">
            <div className="col-lg-6">
                <div className="card-group d-block d-md-flex row">
                    <form method="POST" onSubmit={handleSubmit}>

                        <div className="card col-md-12 p-4 mb-0">
                            <div className="card-body">
                                <h1>Login</h1>
                                <p className="text-medium-emphasis">Sign In to your account</p>
                                <div className="input-group mb-3">
                                    <span className="input-group-text">
                                        <MailIcon className="pe-1" />
                                    </span>
                                    <input className="form-control" type="text" required autoComplete="email" name="email"/>
                                </div>

                                <div className="input-group mb-4">
                                    <span className="input-group-text">
                                        <KeyIcon className="pe-1" />
                                    </span>
                                    <input className="form-control" type="password" required autoComplete="password" name="password"/>
                                </div>

                                <div className="row">
                                    <div className="col-6">
                                        <button className="btn btn-primary px-4" type="submit">Login</button>
                                    </div>
                                    <div className="col-6 text-end">
                                        <button className="btn btn-link px-0" type="button">Forgot password?</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>

    )
}

export default LoginComponent
