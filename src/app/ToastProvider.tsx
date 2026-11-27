import { memo, useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Toast } from "../components/ui";
import type { ToastTone } from "../components/ui";
import { ToastContext } from "./toast";
import type { ToastApi } from "./toast";

interface ToastProviderProps {
    children: ReactNode;
}

interface ToastState {
    message: string;
    tone: ToastTone;
}

/** One app-wide toast; pages call useToast().showToast(). */
export const ToastProvider = memo<ToastProviderProps>(({ children }) => {
    const [toast, setToast] = useState<ToastState | null>(null);

    const showToast = useCallback((message: string, tone: ToastTone = "success") => {
        setToast({ message, tone });
    }, []);
    const dismiss = useCallback(() => setToast(null), []);
    const value = useMemo<ToastApi>(() => ({ showToast }), [showToast]);

    return (
        <ToastContext value={value}>
            {children}
            <Toast message={toast?.message ?? null} tone={toast?.tone} onDismiss={dismiss} />
        </ToastContext>
    );
});

ToastProvider.displayName = "ToastProvider";

export default ToastProvider;
