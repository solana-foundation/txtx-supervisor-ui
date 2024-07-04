import React, { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "../App";
import { useAppDispatch } from "../hooks";
import { useNavigate, useParams } from "react-router-dom";
import { setParticipantToken } from "../reducers/participant-auth-slice";

const DIGIT_COUNT = 6;

function isValidDigit(value) {
  return (
    value === "0" ||
    value === "1" ||
    value === "2" ||
    value === "3" ||
    value === "4" ||
    value === "5" ||
    value === "6" ||
    value === "7" ||
    value === "8" ||
    value === "9"
  );
}
export default function Login() {
  const [allDigitsSet, setAllDigitsSet] = useState(false);
  const [digits, setDigits] = useState<any[]>(Array(DIGIT_COUNT).fill(""));
  // todo: create loading animation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const inputs = useRef<any>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    let allSet = true;
    for (let i = 0; i < DIGIT_COUNT; i++) {
      if (!isValidDigit(digits[i])) {
        allSet = false;
        break;
      }
    }
    setAllDigitsSet(allSet);
  }, [digits]);

  useEffect(() => {
    if (allDigitsSet) {
      const fetchAuthToken = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${BACKEND_URL}/api/v1/channels/auth/${slug}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ otpCode: digits.join("") }),
            },
          );
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const result = await response.json();
          dispatch(setParticipantToken(result.authToken));
          const route = slug ? `/c/${slug}/` : "/";
          navigate(route);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchAuthToken();
    }
  }, [allDigitsSet]);

  const setDigit = (index: number, element: any) => {
    if (!isValidDigit(element.value)) {
      inputs.current[index].value = "";
      return;
    }
    const newDigits = [...digits];
    newDigits[index] = element.value;
    setDigits(newDigits);

    if (index < DIGIT_COUNT - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const onKeyDown = (event, index) => {
    if (event.key === "Backspace" && index !== 0) {
      inputs.current[index].value = "";
      inputs.current[index - 1].focus();
      inputs.current[index - 1].value = "";
      event.preventDefault();
    }
  };

  useEffect(() => {
    const handlePaste = (event) => {
      const paste = event.clipboardData.getData("text").trim().replace("-", "");

      if (paste.length === DIGIT_COUNT && paste.split("").every(isValidDigit)) {
        const newDigits = paste.split("").slice(0, DIGIT_COUNT);
        setDigits(newDigits);
        newDigits.forEach((value, index) => {
          inputs.current[index].value = value;
        });
        inputs.current[DIGIT_COUNT - 1].focus();
      }
      event.preventDefault();
    };

    inputs.current.forEach((input) => {
      input.addEventListener("paste", handlePaste);
    });

    return () => {
      inputs.current.forEach((input) => {
        if (input) {
          input.removeEventListener("paste", handlePaste);
        }
      });
    };
  }, [DIGIT_COUNT]);

  return (
    <div className="bg-gradient-to-b from-gray-950 to-neutral-900 ">
      <div className="min-h-screen w-full pt-0 mt-0 grow shrink basis-0 px-6 pt-6 flex-col justify-start items-center gap-8 inline-flex">
        <div className="mx-auto w-[575px] max-w-full h-[231px] px-6 pt-6 pb-16 bg-zinc-900 rounded-lg shadow border border-neutral-800 flex-col justify-start items-start gap-8 flex">
          <div className="self-stretch justify-start items-start inline-flex">
            <div className="grow shrink basis-0 text-emerald-500 text-base font-normal font-gt">
              RUNBOOK COLLABORATIVE EXECUTION
            </div>
          </div>
          <div className="self-stretch h-[92px] flex-col justify-start items-start gap-3 flex">
            <div
              // onPaste={handlePaste}
              className="self-stretch justify-center items-center gap-4 inline-flex"
            >
              {Array(DIGIT_COUNT)
                .fill(undefined)
                .map((_, i) => (
                  <div className="w-16 px-3 py-4 bg-gray-950 rounded border border-zinc-600 flex-col justify-center items-center inline-flex">
                    <input
                      key={`${i}-${digits[i]}`}
                      className="text-center w-full max-w-full p-0 bg-gray-950 text-4xl text-white font-normal font-gt border-none focus:outline-none focus:ring-0 ring-0 "
                      defaultValue={digits[i]}
                      onChange={(e) => {
                        setDigit(i, e.target);
                      }}
                      datatype="text"
                      maxLength={1}
                      onKeyDown={(e) => onKeyDown(e, i)}
                      ref={(el) => (inputs.current[i] = el)}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="self-stretch text-sm text-rose-400">{error}</div>
        </div>
      </div>
    </div>
  );
}
