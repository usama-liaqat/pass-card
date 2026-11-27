import { memo, useCallback, useMemo } from "react";
import { House, RotateCcw } from "lucide-react";
import { isRouteErrorResponse, useLocation, useNavigate, useRouteError } from "react-router";
import { useToast } from "../../app/toast";
import { StatusPage } from "../../components/app/StatusPage/StatusPage";
import type { StatusAction } from "../../components/app/StatusPage/StatusPage";
import { QrEngineLoadError, resetQrEngine } from "../../lib/qrEngine";
import { PATHS } from "../../routes/paths";

const HOME_ACTION: StatusAction = { label: "Go to homepage", icon: House, to: PATHS.home };

interface ErrorSummary {
    code: string;
    whatHappened: string;
}

const describeError = (error: unknown): ErrorSummary => {
    if (error instanceof QrEngineLoadError) {
        return {
            code: error.code,
            whatHappened: "the QR code engine didn’t load, so cards can’t be generated."
        };
    }
    if (isRouteErrorResponse(error)) {
        return { code: `HTTP_${error.status}`, whatHappened: error.statusText || "the page returned an error." };
    }
    if (error instanceof Error) {
        return { code: error.name || "Error", whatHappened: error.message || "an unexpected error occurred." };
    }
    return { code: "UNKNOWN", whatHappened: "an unexpected error occurred." };
};

/**
 * Route error boundary (React Router errorElement). Shows the error page with
 * technical details; drafts live outside the failed page, so nothing is lost.
 */
export const ErrorPage = memo(() => {
    const error = useRouteError();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const details = useMemo(() => {
        const summary = describeError(error);
        const time = new Date().toISOString().slice(0, 16).replace("T", " ");
        // No form data or personal details: only what went wrong and where.
        return [
            `Error: ${summary.code}`,
            `Page: ${pathname}`,
            `What happened: ${summary.whatHappened}`,
            `Time: ${time} UTC`,
            `Browser: ${navigator.userAgent.slice(0, 120)}`
        ].join("\n");
    }, [error, pathname]);

    // Navigating to the same path gives React Router a new location, which
    // resets the error boundary and renders the page again (re-fetching the
    // QR engine if that was what failed).
    const tryAgain = useCallback(() => {
        if (error instanceof QrEngineLoadError) resetQrEngine();
        navigate(pathname, { replace: true });
    }, [error, navigate, pathname]);

    const copyDetails = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(details);
            showToast("Error details copied — paste them into a bug report");
        } catch {
            showToast("Couldn’t copy. Select the details and copy them by hand.", "error");
        }
    }, [details, showToast]);

    const primary = useMemo<StatusAction>(
        () => ({ label: "Try again", icon: RotateCcw, onClick: tryAgain }),
        [tryAgain]
    );

    return (
        <div className="wrap page-enter">
            <StatusPage
                tone="error"
                code="Something went wrong"
                title="We couldn’t load this card"
                body="Passcard hit an unexpected problem while preparing your card. Nothing was lost — your drafts are still here in this tab. Try again, or reload if it keeps happening."
                primary={primary}
                secondary={HOME_ACTION}
                details={details}
                onCopyDetails={copyDetails}
                note="No personal details are included in the error report."
            />
        </div>
    );
});

ErrorPage.displayName = "ErrorPage";

export default ErrorPage;
