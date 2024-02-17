class LocalStorageService {
    // During 5 minutes
    static DURING = 5 * 60 * 1000;

    static setToken(token) {
        localStorage.setItem("token", token);
    }

    static getToken() {
        return localStorage.getItem("token");
    }

    static removeToken() {
        localStorage.removeItem("token");
    }

    static setLoading(loading) {
        localStorage.setItem("loading", loading);
        localStorage.setItem("loadingBeginTime", new Date().getTime());
    }

    static getLoading() {
        return localStorage.getItem("loading");
    }

    static removeLoading() {
        localStorage.removeItem("loading");
        localStorage.removeItem("loadingBeginTime");
    }

    static removeLoadingOverTime() {
        if (localStorage.getItem("loading")) {
            let loadingBeginTime = localStorage.getItem("loading");
            if (
                new Date().getTime() - loadingBeginTime >
                LocalStorageService.DURING
            ) {
                localStorage.removeItem("loading");
                localStorage.removeItem("loadingBeginTime");
            }
        }
    }
}

export default LocalStorageService;
