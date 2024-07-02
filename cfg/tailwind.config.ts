import { Config } from "tailwindcss";

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
            }
        }
    },
    darkMode: ["class", '[data-mode="dark"]'],
    plugins: []
} as Config;
