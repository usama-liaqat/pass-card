import { Activity, memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FocusEvent, KeyboardEvent, Ref } from "react";
import { Check, ChevronDown, CircleAlert, Plus, Search } from "lucide-react";
import { classNames } from "../../../lib/classNames";
import { SelectLeadingView } from "./SelectLeading";
import type { SelectLeading } from "./SelectLeading";
import "./Select.css";

export interface SelectOption {
    id: string;
    label: string;
    /** Second line, e.g. a currency code. Also searched. */
    sub?: string;
    /** Extra search terms that are not displayed. */
    keywords?: string;
    disabled?: boolean;
    leading?: SelectLeading;
}

export interface SelectProps {
    label: string;
    options: Array<SelectOption>;
    value: string | null;
    onValueChange: (id: string) => void;
    placeholder?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    hint?: string;
    error?: string;
    optional?: boolean;
    hideLabel?: boolean;
    disabled?: boolean;
    /** Footer action text. "{query}" is replaced with the search text, e.g. "Add {query} manually". */
    footerLabel?: string;
    onFooterAction?: (query: string) => void;
    id?: string;
    ref?: Ref<HTMLButtonElement>;
}

const matches = (option: SelectOption, query: string) =>
    `${option.label} ${option.sub ?? ""} ${option.keywords ?? ""}`.toLowerCase().includes(query);

/** Next enabled index from `from` in direction `step`, or -1 if none. */
const nextEnabled = (list: Array<SelectOption>, from: number, step: 1 | -1): number => {
    for (let i = from; i >= 0 && i < list.length; i += step) {
        if (!list[i].disabled) return i;
    }
    return -1;
};

