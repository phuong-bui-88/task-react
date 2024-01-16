import React, { useEffect, useState } from "react";
import UserService from "../services/UserService.js";

import { useNavigate } from "react-router-dom";

import KeyIcon from '@mui/icons-material/Key';
import MailIcon from '@mui/icons-material/Mail';
import ErrorComponent from "./intergrate/ErrorComponent.jsx";
import HelperService from "@services/HelperService.js";

function LoginComponent() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        try {
            const token = await UserService.loginUser(formJson);
            localStorage.setItem('token', token);

            navigate('/home');
        } catch (error) {
            setErrors(error.errors);
        }
    }


    useEffect(
        () => {
            const token = localStorage.getItem('token');
            if (token) {
                navigate('/home');
            }
        }, []
    )

    return (
        <div className="d-flex justify-content-center min-vh-100 align-items-center">
            <div className="col-lg-6 col-md-6">
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
                                    <input className={HelperService.addInvalid('form-control', errors?.email)}
                                        type="text" required autoComplete="email" name="email" />
                                    <ErrorComponent error={errors?.email} />
                                </div>

                                <div className="input-group mb-4">
                                    <span className="input-group-text">
                                        <KeyIcon className="pe-1" />
                                    </span>
                                    <input className={HelperService.addInvalid('form-control', errors?.password)} type="password" required autoComplete="password" name="password" />
                                    <ErrorComponent error={errors?.password} />
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
