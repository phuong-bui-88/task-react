import React from 'react';

const ErrorComponent = ({ error }) => {

    return (error &&
        <div className="invalid-feedback" role="alert">
            {error[0]}
        </div>
    );
};

export default ErrorComponent;
