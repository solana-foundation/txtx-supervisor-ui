export interface ConstructExecutionResult {
  [key: string]: string;
}

export interface CommandInputEvaluationResult {
  [key: string]: string;
}

export enum CommandInstanceState {
  New = "New",
  Evaluated = "Evaluated",
  AwaitingUserInput = "AwaitingUserInput",
  AwaitingAsyncRequest = "AwaitingAsyncRequest",
  Aborted = "Aborted",
  Failed = "Failed",
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

type Diagnostic = any; // Define Diagnostic type according to your needs

export type ActionItemRequestType =
  | ReviewInputActionItemRequest
  | ProvideInputActionItemRequest
  | PickInputOptionActionItemRequest
  | ProvidePublicKeyActionItemRequest
  | ProvideSignedTransactionActionItemRequest
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
}

export interface ProvideSignedTransactionRequest {
  checkExpectationActionUuid: string | null;
}

export type ActionItemResponse = {
  actionItemUuid: string;
} & ActionItemResponseType;

type ActionItemResponseType =
  | { type: "ReviewInput"; data: boolean }
  | { type: "ValidatePanel" }
  | { type: "ProvideInput"; data: ProvidedInputResponse }
  | { type: "PickInputOption"; data: string }
  | { type: "ProvidePublicKey"; data: ProvidedInputResponse }
  | { type: "ProvideSignedTransaction"; data: ProvidedInputResponse };

export interface ProvidedInputResponse {
  inputName: string;
  value: string;
  typing: PrimitiveType;
}

type PrimitiveType = "string" | "uint" | "int" | "boolean" | "null" | "buffer";
