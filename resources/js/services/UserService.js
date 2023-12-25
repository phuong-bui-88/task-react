
import axios from "axios";

const registerUser = async (formData) => {
    try {
        const response = await axios.post('/register', formData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

// ghetrung1@gmail.com|12345678
const loginUser = async (formData) => {
    try {
        const response = await axios.post('/login', formData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const logoutUser = async (formData) => {
    try {
        const response = await axios.post('/logout')
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export default { registerUser, loginUser, logoutUser };
