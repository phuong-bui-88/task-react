import React, {useState} from "react";
import UserService from "../services/UserService.js";

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import PublicIcon from '@mui/icons-material/Public';

import { useNavigate } from "react-router-dom";

function RegisterComponent() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

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

            navigate('/home');
        } catch (error) {

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

                                <input className="form-control" type="text" placeholder="Username" name="name"
                                       required/>
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <EmailIcon />
                                </span>
                                <input className="form-control" type="email" placeholder="Email" name="email" required/>
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <PublicIcon />
                                </span>
                                <input className="form-control" type="url" placeholder="Website" name="website"/>
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text"><KeyIcon /></span>
                                <input className="form-control" type="password" placeholder="Password" name="password"
                                       required/>
                            </div>

                            <div className="input-group mb-4">
                                <span className="input-group-text"><KeyIcon /></span>
                                <input className="form-control" type="password" placeholder="Repeat password"
                                       name="password_confirmation" required/>
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
