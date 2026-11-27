import { createContext, use } from "react";
import type { ToastTone } from "../components/ui";

export interface ToastApi {
    showToast: (message: string, tone?: ToastTone) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);

export const useToast = (): ToastApi => {
    const value = use(ToastContext);
    if (!value) throw new Error("useToast must be used inside <ToastProvider>");
    return value;
};
