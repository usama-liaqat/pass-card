import { Activity, memo, useCallback, useMemo, useState } from "react";
import { Construction } from "lucide-react";
import { CreatePageLayout } from "../../components/app/CreatePage/CreatePageLayout";
import { getCardType } from "../../cards/cardTypes";
import type { CardTypeId } from "../../cards/cardTypes";
import { useCardDraft } from "../../cards/draftStore";
import type { CardDraftApi } from "../../cards/draftStore";
import { Banner, Field, SectionCard } from "../../components/ui";
import { PLACEHOLDER_CONFIG, buildPlaceholderCard } from "../../cards/placeholderCards";
import type { PlaceholderField } from "../../cards/placeholderCards";
import "./CardPlaceholderPage.css";

interface CardPlaceholderPageProps {
    typeId: CardTypeId;
}

/** A card page built on the shared create-page layout, with a few temporary fields. */
export const CardPlaceholderPage = memo<CardPlaceholderPageProps>(({ typeId }) => {
    const cardType = getCardType(typeId);
    const config = PLACEHOLDER_CONFIG[typeId];
    const draftApi = useCardDraft(typeId);
    const { draft } = draftApi;
    const [showErrors, setShowErrors] = useState(false);

    const required = useMemo(() => config.fields.filter(field => field.required), [config]);
    const missing = useMemo(
        () => required.filter(field => !draft.form[field.id]?.trim()).map(field => field.id),
        [required, draft.form]
    );
    const progress = useMemo(
        () => ({ done: required.length - missing.length, total: required.length }),
        [required.length, missing.length]
    );
    const card = useMemo(() => buildPlaceholderCard(typeId, draft), [typeId, draft]);
    const passMeta = useMemo(
        () =>
            config.fields
                .slice(1)
                .filter(field => field.type !== "password")
                .map(field => draft.form[field.id]?.trim())
                .filter(Boolean)
                .join(" · "),
        [config.fields, draft.form]
    );

    const validate = useCallback(() => {
        setShowErrors(true);
        return missing.length === 0;
    }, [missing.length]);

    const showBanner = showErrors && missing.length > 0;
    const bannerTitle = useMemo(
        () =>
            `${missing.length} ${missing.length === 1 ? "field needs" : "fields need"} attention before we can prepare your pass`,
        [missing.length]
    );

    return (
        <CreatePageLayout
            cardType={cardType}
            draftApi={draftApi}
            card={card}
            progress={progress}
            validate={validate}
            passDescription={config.passDescription}
            passMeta={passMeta}
            privacyNote={config.privacyNote}
        >
            <Activity mode={showBanner ? "visible" : "hidden"}>
                <Banner tone="danger" title={bannerTitle}>
                    Fix the highlighted fields and try again. Your preview keeps updating while you edit.
                </Banner>
            </Activity>
            <SectionCard
                icon={cardType.icon}
                title="Card details"
                description="A few fields to try the layout. The full form for this card is coming next."
            >
                <div className="placeholder-fields">
                    {config.fields.map(field => (
                        <PlaceholderInput
                            key={field.id}
                            field={field}
                            draftApi={draftApi}
                            showError={showErrors && missing.includes(field.id)}
                        />
                    ))}
                </div>
            </SectionCard>
            <SectionCard
                icon={Construction}
                title="More options on the way"
                description="Appearance, QR code and extra details arrive with the full page."
            >
                <Banner tone="info">What you type here stays in this tab while you move between pages.</Banner>
            </SectionCard>
        </CreatePageLayout>
    );
});

CardPlaceholderPage.displayName = "CardPlaceholderPage";

interface PlaceholderInputProps {
    field: PlaceholderField;
    draftApi: CardDraftApi;
    showError: boolean;
}

const PlaceholderInput = memo<PlaceholderInputProps>(({ field, draftApi, showError }) => {
    const { draft, update } = draftApi;
    const handleChange = useCallback((next: string) => update("form", { [field.id]: next }), [update, field.id]);

    return (
        <Field
            label={field.label}
            value={draft.form[field.id] ?? ""}
            onValueChange={handleChange}
            placeholder={field.placeholder}
            type={field.type ?? "text"}
            required={field.required}
            optional={!field.required}
            mono={field.mono}
            inputMode={field.inputMode}
            maxLength={field.maxLength}
            error={showError ? `Enter the ${field.label.toLowerCase()}.` : undefined}
        />
    );
});

PlaceholderInput.displayName = "PlaceholderInput";

export default CardPlaceholderPage;
