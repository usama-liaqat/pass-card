/*
 * Class name builder, ported from clsx (MIT, © Luke Edwards):
 * https://github.com/lukeed/clsx/blob/master/src/index.js
 */

export type ClassDictionary = Record<string, unknown>;
export type ClassArray = Array<ClassValue>;
export type ClassValue = ClassArray | ClassDictionary | string | number | bigint | null | boolean | undefined;

const toVal = (mix: ClassValue): string => {
    let str = "";

    if (typeof mix === "string" || typeof mix === "number" || typeof mix === "bigint") {
        str += mix;
    } else if (typeof mix === "object" && mix !== null) {
        if (Array.isArray(mix)) {
            for (const item of mix) {
                if (!item) continue;
                const value = toVal(item);
                if (value) {
                    if (str) str += " ";
                    str += value;
                }
            }
        } else {
            for (const key in mix) {
                if (mix[key]) {
                    if (str) str += " ";
                    str += key;
                }
            }
        }
    }

    return str;
};

/**
 * Joins class names from strings, numbers, arrays (nested) and objects
 * whose truthy values enable their keys. Falsy values are skipped.
 *
 * classNames("btn", isActive && "btn--active", { "btn--full": fullWidth }, ["a", ["b"]])
 */
export const classNames = (...inputs: Array<ClassValue>): string => {
    let str = "";

    for (const input of inputs) {
        if (!input) continue;
        const value = toVal(input);
        if (value) {
            if (str) str += " ";
            str += value;
        }
    }

    return str;
};
