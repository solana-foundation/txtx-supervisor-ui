export interface Protocol {
  name: string;
  runbooks: Array<RunbookMetadata>;
}
export interface RunbookMetadata {
  name: string;
  description: string;
  uuid: string;
}

export interface UpdateActionItemEvent<Deserialized = true> {
  uuid: string;
  title?: string;
  description?: string;
  actionStatus?: Deserialized extends true ? ActionItemStatus : string;
  actionType?: Deserialized extends true ? ActionItemRequestType : string;
}

export function deserializeActionItemEvent(
  input: UpdateActionItemEvent<false>,
): UpdateActionItemEvent {
  return {
    ...input,
    actionStatus: input.actionStatus
      ? JSON.parse(input.actionStatus)
      : undefined,
    actionType: input.actionType ? JSON.parse(input.actionType) : undefined,
  };
}

export type BlockType = "ActionPanel" | "ModalPanel";

export interface ActionBlock<Deserialized = true> {
  type: BlockType;
  uuid: string;
  visible: boolean;
  panel: ActionPanelData<Deserialized>;
}
export interface ModalBlock<Deserialized = true> {
  type: BlockType;
  uuid: string;
  visible: boolean;
  panel: ModalPanelData<Deserialized>;
}
export interface ProgressBlock {
  type: string;
  uuid: string;
  visible: boolean;
  panel: ProgressBarStatus;
}

export interface ActionPanelData<Deserialized = true> {
  title: string;
  description: string;
  groups: ActionGroup<Deserialized>[];
}

export interface ModalPanelData<Deserialized = true> {
  title: string;
  description: string;
  groups: ActionGroup<Deserialized>[];
}

export interface ProgressBarStatus {
  status: string;
  message: string;
  diagnostic: Diagnostic;
}

export function deserializeBlock<
  T extends ModalBlock<false> | ActionBlock<false>,
>(
  block: T,
): T extends ModalBlock<false> ? ModalBlock<true> : ActionBlock<true> {
  const deserializedGroups = block.panel.groups.map(deserializeGroup);
  const filtered = deserializedGroups.reduce((acc, group) => {
    const subGroups = group.subGroups;
    const uniqueSubGroups: any[] = [];
    for (let i = 0; i < subGroups.length; i++) {
      const a = subGroups[i];
      let isUnique = true;
      for (let j = i + 1; j < subGroups.length; j++) {
        const b = subGroups[j];
        if (a.actionItems[0].uuid === b.actionItems[0].uuid) {
          isUnique = false;
        }
      }
      if (isUnique) {
        uniqueSubGroups.push(a);
      }
    }
    acc.push({ ...group, subGroups: uniqueSubGroups });
    return acc;
  }, [] as any[]);
  return {
    uuid: block.uuid,
    visible: block.visible,
    type: block.type,
    panel: {
      ...block.panel,
      groups: filtered,
    },
  };
}

function deserializeGroup(group: ActionGroup<false>): ActionGroup<true> {
  return {
    ...group,
    subGroups: group.subGroups.map(deserializeSubGroup),
  };
}

function deserializeSubGroup(
  subGroup: ActionSubGroup<false>,
): ActionSubGroup<true> {
  return {
    ...subGroup,
    actionItems: subGroup.actionItems.map(deserializeActionItem),
  };
}

function deserializeActionItem(
  actionItem: ActionItemRequest<false>,
): ActionItemRequest<true> {
  const deserializedStatus: ActionItemStatus = JSON.parse(
    actionItem.actionStatus,
  );
  const deserializedType: ActionItemRequestType = JSON.parse(
    actionItem.actionType,
  );
  return {
    ...actionItem,
    actionStatus: deserializedStatus,
    actionType: deserializedType,
  };
}
export interface ActionGroup<Deserialized = true> {
  title: string;
  subGroups: ActionSubGroup<Deserialized>[];
}

export interface ActionSubGroup<Deserialized = true> {
  actionItems: ActionItemRequest<Deserialized>[];
  allowBatchCompletion: boolean;
}

export interface ActionItemRequest<Deserialized = true> {
  uuid: string;
  constructUuid: string | null;
  index: number;
  title: string;
  description: string;
  actionStatus: Deserialized extends true ? ActionItemStatus : string;
  actionType: Deserialized extends true ? ActionItemRequestType : string;
}

export type ActionItemStatus =
  | { status: "Todo" }
  | { status: "Success" }
  | { status: "InProgress"; data: string }
  | { status: "Error"; data: Diagnostic }
  | { status: "Warning"; data: Diagnostic };

export interface Diagnostic {
  span: DiagnosticSpan | null;
  message: string;
  level: DiagnosticLevel;
}

