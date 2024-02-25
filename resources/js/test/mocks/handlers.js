import { HttpResponse, http } from "msw";

// Mock data

export const errorsResponse = {
    errors: {
        email: [`Failed to login:  user 2 does not exist`],
        password: [`Failed to password:  user 2 does not exist`],
    },
};

export const pageResponse = {
    data: {
        title: "Test Page",
        content: "<p>Test content</p>",
    },
};

export const emailRight = "emailRight@gmail.com";

const token = {
    token: "test-token",
};

export const handlers = [
    // Mock GET request
    http.get("/api/user", async ({ request }) => {
        const token = request.headers.get("Authorization");
        if (token == "Bearer user-token") {
            return HttpResponse.json({ data: { is_admin: false } });
        }

        if (token == "Bearer admin-token") {
            return HttpResponse.json({ data: { is_admin: true } });
        }

        return HttpResponse.json();
    }),

    http.get("/api/checklist-groups", async ({ request }) => {
        const url = new URL(request.url);
        const isUser = url.searchParams.get("is_user");
        console.log(isUser);

        return HttpResponse.json({ data: [], analytic: {} });
    }),

    http.get("/api/pages", () => {
        return HttpResponse.json([]);
    }),

    http.get("/api/welcome", async () => {
        return HttpResponse.json(pageResponse);
    }),

    http.post("/login", async ({ request }) => {
        const { email } = await request.json();

        if (email === "test@example.com") {
            return HttpResponse.json(token);
        }

        return HttpResponse.json(errorsResponse, { status: 401 });
    }),

    http.post("/register", async ({ request }) => {
        const { email } = await request.json();

        if (email === emailRight) {
            return HttpResponse.json(token);
        }

        return HttpResponse.json(errorsResponse, { status: 401 });
    }),

    http.post("/logout", async () => {
        return await HttpResponse.json({ message: "User logged out" });
    }),
];
