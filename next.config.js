const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
  dynamicStartUrl: false,
  skipWaiting: false,
  scope: "/a",
  fallbacks: {
    //image: '/static/images/fallback.png',
    document: "/a",
    // font: '/static/font/fallback.woff2',
    // audio: ...,
    // video: ...,
  },
});

module.exports = withPWA({});
