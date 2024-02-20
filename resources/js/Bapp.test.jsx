import { render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, test } from "vitest";
import Bapp from "./Bapp";


describe("Hello", () => {

    test("adds 1 + 3 to equal 4", () => {
        expect(4).toBe(4);
        render(<Bapp />);
    });

    test("adds 1 + 5 to equal 6", () => {
        expect(6).toBe(6);
        render(<Bapp />);
        screen.debug();
    });
});
