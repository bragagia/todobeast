const withPWA = require("next-pwa")({
  dest: "public",
});

module.exports = withPWA({
  //output: "export",
  //exclude: ["api", "middleware"],
  //
  // That was a try to rewrite all sub-url of app to the app, but it seems unecessary, keeping it there just in case
  // async rewrites() {
  //   return [
  //     // Rewrite everything else to use `pages/index`
  //     {
  //       source: "/a/:any*",
  //       destination: "/a/",
  //     },
  //     // Do not rewrite root routes
  //     {
  //       source: "/:any*",
  //       destination: "/:any*",
  //     },
  //   ];
  // },
});
