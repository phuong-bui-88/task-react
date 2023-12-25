import './bootstrap';

import React from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import AppLayout from "./layouts/AppLayout.jsx";


const rootElement = document.getElementById('app')
const root = createRoot(rootElement)

root.render(
//     // <React.StrictMode>
        <BrowserRouter>
             <AppLayout />
        </BrowserRouter>
//     // {/*// </React.StrictMode>*/}
)
