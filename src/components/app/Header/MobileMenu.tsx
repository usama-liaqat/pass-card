import { Activity, memo } from "react";
import { House } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router";
import { CARD_TYPES } from "../../../cards/cardTypes";
import type { CardTypeId } from "../../../cards/cardTypes";
import { PATHS } from "../../../routes/paths";

interface MobileMenuProps {
    id: string;
    open: boolean;
    drafts: Record<CardTypeId, boolean>;
    onNavigate: () => void;
}

/** The panel behind the menu button below 980px: "All cards" plus every card page. */
export const MobileMenu = memo<MobileMenuProps>(({ id, open, drafts, onNavigate }) => {
    return (
        <Activity mode={open ? "visible" : "hidden"}>
            <nav id={id} className="mobile-menu" aria-label="Pages">
                <MobileMenuItem
                    to={PATHS.home}
                    end
                    icon={House}
                    label="All cards"
                    description="Start from the homepage"
                    draft={false}
                    onNavigate={onNavigate}
                />
                {CARD_TYPES.map(type => (
                    <MobileMenuItem
                        key={type.id}
                        to={type.route}
                        icon={type.icon}
                        label={type.navLabel}
                        description={type.description}
                        draft={drafts[type.id]}
                        onNavigate={onNavigate}
                    />
                ))}
            </nav>
        </Activity>
    );
});

MobileMenu.displayName = "MobileMenu";

interface MobileMenuItemProps {
    to: string;
    end?: boolean;
    icon: LucideIcon;
    label: string;
    description: string;
    draft: boolean;
    onNavigate: () => void;
}

const MobileMenuItem = memo<MobileMenuItemProps>(({ to, end, icon: Icon, label, description, draft, onNavigate }) => {
    return (
        <NavLink to={to} end={end} className="mobile-menu__item" onClick={onNavigate}>
            <span className="mobile-menu__tile" aria-hidden="true">
                <Icon size={17} />
            </span>
            <span className="mobile-menu__text">
                <span className="mobile-menu__label">{label}</span>
                <span className="mobile-menu__description">{description}</span>
            </span>
            <Activity mode={draft ? "visible" : "hidden"}>
                <span className="mobile-menu__draft">Draft</span>
            </Activity>
        </NavLink>
    );
});

MobileMenuItem.displayName = "MobileMenuItem";

export default MobileMenu;
