export interface ClientDiscoveryResponse {
  clientType: "Participant" | "Operator";
  needsCredentials: boolean;
}

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
  id: string;
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

export type BlockType = "ActionPanel" | "ModalPanel" | "ErrorPanel";

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
export interface ErrorBlock<Deserialized = true> {
  type: BlockType;
  uuid: string;
  visible: boolean;
  panel: ErrorPanelData<Deserialized>;
}
export interface ProgressBlock {
  type: "ProgressBar";
  uuid: string;
  visible: boolean;
  panel: ConstructProgressBarStatuses[];
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

export interface ErrorPanelData<Deserialized = true> {
  title: string;
  description: string;
  groups: ActionGroup<Deserialized>[];
}

export interface ConstructProgressBarStatuses {
  constructDid: string;
  statuses: ProgressBarStatus[];
}

export interface ProgressBarStatusUpdate {
  progressBarUuid: string;
  constructDid: string;
  newStatus: ProgressBarStatus;
}

export interface ProgressBarVisibilityUpdate {
  progressBarUuid: string;
  visible: boolean;
}

export interface ProgressBarStatus {
  status: string;
  statusColor: ProgressBarStatusColor;
  message: string;
  diagnostic?: Diagnostic;
}
export type ProgressBarStatusColor = "Green" | "Yellow" | "Red";
export function deserializeBlock<
  T extends ModalBlock<false> | ActionBlock<false> | ErrorBlock<false>,
>(
  block: T,
): T extends ErrorBlock<false>
  ? ErrorBlock<true>
  : T extends ModalBlock<false>
    ? ModalBlock<true>
    : ActionBlock<true> {
  const deserializedGroups = block.panel.groups.map(deserializeGroup);
  const panel = {
    ...block.panel,
    groups: deserializedGroups,
  };
  //@ts-ignore (todo)
  return {
    uuid: block.uuid,
    visible: block.visible,
    type: block.type,
    panel,
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
  id: string;
  constructUuid: string | null;
  index: number;
  title: string;
  description?: string;
  actionStatus: Deserialized extends true ? ActionItemStatus : string;
  actionType: Deserialized extends true ? ActionItemRequestType : string;
}

export type ActionItemStatus =
  | { status: "Todo" }
  | { status: "Blocked" }
  | { status: "Success"; data: string }
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
  | ProvideSignedMessageActionItemRequest
  | ProvideSignedTransactionActionItemRequest
  | DisplayOutputActionItemRequest
  | DisplayErrorLogActionItemRequest
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
  data: PickInputOptionRequest;
};
export type ProvidePublicKeyActionItemRequest = {
  type: "ProvidePublicKey";
  data: ProvidePublicKeyRequest;
};
export type ProvideSignedMessageActionItemRequest = {
  type: "ProvideSignedMessage";
  data: ProvideSignedMessageRequest;
};
export type ProvideSignedTransactionActionItemRequest = {
  type: "ProvideSignedTransaction";
  data: ProvideSignedTransactionRequest;
};
export type DisplayOutputActionItemRequest = {
  type: "DisplayOutput";
  data: DisplayOutputRequest;
};
export type DisplayErrorLogActionItemRequest = {
  type: "DisplayErrorLog";
  data: DisplayErrorLogRequest;
};
export type OpenModalActionItemRequest = {
  type: "OpenModal";
  data: OpenModalRequest;
};
export type ValidateBlockActionItemRequest = { type: "ValidateBlock" };
export type ValidateModalActionItemRequest = { type: "ValidateModal" };

export interface ReviewInputRequest {
  inputName: string;
  value: Value;
}
export interface ProvideInputRequest {
  inputName: string;
  typing: PrimitiveType;
  defaultValue?: Value;
}

export interface PickInputOptionRequest {
  options: InputOption[];
  selected: InputOption;
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
  expectedSignerAddress: string | null;
  skippable: boolean;
  signerUuid: string;
  payload: Value;
  namespace: string;
  networkId: string;
}

export interface ProvideSignedMessageRequest {
  checkExpectationActionUuid: string | null;
  signerUuid: string;
  message: Value;
  namespace: string;
  networkId: string;
}

export interface DisplayOutputRequest {
  name: string;
  description: string | null;
  value: Value;
}
export interface DisplayErrorLogRequest {
  diagnostic: Diagnostic;
}
export interface OpenModalRequest {
  modalUuid: string;
  title: string;
}

export type ActionItemResponse = {
  actionItemId: string;
} & ActionItemResponseType;

type ActionItemResponseType =
  | { type: "ReviewInput"; data: ReviewInputResponse }
  | { type: "ProvideInput"; data: ProvidedInputResponse }
  | { type: "PickInputOption"; data: string }
  | { type: "ProvidePublicKey"; data: ProvidePublicKeyResponse }
  | { type: "ProvideSignedMessage"; data: ProvideSignedMessageResponse }
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

export interface ProvideSignedMessageResponse {
  signedMessageBytes: string;
  signerUuid: string;
}

export interface ProvideSignedTransactionResponse {
  signedTransactionBytes: string | null;
  signerUuid: string;
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
      value: PrimitiveValue;
    }
  | {
      type: ArrayType;
      value: Value[];
    }
  | {
      type: Object;
      value: { [key: string]: { Err: Diagnostic } | { Ok: Value } };
    };

export type PrimitiveValue =
  | { type: "String"; value: string }
  | { type: "UInt"; value: number }
  | { type: "Int"; value: number }
  | { type: "Boolean"; value: boolean }
  | { type: "Null"; value: null }
  | { type: "Buffer"; value: BufferData };

export interface BufferData {
  bytes: Uint8Array;
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
  let primitiveValue: PrimitiveValue;
  if (typing === "Boolean") {
    primitiveValue = { type: "Boolean", value: !!input };
  } else if (typing === "Buffer") {
    primitiveValue = {
      type: "Buffer",
      value: {
        bytes: Uint8Array.from(input),
        typing: { id: "unknown", documentation: "unknown" },
      },
    };
  } else if (typing === "Int") {
    primitiveValue = {
      type: "Int",
      value: parseInt(input),
    };
  } else if (typing === "UInt") {
    primitiveValue = {
      type: "UInt",
      value: Math.max(0, parseInt(input)),
    };
  } else if (typing === "Null") {
    primitiveValue = {
      type: "Null",
      value: null,
    };
  } else {
    primitiveValue = {
      type: "String",
      value: input.toString(),
    };
  }
  return {
    type: "Primitive",
    value: primitiveValue,
  };
}

export type DisplayableValue = string | number | boolean;
export function formatValueForDisplay(input: Value): DisplayableValue {
  const { type, value } = input;
  if (type === "Primitive") {
    if (value.type === "Buffer") {
      const bufferData = value.value;
      return "0x" + toHexString(bufferData.bytes);
    } else if (value.type === "Null") {
      return "N/A";
    } else {
      return value.value;
    }
  } else if (type === "Array") {
    return JSON.stringify(value.map((v) => formatValueForDisplay(v)));
  } else if (type === "Object") {
    const keys = Object.keys(value);
    return JSON.stringify(
      keys.map((k) => {
        let val = value[k];
        if ("Err" in val) {
          return { k: JSON.stringify(val.Err) };
        } else {
          return { k: formatValueForDisplay(val.Ok) };
        }
      }),
    );
  }
  throw new Error(
    `Unable to format value for display: ${JSON.stringify(value)}`,
  );
}

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    // @ts-ignore
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

export function formatDiagnosticForDisplay(input: Diagnostic) {
  return input.message;
}
