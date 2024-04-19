import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import * as monaco_editor from "monaco-editor";
import { getCustomTheme } from "../../utils/monaco-theme";
import { useAppDispatch } from "../../hooks";
import {
  setRunbookData,
  updateFieldDirtinessMap,
} from "../../reducers/runbooksSlice";
import { GET_MANUAL, UPDATE_COMMAND_INPUT } from "../../utils/queries";
import { useMutation } from "@apollo/client";
import debounce from "debounce";

const MAX_LINE_HEIGHT = 1000;
const MIN_LINE_HEIGHT = 32;

export interface CodeBlock {
  code: string | object;
  dataKey: string;
  runbookUuid: string;
  fieldName: string;
  constructUuid: string;
  readonly: boolean;
}
export function CodeBlock({
  code,
  dataKey,
  runbookUuid,
  fieldName,
  constructUuid,
  readonly,
}: CodeBlock) {
  const dispatch = useAppDispatch();

  const [height, setHeight] = useState(MIN_LINE_HEIGHT);

  const [updateCommandInput, { data, loading, error }] = useMutation(
    UPDATE_COMMAND_INPUT,
    {
      update(cache, { data: { updateCommandInput } }) {
        const runbookData = {
          uuid: runbookUuid,
          data: updateCommandInput,
        };
        cache.writeQuery({
          query: GET_MANUAL,
          data: {
            runbook: runbookData,
          },
        });
        dispatch(setRunbookData(runbookData));
      },
    },
  );
  const onChange = (value) => {
    if (!readonly) {
      dispatch(
        updateFieldDirtinessMap({
          runbookUuid,
          mapKey: dataKey,
          fieldIsDirty: value != code,
        }),
      );
      updateCommandInput({
        variables: {
          runbookName: runbookUuid,
          commandUuid: constructUuid.replace("local:", ""),
          inputName: fieldName,
          value: value,
        },
      });
    }
  };
  const debouncedOnChange = debounce(onChange, 500);
  const onMount = (editor: monaco_editor.editor.IStandaloneCodeEditor) => {
    const updateHeight = () => {
      const contentHeight = Math.min(
        MAX_LINE_HEIGHT,
        Math.max(MIN_LINE_HEIGHT, editor.getContentHeight() + 8),
      );
      setHeight(contentHeight);
    };
    editor.onDidContentSizeChange(updateHeight);
  };

  async function beforeEditorMount(monaco: typeof monaco_editor) {
    monaco.editor.defineTheme("txtx-dark", getCustomTheme());
    monaco.editor.setTheme("txtx-dark");
  }

  const isObject = typeof code === "object";
  return (
    <div>
      <Editor
        className="border rounded dark:border-slate-500/10 leading-6"
        height={`${height}px`}
        theme="txtx-dark"
        defaultLanguage={isObject ? "json" : "javascript"}
        value={isObject ? JSON.stringify(code, null, "\t") : code + ""}
        onMount={onMount}
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
          readOnly: readonly,
        }}
        onChange={debouncedOnChange}
      />
    </div>
  );
}
