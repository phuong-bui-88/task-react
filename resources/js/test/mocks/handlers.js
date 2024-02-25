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

export const checklistReponse = {
    data: {
        name: "Test",
        checklistGroupId: 1,
        tasks: [
            {
                id: 1,
                name: "Test task 1",
                description: "Test description 1",
                is_completed: false,
                is_favorite: false,
            },
            {
                id: 2,
                name: "Test task 2",
                description: "Test description 2",
                is_completed: false,
                is_favorite: false,
            },
        ],
    },
};

export const checklistGroupsResponse = {
    data: {
        1: {
            id: 1,
            name: "Test",
            checklists: {
                1: {
                    id: 1,
                    name: "Test",
                },
            },
        },
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

    http.get("/api/checklists/:id", async () => {
        return HttpResponse.json(checklistReponse);
    }),

    http.put("/api/tasks/:id/complete", async () => {
        return HttpResponse.json({ data: [] });
    }),

    http.put("/api/tasks/:id/favorite", async () => {
        return HttpResponse.json({ data: [] });
    }),

    http.put("/api/tasks/:id/note", async () => {
        return HttpResponse.json({ data: [] });
    }),

    http.put("/api/tasks/:id/due-date", async () => {
        return HttpResponse.json({ data: [] });
    }),

    http.put("/api/tasks/:id/remind-at", async () => {
        return HttpResponse.json({ data: [] });
    }),

    http.get("/api/favorite-tasks", async () => {
        return HttpResponse.json({ data: checklistReponse.data.tasks });
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

    // admin
    http.get("/api/checklist-groups/:id/checklists/:id", async () => {
        return HttpResponse.json(checklistReponse);
    }),

    http.get("/api/users", async () => {
        return HttpResponse.json({
            data: [
                {
                    id: 1,
                    created_at: "2022-01-01",
                    name: "John Doe",
                    email: "john@example.com",
                    website: "example.com",
                },
                {
                    id: 2,
                    created_at: "2022-01-02",
                    name: "Jane Doe",
                    email: "jane@example.com",
                    website: "example.com",
                },
            ],
            meta: { last_page: 2 },
        });
    }),
];
