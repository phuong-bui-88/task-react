import BaseService from "./BaseService";

const baseService = new BaseService();

const getPages = async () => {
    return baseService.get("/api/pages");
};

const getPage = async (id) => {
    const page = {
        1: "welcome",
        2: "consulation",
    };

    return baseService.get("/api/" + page[id]);
};

const updatePage = async (page) => {
    let data = { title: page.title, content: page.content };

    return baseService.put("/api/pages/" + page.id, data);
};

export default { getPages, getPage, updatePage };
