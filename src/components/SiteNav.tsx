import { memo } from "react";
import { NavLink } from "react-router";
import { NAV_ITEMS } from "../routes/paths";
import "./SiteNav.css";

export const SiteNav = memo(() => {
    return (
        <nav aria-label="Main" className="site-nav">
            <ul className="site-nav__list">
                {NAV_ITEMS.map(item => (
                    <li key={item.to}>
                        <NavLink to={item.to} end={item.end} className="site-nav__link">
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
});

SiteNav.displayName = "SiteNav";

export default SiteNav;
