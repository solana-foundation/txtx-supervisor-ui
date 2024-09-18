import { useEffect } from "react";

export default function useHandleEscapeKey(
  onEscape: () => void,
  deps: React.DependencyList,
  additionalCondition: boolean = true,
) {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && additionalCondition) {
        onEscape();
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, deps);
}
