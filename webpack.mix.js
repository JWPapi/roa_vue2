const mix = require("laravel-mix");
const path = require("path");
const tailwindcss = require("tailwindcss");
const theme = path.basename(path.resolve());
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

mix
  .setPublicPath("public")
  .js("scripts/index.js", `js/${theme}.js`)
  .sourceMaps(mix.inProduction()) //, "eval-cheap-source-map", "hidden-source-map")
  .sass("styles/index.scss", `css/${theme}.css`)
  .options({
    processCssUrls: false,
    postCss: [tailwindcss("./tailwind.config.js")],
    terser: {
      extractComments: false,
      terserOptions: {
        output: {
          comments: false,
        },
      },
    },
  })
  .webpackConfig({
    watchOptions: {
      ignored: /node_modules/,
      poll: 1000,
    },
    plugins: [
      // new BundleAnalyzerPlugin()
    ],
  })
  .extract();

if (mix.inProduction()) {
  mix.version();
}
