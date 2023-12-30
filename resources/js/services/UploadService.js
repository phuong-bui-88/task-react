import axios from "axios";

const uploadImage = async (file, token) => {
    console.log(file, 'file');
    try {
        const response = await axios.post('/api/upload', file, { 
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
              }, 
        });
        
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
}

export default { uploadImage };

