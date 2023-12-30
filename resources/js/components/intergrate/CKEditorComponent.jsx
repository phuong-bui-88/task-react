import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import MyUploadAdapter from './MyUploadAdapter.js';


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
