import React from "react";
import { Modal, ModalOverlay, Dialog, type ModalOverlayProps } from "react-aria-components";
import { X } from "lucide-react";
import { cn } from "../../lib/utils/cn";

export interface DrawerProps extends ModalOverlayProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function Drawer({
  title,
  description,
  children,
  isOpen,
  onOpenChange,
  ...props
}: DrawerProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      className={({ isEntering, isExiting }) =>
        cn(
          "fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-xs transition-opacity duration-300",
          isEntering && "animate-in fade-in duration-300",
          isExiting && "animate-out fade-out duration-200",
        )
      }
      {...props}
    >
      <Modal
        className={({ isEntering, isExiting }) =>
          cn(
            "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out outline-none",
            isEntering && "translate-x-0 duration-300",
            isExiting && "translate-x-full duration-200",
          )
        }
      >
        <Dialog className="flex h-full flex-col outline-none">
          {({ close }) => (
            <>
              <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                <div>
                  {title && <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>}
                  {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
                  aria-label="Close panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
