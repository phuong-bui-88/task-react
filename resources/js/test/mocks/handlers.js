import { HttpResponse, http } from "msw";

// Mock data
const data = {
    id: 1,
    name: "John Doe",
};

const token = {
    token: "test-token",
};

export const handlers = [
    // Mock GET request
    http.get("/api/user", (req, res, ctx) => {
        return HttpResponse.json(data);
    }),

    http.post("/login", (req, res, ctx) => {
        return HttpResponse.json(token);
    }),
];
