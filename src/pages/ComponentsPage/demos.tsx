import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Lock, Palette, Plus, QrCode as QrCodeIcon, RotateCcw, Trash2 } from "lucide-react";
import {
    Badge,
    Banner,
    Button,
    ColorPicker,
    Dialog,
    Disclosure,
    Field,
    ImageUpload,
    QrCode,
    SectionCard,
    Segmented,
    Select,
    ThemeThumbnailGroup,
    Toast,
    Toggle,
    WalletButton,
    WalletCard,
    useQrCode
} from "../../components/ui";
import type {
    ImageUploadValue,
    SegmentedOption,
    SelectOption,
    ToastTone,
    WalletCardView,
    WalletPlatform
} from "../../components/ui";
import {
    ACCOUNT_TYPE_OPTIONS,
    BANK_OPTIONS,
    CARD_SAMPLE_OPTIONS,
    CARD_THEMES,
    COUNTRY_OPTIONS,
    SAMPLE_CARDS,
    THUMBNAIL_SAMPLE
} from "./sampleData";

const noop = () => undefined;

/* Buttons ---------------------------------------------------------------- */

export const ButtonsDemo = memo(() => {
    const [loading, setLoading] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startLoading = useCallback(() => {
        setLoading(true);
        timerRef.current = setTimeout(() => setLoading(false), 1600);
    }, []);

    useEffect(
        () => () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        },
        []
    );

    return (
        <div className="demo-stack">
            <div className="demo-row">
                <Button variant="primary">Create pass</Button>
                <Button>Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="primary" disabled>
                    Disabled
                </Button>
            </div>
            <div className="demo-row">
                <Button size="sm" icon={RotateCcw} variant="ghost">
                    Reset
                </Button>
                <Button size="lg" icon={Plus}>
                    Add field
                </Button>
                <Button iconOnly icon={Trash2} aria-label="Delete card" variant="ghost" />
                <Button iconOnly icon={Lock} aria-label="Lock card" />
            </div>
            <div className="demo-row">
                <Button variant="primary" loading={loading} loadingLabel="Creating pass…" onClick={startLoading}>
                    Click to load
                </Button>
                <Button loading iconOnly icon={Plus} aria-label="Saving" />
            </div>
        </div>
    );
});

ButtonsDemo.displayName = "ButtonsDemo";

/* Fields ----------------------------------------------------------------- */

export const FieldsDemo = memo(() => {
    const [title, setTitle] = useState("Ayesha Raza Khan");
    const [iban, setIban] = useState("PK83 ALFH 0055");
    const [password, setPassword] = useState("sunflower-42");
    const [notes, setNotes] = useState("");
    const [search, setSearch] = useState("");

    const ibanError = useMemo(
        () => (iban.replace(/\s/g, "").length < 24 ? "IBAN should be 24 characters for Pakistan." : undefined),
        [iban]
    );

    return (
        <div className="demo-grid2">
            <Field
                label="Account title"
                required
                value={title}
                onValueChange={setTitle}
                placeholder="e.g. Ayesha Raza Khan"
                hint="The name the account is held in."
                maxLength={70}
            />
            <Field
                label="IBAN"
                mono
                value={iban}
                onValueChange={setIban}
                placeholder="PK00 XXXX 0000 0000 0000 0000"
                error={ibanError}
                maxLength={42}
            />
            <Field
                label="Wi-Fi password"
                type="password"
                value={password}
                onValueChange={setPassword}
                hint="Use the eye button to check it."
            />
            <Field
                label="Search banks"
                hideLabel
                value={search}
                onValueChange={setSearch}
                placeholder="Search banks (visually hidden label)"
                inputMode="search"
            />
            <div className="demo-span2">
                <Field
                    label="Additional notes"
                    optional
                    type="textarea"
                    value={notes}
                    onValueChange={setNotes}
                    placeholder="e.g. Please share the transfer receipt on WhatsApp."
                    maxLength={200}
                />
            </div>
        </div>
    );
});

FieldsDemo.displayName = "FieldsDemo";

/* Select ----------------------------------------------------------------- */

