/** Saves text or a Blob as a file. Everything stays in the browser. */
export const saveFile = (fileName: string, data: string | Blob, type = "application/octet-stream"): void => {
    const blob = typeof data === "string" ? new Blob([data], { type }) : data;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
    // Give the browser time to start the download before releasing the URL.
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
};

/** Reads a user-picked file as text. */
export const readFileText = (file: File): Promise<string> => file.text();

/** "Bank Alfalah" → "bank-alfalah", for download file names. */
export const toFileSlug = (value: string, fallback = "passcard"): string =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 48) || fallback;
