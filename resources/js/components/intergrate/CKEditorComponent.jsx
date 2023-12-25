
import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CKEditorComponent = ({ data, onChange }) => {
  return (
      <CKEditor
          editor={ClassicEditor}
          data={data}
          onChange={(event, editor) => {
              const newData = editor.getData();
              onChange(newData);
          }}
      />
  );
};

export default CKEditorComponent;
