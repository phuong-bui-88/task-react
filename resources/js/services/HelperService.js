const HelperService = {
    addInvalid: (defaultClassName = "form-control", error) => {
        const className = defaultClassName || "form-control";
        return `${className} ${error ? "is-invalid" : ""}`;
    },
};

export default HelperService;
