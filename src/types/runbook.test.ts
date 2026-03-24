import { describe, expect, it } from "vitest";
import {
  deserializeActionItemEvent,
  deserializeBlock,
  formatDiagnosticForDisplay,
  toValue,
  valueToJson,
  type ActionBlock,
} from "./runbook";

describe("runbook type helpers", () => {
  it("deserializes action item updates", () => {
    const result = deserializeActionItemEvent({
      id: "action-1",
      title: "Updated Action",
      actionStatus: JSON.stringify({ status: "Success", data: "ok" }),
      actionType: JSON.stringify({
        type: "ValidateBlock",
      }),
    });

    expect(result).toEqual({
      id: "action-1",
      title: "Updated Action",
      actionStatus: { status: "Success", data: "ok" },
      actionType: { type: "ValidateBlock" },
    });
  });

  it("deserializes blocks with nested groups and action items", () => {
    const block: ActionBlock<false> = {
      type: "ActionPanel",
      uuid: "block-1",
      visible: true,
      panel: {
        title: "Panel",
        description: "Description",
        groups: [
          {
            title: "Group",
            subGroups: [
              {
                title: null,
                allowBatchCompletion: false,
                actionItems: [
                  {
                    id: "action-1",
                    constructUuid: null,
                    index: 0,
                    constructInstanceName: "Provide Input",
                    internalKey: "action-1",
                    actionStatus: JSON.stringify({ status: "Todo" }),
                    actionType: JSON.stringify({
                      type: "ProvideInput",
                      data: {
                        inputName: "name",
                        typing: "string",
                      },
                    }),
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    const result = deserializeBlock(block);

    expect(result.panel.groups[0].subGroups[0].actionItems[0].actionStatus).toEqual(
      { status: "Todo" },
    );
    expect(result.panel.groups[0].subGroups[0].actionItems[0].actionType).toEqual(
      {
        type: "ProvideInput",
        data: {
          inputName: "name",
          typing: "string",
        },
      },
    );
  });

  it("converts values to and from displayable JSON shapes", () => {
    expect(toValue("hello", "string")).toEqual({
      type: "string",
      value: "hello",
    });
    expect(toValue(7, "integer")).toEqual({
      type: "integer",
      value: "7",
    });
    expect(toValue("false", "bool")).toEqual({
      type: "bool",
      value: false,
    });
    expect(valueToJson({ type: "integer", value: "42" })).toBe(42);
    expect(valueToJson({ type: "bool", value: true })).toBe("true");
  });

  it("formats diagnostics for display", () => {
    expect(
      formatDiagnosticForDisplay({
        span: null,
        message: "Something went wrong",
        level: "Error",
      }),
    ).toBe("Something went wrong");
  });
});
