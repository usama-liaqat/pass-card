import { Activity, memo, useCallback, useEffect, useId, useRef, useState } from "react";
import { CreditCard, Lock, Menu, Moon, Sun, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";
import { CARD_TYPES } from "../../../cards/cardTypes";
import { useDraftFlags } from "../../../cards/draftStore";
import { PATHS } from "../../../routes/paths";
import { useTheme } from "../../../theme";
import { Button } from "../../ui";
import { MobileMenu } from "./MobileMenu";
import "./Header.css";

export const Header = memo(() => {
    const { theme, toggleTheme } = useTheme();
    const drafts = useDraftFlags();
    const { pathname } = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuId = useId();
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const isDark = theme === "dark";

    const toggleMenu = useCallback(() => setMenuOpen(open => !open), []);
    const closeMenu = useCallback(() => setMenuOpen(false), []);

    // Close the menu after navigating.
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Escape closes the menu and returns focus to its button.
    useEffect(() => {
        if (!menuOpen) return undefined;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            setMenuOpen(false);
            menuButtonRef.current?.focus();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [menuOpen]);

    return (
        <header className="app-header">
            <div className="app-header__bar wrap">
                <Link to={PATHS.home} className="app-header__brand" aria-label="Passcard home">
                    <span className="app-header__logo" aria-hidden="true">
                        <CreditCard size={17} />
                    </span>
                    <span className="app-header__name">Passcard</span>
                </Link>

                <nav className="app-header__nav" aria-label="Card types">
                    {CARD_TYPES.map(type => (
                        <NavLink key={type.id} to={type.route} className="app-header__link">
                            <type.icon size={15} aria-hidden="true" />
                            {type.navLabel}
                            <Activity mode={drafts[type.id] && !type.comingSoon ? "visible" : "hidden"}>
                                <span className="app-header__dot" title="Draft kept in this tab">
                                    <span className="sr-only">(draft)</span>
                                </span>
                            </Activity>
                            <Activity mode={type.comingSoon ? "visible" : "hidden"}>
                                <span className="soon-tag">Soon</span>
                            </Activity>
                        </NavLink>
                    ))}
                </nav>

                <div className="app-header__spacer" />

                <div className="app-header__tools">
                    <span className="app-header__chip">
                        <Lock size={13} aria-hidden="true" />
                        Runs in your browser
                    </span>
                    <Button
                        variant="ghost"
                        iconOnly
                        icon={isDark ? Sun : Moon}
                        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                        onClick={toggleTheme}
                    />
                    <Button
                        ref={menuButtonRef}
                        variant="ghost"
                        iconOnly
                        icon={menuOpen ? X : Menu}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls={menuId}
                        className="app-header__menu-button"
                        onClick={toggleMenu}
                    />
                </div>
            </div>
            <MobileMenu id={menuId} open={menuOpen} drafts={drafts} onNavigate={closeMenu} />
        </header>
    );
});

Header.displayName = "Header";

export default Header;
