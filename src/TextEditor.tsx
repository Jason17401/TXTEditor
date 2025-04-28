import React, { useRef, useState } from "react";
import "./TextEditor.css";

type TextFormat = "b" | "i" | "u" | "s" | "sub" | "sup";

interface TextEditorSettings {
  minDim?: {
    width: number;
    height: number;
  };
  maxDim?: {
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
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const formatText = createFormatText(editorRef);

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
        <div className="toolbar">
          <button onClick={() => formatText("b")}>
            <b>B</b>
          </button>
          <button onClick={() => formatText("i")}>
            <i>I</i>
          </button>
          <button onClick={() => formatText("u")}>
            <u>U</u>
          </button>
          <button onClick={() => formatText("s")}>
            <s>S</s>
          </button>
          <button onClick={() => formatText("sup")}>
            x<sup>x</sup>
          </button>
          <button onClick={() => formatText("sub")}>
            x<sub>x</sub>
          </button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className={`editor${isFocused ? "" : " placeholder"}`}
          role="textbox"
          aria-multiline="true"
          aria-label={
            options?.placeholder ? options?.placeholder : "Start typing..."
          }
          style={{
            minWidth: settings?.minDim?.width || 600,
            minHeight: settings?.minDim?.height || 150,
            maxWidth: settings?.maxDim?.width || 600,
            maxHeight: settings?.maxDim?.height || 600,
          }}
          data-placeholder={options?.placeholder ? options?.placeholder : ""}
          onFocus={handleFocus}
          {...(options?.placeholder ? { onBlur: handleBlur } : {})}
        ></div>
      </div>
    </>
  );
}

const createFormatText = (editorRef: React.RefObject<HTMLDivElement>) => {
  return (format: TextFormat) => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current?.contains(selection.anchorNode))
      return;

    const range = selection.getRangeAt(0);

    if (selection.isCollapsed) {
      // Insert format tags at standalone caret
      const wrapper = document.createElement(format);
      wrapper.appendChild(document.createTextNode("\u200B"));
      range.insertNode(wrapper);
      range.setStart(wrapper.firstChild!, 1);
      range.collapse(true);
      selection.addRange(range);
    } else {
      // Text selected format toggling
      try {
        const wrapper = document.createElement(format);
        wrapper.appendChild(range.extractContents());
        range.insertNode(wrapper);
      } catch (error) {
        console.error("Failed to format text", error);
      }
    }
    editorRef.current?.focus();
  };
};
