import React, { useState } from "react";
import UserService from "../services/UserService.js";

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import PublicIcon from '@mui/icons-material/Public';

import { useNavigate } from "react-router-dom";
import ErrorComponent from "./intergrate/ErrorComponent.jsx";
import HelperService from "@services/HelperService.js";

function RegisterComponent() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
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
            const token = await UserService.registerUser(formJson);
            localStorage.setItem('token', token);

            navigate('/dashboard');
        } catch (error) {
            setErrors(error.errors);
        }

    }

    return (
        <div className="d-flex justify-content-center min-vh-100 align-items-center">
            <div className="col-md-9">
                <div className="card mb-4 mx-4">
                    <form onSubmit={handleSubmit} method="post">
                        <div className="card-body p-4">
                            <h1>Register</h1>
                            <p className="text-medium-emphasis">Create your account</p>
                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <PersonIcon />
                                </span>

                                <input className={HelperService.addInvalid('form-control', errors?.name)} type="text" placeholder="Username" name="name"
                                    required />
                                <ErrorComponent error={errors?.name} />
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <EmailIcon />
                                </span>
                                <input className={HelperService.addInvalid('form-control', errors?.email)} type="email" placeholder="Email" name="email" required />
                                <ErrorComponent error={errors?.email} />
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <PublicIcon />
                                </span>
                                <input className={HelperService.addInvalid('form-control', errors?.website)} type="url" placeholder="Website" name="website" />
                                <ErrorComponent error={errors?.website} />
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text"><KeyIcon /></span>
                                <input className={HelperService.addInvalid('form-control', errors?.password)} type="password" placeholder="Password" name="password"
                                    required />
                                <ErrorComponent error={errors?.password} />
                            </div>

                            <div className="input-group mb-4">
                                <span className="input-group-text"><KeyIcon /></span>
                                <input className={HelperService.addInvalid('form-control', errors?.pa)} type="password" placeholder="Repeat password"
                                    name="password_confirmation" required />

                                <ErrorComponent error={errors?.password_confirmation} />
                            </div>

                            <button className="btn btn-primary" type="submit">Create Account</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterComponent
