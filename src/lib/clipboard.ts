/** Copies text; resolves false when the browser blocks the clipboard. */
export const copyText = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
};

export type ShareResult = "shared" | "cancelled" | "copied" | "failed";

/** Opens the native share sheet when there is one, otherwise copies the text. */
export const shareText = async (title: string, text: string): Promise<ShareResult> => {
    if (typeof navigator.share === "function") {
        try {
            await navigator.share({ title, text });
            return "shared";
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
        }
    }
    return (await copyText(text)) ? "copied" : "failed";
};
