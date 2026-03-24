import { describe, expect, it } from "vitest";
import {
  runbookStepSlice,
  selectRunbookActiveStep,
  setRunbookActiveStep,
} from "./runbook-step-slice";

describe("runbookStepSlice", () => {
  it("updates the active step", () => {
    const state = runbookStepSlice.reducer(undefined, setRunbookActiveStep(3));

    expect(state).toBe(3);
    expect(selectRunbookActiveStep({ activeStep: state })).toBe(3);
  });

  it("defaults to step 0", () => {
    const state = runbookStepSlice.reducer(undefined, { type: "unknown" });

    expect(state).toBe(0);
  });
});