export interface DiagnosticSpan {
  line_start: number;
  line_end: number;
  column_start: number;
  column_end: number;
}

export type DiagnosticLevel = "Error" | "Warning" | "Note";

export type ActionItemRequestType =
  | ReviewInputActionItemRequest
  | ProvideInputActionItemRequest
  | PickInputOptionActionItemRequest
  | ProvidePublicKeyActionItemRequest
  | ProvideSignedTransactionActionItemRequest
  | DisplayOutputActionItemRequest
  | ValidateBlockActionItemRequest
  | ValidateModalActionItemRequest
  | OpenModalActionItemRequest;

export type ReviewInputActionItemRequest = {
  type: "ReviewInput";
  data: ReviewInputRequest;
};
export type ProvideInputActionItemRequest = {
  type: "ProvideInput";
  data: ProvideInputRequest;
};
export type PickInputOptionActionItemRequest = {
  type: "PickInputOption";
  data: InputOption[];
};
export type ProvidePublicKeyActionItemRequest = {
  type: "ProvidePublicKey";
  data: ProvidePublicKeyRequest;
};
export type ProvideSignedTransactionActionItemRequest = {
  type: "ProvideSignedTransaction";
  data: ProvideSignedTransactionRequest;
};
export type DisplayOutputActionItemRequest = {
  type: "DisplayOutput";
  data: DisplayOutputRequest;
};
export type OpenModalActionItemRequest = {
  type: "OpenModal";
  data: OpenModalRequest;
};
export type ValidateBlockActionItemRequest = { type: "ValidateBlock" };
export type ValidateModalActionItemRequest = { type: "ValidateModal" };

export interface ReviewInputRequest {
  inputName: string;
}
export interface ProvideInputRequest {
  inputName: string;
  typing: PrimitiveType;
}

export interface InputOption {
  value: string;
  displayedValue: string;
}

export interface ProvidePublicKeyRequest {
  checkExpectationActionUuid: string | null;
  message: string;
  namespace: string;
  networkId: string;
}

export interface ProvideSignedTransactionRequest {
  checkExpectationActionUuid: string | null;
  payload: Value;
  namespace: string;
  networkId: string;
}

export interface DisplayOutputRequest {
  name: string;
  description: string | null;
  value: Value;
}
export interface OpenModalRequest {
  modalUuid: string;
  title: string;
}

export type ActionItemResponse = {
  actionItemUuid: string;
} & ActionItemResponseType;

type ActionItemResponseType =
  | { type: "ReviewInput"; data: ReviewInputResponse }
  | { type: "ProvideInput"; data: ProvidedInputResponse }
  | { type: "PickInputOption"; data: string }
  | { type: "ProvidePublicKey"; data: ProvidePublicKeyResponse }
  | { type: "ProvideSignedTransaction"; data: ProvideSignedTransactionResponse }
  | { type: "ValidateBlock" }
  | { type: "ValidateModal" };

export interface ReviewInputResponse {
  inputName: string;
  valueChecked: boolean;
}

export interface ProvidedInputResponse {
  inputName: string;
  updatedValue: Value;
}

export interface ProvidePublicKeyResponse {
  publicKey: string;
}

export interface ProvideSignedTransactionResponse {
  signedTransactionBytes: string;
}

export type Primitive = "Primitive";
export type ArrayType = "Array";
export type Object = "Object";
export type Addon = "Addon";
export type Type = Primitive | ArrayType | Object | Addon;

export type PrimitiveType =
  | "String"
  | "UInt"
  | "Int"
  | "Boolean"
  | "Null"
  | "Buffer";

export type Value =
  | {
      type: Primitive;
      value: {
        type: PrimitiveType;
        value: string | number | boolean | null | BufferData;
      };
    }
  | {
      type: ArrayType;
      value: Value[];
    }
  | {
      type: Object;
      value: { [key: string]: { Err: Diagnostic } | { Ok: Value } };
    };
export interface BufferData {
  bytes: number[];
  typing: { id: string; documentation: string };
}
export function toValue(input: any, typing: PrimitiveType): Value {
  if (
    typeof input === "object" ||
    typeof input === "function" ||
    Array.isArray(input)
  ) {
    throw new Error(`toValue not yet supported for ${typeof input}: ${input}`);
  }
  return {
    type: "Primitive",
    value: {
      type: typing,
      value: input,
    },
  };
}

export function valueToString(
  input: Value,
): string | number | boolean | null | undefined {
  const { type, value } = input;
  if (type !== "Primitive") {
    return;
  }
  if (value.type === "Buffer" || typeof value.value === "object") {
    const bufferData = value.value as BufferData;

    return "0x" + toHexString(bufferData.bytes);
  }
  return value.value;
}
function toHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    // @ts-ignore
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}
