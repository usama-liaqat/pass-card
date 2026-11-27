import { memo, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { classNames } from "../../../lib/classNames";
import { IconSlot } from "../IconSlot/IconSlot";
import "./Segmented.css";

export interface SegmentedOption<T extends string = string> {
    id: T;
    label: string;
    icon?: LucideIcon;
}

export interface SegmentedProps<T extends string = string> {
    /** Accessible name of the group. */
    label: string;
    options: Array<SegmentedOption<T>>;
    value: T;
    onValueChange: (value: T) => void;
    /** md 34px segments, sm 28px. Both keep a 44px hit area. */
    size?: "md" | "sm";
    fullWidth?: boolean;
}

const SegmentedInner = memo<SegmentedProps>(
    ({ label, options, value, onValueChange, size = "md", fullWidth = false }) => {
        const rootClass = useMemo(
            () => classNames("segmented", `segmented--${size}`, fullWidth && "segmented--full"),
            [size, fullWidth]
        );

        return (
            <div role="group" aria-label={label} className={rootClass}>
                {options.map(option => (
                    <SegmentedItem
                        key={option.id}
                        option={option}
                        pressed={option.id === value}
                        onPick={onValueChange}
                    />
                ))}
            </div>
        );
    }
);

SegmentedInner.displayName = "Segmented";

interface SegmentedItemProps {
    option: SegmentedOption;
    pressed: boolean;
    onPick: (id: string) => void;
}

const SegmentedItem = memo<SegmentedItemProps>(({ option, pressed, onPick }) => {
    const handleClick = useCallback(() => onPick(option.id), [onPick, option.id]);
    return (
        <button type="button" aria-pressed={pressed} onClick={handleClick} className="segmented__item">
            <IconSlot icon={option.icon} size={14} />
            {option.label}
        </button>
    );
});

SegmentedItem.displayName = "SegmentedItem";

/** Typed wrapper so callers get their option id union back in onValueChange. */
export const Segmented = SegmentedInner as unknown as (<T extends string>(props: SegmentedProps<T>) => ReactNode) & {
    displayName?: string;
};

export default Segmented;
