import { use, useMemo } from "react";
import { generateQr } from "../../../lib/qr";
import type { QrResult } from "../../../lib/qr";
import { loadQrEngine } from "../../../lib/qrEngine";

/**
 * Memoized QR generation, for callers that need the result (e.g. to show an
 * overflow Banner). Suspends until the QR engine chunk has loaded; if it fails
 * to load, the error reaches the nearest route error boundary.
 */
export const useQrCode = (value: string): QrResult => {
    const qrcode = use(loadQrEngine());
    return useMemo(() => generateQr(qrcode, value), [qrcode, value]);
};
