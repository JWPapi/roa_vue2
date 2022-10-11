const { colors, fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    outline: {
      none: "none",
    },
    extend: {
      screens: {
        md: "830px",
        lg: "1060px",
        "2xl": "1600px",
      },
      cursor: {
        cell: "cell",
      },
      backgroundOpacity: {
        10: "0.1",
        35: "0.35",
      },
      opacity: {
        10: "0.1",
      },
      scale: {
        "98": "0.98",
        "102": "1.02",
        "-100": "-1",
      },
      transitionTimingFunction: {
        "in-out-circ": "cubic-bezier(0.5, 0, 0.15, 1)",
        "out-exp": "cubic-bezier(0.16, 0.5, 0.3, 1)",
      },
      colors: {
        transparent: "rgba(255,255,255,0)",
        gray: {
          ...colors.gray,
          lightest: "#F4F5F8",
          solid: "#8A9095",
          light: "#D0D3D4",
          default: "#AEB6BD",
          darkest: "#2D2926",
          dark: "#4F4F4F",
        },
        red: {
          ...colors.red,
          default: "#F94223",
        },
        blue: {
          ...colors.blue,
          default: "#0072CE",
        },
        yellow: {
          ...colors.yellow,
          default: "#F9C81C",
        },
      },
      borderRadius: {
        default: "8px",
        sm: "1px",
        lg: "20px",
        full: "1000px",
      },
      borderWidth: {
        sm: "0.5px",
      },
      boxShadow: {
        default: "5px 10px 25px rgba(0, 0, 0, 0.1)",
        lg:
          "0 10px 15px -3px rgb(0 0 0 / 30%), 0 4px 6px -2px rgb(0 0 0 / 20%)",
      },
      spacing: {
        window: "calc(var(--vh) * 100)",
      },
      height: {
        "72": "18rem",
        "96": "24rem",
        "128": "32rem",
        "160": "40rem",
        "screen-third": "33vw",
        "screen-half": "50vw",
        hero: "calc(100vh - 15rem)",
      },
      maxHeight: {
        "56": "14rem",
        "72": "18rem",
        "96": "24rem",
        "160": "40rem",
      },
      maxWidth: {
        "1/3": "33.333333%",
      },
      width: {
        "72": "18rem",
        "96": "24rem",
      },
      letterSpacing: {
        wide: "0.05em",
        wider: "0.125em",
        widest: "0.1875em",
      },
      padding: {
        "1/1": "100%",
        ratio: "62.5%",
      },
      fontSize: {
        "3xs": "0.6875rem",
        "2xs": "0.75rem",
        xs: "0.8125rem",
      },
      fontFamily: {
        default: "Resist Sans Display",
        sans: ["Resist Sans Display", ...fontFamily.sans],
        script: ["Quisas", "Resist Sans Display", ...fontFamily.sans],
      },
      typography: (theme) => ({
        sm: {
          css: {
            color: theme("colors.gray.darkest"),
            fontSize: "14px",
            lineHeight: "20px",
            "blockquote p:first-of-type::before": {
              content: "open-quote",
            },
            "blockquote p:last-of-type::after": {
              content: "close-quote",
            },
            blockquote: {
              padding: "0 1em",
              margin: 0,
            },
          },
        },
        "sm-weak": {
          css: {
            color: theme("colors.gray.darkest"),
            fontSize: "14px",
            lineHeight: "20px",
            "blockquote p:first-of-type::before": {
              content: "open-quote",
            },
            "blockquote p:last-of-type::after": {
              content: "close-quote",
            },
            blockquote: {
              padding: "0 1em",
              margin: 0,
            },
            strong: {
              fontWeight: "inherit",
              color: "inherit",
            },
          },
        },
        weak: {
          css: {
            strong: {
              fontWeight: "inherit",
              color: "inherit",
            },
          },
        },
        light: {
          css: {
            color: theme("colors.gray.solid"),
            fontSize: "16px",
            lineHeight: "26px",
            a: {
              color: theme("colors.gray.darkest"),
            },
          },
        },
        default: {
          css: {
            color: theme("colors.gray.darkest"),
            fontSize: "16px",
            lineHeight: "22px",
            letterSpacing: "0.5px",
            strong: {
              fontWeight: 500,
              color: "inherit",
            },
            a: {
              color: theme("colors.gray.solid"),
              transition: "color 200ms",
              "&:hover": {
                color: theme("colors.gray.darkest"),
              },
            },
            h2: {
              fontSize: "20px",
              lineHeight: "26px",
              fontWeight: "500",
              textAlign: "left",
              color: "inherit",
            },
            h3: {
              fontSize: "20px",
              lineHeight: "26px",
              fontWeight: "400",
              textAlign: "left",
              color: "inherit",
            },

            blockquote: {
              fontSize: "26px",
              fontWeight: "400",
              fontStyle: "normal",
              color: "inherit",
              lineHeight: "32px",
              textAlign: "center",
              paddingLeft: "4rem",
              paddingRight: "4rem",
              borderLeftWidth: "0",
            },
          },
        },
      }),
    },
  },
  variants: {
    opacity: ({ after }) => after(["disabled", "group-hover", "group-focus"]),
    backgroundOpacity: ({ after }) => after(["group-hover", "group-focus"]),
    backgroundColor: ({ after }) => after(["group-hover", "group-focus"]),
    textColor: ({ after }) => after(["group-hover", "group-focus"]),
    borderWidth: ({ after }) => after(["last", "hover", "focus"]),
    borderColor: ({ after }) => after(["group-hover", "group-focus"]),
    padding: ({ after }) => after(["last", "first"]),
    margin: ({ after }) => after(["last", "focus"]),
    scale: ({ after }) => after(["group-hover", "group-focus"]),
  },
  plugins: [
    require("@tailwindcss/custom-forms"),
    require("@tailwindcss/typography"),
  ],
  future: {
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: [
      "./+(layouts|partials|templates)/**/*.html",
      "./scripts/**/*.vue",
      "./styles/**/*.scss",
    ],
  },
};
