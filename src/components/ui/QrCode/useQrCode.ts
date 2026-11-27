import { useMemo } from "react";
import { generateQr } from "../../../lib/qr";
import type { QrResult } from "../../../lib/qr";

/** Memoized QR generation, for callers that need the result (e.g. to show an overflow Banner). */
export const useQrCode = (value: string): QrResult => useMemo(() => generateQr(value), [value]);