export const Select = memo<SelectProps>(
    ({
        label,
        options,
        value,
        onValueChange,
        placeholder = "Select…",
        searchable = true,
        searchPlaceholder = "Search",
        hint,
        error,
        optional = false,
        hideLabel = false,
        disabled = false,
        footerLabel,
        onFooterAction,
        id,
        ref
    }) => {
        const autoId = useId();
        const triggerId = id ?? autoId;
        const labelId = `${triggerId}-label`;
        const valueId = `${triggerId}-value`;
        const listboxId = `${triggerId}-listbox`;
        const hintId = `${triggerId}-hint`;
        const errorId = `${triggerId}-error`;

        const [open, setOpen] = useState(false);
        const [query, setQuery] = useState("");
        const [activeIndex, setActiveIndex] = useState(-1);

        const rootRef = useRef<HTMLDivElement>(null);
        const triggerRef = useRef<HTMLButtonElement>(null);
        const searchRef = useRef<HTMLInputElement>(null);
        const listboxRef = useRef<HTMLDivElement>(null);

        const trimmedQuery = useMemo(() => query.trim(), [query]);
        const shown = useMemo(() => {
            const q = trimmedQuery.toLowerCase();
            return q ? options.filter(option => matches(option, q)) : options;
        }, [options, trimmedQuery]);
        const selected = useMemo(() => options.find(option => option.id === value) ?? null, [options, value]);
        const activeOption = useMemo(() => shown[activeIndex] ?? null, [shown, activeIndex]);
        const activeId = useMemo(
            () => (open && activeOption ? `${listboxId}-${activeOption.id}` : undefined),
            [open, activeOption, listboxId]
        );
        const footerText = useMemo(() => {
            if (!footerLabel) return "";
            const quoted = trimmedQuery ? `“${trimmedQuery}”` : "";
            return footerLabel.replace("{query}", quoted).replace(/\s+/g, " ").trim();
        }, [footerLabel, trimmedQuery]);

        const hasError = Boolean(error);
        const hasHint = !hasError && Boolean(hint);
        const hasFooter = Boolean(footerLabel && onFooterAction);
        const describedBy = useMemo(
            () => (hasError ? errorId : hasHint ? hintId : undefined),
            [hasError, hasHint, errorId, hintId]
        );
        const triggerClass = useMemo(
            () =>
                classNames("select__trigger", open && "select__trigger--open", hasError && "select__trigger--invalid"),
            [open, hasError]
        );
        const labelClass = useMemo(() => classNames("select__label", hideLabel && "sr-only"), [hideLabel]);
        const valueClass = useMemo(() => classNames("select__value", !selected && "select__value--empty"), [selected]);

        const setTriggerRef = useCallback(
            (node: HTMLButtonElement | null) => {
                triggerRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) ref.current = node;
            },
            [ref]
        );

        const openList = useCallback(() => {
            if (disabled) return;
            const selectedIndex = options.findIndex(option => option.id === value && !option.disabled);
            setQuery("");
            setActiveIndex(selectedIndex >= 0 ? selectedIndex : nextEnabled(options, 0, 1));
            setOpen(true);
        }, [disabled, options, value]);

        const closeList = useCallback((returnFocus: boolean) => {
            setOpen(false);
            setQuery("");
            if (returnFocus) triggerRef.current?.focus();
        }, []);

        const pick = useCallback(
            (option: SelectOption) => {
                if (option.disabled) return;
                onValueChange(option.id);
                closeList(true);
            },
            [onValueChange, closeList]
        );

        const runFooter = useCallback(() => {
            onFooterAction?.(trimmedQuery);
            closeList(true);
        }, [onFooterAction, trimmedQuery, closeList]);

        // Move focus into the popup once it is shown.
        useEffect(() => {
            if (!open) return;
            if (searchable) searchRef.current?.focus();
            else listboxRef.current?.focus();
        }, [open, searchable]);

        // Close on a pointer press anywhere outside the control.
        useEffect(() => {
            if (!open) return undefined;
            const handlePointerDown = (event: PointerEvent) => {
                if (!rootRef.current?.contains(event.target as Node)) closeList(false);
            };
            document.addEventListener("pointerdown", handlePointerDown);
            return () => document.removeEventListener("pointerdown", handlePointerDown);
        }, [open, closeList]);

        // Keep the active option visible while arrowing through a long list.
        useEffect(() => {
            if (!activeId) return;
            document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
        }, [activeId]);

        const handleTriggerClick = useCallback(() => {
            if (open) closeList(false);
            else openList();
        }, [open, openList, closeList]);

        const handleTriggerKeyDown = useCallback(
            (event: KeyboardEvent<HTMLButtonElement>) => {
                if (open) return;
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    openList();
                }
            },
            [open, openList]
        );

        const handleListKeyDown = useCallback(
            (event: KeyboardEvent<HTMLElement>) => {
                switch (event.key) {
                    case "ArrowDown": {
                        event.preventDefault();
                        const next = nextEnabled(shown, activeIndex + 1, 1);
                        if (next >= 0) setActiveIndex(next);
                        break;
                    }
                    case "ArrowUp": {
                        event.preventDefault();
                        const prev = nextEnabled(shown, activeIndex - 1, -1);
                        if (prev >= 0) setActiveIndex(prev);
                        break;
                    }
                    case "Home":
                        if (!searchable) {
                            event.preventDefault();
                            setActiveIndex(nextEnabled(shown, 0, 1));
                        }
                        break;
                    case "End":
                        if (!searchable) {
                            event.preventDefault();
                            setActiveIndex(nextEnabled(shown, shown.length - 1, -1));
                        }
                        break;
                    case "Enter":
                        event.preventDefault();
                        if (activeOption) pick(activeOption);
                        else if (hasFooter && shown.length === 0) runFooter();
                        break;
                    case "Escape":
                        event.preventDefault();
                        event.stopPropagation();
                        closeList(true);
                        break;
                    default:
                        break;
                }
            },
            [shown, activeIndex, activeOption, searchable, hasFooter, pick, runFooter, closeList]
        );

        const handleSearch = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const next = event.target.value;
                const q = next.trim().toLowerCase();
                const nextShown = q ? options.filter(option => matches(option, q)) : options;
                setQuery(next);
                setActiveIndex(nextEnabled(nextShown, 0, 1));
            },
            [options]
        );

        // Close when keyboard focus leaves the whole control (e.g. Tab away).
        const handleBlur = useCallback(
            (event: FocusEvent<HTMLDivElement>) => {
                if (!open) return;
                const next = event.relatedTarget as Node | null;
                if (next && !rootRef.current?.contains(next)) closeList(false);
            },
            [open, closeList]
        );

        const handleHover = useCallback((index: number) => setActiveIndex(index), []);

        return (
            <div ref={rootRef} className="select" onBlur={handleBlur}>
                <div id={labelId} className={labelClass}>
                    {label}
                    <Activity mode={optional && !hideLabel ? "visible" : "hidden"}>
                        <span className="select__tag">Optional</span>
                    </Activity>
                </div>
                <div className="select__control">
                    <button
                        ref={setTriggerRef}
                        id={triggerId}
                        type="button"
                        className={triggerClass}
                        disabled={disabled}
                        aria-haspopup="listbox"
                        aria-expanded={open}
                        aria-controls={open ? listboxId : undefined}
                        aria-labelledby={`${labelId} ${valueId}`}
                        aria-invalid={hasError}
                        aria-describedby={describedBy}
                        onClick={handleTriggerClick}
                        onKeyDown={handleTriggerKeyDown}
                    >
                        <Activity mode={selected?.leading ? "visible" : "hidden"}>
                            <SelectedLeading option={selected} />
                        </Activity>
                        <span id={valueId} className={valueClass}>
                            {selected?.label ?? placeholder}
                        </span>
                        <ChevronDown size={16} className="select__chevron" aria-hidden="true" />
                    </button>

                    <Activity mode={open ? "visible" : "hidden"}>
                        <div className="select__menu">
                            <Activity mode={searchable ? "visible" : "hidden"}>
                                <div className="select__search">
                                    <Search size={16} className="select__search-icon" aria-hidden="true" />
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        role="combobox"
                                        aria-label={searchPlaceholder}
                                        aria-expanded={open}
                                        aria-controls={listboxId}
                                        aria-autocomplete="list"
                                        aria-activedescendant={activeId}
                                        placeholder={searchPlaceholder}
                                        value={query}
                                        onChange={handleSearch}
                                        onKeyDown={handleListKeyDown}
                                        autoComplete="off"
                                        spellCheck={false}
                                        className="select__search-input"
                                    />
                                </div>
                            </Activity>
                            <div
                                ref={listboxRef}
                                id={listboxId}
                                role="listbox"
                                aria-labelledby={labelId}
                                aria-activedescendant={searchable ? undefined : activeId}
                                tabIndex={searchable ? undefined : -1}
                                onKeyDown={searchable ? undefined : handleListKeyDown}
                                className="select__list"
                            >
                                {shown.map((option, index) => (
                                    <SelectOptionRow
                                        key={option.id}
                                        id={`${listboxId}-${option.id}`}
                                        option={option}
                                        index={index}
                                        selected={option.id === value}
                                        active={index === activeIndex}
                                        onPick={pick}
                                        onHover={handleHover}
                                    />
                                ))}
                                <Activity mode={shown.length === 0 ? "visible" : "hidden"}>
                                    <div className="select__empty">No matches for “{trimmedQuery}”</div>
                                </Activity>
                            </div>
                            <Activity mode={hasFooter ? "visible" : "hidden"}>
                                <button type="button" className="select__footer" onClick={runFooter}>
                                    <Plus size={15} aria-hidden="true" />
                                    <span className="select__footer-text">{footerText}</span>
                                </button>
                            </Activity>
                        </div>
                    </Activity>
                </div>
                <Activity mode={hasError ? "visible" : "hidden"}>
                    <div id={errorId} className="select__error" role="alert">
                        <CircleAlert size={14} aria-hidden="true" />
                        <span>{error}</span>
                    </div>
                </Activity>
                <Activity mode={hasHint ? "visible" : "hidden"}>
                    <div id={hintId} className="select__hint">
                        {hint}
                    </div>
                </Activity>
            </div>
        );
    }
);

