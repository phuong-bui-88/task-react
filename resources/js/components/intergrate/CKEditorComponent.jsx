import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import MyUploadAdapter from './MyUploadAdapter.js';
import 'ckeditor5-custom-build/build/ckeditor';

// https://ckeditor.com/docs/ckeditor5/latest/installation/integrations/react.html#integrating-a-build-from-the-online-builder
// https://stackoverflow.com/a/75251831
const CKEditorComponent = ({ data, onChange }) => {

    return (
        <CKEditor
            editor={ClassicEditor}
            data={data}

            onChange={(event, editor) => {
                const newData = editor.getData();
                onChange(newData);
            }}

            onReady={(editor) => {
                editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                    return new MyUploadAdapter(loader);
                };
            }}
        />
    );
};

export default CKEditorComponent;
