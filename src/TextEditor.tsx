import React, { useState } from "react";
import "./TextEditor.css";

interface TextEditorSettings {
  minDim?: {
    width: number;
    height: number;
  };
}

interface TextEditorOptions {
  placeholder?: string;
}

interface TextEditorProps {
  settings?: TextEditorSettings;
  options?: TextEditorOptions;
}

export default function TextEditor({
  settings,
  options,
}: TextEditorProps): JSX.Element {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
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
          aria-label={
            options?.placeholder ? options?.placeholder : "Start typing..."
          }
          style={{
            minWidth: settings?.minDim?.width || 300,
            minHeight: settings?.minDim?.height || 150,
          }}
          data-placeholder={options?.placeholder ? options?.placeholder : ""}
          onFocus={handleFocus}
          {...(options?.placeholder ? { onBlur: handleBlur } : {})}
        ></div>
      </div>
    </>
  );
}
