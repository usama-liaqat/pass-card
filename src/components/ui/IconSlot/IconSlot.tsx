import { memo } from "react";
import type { LucideIcon } from "lucide-react";

interface IconSlotProps {
    icon?: LucideIcon;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

/** Renders an optional decorative Lucide icon; renders nothing when none is given. */
export const IconSlot = memo<IconSlotProps>(({ icon: Icon, size = 16, strokeWidth = 2, className }) => {
    if (!Icon) return null;
    return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
});

IconSlot.displayName = "IconSlot";

export default IconSlot;
