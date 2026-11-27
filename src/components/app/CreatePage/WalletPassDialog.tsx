import { memo, useMemo } from "react";
import type { CSSProperties } from "react";
import { Lock } from "lucide-react";
import { Banner, Button, Dialog } from "../../ui";
import type { WalletCardData, WalletPlatform } from "../../ui";
import { PLATFORM_NAMES } from "./useWalletPassFlow";

const SIGNING_NOTES: Record<WalletPlatform, string> = {
    apple: "Apple Wallet only installs passes signed with an Apple Pass Type ID certificate. This browser-only build holds no signing keys, so sign the pass file with your own certificate to install it.",
    google: "Google Wallet needs an issuer account to turn this pass into a save link. Add the pass object through your own Google Wallet issuer account — no keys are stored here."
};

const DOWNLOAD_LABELS: Record<WalletPlatform, string> = {
    apple: "Download pass.json",
    google: "Download pass object (.json)"
};

interface WalletPassDialogProps {
    platform: WalletPlatform | null;
    card: WalletCardData;
    /** e.g. "bank account card". */
    cardLabel: string;
    /** Summary line under the card name, e.g. "Savings account · •••• 5678". */
    meta: string;
    onDownload: () => void;
    onClose: () => void;
}

/** "Wallet pass prepared": what was made, the signing note and the unsigned file download. */
export const WalletPassDialog = memo<WalletPassDialogProps>(
    ({ platform, card, cardLabel, meta, onDownload, onClose }) => {
        // Keep showing the last platform's text while the dialog animates closed.
        const shown: WalletPlatform = platform ?? "apple";
        const tileStyle = useMemo(
            () =>
                ({
                    "--pass-tile-bg": card.theme.bg,
                    "--pass-tile-fg": card.theme.fg,
                    "--pass-tile-border": card.theme.border
                }) as CSSProperties,
            [card.theme]
        );
        const monogram = useMemo(
            () => (card.logo.kind === "mono" ? card.logo.text : card.title.slice(0, 2).toUpperCase()),
            [card.logo, card.title]
        );
        const footer = useMemo(
            () => (
                <div className="pass-dialog__footer">
                    <Button variant="primary" size="lg" fullWidth onClick={onDownload}>
                        {DOWNLOAD_LABELS[shown]}
                    </Button>
                    <Button variant="ghost" size="lg" fullWidth onClick={onClose}>
                        Done
                    </Button>
                    <p className="pass-dialog__fine">Nothing was uploaded. Everything was created in your browser.</p>
                </div>
            ),
            [shown, onDownload, onClose]
        );

        return (
            <Dialog
                open={platform !== null}
                onClose={onClose}
                title="Wallet pass prepared"
                description={`Your ${cardLabel} layout is ready for ${PLATFORM_NAMES[shown]}.`}
                footer={footer}
            >
                <div className="pass-dialog__summary">
                    <span className="pass-dialog__tile" style={tileStyle} aria-hidden="true">
                        {monogram}
                    </span>
                    <span className="pass-dialog__text">
                        <span className="pass-dialog__name">{card.primary.value}</span>
                        <span className="pass-dialog__meta">{meta}</span>
                    </span>
                </div>
                <Banner tone="warn" icon={Lock}>
                    {SIGNING_NOTES[shown]}
                </Banner>
            </Dialog>
        );
    }
);

WalletPassDialog.displayName = "WalletPassDialog";

export default WalletPassDialog;
