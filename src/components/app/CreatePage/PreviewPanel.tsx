import { Activity, memo, useCallback } from "react";
import { LoaderCircle, QrCode } from "lucide-react";
import { Segmented, WalletCard } from "../../ui";
import type { SegmentedOption, WalletCardData, WalletCardView, WalletPlatform } from "../../ui";
import { PLATFORM_NAMES } from "./useWalletPassFlow";

const PLATFORM_OPTIONS: Array<SegmentedOption<WalletPlatform>> = [
    { id: "apple", label: "Apple Wallet" },
    { id: "google", label: "Google Wallet" }
];

const VIEW_OPTIONS: Array<SegmentedOption<WalletCardView>> = [
    { id: "front", label: "Front" },
    { id: "details", label: "Details" }
];

export interface PreviewPanelProps {
    card: WalletCardData;
    platform: WalletPlatform;
    view: WalletCardView;
    onPlatformChange: (platform: WalletPlatform) => void;
    onViewChange: (view: WalletCardView) => void;
    /** Under the card, e.g. "Apple Wallet generic pass layout". */
    caption: string;
    /** Optional line about the QR code content. */
    qrLine?: string;
    /** Shows "Preparing your … pass" over the stage. */
    preparing: WalletPlatform | null;
}

export const PreviewPanel = memo<PreviewPanelProps>(
    ({ card, platform, view, onPlatformChange, onViewChange, caption, qrLine, preparing }) => {
        const hasQrLine = Boolean(qrLine);
        const handlePlatform = useCallback(
            (next: WalletPlatform) => {
                onPlatformChange(next);
            },
            [onPlatformChange]
        );

        return (
            <section className="create-panel" aria-labelledby="live-preview-title">
                <div className="preview-panel__head">
                    <div className="preview-panel__title">
                        <span className="preview-panel__live" aria-hidden="true" />
                        <h2 id="live-preview-title" className="preview-panel__heading">
                            Live preview
                        </h2>
                    </div>
                    <Segmented
                        label="Wallet platform"
                        options={PLATFORM_OPTIONS}
                        value={platform}
                        onValueChange={handlePlatform}
                    />
                </div>

                <div className="preview-panel__stage">
                    <WalletCard card={card} platform={platform} view={view} onViewChange={onViewChange} />
                    <Activity mode={preparing ? "visible" : "hidden"}>
                        <div className="preview-panel__preparing" role="status">
                            <LoaderCircle size={14} strokeWidth={2.5} className="spin" aria-hidden="true" />
                            Preparing your {preparing ? PLATFORM_NAMES[preparing] : ""} pass…
                        </div>
                    </Activity>
                </div>

                <div className="preview-panel__foot">
                    <Segmented
                        label="Card side"
                        size="sm"
                        options={VIEW_OPTIONS}
                        value={view}
                        onValueChange={onViewChange}
                    />
                    <span className="preview-panel__caption">{caption}</span>
                </div>

                <Activity mode={hasQrLine ? "visible" : "hidden"}>
                    <div className="preview-panel__qr-line">
                        <QrCode size={15} aria-hidden="true" />
                        <span>{qrLine}</span>
                    </div>
                </Activity>
            </section>
        );
    }
);

PreviewPanel.displayName = "PreviewPanel";

export default PreviewPanel;
