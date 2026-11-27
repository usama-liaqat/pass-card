import type qrcodeFactory from "qrcode-generator";

export type QrFactory = typeof qrcodeFactory;

/** Thrown (to the route error boundary) when the QR library chunk can't be loaded. */
export class QrEngineLoadError extends Error {
    readonly code = "QR_ENGINE_LOAD_FAILED";

    constructor(cause: unknown) {
        super("The QR code engine didn't load.", { cause });
        this.name = "QrEngineLoadError";
    }
}

let enginePromise: Promise<QrFactory> | null = null;

/**
 * Loads qrcode-generator as a separate chunk. The promise is cached so React's
 * use() sees the same instance on every render. A failure stays cached too:
 * use() then throws it to the error boundary, instead of every render starting
 * a new request and suspending forever. Call resetQrEngine() before retrying.
 */
export const loadQrEngine = (): Promise<QrFactory> => {
    enginePromise ??= import("qrcode-generator").then(
        module => module.default,
        (error: unknown) => {
            throw new QrEngineLoadError(error);
        }
    );
    return enginePromise;
};

/** Forgets a failed load so the next render requests the chunk again ("Try again"). */
export const resetQrEngine = (): void => {
    enginePromise = null;
};

/** Starts loading early without risking an unhandled rejection. */
export const preloadQrEngine = (): void => {
    loadQrEngine().catch(() => undefined);
};
