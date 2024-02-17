import BaseService from "./BaseService";

const baseService = new BaseService();

const getUsers = async (currentPage) => {
    return baseService.get(`/api/users?page=${currentPage}`, true);
};

const getUser = async () => {
    return baseService.get("/api/user");
};

const registerUser = async (formData) => {
    let result = await baseService.post("/register", formData);
    return result.token;
};

// ghetrung1@gmail.com|12345678
const loginUser = async (formData) => {
    let result = await baseService.post("/login", formData);
    return result.token;
};

const logoutUser = async () => {
    return baseService.post("/logout");
};

const paymentUser = async () => {
    return baseService.post("/api/payment", null);
};

export default {
    getUsers,
    getUser,
    registerUser,
    loginUser,
    logoutUser,
    paymentUser,
};
