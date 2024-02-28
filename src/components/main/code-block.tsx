import React, { useContext } from "react";
import Editor from "@monaco-editor/react";
import * as monaco_editor from "monaco-editor";
import { getCustomTheme } from "../../utils/monaco-theme";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  selectManual,
  setManualData,
  updateFieldDirtinessMap,
} from "../../reducers/manualsSlice";
import { GET_MANUAL, UPDATE_COMMAND_INPUT } from "../../utils/queries";
import { useMutation } from "@apollo/client";

export interface CodeBlock {
  code: string;
  dataKey: string;
  manualUuid: string;
  fieldName: string;
  constructUuid: string;
}
export function CodeBlock({
  code,
  dataKey,
  manualUuid,
  fieldName,
  constructUuid,
}: CodeBlock) {
  const dispatch = useAppDispatch();
  async function beforeEditorMount(monaco: typeof monaco_editor) {
    monaco.editor.defineTheme("txtx-dark", getCustomTheme());
    monaco.editor.setTheme("txtx-dark");
  }
  const [updateCommandInput, { data, loading, error }] = useMutation(
    UPDATE_COMMAND_INPUT,
    {
      update(cache, { data: { updateCommandInput } }) {
        const manualData = {
          uuid: manualUuid,
          data: updateCommandInput,
        };
        cache.writeQuery({
          query: GET_MANUAL,
          data: {
            manual: manualData,
          },
        });
        dispatch(setManualData(manualData));
      },
    },
  );
  const onChange = (value) => {
    dispatch(
      updateFieldDirtinessMap({
        manualUuid,
        mapKey: dataKey,
        fieldIsDirty: value != code,
      }),
    );
    updateCommandInput({
      variables: {
        manualName: manualUuid,
        commandUuid: constructUuid.replace("local:", ""),
        inputName: fieldName,
        value: value,
      },
    });
  };

  return (
    <div>
      <Editor
        className="border rounded dark:border-slate-500/10 leading-6"
        height="2rem"
        theme="txtx-dark"
        defaultLanguage="javascript"
        value={code + ""}
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
