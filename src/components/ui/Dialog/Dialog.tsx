import { Activity, memo, useCallback, useEffect, useId, useRef } from "react";
import type { MouseEvent, ReactNode, SyntheticEvent } from "react";
import { X } from "lucide-react";
import { Button } from "../Button/Button";
import "./Dialog.css";

export interface DialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: ReactNode;
    /** Buttons shown at the bottom, stacked. */
    footer?: ReactNode;
    /** Shows a close button in the corner. */
    showClose?: boolean;
    /** Closes when the dimmed backdrop is clicked. */
    closeOnBackdrop?: boolean;
    children?: ReactNode;
}

/**
 * Built on the native <dialog> element with showModal(): the rest of the page
 * becomes inert (focus can't leave), Escape closes it, and focus returns to
 * the opener on close.
 */
export const Dialog = memo<DialogProps>(
    ({ open, onClose, title, description, footer, showClose = true, closeOnBackdrop = true, children }) => {
        const dialogRef = useRef<HTMLDialogElement>(null);
        const titleId = useId();
        const descriptionId = useId();
        const hasDescription = description !== undefined && description !== null;
        const hasFooter = footer !== undefined && footer !== null;

        useEffect(() => {
            const dialog = dialogRef.current;
            if (!dialog) return;
            if (open && !dialog.open) dialog.showModal();
            if (!open && dialog.open) dialog.close();
        }, [open]);

        // Escape fires "cancel"; keep the open prop as the single source of truth.
        const handleCancel = useCallback(
            (event: SyntheticEvent<HTMLDialogElement>) => {
                event.preventDefault();
                onClose();
            },
            [onClose]
        );

        const handleBackdropClick = useCallback(
            (event: MouseEvent<HTMLDialogElement>) => {
                if (closeOnBackdrop && event.target === event.currentTarget) onClose();
            },
            [closeOnBackdrop, onClose]
        );

        return (
            <dialog
                ref={dialogRef}
                className="dialog"
                aria-labelledby={titleId}
                aria-describedby={hasDescription ? descriptionId : undefined}
                onCancel={handleCancel}
                onClick={handleBackdropClick}
            >
                <div className="dialog__panel">
                    <Activity mode={showClose ? "visible" : "hidden"}>
                        <div className="dialog__close">
                            <Button variant="ghost" size="sm" iconOnly icon={X} aria-label="Close" onClick={onClose} />
                        </div>
                    </Activity>
                    <h2 id={titleId} className="dialog__title">
                        {title}
                    </h2>
                    <Activity mode={hasDescription ? "visible" : "hidden"}>
                        <div id={descriptionId} className="dialog__description">
                            {description}
                        </div>
                    </Activity>
                    {children}
                    <Activity mode={hasFooter ? "visible" : "hidden"}>
                        <div className="dialog__footer">{footer}</div>
                    </Activity>
                </div>
            </dialog>
        );
    }
);

Dialog.displayName = "Dialog";

export default Dialog;
