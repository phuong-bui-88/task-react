import { HttpResponse, http } from "msw";

// Mock data
const data = {
    id: 1,
    name: "John Doe",
};

export const userErrors = {
    errors: {
        email: [`Failed to login:  user 2 does not exist`],
        password: [`Failed to password:  user 2 does not exist`],
    },
};

const token = {
    token: "test-token",
};

export const handlers = [
    // Mock GET request
    http.get("/api/user", (req, res, ctx) => {
        return HttpResponse.json(data);
    }),

    http.post("/login", async ({ request }) => {
        const { email } = await request.json();

        if (email === "test@example.com") {
            return HttpResponse.json(token);
        }

        return HttpResponse.json(userErrors, { status: 401 });
    }),
];
