import axios from "axios";

const getPages = async (token) => {
    try {
        const response = await axios.get("/api/pages", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};

const getPage = async (id, token) => {
    const page = {
        1: "welcome",
        2: "consulation",
    };
    try {
        const response = await axios.get("/api/" + page[id], {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};

const updatePage = async (page, token) => {
    let data = { title: page.title, content: page.content };

    const response = await axios.put("/api/pages/" + page.id, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export default { getPages, getPage, updatePage };
