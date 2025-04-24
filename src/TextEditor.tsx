import React, { useState } from "react";
import "./TextEditor.css";

interface TextEditorSettings {
  minDim?: {
    width: number;
    height: number;
  };
}

interface TextEditorProps {
  settings?: TextEditorSettings;
}

export default function TextEditor({ settings }: TextEditorProps): JSX.Element {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    // TODO: Make the editor not reset when newline is in place but editor is empty
    const editor = event.target as HTMLDivElement;
    if (editor.textContent === "") {
      editor.innerHTML = "";
      setIsFocused(false);
    }
  };

  return (
    <>
      <div className="textEditor">
        <div className="toolbar"></div>
        <div
          contentEditable
          suppressContentEditableWarning
          className={`editor${isFocused ? "" : " placeholder"}`}
          role="textbox"
          aria-multiline="true"
          aria-label="Start typing..."
          style={{
            minWidth: settings?.minDim?.width || 300,
            minHeight: settings?.minDim?.height || 150,
          }}
          data-placeholder="Start typing..."
          onFocus={handleFocus}
          onBlur={handleBlur}
        ></div>
      </div>
    </>
  );
}
