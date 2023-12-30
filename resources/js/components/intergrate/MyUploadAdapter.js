
import UploadService from '../../services/UploadService.js'; // Import the uploadService
import TokenService from '../../services/TokenService.js'; // Import the tokenService
import axios from 'axios';

class MyUploadAdapter {
    constructor( loader ) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then((file) => {
          return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image', file);
            const token = TokenService.getToken();
    
            const config = {
                headers: { "Content-Type": "multipart/form-data", 'Authorization': `Bearer ${token}`} 
            };
    
            axios
              .post('/api/upload', formData, config)
              .then((response) => {
                resolve({
                  default: response.data.url,
                });
              })
              .catch((error) => {
                reject(error);
              });
          });
        });
      }

    // Aborts the upload process.
    abort() {
        if ( this.xhr ) {
            this.xhr.abort();
        }
    }
}

export default MyUploadAdapter;
