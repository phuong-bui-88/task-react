
import axios from "axios";

const getPages = async () => {
    try {
        const response = await axios.get('/api/pages');
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
}

const getPage = async (id) => {
    const page = {
        '1': 'welcome',
        '2': 'consoludation'
    }
    try {
        const response = await axios.get('/api/' + page[id]);
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
}

const updatePage = async (page) => {
    // try {
        const response = await axios.put('/api/pages/' + page.id, {'title': page.title, 'content': page.content});
        return response.data;
    // } catch (error) {
    //     throw error.response.data;
    // }
}


export default { getPages, getPage, updatePage };
