import axios from "axios";

const getUsers = async (currentPage, token) => {
    return await axios.get(`/api/users?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

const getUser = async (token) => {
    try {
        const response = await axios.get("/api/user", {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data.data;
    } catch (error) {
        return false;
    }
};

const registerUser = async (formData) => {
    try {
        const response = await axios.post("/register", formData);
        return response.data.token;
    } catch (error) {
        throw error.response.data;
    }
};

// ghetrung1@gmail.com|12345678
const loginUser = async (formData) => {
    try {
        const response = await axios.post("/login", formData);
        return response.data.token;
    } catch (error) {
        throw error.response.data;
    }
};

const logoutUser = async () => {
    try {
        const response = await axios.post("/logout");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const paymentUser = async (token) => {
    try {
        const response = await axios.post("/api/payment", null, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};

export default {
    getUsers,
    getUser,
    registerUser,
    loginUser,
    logoutUser,
    paymentUser,
};
