import { Activity, memo, useCallback, useMemo, useState } from "react";
import { Palette, RotateCcw } from "lucide-react";
import { useToast } from "../../app/toast";
import { BANK_THEMES, countryById } from "../../cards/bank/bankData";
import type { BankQrContent, BankQrSource, BankThemeId } from "../../cards/bank/bankData";
import { resolveBank } from "../../cards/bank/bankState";
import type { BankForm, BankLook, BankQr } from "../../cards/bank/bankState";
import type { BankErrors } from "../../cards/bank/bankValidation";
import { themeColors } from "../../cards/bank/buildBankCard";
import {
    Banner,
    Button,
    ColorPicker,
    Field,
    ImageUpload,
    Segmented,
    SectionCard,
    Select,
    ThemeThumbnailGroup,
    Toggle
} from "../../components/ui";
import type { ImageUploadValue, SegmentedOption, SelectOption, ThumbnailTheme } from "../../components/ui";
import { blend, contrastRatio } from "../../lib/color";
import { readFileAsDataUrl } from "../../lib/download";

const LOGO_MAX_BYTES = 1024 * 1024;
const QR_IMAGE_MAX_BYTES = 2 * 1024 * 1024;
const CUSTOM_SWATCHES = ["#F04438", "#FDB022", "#2E90FA"];

const QR_SOURCE_OPTIONS: Array<SegmentedOption<BankQrSource>> = [
    { id: "generate", label: "Generate from details" },
    { id: "upload", label: "Upload my QR" }
];

type ShowKey = "showType" | "showAccNo" | "showIban" | "showBranch" | "showCurrency";

interface BankAppearanceSectionProps {
    form: BankForm;
    look: BankLook;
    qr: BankQr;
    setLook: (patch: Partial<BankLook>) => void;
    setQr: (patch: Partial<BankQr>) => void;
    resetLook: () => void;
    /** Shown errors (only qrImg applies here). */
    errors: BankErrors;
}

