import { useEffect } from "react";

export default function useHandleEnterKey(
  onEnter: any,
  deps: React.DependencyList,
  additionalCondition: boolean = true,
) {
  useEffect(() => {
    const handleEnterKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" && additionalCondition) {
        onEnter();
      }
    };
    document.addEventListener("keydown", handleEnterKey);
    return () => {
      document.removeEventListener("keydown", handleEnterKey);
    };
  }, deps);
}
