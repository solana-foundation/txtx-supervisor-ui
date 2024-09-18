import { ActionItemRequest } from "../main/types";

export interface ProvideSignedMessageAction {
  actionItem: ActionItemRequest;
  isFirst: boolean;
  isLast: boolean;
  isCurrent: boolean;
}
export function ProvideSignedMessageAction({
  actionItem,
  isFirst,
  isLast,
  isCurrent,
}: ProvideSignedMessageAction): React.JSX.Element {
  throw new Error("Signed message action not supported");
}
