import BaseService from "@services/BaseService.js";

const baseService = new BaseService();

class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then((file) => {
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append("image", file);

                baseService
                    .uploadFileFormData("/api/upload", formData)
                    .then((response) => {
                        resolve({
                            default: response.url,
                        });
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        });
    }
}

export default MyUploadAdapter;
