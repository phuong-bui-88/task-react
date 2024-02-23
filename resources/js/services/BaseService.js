import axios from "axios";
import LocalStorageService from "./LocalStorageService";

class BaseService {
    constructor() {
        this.api = axios.create({
            baseURL: "/", // Replace with your API base URL
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.setAuthorizationHeader(LocalStorageService.getToken());
    }

    async get(endpoint, isFullResponse = false) {
        try {
            LocalStorageService.setLoading(true);
            window.dispatchEvent(new Event("addLoadingStorage"));

            this.setAuthorizationHeader(LocalStorageService.getToken());
            const response = await this.api.get(endpoint);
            return isFullResponse ? response.data : response.data.data;
        } catch (error) {
            // console.error("Error:", error);
            throw this.formatErrors(error);
        } finally {
            LocalStorageService.removeLoading();
            window.dispatchEvent(new Event("removeLoadingStorage"));
        }
    }

    async post(endpoint, data) {
        try {
            LocalStorageService.setLoading(true);

            this.setAuthorizationHeader(LocalStorageService.getToken());
            const response = await this.api.post(endpoint, data);
            return response.data;
        } catch (error) {
            // console.error("Error:", error);
            throw this.formatErrors(error);
        } finally {
            LocalStorageService.removeLoading();
        }
    }

    async uploadFileFormData(endpoint, data) {
        try {
            LocalStorageService.setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${LocalStorageService.getToken()}`,
                },
            };

            const response = await this.api.post(endpoint, data, config);
            return response.data;
        } catch (error) {
            // console.error("Error:", error);
            throw this.formatErrors(error);
        } finally {
            LocalStorageService.removeLoading();
        }
    }

    // Example method for making a POST request
    async put(endpoint, data) {
        try {
            LocalStorageService.setLoading(true);

            this.setAuthorizationHeader(LocalStorageService.getToken());
            const response = await this.api.put(endpoint, data);
            return response.data;
        } catch (error) {
            // console.error("Error:", error);
            throw this.formatErrors(error);
        } finally {
            LocalStorageService.removeLoading();
        }
    }

    // Example method for making a POST request
    async delete(endpoint) {
        try {
            LocalStorageService.setLoading(true);

            this.setAuthorizationHeader(LocalStorageService.getToken());
            const response = await this.api.delete(endpoint);
            return response.data;
        } catch (error) {
            // console.error("Error:", error);
            throw this.formatErrors(error);
        } finally {
            LocalStorageService.removeLoading();
        }
    }

    setAuthorizationHeader(token) {
        this.api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    formatErrors(error) {
        if (error.response) {
            return error.response.data;
        }

        return error;
    }
}

export default BaseService;
