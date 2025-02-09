import { useEffect, useState } from "react";
import {
  removeFirstError,
  selectErrors,
  selectFirstError,
} from "../../reducers/error-slice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import React from "react";
import { Transition } from "@headlessui/react";

const ErrorModal = () => {
  const errors = useAppSelector(selectErrors);
  const dispatch = useAppDispatch();
  const [currentError, setCurrentError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentError(errors[0]);
    const timer = setTimeout(() => {
      dispatch(removeFirstError());
    }, 5000);
    return () => clearTimeout(timer);
  }, [errors, dispatch]);

  return (
    <Transition
      show={!!currentError}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0 translate-y-2"
      enterTo="opacity-100 translate-y-0"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-2"
    >
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
        {currentError}
      </div>
    </Transition>
  );
};

export default ErrorModal;
