import React, {useState} from "react";
import UserService from "../services/UserService.js";

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
            const responseData = await UserService.registerUser(formJson);
            localStorage.setItem('user', true);

            navigate('/home');
        } catch (error) {

        }

    }

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card mb-4 mx-4">
                    <form onSubmit={handleSubmit} method="post">
                        <div className="card-body p-4">
                            <h1>Register</h1>
                            <p className="text-medium-emphasis">Create your account</p>
                            <div className="input-group mb-3"><span className="input-group-text">
                                <svg className="icon">
                                  <use xlink:href="vendors/@coreui/icons/svg/free.svg#cil-user"></use>

                                </svg></span>
                                <input className="form-control" type="text" placeholder="Username" name="name"
                                       required/>
                            </div>

                            <div className="input-group mb-3"><span className="input-group-text">
                                <svg className="icon">
                                  <use xlink:href="vendors/@coreui/icons/svg/free.svg#cil-envelope-open"></use>
                                </svg></span>
                                <input className="form-control" type="email" placeholder="Email" name="email" required/>
                            </div>

                            <div className="input-group mb-3"><span className="input-group-text">
                                <svg className="icon">
                                  <use xlink:href="vendors/@coreui/icons/svg/free.svg#cil-lock-locked"></use>
                                </svg></span>
                                <input className="form-control" type="password" placeholder="Password" name="password"
                                       required/>
                            </div>

                            <div className="input-group mb-4"><span className="input-group-text">
                                <svg className="icon">
                                  <use xlink:href="vendors/@coreui/icons/svg/free.svg#cil-lock-locked"></use>
                                </svg></span>
                                <input className="form-control" type="password" placeholder="Repeat password"
                                       name="password_confirmation" required/>
                            </div>

                            <button class="btn btn-block btn-success" type="submit">Create Account</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    //
    // <form onSubmit={handleSubmit} method="post">
    //
    //     <div className="row mb-3">
    //         <label className="col-md-4 col-form-label text-md-end">Name</label>
    //
    //         <div className="col-md-6">
    //             <input id="name" type="text" className="form-control @error('name') is-invalid @enderror" name="name"
    //                    defaultValue={formData.name}
    //                    required/>
    //         </div>
    //     </div>
    //
    //     <div className="row mb-3">
    //         <label className="col-md-4 col-form-label text-md-end">Email Address</label>
    //
    //         <div className="col-md-6">
    //             <input id="email" type="email" className="form-control @error('email') is-invalid @enderror"
    //                    name="email" defaultValue={formData.email}
    //                    required autoComplete="email"/>
    //
    //         </div>
    //     </div>
    //
    //     <div className="row mb-3">
    //         <label className="col-md-4 col-form-label text-md-end">Password</label>
    //
    //         <div className="col-md-6">
    //             <input id="password" type="password" className="form-control @error('password') is-invalid @enderror"
    //                    name="password" defaultValue={formData.password}
    //                    required autoComplete="new-password"/>
    //         </div>
    //     </div>
    //
    //     <div className="row mb-3">
    //         <label className="col-md-4 col-form-label text-md-end">
    //             Confirm Password</label>
    //
    //         <div className="col-md-6">
    //             <input id="password-confirm" type="password" className="form-control"
    //                    name="password_confirmation" defaultValue={formData.password_confirmation}
    //                    required autoComplete="new-password"/>
    //         </div>
    //     </div>
    //
    //     <div className="row mb-0">
    //         <div className="col-md-6 offset-md-4">
    //             <button type="submit" className="btn btn-primary">
    //                 Register
    //             </button>
    //         </div>
    //     </div>
    // </form>
)
}

export default RegisterComponent
