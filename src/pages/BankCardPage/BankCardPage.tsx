import { Activity, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, QrCode, Share2 } from "lucide-react";
import { useToast } from "../../app/toast";
import { bankQrContent, bankDetailsText, buildBankCard } from "../../cards/bank/buildBankCard";
import { accountTypeLabel, resolveBank } from "../../cards/bank/bankState";
import { countRequiredDone, REQUIRED_KEYS, validateBank } from "../../cards/bank/bankValidation";
import type { BankErrorKey, BankErrors } from "../../cards/bank/bankValidation";
import { useBankDraft } from "../../cards/bank/useBankDraft";
import { getCardType } from "../../cards/cardTypes";
import { CreatePageLayout } from "../../components/app/CreatePage/CreatePageLayout";
import type { CardImageFormat } from "../../components/app/CreatePage/ActionsPanel";
import { Banner, Button } from "../../components/ui";
import { copyText, shareText } from "../../lib/clipboard";
import { dataUrlToBlob, saveFile, toFileSlug } from "../../lib/download";
import { canvasToBlob, drawPassCanvas, passSvg, qrPngBlob } from "../../lib/passImage";
import { AccountDetailsSection } from "./AccountDetailsSection";
import { BankAppearanceSection } from "./BankAppearanceSection";
import { BankInfoSection } from "./BankInfoSection";
import "./BankCardPage.css";

const CARD_TYPE = getCardType("bank");
const COPIED_MS = 1800;

const PRIVACY_NOTE =
    "This pass holds bank account details for receiving transfers. It isn’t a payment card and can’t be used to pay. Everything stays in this browser unless you download or export a file yourself.";

type CopiedKey = "copy" | "share" | null;