export const SelectDemo = memo(() => {
    const [country, setCountry] = useState<string | null>("PK");
    const [bank, setBank] = useState<string | null>(null);
    const [type, setType] = useState<string | null>("current");
    const [customBanks, setCustomBanks] = useState<Array<SelectOption>>([]);

    const bankOptions = useMemo(() => [...BANK_OPTIONS, ...customBanks], [customBanks]);
    const addBank = useCallback((query: string) => {
        const label = query || "My bank";
        const id = `custom-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        setCustomBanks(current =>
            current.some(option => option.id === id)
                ? current
                : [
                      ...current,
                      {
                          id,
                          label,
                          sub: "Added manually",
                          leading: { kind: "mono", text: label.slice(0, 2).toUpperCase(), bg: "#52525B", fg: "#FFFFFF" }
                      }
                  ]
        );
        setBank(id);
    }, []);

    return (
        <div className="demo-grid2">
            <Select
                label="Country"
                options={COUNTRY_OPTIONS}
                value={country}
                onValueChange={setCountry}
                searchPlaceholder="Search countries"
                hint="Flags, sub-labels and a disabled option."
            />
            <Select
                label="Bank"
                options={bankOptions}
                value={bank}
                onValueChange={setBank}
                placeholder="Choose your bank"
                searchPlaceholder="Search banks"
                footerLabel="Add {query} manually"
                onFooterAction={addBank}
                error={bank ? undefined : "Choose a bank or add it manually."}
            />
            <Select
                label="Account type"
                options={ACCOUNT_TYPE_OPTIONS}
                value={type}
                onValueChange={setType}
                searchable={false}
            />
            <Select
                label="Branch"
                optional
                options={ACCOUNT_TYPE_OPTIONS}
                value={null}
                onValueChange={noop}
                disabled
                placeholder="Pick a bank first"
            />
        </div>
    );
});

SelectDemo.displayName = "SelectDemo";

/* Toggle + Segmented ----------------------------------------------------- */

const PLATFORM_OPTIONS: Array<SegmentedOption<WalletPlatform>> = [
    { id: "apple", label: "Apple Wallet" },
    { id: "google", label: "Google Wallet" }
];

const VIEW_OPTIONS: Array<SegmentedOption<WalletCardView>> = [
    { id: "front", label: "Front" },
    { id: "details", label: "Details" }
];

export const ControlsDemo = memo(() => {
    const [showIban, setShowIban] = useState(true);
    const [showQr, setShowQr] = useState(false);
    const [platform, setPlatform] = useState<WalletPlatform>("apple");
    const [view, setView] = useState<WalletCardView>("front");
    const [platformFull, setPlatformFull] = useState<WalletPlatform>("google");

    return (
        <div className="demo-stack">
            <div className="demo-toggles">
                <Toggle label="Show IBAN" checked={showIban} onCheckedChange={setShowIban} />
                <Toggle label="Show QR code" sub="Scan to copy the IBAN" checked={showQr} onCheckedChange={setShowQr} />
                <Toggle
                    label="Show Raast ID"
                    sub="Add a Raast ID first"
                    checked={false}
                    onCheckedChange={noop}
                    disabled
                />
            </div>
            <div className="demo-row">
                <Segmented
                    label="Wallet platform"
                    options={PLATFORM_OPTIONS}
                    value={platform}
                    onValueChange={setPlatform}
                />
                <Segmented label="Card side" size="sm" options={VIEW_OPTIONS} value={view} onValueChange={setView} />
            </div>
            <Segmented
                label="Wallet platform, full width"
                fullWidth
                options={PLATFORM_OPTIONS}
                value={platformFull}
                onValueChange={setPlatformFull}
            />
        </div>
    );
});

ControlsDemo.displayName = "ControlsDemo";

/* SectionCard + Disclosure ----------------------------------------------- */

export const SectionDemo = memo(() => {
    const [branch, setBranch] = useState("F-7 Markaz, Islamabad");
    const [swift, setSwift] = useState("ALFHPKKA");
    const [nickname, setNickname] = useState("");

    const count = useMemo(() => [branch, swift, nickname].filter(Boolean).length, [branch, swift, nickname]);
    const summary = useMemo(
        () => (count ? "Branch, SWIFT / BIC, nickname" : "Branch, SWIFT / BIC, Raast ID, notes"),
        [count]
    );
    const resetAction = useMemo(
        () => (
            <Button variant="ghost" size="sm" icon={RotateCcw}>
                Reset
            </Button>
        ),
        []
    );

    return (
        <div className="demo-stack">
            <SectionCard
                icon={Palette}
                title="Card appearance"
                description="Applies to both Apple Wallet and Google Wallet."
                action={resetAction}
            >
                <Disclosure
                    title="Additional details"
                    summary={summary}
                    count={count}
                    hasError={swift.length > 0 && swift.length < 8}
                >
                    <div className="demo-grid2">
                        <Field label="Branch name" optional value={branch} onValueChange={setBranch} />
                        <Field
                            label="SWIFT / BIC"
                            optional
                            mono
                            value={swift}
                            onValueChange={setSwift}
                            maxLength={11}
                            error={
                                swift.length > 0 && swift.length < 8 ? "SWIFT codes are 8 or 11 characters." : undefined
                            }
                        />
                        <Field label="Account nickname" optional value={nickname} onValueChange={setNickname} />
                    </div>
                </Disclosure>
            </SectionCard>
            <SectionCard
                icon={QrCodeIcon}
                iconTone="accent"
                title="Contact QR code"
                description="Anyone can scan it with their phone camera. No app or account needed."
            />
        </div>
    );
});

SectionDemo.displayName = "SectionDemo";

/* Banners + Badges ------------------------------------------------------- */

export const StatusDemo = memo(() => {
    return (
        <div className="demo-stack">
            <Banner tone="danger" title="3 fields need attention">
                Fix the highlighted fields and try again. Your preview keeps updating while you edit.
            </Banner>
            <Banner tone="warn" title="Not signed yet">
                Apple Wallet needs a signed pass. Download the pass.json to sign it yourself.
            </Banner>
            <Banner tone="success">Bank details applied from your IBAN.</Banner>
            <Banner tone="info" title="Runs in your browser">
                Nothing you type is uploaded. Your draft stays in this tab.
            </Banner>
            <div className="demo-row">
                <Badge>Neutral</Badge>
                <Badge tone="accent">2 added</Badge>
                <Badge tone="success">Valid</Badge>
                <Badge tone="warn">Unsigned</Badge>
                <Badge tone="danger">Check</Badge>
                <Badge tone="neutral" icon={Lock}>
                    Private
                </Badge>
            </div>
        </div>
    );
});

StatusDemo.displayName = "StatusDemo";

/* Toast + Dialog --------------------------------------------------------- */

export const OverlaysDemo = memo(() => {
    const [toast, setToast] = useState<{ message: string; tone: ToastTone } | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const showSuccess = useCallback(() => setToast({ message: "IBAN copied", tone: "success" }), []);
    const showError = useCallback(() => setToast({ message: "That image is over 1 MB", tone: "error" }), []);
    const dismissToast = useCallback(() => setToast(null), []);
    const openDialog = useCallback(() => setDialogOpen(true), []);
    const closeDialog = useCallback(() => setDialogOpen(false), []);
    const confirmDialog = useCallback(() => {
        setDialogOpen(false);
        setToast({ message: "Pass downloaded", tone: "success" });
    }, []);

    const footer = useMemo(
        () => (
            <div className="demo-dialog-footer">
                <Button variant="primary" size="lg" fullWidth onClick={confirmDialog}>
                    Download pass.json
                </Button>
                <Button variant="ghost" size="lg" fullWidth onClick={closeDialog}>
                    Done
                </Button>
            </div>
        ),
        [confirmDialog, closeDialog]
    );

    return (
        <div className="demo-row">
            <Button onClick={showSuccess}>Show success toast</Button>
            <Button onClick={showError}>Show error toast</Button>
            <Button variant="primary" onClick={openDialog}>
                Open dialog
            </Button>
            <Toast message={toast?.message ?? null} tone={toast?.tone} onDismiss={dismissToast} />
            <Dialog
                open={dialogOpen}
                onClose={closeDialog}
                title="Wallet pass prepared"
                description="Your Apple Wallet pass is ready. Signing happens on your device."
                footer={footer}
            >
                <Banner tone="warn">Apple requires a signed pass before it opens in Wallet.</Banner>
            </Dialog>
        </div>
    );
});

OverlaysDemo.displayName = "OverlaysDemo";

/* ColorPicker + ImageUpload + ThemeThumbnail ----------------------------- */

const MAX_IMAGE_BYTES = 1024 * 1024;

export const AppearanceDemo = memo(() => {
    const [background, setBackground] = useState("#18181B");
    const [text, setText] = useState("#FFFFFF");
    const [label, setLabel] = useState("#A1A1AA");
    const [theme, setTheme] = useState("graphite");
    const [logo, setLogo] = useState<ImageUploadValue | null>(null);
    const [logoError, setLogoError] = useState<string | undefined>(undefined);

    // Revoke the previous preview URL when it is replaced or removed.
    useEffect(() => {
        if (!logo) return undefined;
        return () => URL.revokeObjectURL(logo.url);
    }, [logo]);

    const selectLogo = useCallback((file: File) => {
        if (file.size > MAX_IMAGE_BYTES) {
            setLogoError("That image is over 1 MB. Try a smaller PNG or SVG.");
            return;
        }
        setLogoError(undefined);
        setLogo({ url: URL.createObjectURL(file), name: file.name });
    }, []);
    const removeLogo = useCallback(() => {
        setLogo(null);
        setLogoError(undefined);
    }, []);

    return (
        <div className="demo-stack">
            <ThemeThumbnailGroup
                label="Business card theme"
                themes={CARD_THEMES}
                value={theme}
                onValueChange={setTheme}
                sample={THUMBNAIL_SAMPLE}
            />
            <div className="demo-grid3">
                <ColorPicker name="Background" value={background} onValueChange={setBackground} />
                <ColorPicker name="Text" value={text} onValueChange={setText} />
                <ColorPicker name="Labels" value={label} onValueChange={setLabel} />
            </div>
            <ImageUpload
                label="Logo"
                value={logo}
                onSelect={selectLogo}
                onRemove={removeLogo}
                prompt="Upload a custom logo"
                hint="Square PNG, JPG or SVG, up to 1 MB. We use the bank’s mark by default."
                description="Shown on both wallets in place of the bank mark"
                error={logoError}
            />
        </div>
    );
});

AppearanceDemo.displayName = "AppearanceDemo";

/* Wallet buttons --------------------------------------------------------- */

export const WalletButtonsDemo = memo(() => {
    const [busy, setBusy] = useState<WalletPlatform | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const press = useCallback((platform: WalletPlatform) => {
        setBusy(platform);
        timerRef.current = setTimeout(() => setBusy(null), 1600);
    }, []);
    const pressApple = useCallback(() => press("apple"), [press]);
    const pressGoogle = useCallback(() => press("google"), [press]);

    useEffect(
        () => () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        },
        []
    );

    return (
        <div className="demo-stack">
            <div className="demo-grid2">
                <WalletButton
                    platform="apple"
                    onPress={pressApple}
                    loading={busy === "apple"}
                    disabled={busy === "google"}
                />
                <WalletButton
                    platform="google"
                    onPress={pressGoogle}
                    loading={busy === "google"}
                    disabled={busy === "apple"}
                />
            </div>
            <div className="demo-grid2">
                <WalletButton platform="apple" onPress={noop} loading />
                <WalletButton platform="google" onPress={noop} disabled />
            </div>
        </div>
    );
});

WalletButtonsDemo.displayName = "WalletButtonsDemo";

/* QR code ---------------------------------------------------------------- */

const LONG_TEXT = "Passcard ✓ ".repeat(260);

export const QrDemo = memo(() => {
    const [value, setValue] = useState("WIFI:T:WPA;S:Khan Family 5G;P:sunflower-42;;");
    const result = useQrCode(value);
    const fillLong = useCallback(() => setValue(LONG_TEXT), []);
    const fillUnicode = useCallback(() => setValue("مرحبا · Grüße · こんにちは · 🙂"), []);

    const status = useMemo(() => {
        if (result.status === "ok")
            return `Version ${(result.size - 8 - 17) / 4} · level ${result.level} · ${result.size - 8} modules`;
        if (result.status === "empty") return "Type something to make a QR code.";
        return "";
    }, [result]);

    return (
        <div className="demo-qr">
            <div className="demo-qr__codes">
                <QrCode value={value} size={160} label="Showcase QR" />
                <QrCode value={value} size={96} label="Showcase QR, small" />
            </div>
            <div className="demo-stack">
                <Field
                    label="QR content"
                    type="textarea"
                    value={value}
                    onValueChange={setValue}
                    hint={status}
                    error={
                        result.status === "overflow"
                            ? "Too long for a QR code. Shorten the text or use a link."
                            : undefined
                    }
                />
                <div className="demo-row">
                    <Button size="sm" onClick={fillUnicode}>
                        Non-Latin text
                    </Button>
                    <Button size="sm" onClick={fillLong}>
                        Too long
                    </Button>
                </div>
            </div>
        </div>
    );
});

QrDemo.displayName = "QrDemo";

/* Wallet card ------------------------------------------------------------ */

type SampleId = keyof typeof SAMPLE_CARDS;

export const WalletCardDemo = memo(() => {
    const [sample, setSample] = useState<string | null>("bank");
    const [platform, setPlatform] = useState<WalletPlatform>("apple");
    const [view, setView] = useState<WalletCardView>("front");

    const card = useMemo(() => SAMPLE_CARDS[(sample ?? "bank") as SampleId], [sample]);

    return (
        <div className="demo-stack">
            <div className="demo-grid2">
                <Select
                    label="Sample card"
                    options={CARD_SAMPLE_OPTIONS}
                    value={sample}
                    onValueChange={setSample}
                    searchable={false}
                />
                <div className="demo-controls">
                    <Segmented
                        label="Wallet platform"
                        fullWidth
                        options={PLATFORM_OPTIONS}
                        value={platform}
                        onValueChange={setPlatform}
                    />
                    <Segmented
                        label="Card side"
                        fullWidth
                        size="sm"
                        options={VIEW_OPTIONS}
                        value={view}
                        onValueChange={setView}
                    />
                </div>
            </div>
            <div className="demo-stage">
                <WalletCard card={card} platform={platform} view={view} onViewChange={setView} />
            </div>
        </div>
    );
});

WalletCardDemo.displayName = "WalletCardDemo";
