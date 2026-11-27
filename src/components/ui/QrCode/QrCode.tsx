import { Activity, Suspense, memo, useEffect, useEffectEvent, useMemo } from "react";
import { useQrCode } from "./useQrCode";
import "./QrCode.css";

export interface QrCodeProps {
    /** Text to encode (UTF-8, byte mode). */
    value: string;
    /** Rendered width and height in px, quiet zone included. */
    size?: number;
    /** Accessible description, e.g. "Scan to copy IBAN". */
    label: string;
    /** Called whenever the content starts or stops fitting in a QR code. */
    onOverflowChange?: (overflow: boolean) => void;
    /** Text shown in place of the code when the content is too long. */
    overflowText?: string;
}

/** Shows a loading placeholder while the QR engine chunk downloads. */
export const QrCode = memo<QrCodeProps>(props => {
    return (
        <Suspense fallback={<QrPlaceholder size={props.size ?? 132} text="Loading QR code…" tone="pending" />}>
            <QrCodeContent {...props} />
        </Suspense>
    );
});

QrCode.displayName = "QrCode";

const QrCodeContent = memo<QrCodeProps>(
    ({ value, size = 132, label, onOverflowChange, overflowText = "Too long for a QR code" }) => {
        const result = useQrCode(value);
        const overflow = result.status === "overflow";
        const path = result.status === "ok" ? result.path : "";
        const viewBox = useMemo(
            () => (result.status === "ok" ? `0 0 ${result.size} ${result.size}` : "0 0 1 1"),
            [result]
        );
        const reportOverflow = useEffectEvent((next: boolean) => onOverflowChange?.(next));

        useEffect(() => {
            reportOverflow(overflow);
        }, [overflow]);

        return (
            <span className="qr">
                <Activity mode={result.status === "ok" ? "visible" : "hidden"}>
                    <svg
                        viewBox={viewBox}
                        width={size}
                        height={size}
                        role="img"
                        aria-label={`QR code: ${label}`}
                        shapeRendering="crispEdges"
                        className="qr__svg"
                    >
                        <rect width="100%" height="100%" className="qr__bg" />
                        <path d={path || undefined} className="qr__modules" />
                    </svg>
                </Activity>
                <Activity mode={overflow ? "visible" : "hidden"}>
                    <QrPlaceholder size={size} text={overflowText} tone="error" />
                </Activity>
            </span>
        );
    }
);

QrCodeContent.displayName = "QrCodeContent";

interface QrPlaceholderProps {
    size: number;
    text: string;
    tone: "pending" | "error";
}

export const QrPlaceholder = memo<QrPlaceholderProps>(({ size, text, tone }) => {
    const style = useMemo(() => ({ width: size, height: size }), [size]);
    return (
        <span className="qr-placeholder" data-tone={tone} style={style} role="img" aria-label={text}>
            {text}
        </span>
    );
});

QrPlaceholder.displayName = "QrPlaceholder";

export default QrCode;
