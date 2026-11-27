import { Activity, memo, useMemo } from "react";
import { ArrowRight, Lock, QrCode, ShieldCheck, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { CARD_TYPES, createLabel } from "../../cards/cardTypes";
import type { CardTypeConfig } from "../../cards/cardTypes";
import { buildCardPreview } from "../../cards/cardPreview";
import { hasDraftContent, useAllDrafts } from "../../cards/draftStore";
import type { CardDraft } from "../../cards/draftStore";
import { WalletCard } from "../../components/ui";
import "./HomePage.css";

interface Feature {
    id: string;
    title: string;
    text: string;
    icon: LucideIcon;
}

const FEATURES: Array<Feature> = [
    {
        id: "private",
        title: "Private by design",
        text: "Everything is made in your browser. Nothing is uploaded or stored.",
        icon: ShieldCheck
    },
    {
        id: "qr",
        title: "Real, scannable QR codes",
        text: "Generated on your device for every card type.",
        icon: QrCode
    },
    {
        id: "wallets",
        title: "Apple & Google Wallet",
        text: "Wallet-ready layouts, plus images, contact files and pass files.",
        icon: Wallet
    }
];

export const HomePage = memo(() => {
    const drafts = useAllDrafts();

    return (
        <div className="home wrap page-enter">
            <div className="home__hero">
                <span className="home__chip">
                    <Lock size={13} aria-hidden="true" />
                    Free, open source and runs in your browser
                </span>
                <h1 className="home__title">Create your wallet card</h1>
                <p className="home__lead">
                    Personalized bank account, business, Wi-Fi and social cards for Apple Wallet and Google Wallet. Pick
                    a card to start — your drafts stay put while you move between pages.
                </p>
            </div>

            <div className="home__grid">
                {CARD_TYPES.map(type => (
                    <HomeCardTile key={type.id} type={type} draft={drafts[type.id]} />
                ))}
            </div>

            <ul className="home__features">
                {FEATURES.map(feature => (
                    <li key={feature.id} className="home__feature">
                        <span className="home__feature-icon" aria-hidden="true">
                            <feature.icon size={16} />
                        </span>
                        <span className="home__feature-text">
                            <span className="home__feature-title">{feature.title}</span>
                            <span className="home__feature-body">{feature.text}</span>
                        </span>
                    </li>
                ))}
            </ul>

            <p className="home__footnote">
                More card types — membership, loyalty and emergency contact — are on the way.
            </p>
        </div>
    );
});

HomePage.displayName = "HomePage";

interface HomeCardTileProps {
    type: CardTypeConfig;
    draft: CardDraft;
}

/** One link per card type, previewing the user's draft (or a sample) on their chosen wallet. */
const HomeCardTile = memo<HomeCardTileProps>(({ type, draft }) => {
    const Icon = type.icon;
    const card = useMemo(() => buildCardPreview(type.id, draft), [type.id, draft]);
    const hasDraft = useMemo(() => hasDraftContent(draft), [draft]);
    return (
        <Link to={type.route} className="home-tile">
            <span className="home-tile__stage">
                {/* Decorative preview: inert so its buttons can't be focused inside the link. */}
                <span className="home-tile__zoom" aria-hidden="true" inert>
                    <WalletCard card={card} platform={draft.platform} view="front" />
                </span>
                <Activity mode={hasDraft ? "visible" : "hidden"}>
                    <span className="home-tile__draft">
                        <span className="home-tile__dot" />
                        Draft in this tab
                    </span>
                </Activity>
            </span>
            <span className="home-tile__body">
                <span className="home-tile__icon" aria-hidden="true">
                    <Icon size={20} />
                </span>
                <span className="home-tile__text">
                    <span className="home-tile__name">{type.name}</span>
                    <span className="home-tile__description">{type.description}</span>
                    <span className="home-tile__cta">
                        {createLabel(type)}
                        <ArrowRight size={15} aria-hidden="true" />
                    </span>
                </span>
            </span>
        </Link>
    );
});

HomeCardTile.displayName = "HomeCardTile";

export default HomePage;
