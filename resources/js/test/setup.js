import { cleanup } from "@testing-library/react";
import { server } from "./mocks/server";

beforeAll(() => {
    server.listen();
});

afterAll(() => {
    server.close();
    cleanup();
});

afterEach(() => {
    server.resetHandlers();
    cleanup();
});
