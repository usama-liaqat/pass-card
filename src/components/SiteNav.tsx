import { memo } from "react";
import { NavLink } from "react-router";
import { NAV_ITEMS } from "../routes/paths";

export const SiteNav = memo(() => {
    return (
        <nav aria-label="Main">
            <ul>
                {NAV_ITEMS.map(item => (
                    <li key={item.to}>
                        <NavLink to={item.to} end={item.end}>
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
