import React, { useEffect, useRef, useState } from 'react';
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';


export const TextEditor=()=> {

  const [editorState, setEditorState] = useState(() =>
  EditorState.createEmpty(),
);



  return <Editor editorState={editorState}   />;
}