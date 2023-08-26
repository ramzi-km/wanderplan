/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{html,ts}",
  // "./node_modules/flowbite/**/*.js",
];
export const theme = {
  screens: {
    sm: "480px",
    md: "768px",
    lg: "976px",
    xl: "1440px",
  },
  extend: {
    colors: {
      primary: "var(--primary-color)",
      secondary: "var(--secondary-color)",
      accent: "var(--accent-color)",
      textp: "var(--textP-color)",
      texts: "var(--textS-color)",
      textg: "var(--textG-color)",
      bgclr: "var(--bg-color)",
      "disabled-color": "#ff0000",
    },
  },
};
export const daisyui = {
  themes: [
    {
      light: {
        // ...require("daisyui/src/theming/themes")["[data-theme=light]"],
        primary: "#03AF48", //primary
        secondary: "#ffffff", //secondary
        accent: "#1D7643", //accent
        "base-100": "#e6e6e6", //bg-color
        neutral: "#400000", //textS
        info: "#6C757D", //textG
        success: "#000000", //textP
      },
      dark: {
        // ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
        primary: "#03AF48", //primary
        secondary: "#222222", //secondary
        accent: "#1D7643", //accent
        "base-100": "#263238", //bg-color
        neutral: "#f5f5dc", //textS
        info: "#6C757D", //textG
        success: "#ffffff", //textP
      },
    },
  ],
};
export const plugins = [
  require("daisyui"), //require("flowbite/plugin")//
];
