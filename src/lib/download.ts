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

/** Reads an image as a data URL, so it can be stored in the draft and drawn into exports. */
export const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error ?? new Error("Couldn’t read that file"));
        reader.readAsDataURL(file);
    });

/** Turns a data URL back into a Blob for download. */
export const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => (await fetch(dataUrl)).blob();

/** "Bank Alfalah" → "bank-alfalah", for download file names. */
export const toFileSlug = (value: string, fallback = "passcard"): string =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 48) || fallback;
