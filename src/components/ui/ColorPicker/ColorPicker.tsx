import { memo, useCallback } from "react";
import type { ChangeEvent } from "react";
import "./ColorPicker.css";

export interface ColorPickerProps {
    /** Visible name, also used for the input's accessible name ("{name} color"). */
    name: string;
    /** A #RRGGBB hex value. */
    value: string;
    onValueChange: (value: string) => void;
}

/** One color row: native color input, name and current hex value. */
export const ColorPicker = memo<ColorPickerProps>(({ name, value, onValueChange }) => {
    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => onValueChange(event.target.value),
        [onValueChange]
    );

    return (
        <label className="color-picker">
            <input
                type="color"
                className="color-picker__input"
                value={value}
                onChange={handleChange}
                aria-label={`${name} color`}
            />
            <span className="color-picker__text">
                <span className="color-picker__name">{name}</span>
                <span className="color-picker__value">{value}</span>
            </span>
        </label>
    );
});

ColorPicker.displayName = "ColorPicker";

export default ColorPicker;
