import React, { useContext } from "react";
import Editor from "@monaco-editor/react";
import * as monaco_editor from "monaco-editor";
import { getCustomTheme } from "../../utils/monaco-theme";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  selectManual,
  updateFieldDirtinessMap,
} from "../../reducers/manualsSlice";

export interface CodeBlock {
  code: string;
  dataKey: string;
  manualUuid: string;
}
export function CodeBlock({ code, dataKey, manualUuid }: CodeBlock) {
  const dispatch = useAppDispatch();
  async function beforeEditorMount(monaco: typeof monaco_editor) {
    monaco.editor.defineTheme("txtx-dark", getCustomTheme());
    monaco.editor.setTheme("txtx-dark");
  }
  const onChange = (value) => {
    dispatch(
      updateFieldDirtinessMap({
        manualUuid,
        mapKey: dataKey,
        fieldIsDirty: value != code,
      }),
    );
  };

  return (
    <div>
      <Editor
        className="border rounded dark:border-slate-500/10 leading-6"
        height="2rem"
        theme="txtx-dark"
        defaultLanguage="javascript"
        defaultValue={code + ""}
        beforeMount={beforeEditorMount}
        options={{
          lineNumbers: "off",
          minimap: { enabled: false },
          hideCursorInOverviewRuler: true,
          padding: { top: 6 },
          lightbulb: {
            enabled: false,
          },
          scrollbar: { vertical: "hidden" },
          scrollBeyondLastLine: false,
          renderLineHighlight: "none",
        }}
        onChange={onChange}
      />
    </div>
  );
}
