import { memo } from "react";
import type { ComponentType } from "react";
import { Lock, Moon, Sun } from "lucide-react";
import { Badge, Button } from "../../components/ui";
import { ThemeScope, useTheme } from "../../theme";
import {
    AppearanceDemo,
    ButtonsDemo,
    ControlsDemo,
    FieldsDemo,
    OverlaysDemo,
    QrDemo,
    SectionDemo,
    SelectDemo,
    StatusDemo,
    WalletButtonsDemo,
    WalletCardDemo
} from "./demos";
import "./ComponentsPage.css";

interface ShowcaseSection {
    id: string;
    title: string;
    description: string;
    Demo: ComponentType;
}

const SECTIONS: Array<ShowcaseSection> = [
    {
        id: "button",
        title: "Button",
        description: "Primary, secondary, ghost, sizes, icon-only and loading.",
        Demo: ButtonsDemo
    },
    {
        id: "field",
        title: "Field",
        description: "Labels with Optional/Required tags, hints, errors, password, textarea and mono.",
        Demo: FieldsDemo
    },
    {
        id: "select",
        title: "Select",
        description: "Searchable listbox with flags, monograms, icon tiles, disabled options and a footer action.",
        Demo: SelectDemo
    },
    {
        id: "controls",
        title: "Toggle and Segmented",
        description: "Switches with sub-text; md, sm and full-width segments.",
        Demo: ControlsDemo
    },
    {
        id: "section",
        title: "SectionCard and Disclosure",
        description: "Form sections with an icon tile and action; an expandable group with a count badge.",
        Demo: SectionDemo
    },
    { id: "status", title: "Banner and Badge", description: "Danger, warn, success and info.", Demo: StatusDemo },
    {
        id: "overlays",
        title: "Toast and Dialog",
        description: "Live-region toasts and a modal dialog (Escape closes it).",
        Demo: OverlaysDemo
    },
    {
        id: "appearance",
        title: "ThemeThumbnail, ColorPicker and ImageUpload",
        description: "Card theme radios, color rows and a logo upload that stays in the browser.",
        Demo: AppearanceDemo
    },
    {
        id: "wallet-button",
        title: "WalletButton",
        description: "Placeholder Add to Wallet buttons until the official badge artwork is added.",
        Demo: WalletButtonsDemo
    },
    {
        id: "qr",
        title: "QrCode",
        description: "Real QR codes in UTF-8 byte mode, level M falling back to L, with a 4-module quiet zone.",
        Demo: QrDemo
    },
    {
        id: "wallet-card",
        title: "WalletCard",
        description: "Apple and Google generic pass layouts, front and details. Use the info button to flip.",
        Demo: WalletCardDemo
    }
];

export const ComponentsPage = memo(() => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="showcase">
            <header className="showcase__header">
                <div className="showcase__intro">
                    <h1 className="showcase__title">Components</h1>
                    <p className="showcase__lead">
                        Passcard’s design system. Every component is shown in light and dark with sample data.
                    </p>
                </div>
                <div className="showcase__tools">
                    <Badge icon={Lock}>Runs in your browser</Badge>
                    <Button
                        variant="ghost"
                        iconOnly
                        icon={isDark ? Sun : Moon}
                        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                        onClick={toggleTheme}
                    />
                </div>
            </header>

            <nav className="showcase__toc" aria-label="Components on this page">
                {SECTIONS.map(section => (
                    <a key={section.id} href={`#${section.id}`} className="showcase__toc-link">
                        {section.title}
                    </a>
                ))}
            </nav>

            {SECTIONS.map(section => (
                <ShowcaseBlock key={section.id} section={section} />
            ))}
        </div>
    );
});

ComponentsPage.displayName = "ComponentsPage";

interface ShowcaseBlockProps {
    section: ShowcaseSection;
}

const ShowcaseBlock = memo<ShowcaseBlockProps>(({ section }) => {
    const { Demo } = section;
    return (
        <section id={section.id} className="showcase__section" aria-labelledby={`${section.id}-title`}>
            <div className="showcase__section-head">
                <h2 id={`${section.id}-title`} className="showcase__section-title">
                    {section.title}
                </h2>
                <p className="showcase__section-desc">{section.description}</p>
            </div>
            <div className="showcase__pair">
                <ThemeScope theme="light" className="showcase__pane">
                    <div className="showcase__pane-label">Light</div>
                    <Demo />
                </ThemeScope>
                <ThemeScope theme="dark" className="showcase__pane">
                    <div className="showcase__pane-label">Dark</div>
                    <Demo />
                </ThemeScope>
            </div>
        </section>
    );
});

ShowcaseBlock.displayName = "ShowcaseBlock";

export default ComponentsPage;
