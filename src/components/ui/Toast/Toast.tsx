import { Activity, memo, useEffect, useEffectEvent, useMemo } from "react";
import { Check, CircleAlert } from "lucide-react";
import { classNames } from "../../../lib/classNames";
import "./Toast.css";

export type ToastTone = "success" | "error";

export interface ToastProps {
    /** The message to show. Null hides the toast. */
    message: string | null;
    tone?: ToastTone;
    /** Called when the toast should go away (after `duration`). */
    onDismiss: () => void;
    /** Milliseconds before auto-dismiss. */
    duration?: number;
}

/**
 * The live region stays mounted and only its text changes, so screen
 * readers reliably announce each new message.
 */
export const Toast = memo<ToastProps>(({ message, tone = "success", onDismiss, duration = 3200 }) => {
    const visible = Boolean(message);
    const className = useMemo(() => classNames("toast", visible && "toast--visible"), [visible]);
    const dismiss = useEffectEvent(() => onDismiss());

    useEffect(() => {
        if (!message) return undefined;
        const timer = window.setTimeout(dismiss, duration);
        return () => window.clearTimeout(timer);
    }, [message, duration]);

    return (
        <div role="status" aria-live="polite" aria-atomic="true" className="toast-region">
            <div className={className}>
                <Activity mode={visible && tone === "success" ? "visible" : "hidden"}>
                    <Check
                        size={16}
                        strokeWidth={2.5}
                        className="toast__icon toast__icon--success"
                        aria-hidden="true"
                    />
                </Activity>
                <Activity mode={visible && tone === "error" ? "visible" : "hidden"}>
                    <CircleAlert
                        size={16}
                        strokeWidth={2.25}
                        className="toast__icon toast__icon--error"
                        aria-hidden="true"
                    />
                </Activity>
                <span>{message}</span>
            </div>
        </div>
    );
});

Toast.displayName = "Toast";

export default Toast;