export const BankAppearanceSection = memo<BankAppearanceSectionProps>(
    ({ form, look, qr, setLook, setQr, resetLook, errors }) => {
        const { showToast } = useToast();
        const [logoError, setLogoError] = useState<string | undefined>(undefined);
        const country = countryById(form.country);
        const bank = useMemo(() => resolveBank(form), [form]);
        const current = useMemo(() => themeColors(look, bank), [look, bank]);

        const themes = useMemo<Array<ThumbnailTheme>>(
            () =>
                BANK_THEMES.map(theme => {
                    const colors = themeColors({ ...look, theme: theme.id }, bank);
                    return {
                        id: theme.id,
                        label: theme.label,
                        bg: colors.bg,
                        fg: colors.fg,
                        fg2: colors.fg2,
                        border: colors.border === "transparent" ? colors.bg : colors.border,
                        tileBg: theme.id === "bank" || !bank ? blend(colors.fg, colors.bg, 0.3) : bank.color,
                        tileFg: colors.fg,
                        avatarBg: colors.bg === "#FFFFFF" ? "#111114" : "#FFFFFF",
                        avatarFg: colors.bg,
                        swatches: theme.id === "custom" ? CUSTOM_SWATCHES : undefined
                    };
                }),
            [look, bank]
        );

        const pickTheme = useCallback((id: string) => setLook({ theme: id as BankThemeId }), [setLook]);

        // Editing any color switches to Custom, starting from the colors on screen.
        const setColor = useCallback(
            (key: "customBg" | "customFg" | "customFg2", value: string) =>
                setLook({
                    theme: "custom",
                    customBg: current.bg,
                    customFg: current.fg,
                    customFg2: current.fg2,
                    [key]: value.toUpperCase()
                }),
            [current, setLook]
        );
        const setBg = useCallback((value: string) => setColor("customBg", value), [setColor]);
        const setFg = useCallback((value: string) => setColor("customFg", value), [setColor]);
        const setFg2 = useCallback((value: string) => setColor("customFg2", value), [setColor]);
        const lowContrast = look.theme === "custom" && contrastRatio(look.customBg, look.customFg) < 3;

        const logoValue = useMemo<ImageUploadValue | null>(
            () => (look.logo ? { url: look.logo, name: look.logoName || "Logo" } : null),
            [look.logo, look.logoName]
        );
        const selectLogo = useCallback(
            async (file: File) => {
                if (file.size > LOGO_MAX_BYTES) {
                    setLogoError("That image is over 1 MB. Try a smaller file.");
                    return;
                }
                setLogoError(undefined);
                try {
                    setLook({ logo: await readFileAsDataUrl(file), logoName: file.name });
                    showToast("Logo added to your card");
                } catch {
                    showToast("Couldn’t read that file", "error");
                }
            },
            [setLook, showToast]
        );
        const removeLogo = useCallback(() => {
            setLook({ logo: "", logoName: "" });
            setLogoError(undefined);
        }, [setLook]);

        const toggles = useMemo<Array<{ key: ShowKey; label: string }>>(
            () => [
                { key: "showType", label: "Account type" },
                { key: "showAccNo", label: "Account number" },
                { key: "showIban", label: country.iban ? "IBAN" : "Routing number" },
                { key: "showBranch", label: country.branchLabel ?? "Branch code" },
                { key: "showCurrency", label: "Currency" }
            ],
            [country]
        );

        const qrOptions = useMemo<Array<SelectOption>>(
            () => [
                { id: "iban", label: country.iban ? "IBAN" : "Routing number", sub: "Best for bank transfers" },
                { id: "accno", label: "Account number", sub: "For same-bank transfers" },
                { id: "full", label: "All account details", sub: "Title, number, IBAN and bank" },
                {
                    id: "raast",
                    label: "Raast ID",
                    sub: country.raast
                        ? form.raast
                            ? "Instant payments via Raast"
                            : "Add a Raast ID first"
                        : "Only available in Pakistan",
                    disabled: !(country.raast && form.raast)
                }
            ],
            [country, form.raast]
        );
        const setQrOn = useCallback((on: boolean) => setQr({ on }), [setQr]);
        const setQrSource = useCallback((source: BankQrSource) => setQr({ source }), [setQr]);
        const setQrContent = useCallback((content: string) => setQr({ content: content as BankQrContent }), [setQr]);
        const setCaption = useCallback((caption: string) => setQr({ caption }), [setQr]);

        const qrImageValue = useMemo<ImageUploadValue | null>(
            () => (qr.img ? { url: qr.img, name: qr.imgName || "QR code" } : null),
            [qr.img, qr.imgName]
        );
        const selectQrImage = useCallback(
            async (file: File) => {
                if (file.size > QR_IMAGE_MAX_BYTES) {
                    showToast("That image is over 2 MB. Try a smaller file", "error");
                    return;
                }
                try {
                    setQr({ img: await readFileAsDataUrl(file), imgName: file.name, source: "upload", on: true });
                    showToast("Your QR code is now on the card");
                } catch {
                    showToast("Couldn’t read that file", "error");
                }
            },
            [setQr, showToast]
        );
        const removeQrImage = useCallback(() => {
            setQr({ img: "", imgName: "" });
            showToast("QR image removed");
        }, [setQr, showToast]);

        const handleReset = useCallback(() => {
            resetLook();
            setLogoError(undefined);
            showToast("Appearance reset to default");
        }, [resetLook, showToast]);
        const resetAction = useMemo(
            () => (
                <Button variant="ghost" size="sm" icon={RotateCcw} onClick={handleReset}>
                    Reset
                </Button>
            ),
            [handleReset]
        );

        return (
            <SectionCard
                icon={Palette}
                title="Card appearance"
                description="Applies to both Apple Wallet and Google Wallet."
                action={resetAction}
            >
                <div className="bank-block">
                    <div className="bank-block__title">Theme</div>
                    <ThemeThumbnailGroup
                        label="Card theme"
                        variant="swatch"
                        themes={themes}
                        value={look.theme}
                        onValueChange={pickTheme}
                    />
                </div>

                <div className="bank-block bank-block--divided">
                    <div className="bank-block__head">
                        <div className="bank-block__title">Colors</div>
                        <div className="bank-block__note">
                            {look.theme === "custom" ? "Custom theme" : "Editing switches to Custom"}
                        </div>
                    </div>
                    <div className="bank-grid3">
                        <ColorPicker name="Background" value={current.bg.toLowerCase()} onValueChange={setBg} />
                        <ColorPicker name="Primary text" value={current.fg.toLowerCase()} onValueChange={setFg} />
                        <ColorPicker name="Secondary text" value={current.fg2.toLowerCase()} onValueChange={setFg2} />
                    </div>
                    <Activity mode={lowContrast ? "visible" : "hidden"}>
                        <Banner tone="warn">
                            Text may be hard to read on this background. Try a lighter or darker text color.
                        </Banner>
                    </Activity>
                </div>

                <div className="bank-block bank-block--divided">
                    <ImageUpload
                        label="Logo"
                        value={logoValue}
                        onSelect={selectLogo}
                        onRemove={removeLogo}
                        prompt="Upload a custom logo"
                        hint="Square PNG, JPG or SVG, up to 1 MB. We use the bank’s mark by default."
                        description="Shown on both wallets in place of the bank mark"
                        error={logoError}
                    />
                </div>

                <div className="bank-block bank-block--divided">
                    <div className="bank-block__title">Show on card</div>
                    <div className="bank-toggles">
                        {toggles.map(toggle => (
                            <ShowToggle
                                key={toggle.key}
                                name={toggle.key}
                                label={toggle.label}
                                look={look}
                                setLook={setLook}
                            />
                        ))}
                    </div>
                    <div className="bank-block__note">
                        Empty optional fields are hidden automatically. Branch name, SWIFT, Raast ID and notes appear in
                        pass details.
                    </div>
                </div>

                <div className="bank-block bank-block--divided">
                    <Toggle
                        label="QR code"
                        sub="Lets others scan your details from your phone"
                        checked={qr.on}
                        onCheckedChange={setQrOn}
                    />
                    <Activity mode={qr.on ? "visible" : "hidden"}>
                        <div className="bank-block">
                            <Segmented
                                label="QR code source"
                                fullWidth
                                options={QR_SOURCE_OPTIONS}
                                value={qr.source}
                                onValueChange={setQrSource}
                            />
                            <Activity mode={qr.source === "generate" ? "visible" : "hidden"}>
                                <Select
                                    label="QR code contains"
                                    options={qrOptions}
                                    value={qr.content}
                                    onValueChange={setQrContent}
                                    searchable={false}
                                    hint="A real, scannable QR made on this device from your details."
                                />
                            </Activity>
                            <Activity mode={qr.source === "upload" ? "visible" : "hidden"}>
                                <div className="bank-block">
                                    <ImageUpload
                                        label="Your QR image"
                                        value={qrImageValue}
                                        onSelect={selectQrImage}
                                        onRemove={removeQrImage}
                                        prompt="Upload your QR code"
                                        hint="e.g. your Raast, bank app or payment QR. PNG or JPG, up to 2 MB."
                                        description="Shown on the pass exactly as uploaded"
                                        accept="image/png,image/jpeg,image/webp"
                                        error={errors.qrImg}
                                    />
                                    <Field
                                        label="Text under QR"
                                        optional
                                        value={qr.caption}
                                        onValueChange={setCaption}
                                        placeholder="Scan to pay"
                                        hint="A short line shown below the code on the pass."
                                        maxLength={30}
                                    />
                                </div>
                            </Activity>
                        </div>
                    </Activity>
                </div>
            </SectionCard>
        );
    }
);

BankAppearanceSection.displayName = "BankAppearanceSection";

interface ShowToggleProps {
    name: ShowKey;
    label: string;
    look: BankLook;
    setLook: (patch: Partial<BankLook>) => void;
}

const ShowToggle = memo<ShowToggleProps>(({ name, label, look, setLook }) => {
    const handleChange = useCallback((checked: boolean) => setLook({ [name]: checked }), [setLook, name]);
    return <Toggle label={label} checked={look[name]} onCheckedChange={handleChange} />;
});

ShowToggle.displayName = "ShowToggle";

export default BankAppearanceSection;
