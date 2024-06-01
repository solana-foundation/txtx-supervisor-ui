export interface Protocol {
  name: string;
  runbooks: Array<RunbookMetadata>;
}
export interface RunbookMetadata {
  name: string;
  description: string;
  uuid: string;
}

export type BlockAppendEvent = Block<false>;

export interface UpdateActionItemEvent<Deserialized = true> {
  newStatus: Deserialized extends true ? ActionItemStatus : string;
  actionItemUuid: string;
}

export interface Block<Deserialized = true> {
  uuid: string;
  title: string;
  description: string;
  groups: ActionGroup<Deserialized>[];
}

export function deserializeBlock(block: Block<false>): Block<true> {
  return {
    uuid: block.uuid,
    title: block.title,
    description: block.description,
    groups: block.groups.map((group) => ({
      title: group.title,
      subGroups: group.subGroups.map((subGroup) => ({
        allowBatchCompletion: subGroup.allowBatchCompletion,
        actionItems: subGroup.actionItems.map((actionItem) => {
          const deserializedStatus: ActionItemStatus = JSON.parse(
            actionItem.actionStatus,
          );
          const deserializedType: ActionItemRequestType = JSON.parse(
            actionItem.actionType,
          );
          return {
            uuid: actionItem.uuid,
            constructUuid: actionItem.constructUuid,
            index: actionItem.index,
            title: actionItem.title,
            description: actionItem.description,
            actionStatus: deserializedStatus,
            actionType: deserializedType,
          };
        }),
      })),
    })),
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
  | ValidatePanelActionItemRequest;

export type ReviewInputActionItemRequest = { type: "ReviewInput" };
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
export type ValidatePanelActionItemRequest = { type: "ValidatePanel" };

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

export type ActionItemResponse = {
  actionItemUuid: string;
} & ActionItemResponseType;

type ActionItemResponseType =
  | { type: "ReviewInput"; data: ReviewInputResponse }
  | { type: "ProvideInput"; data: ProvidedInputResponse }
  | { type: "PickInputOption"; data: string }
  | { type: "ProvidePublicKey"; data: ProvidePublicKeyResponse }
  | { type: "ProvideSignedTransaction"; data: ProvideSignedTransactionResponse }
  | { type: "ValidatePanel" };

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
      value: { type: PrimitiveType; value: string | number | boolean | null };
    }
  | {
      type: ArrayType;
      value: Value[];
    }
  | {
      type: Object;
      value: { [key: string]: { Err: Diagnostic } | { Ok: Value } };
    };

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

export function valueToString(input: Value): string | undefined {
  const { type, value } = input;
  if (
    type !== "Primitive" ||
    value.type !== "String" ||
    typeof value.value !== "string"
  ) {
    return;
  }
  return value.value;
}
