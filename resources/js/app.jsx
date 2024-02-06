import "./bootstrap";

import React from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import AppLayout from "./layouts/AppLayout.jsx";

import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: "https://6696d6a49b5e059769ca0cfa9814639f@o4506591483068416.ingest.sentry.io/4506591487328256",
    integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay(),
    ],
    // Session Replay
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const rootElement = document.getElementById("app");
const root = createRoot(rootElement);

root.render(
    <BrowserRouter>
        <AppLayout />
    </BrowserRouter>
);