/** /bank-card: a pass that shares bank account details for receiving transfers. */
export const BankCardPage = memo(() => {
    const { showToast } = useToast();
    const { api, state, setForm, setLook, setQr, resetLook } = useBankDraft();
    const { form, look, qr } = state;

    const [showErrors, setShowErrors] = useState(false);
    const [touched, setTouched] = useState<Partial<Record<BankErrorKey, boolean>>>({});
    const [copied, setCopied] = useState<CopiedKey>(null);
    const [imageBusy, setImageBusy] = useState(false);
    const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        () => () => {
            if (copiedTimer.current) clearTimeout(copiedTimer.current);
        },
        []
    );

    const card = useMemo(() => buildBankCard(state), [state]);
    const errors = useMemo(() => validateBank(state), [state]);
    const errorCount = useMemo(() => Object.keys(errors).length, [errors]);
    // Errors show after the field is left, or for every field after a submit attempt.
    const shownErrors = useMemo<BankErrors>(
        () =>
            Object.fromEntries(
                Object.entries(errors).filter(([key]) => showErrors || touched[key as BankErrorKey])
            ) as BankErrors,
        [errors, showErrors, touched]
    );
    const progress = useMemo(() => ({ done: countRequiredDone(errors), total: REQUIRED_KEYS.length }), [errors]);
    const fileBase = useMemo(() => toFileSlug(form.title || "bank-account-card"), [form.title]);

    const touch = useCallback((key: BankErrorKey) => setTouched(current => ({ ...current, [key]: true })), []);

    const validate = useCallback(() => {
        setShowErrors(true);
        return errorCount === 0;
    }, [errorCount]);

    const clearErrors = useCallback(() => {
        setShowErrors(false);
        setTouched({});
    }, []);

    const markCopied = useCallback((key: CopiedKey) => {
        setCopied(key);
        if (copiedTimer.current) clearTimeout(copiedTimer.current);
        copiedTimer.current = setTimeout(() => setCopied(null), COPIED_MS);
    }, []);

    const copyDetails = useCallback(async () => {
        const text = bankDetailsText(state);
        if (!text) {
            showToast("Nothing to copy yet", "error");
            return;
        }
        if (await copyText(text)) {
            markCopied("copy");
            showToast("Account details copied");
        } else showToast("Your browser blocked the clipboard", "error");
    }, [state, markCopied, showToast]);

    const shareDetails = useCallback(async () => {
        const text = bankDetailsText(state);
        if (!text) {
            showToast("Nothing to share yet", "error");
            return;
        }
        const result = await shareText(resolveBank(form)?.name ?? "Bank account", text);
        if (result === "copied") {
            markCopied("share");
            showToast("Sharing isn’t available here — copied instead");
        } else if (result === "failed") showToast("Your browser blocked sharing and the clipboard", "error");
    }, [state, form, markCopied, showToast]);

    const downloadQr = useCallback(async () => {
        if (!qr.on) {
            showToast("Turn on the QR code first", "error");
            return;
        }
        if (qr.source === "upload") {
            if (!qr.img) {
                showToast("Upload your QR image first", "error");
                return;
            }
            saveFile(`${fileBase}-qr.png`, await dataUrlToBlob(qr.img));
            showToast("QR image downloaded");
            return;
        }
        const { text } = bankQrContent(state);
        if (!text) {
            showToast("Add details so there’s something to put in the QR", "error");
            return;
        }
        const blob = await qrPngBlob(text);
        if (!blob) {
            showToast("This content is too long for a QR code. Shorten it first", "error");
            return;
        }
        saveFile(`${fileBase}-qr.png`, blob);
        showToast("QR code downloaded");
    }, [qr, state, fileBase, showToast]);

    const downloadImage = useCallback(
        async (format: CardImageFormat) => {
            if (errorCount > 0) {
                setShowErrors(true);
                showToast(`Fix ${errorCount} field${errorCount > 1 ? "s" : ""} before downloading`, "error");
                return;
            }
            const platform = api.draft.platform;
            setImageBusy(true);
            try {
                if (format === "svg") {
                    saveFile(`${fileBase}-${platform}.svg`, await passSvg(card, platform), "image/svg+xml");
                } else {
                    const canvas = await drawPassCanvas(card, platform, format === "jpeg");
                    const type = format === "jpeg" ? "image/jpeg" : "image/png";
                    saveFile(
                        `${fileBase}-${platform}.${format === "jpeg" ? "jpg" : "png"}`,
                        await canvasToBlob(canvas, type)
                    );
                }
                showToast(`Card downloaded as ${format.toUpperCase()}`);
            } catch {
                showToast("Couldn’t save the image here", "error");
            } finally {
                setImageBusy(false);
            }
        },
        [errorCount, api.draft.platform, card, fileBase, showToast]
    );

    const passMeta = useMemo(() => {
        const type = accountTypeLabel(form);
        return [type ? `${type} account` : "", form.accNo ? `•••• ${form.accNo.slice(-4)}` : "", form.currency]
            .filter(Boolean)
            .join(" · ");
    }, [form]);

    const qrLine = useMemo(() => {
        if (!qr.on) return "";
        if (qr.source === "upload") {
            return qr.img ? "QR uses your uploaded image" : "Upload your QR image to show it on the card";
        }
        const labels: Record<string, string> = {
            iban: form.country === "US" ? "Routing number" : "IBAN",
            accno: "Account number",
            full: "All account details",
            raast: "Raast ID"
        };
        return `Scannable QR · ${labels[qr.content] ?? "IBAN"} · made on this device`;
    }, [qr, form.country]);

    const quickActions = useMemo(
        () => (
            <div className="bank-quick">
                <Button icon={copied === "copy" ? Check : Copy} onClick={copyDetails}>
                    {copied === "copy" ? "Copied" : "Copy details"}
                </Button>
                <Button icon={copied === "share" ? Check : Share2} onClick={shareDetails}>
                    {copied === "share" ? "Copied" : "Share"}
                </Button>
                <Button icon={QrCode} onClick={downloadQr}>
                    QR code
                </Button>
            </div>
        ),
        [copied, copyDetails, shareDetails, downloadQr]
    );

    const bannerTitle = useMemo(
        () =>
            `${errorCount} ${errorCount === 1 ? "field needs" : "fields need"} attention before we can prepare your pass`,
        [errorCount]
    );

    return (
        <CreatePageLayout
            cardType={CARD_TYPE}
            draftApi={api}
            card={card}
            progress={progress}
            validate={validate}
            passDescription="Bank account details"
            passMeta={passMeta}
            qrLine={qrLine}
            quickActions={quickActions}
            privacyNote={PRIVACY_NOTE}
            onDownloadImage={downloadImage}
            imageBusy={imageBusy}
            onReset={clearErrors}
        >
            <Activity mode={showErrors && errorCount > 0 ? "visible" : "hidden"}>
                <Banner tone="danger" title={bannerTitle}>
                    Fix the highlighted fields and try again. Your preview keeps updating while you edit.
                </Banner>
            </Activity>
            <BankInfoSection form={form} setForm={setForm} errors={shownErrors} onTouch={touch} />
            <AccountDetailsSection form={form} setForm={setForm} errors={shownErrors} onTouch={touch} />
            <BankAppearanceSection
                form={form}
                look={look}
                qr={qr}
                setLook={setLook}
                setQr={setQr}
                resetLook={resetLook}
                errors={shownErrors}
            />
        </CreatePageLayout>
    );
});

BankCardPage.displayName = "BankCardPage";

export default BankCardPage;
