// const navigate = vi.fn();

// vi.mock("react-router-dom", async () => {
//     const mod = await vi.importActual("react-router-dom");
//     return {
//         ...mod,
//         useNavigate: () => navigate,
//     };
// });

// export default navigate;

const mockRoute = async (navigate) => {
    const mod = await vi.importActual("react-router-dom");
    return {
        ...mod,
        useNavigate: () => navigate,
    };
};

export default mockRoute;
