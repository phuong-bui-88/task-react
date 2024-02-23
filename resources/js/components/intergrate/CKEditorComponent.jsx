import { CKEditor } from '@ckeditor/ckeditor5-react';
import React from 'react';

// import Editor from 'ckeditor5-custom-build/build/ckeditor';
import MyUploadAdapter from './MyUploadAdapter.js';

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

// https://ckeditor.com/docs/ckeditor5/latest/installation/integrations/react.html#integrating-a-build-from-the-online-builder
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
