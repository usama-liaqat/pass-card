import { Activity, memo, useCallback, useId, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "../Badge/Badge";
import "./Disclosure.css";

export interface DisclosureProps {
    title: string;
    /** One-line summary under the title, e.g. which optional fields are filled. */
    summary?: string;
    /** Shows an "{count} added" badge when above zero. */
    count?: number;
    /** Shows a "Check" badge when something inside needs attention. */
    hasError?: boolean;
    /** Controlled open state. Leave undefined to let the component manage it. */
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactNode;
}

export const Disclosure = memo<DisclosureProps>(
    ({ title, summary, count = 0, hasError = false, open, defaultOpen = false, onOpenChange, children }) => {
        const panelId = useId();
        const [innerOpen, setInnerOpen] = useState(defaultOpen);
        const isOpen = open ?? innerOpen;
        const hasSummary = Boolean(summary);

        const handleToggle = useCallback(() => {
            const next = !isOpen;
            if (open === undefined) setInnerOpen(next);
            onOpenChange?.(next);
        }, [isOpen, open, onOpenChange]);

        return (
            <div className="disclosure">
                <button
                    type="button"
                    className="disclosure__trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={handleToggle}
                >
                    <span className="disclosure__text">
                        <span className="disclosure__title">{title}</span>
                        <Activity mode={hasSummary ? "visible" : "hidden"}>
                            <span className="disclosure__summary">{summary}</span>
                        </Activity>
                    </span>
                    <Activity mode={count > 0 ? "visible" : "hidden"}>
                        <Badge tone="accent">{count} added</Badge>
                    </Activity>
                    <Activity mode={hasError ? "visible" : "hidden"}>
                        <Badge tone="danger">Check</Badge>
                    </Activity>
                    <ChevronDown size={16} className="disclosure__chevron" aria-hidden="true" />
                </button>
                <Activity mode={isOpen ? "visible" : "hidden"}>
                    <div id={panelId} className="disclosure__panel">
                        {children}
                    </div>
                </Activity>
            </div>
        );
    }
);

Disclosure.displayName = "Disclosure";

export default Disclosure;
