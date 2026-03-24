import { describe, expect, it } from "vitest";
import { makeStore } from "../store";
import {
  setActionBlocks,
  setLogEvents,
  setMetadata,
  setModalBlocks,
  setModalVisibility,
  updateActionItems,
  selectActiveActionId,
  selectActiveFlowData,
  selectActiveTransientLogs,
  selectModalValidationReady,
  selectPanelValidationReady,
  selectRunbook,
} from "./runbooks-slice";
import type { ActionBlock, LogEvent, ModalBlock } from "../types/runbook";

function createSerializedActionBlock(
  overrides: Partial<ActionBlock<false>> = {},
): ActionBlock<false> {
  return {
    type: "ActionPanel",
    uuid: "action-panel-1",
    visible: true,
    panel: {
      title: "Action Panel",
      description: "Panel description",
      groups: [
        {
          title: "Group",
          subGroups: [
            {
              title: null,
              allowBatchCompletion: false,
              actionItems: [
                {
                  id: "review-1",
                  constructUuid: null,
                  index: 0,
                  constructInstanceName: "Review Input",
                  internalKey: "review-1",
                  actionStatus: JSON.stringify({ status: "Todo" }),
                  actionType: JSON.stringify({
                    type: "ReviewInput",
                    data: {
                      inputName: "network",
                      value: { type: "string", value: "devnet" },
                      forceExecution: false,
                    },
                  }),
                },
                {
                  id: "validate-1",
                  constructUuid: null,
                  index: 1,
                  constructInstanceName: "Validate Block",
                  internalKey: "validate-1",
                  actionStatus: JSON.stringify({ status: "Todo" }),
                  actionType: JSON.stringify({ type: "ValidateBlock" }),
                },
              ],
            },
          ],
        },
      ],
    },
    ...overrides,
  };
}

function createSerializedModalBlock(): ModalBlock<false> {
  return {
    type: "ModalPanel",
    uuid: "modal-1",
    visible: false,
    panel: {
      title: "Modal Panel",
      description: "Modal description",
      groups: [
        {
          title: "Modal Group",
          subGroups: [
            {
              title: null,
              allowBatchCompletion: false,
              actionItems: [
                {
                  id: "modal-validate-1",
                  constructUuid: null,
                  index: 0,
                  constructInstanceName: "Validate Modal",
                  internalKey: "modal-validate-1",
                  actionStatus: JSON.stringify({ status: "Todo" }),
                  actionType: JSON.stringify({ type: "ValidateModal" }),
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

describe("runbooksSlice", () => {
  it("stores metadata and exposes active flow addon data", () => {
    const store = makeStore();

    store.dispatch(
      setMetadata({
        name: "Demo Runbook",
        description: "Hello world",
        uuid: "runbook-1",
        addonData: [{ addonName: "svm", rpcApiUrl: "http://localhost:8899" }],
      }),
    );

    const state = store.getState();

    expect(selectRunbook(state).metadata.name).toBe("Demo Runbook");
    expect(selectActiveFlowData(state)).toEqual([
      { addonName: "svm", rpcApiUrl: "http://localhost:8899" },
    ]);
  });

  it("deserializes action blocks and tracks the first incomplete action", () => {
    const store = makeStore();

    store.dispatch(setActionBlocks([createSerializedActionBlock()]));

    const state = store.getState();

    expect(selectActiveActionId(state)).toBe("review-1");
    expect(selectRunbook(state).actionBlocks).toHaveLength(1);
    expect(selectRunbook(state).actionBlocks[0].panel.groups[0].subGroups[0]
      .actionItems[0].actionType).toEqual({
      type: "ReviewInput",
      data: {
        inputName: "network",
        value: { type: "string", value: "devnet" },
        forceExecution: false,
      },
    });
  });

  it("updates action items across existing blocks", () => {
    const store = makeStore();
    store.dispatch(setActionBlocks([createSerializedActionBlock()]));

    store.dispatch(
      updateActionItems([
        {
          id: "review-1",
          title: "Updated Review Input",
          description: "Updated description",
          actionStatus: JSON.stringify({ status: "Success", data: "ok" }),
          actionType: JSON.stringify({
            type: "DisplayOutput",
            data: {
              name: "Result",
              description: null,
              value: { type: "string", value: "done" },
            },
          }),
        },
      ]),
    );

    const actionItem =
      selectRunbook(store.getState()).actionBlocks[0].panel.groups[0]
        .subGroups[0].actionItems[0];

    expect(actionItem.constructInstanceName).toBe("Updated Review Input");
    expect(actionItem.description).toBe("Updated description");
    expect(actionItem.actionStatus).toEqual({ status: "Success", data: "ok" });
    expect(actionItem.actionType).toEqual({
      type: "DisplayOutput",
      data: {
        name: "Result",
        description: null,
        value: { type: "string", value: "done" },
      },
    });
  });

  it("calculates validation readiness for panels and modals", () => {
    const store = makeStore();
    store.dispatch(setActionBlocks([createSerializedActionBlock()]));
    store.dispatch(setModalBlocks([createSerializedModalBlock()]));
    store.dispatch(setModalVisibility(["modal-1", true]));

    expect(selectPanelValidationReady(store.getState(), "validate-1")).toBe(
      false,
    );
    expect(
      selectModalValidationReady(store.getState(), "modal-validate-1"),
    ).toBe(true);
  });

  it("returns only active transient logs", () => {
    const store = makeStore();
    const logs: LogEvent[] = [
      {
        uuid: "pending-1",
        type: "Transient",
        summary: "Pending",
        message: "still running",
        level: "info",
        status: "Pending",
      },
      {
        uuid: "done-1",
        type: "Transient",
        summary: "Pending",
        message: "started",
        level: "info",
        status: "Pending",
      },
      {
        uuid: "done-1",
        type: "Transient",
        summary: "Done",
        message: "finished",
        level: "info",
        status: "Success",
      },
      {
        uuid: "static-1",
        type: "Static",
        summary: "Static",
        message: "ignore me",
        level: "info",
        status: null,
      },
    ];

    store.dispatch(setLogEvents(logs));

    expect(selectActiveTransientLogs(store.getState())).toEqual([logs[0]]);
  });
});
