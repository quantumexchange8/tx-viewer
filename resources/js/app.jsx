import "../css/app.css";
import "../css/bootstrap.min.css";
import "../css/bootstrap-extended.css";
import "../css/extra-icons.css";
import "../css/pace.min.css";
import "../sass/main.scss";
import "../sass/blue-theme.scss";
import "../sass/bordered-theme.scss";
import "../sass/dark-theme.scss";
import "../sass/responsive.scss";
import "../sass/semi-dark.scss";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import AntThemeCustomizationProvider from "./Layouts/AntThemeCustomizationProvider";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <AntThemeCustomizationProvider>
                <App {...props} />
            </AntThemeCustomizationProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
