import { Activity, memo, useCallback, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import { useToast } from "../../../app/toast";
import type { CardTypeConfig } from "../../../cards/cardTypes";
import type { CardDraftApi } from "../../../cards/draftStore";
import { parseSetup, serializeSetup } from "../../../cards/setupFile";
import { saveFile, toFileSlug } from "../../../lib/download";
import { PATHS } from "../../../routes/paths";
import { useDeviceWallet } from "../../../lib/deviceWallet";
import { WalletButton } from "../../ui";
import type { WalletCardData, WalletCardView, WalletPlatform } from "../../ui";
import { ActionsPanel } from "./ActionsPanel";
import type { CardImageFormat } from "./ActionsPanel";
import { PreviewPanel } from "./PreviewPanel";
import { useWalletPassFlow } from "./useWalletPassFlow";
import { WalletPassDialog } from "./WalletPassDialog";
import "./CreatePage.css";

export interface CreatePageLayoutProps {
    cardType: CardTypeConfig;
    /** The card's draft from useCardDraft(); export, import and reset use it. */
    draftApi: CardDraftApi;
    /** The preview card built from the draft. */
    card: WalletCardData;
    /** Required fields filled vs total, for the progress bar. */
    progress: { done: number; total: number };
    /** Returns false and shows field errors when required details are missing. */
    validate: () => boolean;
    /** Pass description inside the pass file, e.g. "Bank account details". */
    passDescription: string;
    /** Summary under the card name in the "prepared" dialog. */
    passMeta: string;
    /** Caption under the preview; defaults to the generic pass layout name. */
    caption?: string;
    qrLine?: string;
    quickActions?: ReactNode;
    privacyNote: ReactNode;
    /** Replaces the default sticky bottom bar (two wallet buttons) below 980px. */
    mobileBar?: ReactNode;
    /** Card image export. Leave undefined until the page supports it. */
    onDownloadImage?: (format: CardImageFormat) => void;
    /** True while the card image is being drawn. */
    imageBusy?: boolean;
    /** Called after "Reset form" clears the draft, e.g. to clear shown errors. */
    onReset?: () => void;
    /** The form sections (put a validation Banner first if needed). */
    children: ReactNode;
}

const CAPTIONS: Record<WalletPlatform, string> = {
    apple: "Apple Wallet generic pass layout",
    google: "Google Wallet generic pass layout"
};

/**
 * Shared layout for every "create a card" page: back link, title, progress,
 * form column (55%) and a sticky preview + actions column (45%). Below 980px
 * it stacks preview-first and adds a sticky bottom action bar.
 */
export const CreatePageLayout = memo<CreatePageLayoutProps>(
    ({
        cardType,
        draftApi,
        card,
        progress,
        validate,
        passDescription,
        passMeta,
        caption,
        qrLine,
        quickActions,
        privacyNote,
        mobileBar,
        onDownloadImage,
        imageBusy = false,
        onReset,
        children
    }) => {
        const { showToast } = useToast();
        const { draft, setPreview, replace, reset } = draftApi;
        const flow = useWalletPassFlow({ card, description: passDescription, validate });

        const progressStyle = useMemo(
            () =>
                ({
                    "--progress": `${progress.total ? Math.round((progress.done / progress.total) * 100) : 0}%`
                }) as CSSProperties,
            [progress]
        );
        const progressClass = useMemo(
            () =>
                progress.done === progress.total
                    ? "create-intro__progress create-intro__progress--done"
                    : "create-intro__progress",
            [progress]
        );
        const cardLabel = useMemo(
            () => cardType.title.replace(/^(\w)(?=[a-z]+\s)/, letter => letter.toLowerCase()),
            [cardType.title]
        );

        const setPlatform = useCallback((platform: WalletPlatform) => setPreview({ platform }), [setPreview]);
        const setView = useCallback((view: WalletCardView) => setPreview({ view }), [setPreview]);
        const deviceWallet = useDeviceWallet();
        const addToWallet = useCallback(() => {
            if (deviceWallet) flow.start(deviceWallet);
        }, [deviceWallet, flow]);

        const exportSetup = useCallback(() => {
            saveFile(
                `${toFileSlug(cardType.route.slice(1))}-setup.json`,
                serializeSetup(cardType.id, draft),
                "application/json"
            );
            showToast("Setup exported");
        }, [cardType, draft, showToast]);

        const importSetup = useCallback(
            async (file: File) => {
                const result = parseSetup(await file.text(), cardType.id);
                if (!result.ok) {
                    showToast(result.message, "error");
                    return;
                }
                replace(result.draft);
                showToast("Setup imported");
            },
            [cardType.id, replace, showToast]
        );

        const resetForm = useCallback(() => {
            reset();
            onReset?.();
            showToast("Form reset");
        }, [reset, onReset, showToast]);

        const downloadImage = useCallback(
            (format: CardImageFormat) => {
                if (onDownloadImage) onDownloadImage(format);
                else showToast("Card image download isn’t available on this page yet", "error");
            },
            [onDownloadImage, showToast]
        );

        // Phones get their own wallet's button; desktops get no bar (unless a page supplies one).
        const defaultMobileBar = useMemo(
            () => (
                <WalletButton
                    platform={deviceWallet ?? "apple"}
                    onPress={addToWallet}
                    loading={flow.preparing !== null}
                    disabled={flow.preparing !== null}
                />
            ),
            [deviceWallet, addToWallet, flow.preparing]
        );
        const hasMobileBar = mobileBar !== undefined || deviceWallet !== null;

        return (
            <div className="create-page">
                <div className="wrap page-enter create-page__body">
                    <Link to={PATHS.home} className="create-page__back">
                        <ChevronLeft size={14} aria-hidden="true" />
                        All cards
                    </Link>

                    <div className="create-intro">
                        <div className="create-intro__text">
                            <h1 className="create-intro__title">{cardType.title}</h1>
                            <p className="create-intro__description">{cardType.description}</p>
                        </div>
                        <div className={progressClass} style={progressStyle}>
                            <div className="create-intro__progress-label">
                                <span>Required details</span>
                                <span className="create-intro__progress-count">
                                    {progress.done} of {progress.total}
                                </span>
                            </div>
                            <div
                                role="progressbar"
                                aria-label="Required details completed"
                                aria-valuemin={0}
                                aria-valuemax={progress.total}
                                aria-valuenow={progress.done}
                                className="create-intro__track"
                            >
                                <div className="create-intro__fill" />
                            </div>
                        </div>
                    </div>

                    <div className="create-layout">
                        <div className="create-layout__form">{children}</div>

                        <aside className="create-layout__preview" aria-label="Card preview and actions">
                            <PreviewPanel
                                card={card}
                                platform={draft.platform}
                                view={draft.view}
                                onPlatformChange={setPlatform}
                                onViewChange={setView}
                                caption={caption ?? CAPTIONS[draft.platform]}
                                qrLine={qrLine}
                                preparing={flow.preparing}
                            />
                            <ActionsPanel
                                preparing={flow.preparing}
                                onWallet={flow.start}
                                quickActions={quickActions}
                                onDownloadImage={downloadImage}
                                imageBusy={imageBusy}
                                privacyNote={privacyNote}
                                onExport={exportSetup}
                                onImport={importSetup}
                                onReset={resetForm}
                            />
                        </aside>
                    </div>
                </div>

                <Activity mode={hasMobileBar ? "visible" : "hidden"}>
                    <div className="create-mobile-bar">{mobileBar ?? defaultMobileBar}</div>
                </Activity>

                <WalletPassDialog
                    platform={flow.prepared}
                    card={card}
                    cardLabel={cardLabel}
                    meta={passMeta}
                    onDownload={flow.download}
                    onClose={flow.close}
                />
            </div>
        );
    }
);

CreatePageLayout.displayName = "CreatePageLayout";

export default CreatePageLayout;
