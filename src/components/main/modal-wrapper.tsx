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
        className="modal-close-click-target relative z-40 absolute"
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
          <div className="modal-close-click-target fixed inset-0 backdrop-blur-lg bg-opacity-25 transition-opacity" />
        </TransitionChild>

        <div
          className="modal-close-click-target fixed inset-0 z-10 w-screen overflow-y-auto py-4 sm:py-6 md:py-20 w-full h-full flex items-center justify-center"
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
                  className="modal-close-click-target max-w-[1024px] min-h-full justify-center flex flex-col inline-flex gap-8"
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
