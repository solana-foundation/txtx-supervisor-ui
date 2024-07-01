import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";
import React from "react";

export interface ModalWrapper {
  children: JSX.Element;
  visible: boolean;
  onClick?: any;
}
export function ModalWrapper({ children, visible, onClick }: ModalWrapper) {
  const modalCloseOnClick = (e) => {
    if (e.target.classList.contains("modal-close-click-target")) {
      onClick(e);
    }
  };
  return (
    <Transition show={visible} afterLeave={() => {}} appear>
      <Dialog
        className="modal-close-click-target relative z-40"
        onClose={() => {}}
      >
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="modal-close-click-target fixed inset-0 bg-gray-500 backdrop-blur-sm bg-opacity-25 transition-opacity" />
        </TransitionChild>

        <div
          className="modal-close-click-target fixed inset-0 z-10 w-screen overflow-y-auto py-4 sm:py-6 md:py-20"
          onClick={modalCloseOnClick}
        >
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="modal-close-click-target z-50 mx-auto max-w-[1024px] transform overflow-hidden rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <div className="modal-close-click-target w-full justify-center flex flex-col items-center">
                <div
                  onClick={modalCloseOnClick}
                  className="modal-close-click-target w-[1024px] max-w-full min-h-full px-6 pt-6 justify-center flex flex-col inline-flex gap-8"
                >
                  {children}
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
