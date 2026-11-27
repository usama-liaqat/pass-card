import { Activity, memo, useCallback, useId, useMemo } from "react";
import { classNames } from "../../../lib/classNames";
import "./Toggle.css";

export interface ToggleProps {
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    /** Secondary line under the label. */
    sub?: string;
    disabled?: boolean;
    id?: string;
}

export const Toggle = memo<ToggleProps>(({ label, checked, onCheckedChange, sub, disabled = false, id }) => {
    const autoId = useId();
    const switchId = id ?? autoId;
    const subId = `${switchId}-sub`;
    const hasSub = Boolean(sub);

    const rootClass = useMemo(() => classNames("toggle", disabled && "toggle--disabled"), [disabled]);
    const handleClick = useCallback(() => onCheckedChange(!checked), [checked, onCheckedChange]);

    return (
        <div className={rootClass}>
            <label htmlFor={switchId} className="toggle__text">
                <span className="toggle__label">{label}</span>
                <Activity mode={hasSub ? "visible" : "hidden"}>
                    <span id={subId} className="toggle__sub">
                        {sub}
                    </span>
                </Activity>
            </label>
            <button
                id={switchId}
                type="button"
                role="switch"
                aria-checked={checked}
                aria-describedby={hasSub ? subId : undefined}
                disabled={disabled}
                onClick={handleClick}
                className="toggle__switch hit-area"
            >
                <span className="toggle__knob" aria-hidden="true" />
            </button>
        </div>
    );
});

Toggle.displayName = "Toggle";

export default Toggle;