Select.displayName = "Select";

interface SelectedLeadingProps {
    option: SelectOption | null;
}

const SelectedLeading = memo<SelectedLeadingProps>(({ option }) => {
    if (!option?.leading) return null;
    return <SelectLeadingView leading={option.leading} variant="trigger" />;
});

SelectedLeading.displayName = "SelectedLeading";

interface SelectOptionRowProps {
    id: string;
    option: SelectOption;
    index: number;
    selected: boolean;
    active: boolean;
    onPick: (option: SelectOption) => void;
    onHover: (index: number) => void;
}

const SelectOptionRow = memo<SelectOptionRowProps>(({ id, option, index, selected, active, onPick, onHover }) => {
    const className = useMemo(
        () =>
            classNames(
                "select__option",
                selected && "select__option--selected",
                active && "select__option--active",
                option.disabled && "select__option--disabled"
            ),
        [selected, active, option.disabled]
    );
    const handleClick = useCallback(() => onPick(option), [onPick, option]);
    const handleMouseMove = useCallback(() => {
        if (!option.disabled && !active) onHover(index);
    }, [option.disabled, active, onHover, index]);
    // Keep focus in the search box or listbox when an option is pressed.
    const preventFocusMove = useCallback((event: { preventDefault: () => void }) => event.preventDefault(), []);
    const hasSub = Boolean(option.sub);

    return (
        <div
            id={id}
            role="option"
            aria-selected={selected}
            aria-disabled={option.disabled || undefined}
            className={className}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseDown={preventFocusMove}
        >
            <SelectedLeading option={option} />
            <span className="select__option-text">
                <span className="select__option-label">{option.label}</span>
                <Activity mode={hasSub ? "visible" : "hidden"}>
                    <span className="select__option-sub">{option.sub}</span>
                </Activity>
            </span>
            <Activity mode={selected ? "visible" : "hidden"}>
                <Check size={16} strokeWidth={2.25} className="select__check" aria-hidden="true" />
            </Activity>
        </div>
    );
});

SelectOptionRow.displayName = "SelectOptionRow";

export default Select;
