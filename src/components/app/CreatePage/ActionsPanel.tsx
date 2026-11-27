import { Activity, memo, useCallback, useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { Download, FileDown, FileUp, Info, RotateCcw, ShieldCheck } from "lucide-react";
import { Button, Segmented, WalletButton } from "../../ui";
import type { SegmentedOption, WalletPlatform } from "../../ui";

export type CardImageFormat = "png" | "jpeg" | "svg";

const IMAGE_FORMATS: Array<SegmentedOption<CardImageFormat>> = [
    { id: "png", label: "PNG" },
    { id: "jpeg", label: "JPEG" },
    { id: "svg", label: "SVG" }
];

export interface ActionsPanelProps {
    preparing: WalletPlatform | null;
    onWallet: (platform: WalletPlatform) => void;
    /** Extra buttons, e.g. "Copy IBAN", laid out in a grid. */
    quickActions?: ReactNode;
    onDownloadImage: (format: CardImageFormat) => void;
    imageBusy?: boolean;
    /** Card-specific privacy note. */
    privacyNote: ReactNode;
    onExport: () => void;
    onImport: (file: File) => void;
    onReset: () => void;
}

export const ActionsPanel = memo<ActionsPanelProps>(
    ({
        preparing,
        onWallet,
        quickActions,
        onDownloadImage,
        imageBusy = false,
        privacyNote,
        onExport,
        onImport,
        onReset
    }) => {
        const [format, setFormat] = useState<CardImageFormat>("png");
        const importRef = useRef<HTMLInputElement>(null);
        const hasQuickActions = quickActions !== undefined && quickActions !== null;

        const addApple = useCallback(() => onWallet("apple"), [onWallet]);
        const addGoogle = useCallback(() => onWallet("google"), [onWallet]);
        const downloadImage = useCallback(() => onDownloadImage(format), [onDownloadImage, format]);
        const pickImport = useCallback(() => importRef.current?.click(), []);
        const handleImport = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) onImport(file);
            },
            [onImport]
        );

        return (
            <section className="create-panel actions-panel" aria-label="Save and share">
                <div className="actions-panel__wallet">
                    <div className="actions-panel__wallet-buttons">
                        <WalletButton
                            platform="apple"
                            onPress={addApple}
                            loading={preparing === "apple"}
                            disabled={preparing !== null}
                        />
                        <WalletButton
                            platform="google"
                            onPress={addGoogle}
                            loading={preparing === "google"}
                            disabled={preparing !== null}
                        />
                    </div>
                    <p className="actions-panel__note">
                        <Info size={14} aria-hidden="true" />
                        <span>
                            Wallet passes need your own signing setup. This browser-only build prepares the pass file;
                            it doesn’t hold signing keys.
                        </span>
                    </p>
                </div>

                <Activity mode={hasQuickActions ? "visible" : "hidden"}>
                    <div className="actions-panel__quick">{quickActions}</div>
                </Activity>

                <div className="actions-panel__image">
                    <div className="actions-panel__formats">
                        <Segmented
                            label="Image format"
                            fullWidth
                            size="sm"
                            options={IMAGE_FORMATS}
                            value={format}
                            onValueChange={setFormat}
                        />
                    </div>
                    <Button icon={Download} onClick={downloadImage} loading={imageBusy} loadingLabel="Saving…">
                        Download card
                    </Button>
                </div>

                <div className="actions-panel__privacy">
                    <ShieldCheck size={16} aria-hidden="true" />
                    <p>{privacyNote}</p>
                </div>

                <div className="actions-panel__setup">
                    <Button variant="ghost" size="sm" icon={FileDown} onClick={onExport}>
                        Export setup
                    </Button>
                    <Button variant="ghost" size="sm" icon={FileUp} onClick={pickImport}>
                        Import setup
                    </Button>
                    <input
                        ref={importRef}
                        type="file"
                        accept="application/json,.json"
                        className="sr-only"
                        tabIndex={-1}
                        aria-hidden="true"
                        onChange={handleImport}
                    />
                    <Button variant="ghost" size="sm" icon={RotateCcw} onClick={onReset}>
                        Reset form
                    </Button>
                </div>
            </section>
        );
    }
);

ActionsPanel.displayName = "ActionsPanel";

export default ActionsPanel;
