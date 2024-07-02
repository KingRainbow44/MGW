import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
    content: ["./src/**/*.{html,js,tsx,ts}"],
    mode: "jit",
    theme: {
        extend: {
            colors: {
                blue: "#067BC2",
                dark: "#00000060",

                // Palette colors.
                primary: "#ffffff",
                secondary: "#12130F",
                accent: "#7eaefc"
            },
            textShadow: {
                sm: "0 1px 2px var(--tw-shadow-color)",
                DEFAULT: "0 2px 4px var(--tw-shadow-color)",
                lg: "0 8px 16px var(--tw-shadow-color)",
            }
        }
    },
    darkMode: ["class", '[data-mode="dark"]'],
    plugins: [
        plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    'text-shadow': (value) => ({
                        textShadow: value,
                    }),
                },
                { values: theme('textShadow') }
            )
        }),
    ]
} as Config;
