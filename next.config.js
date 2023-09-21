const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
  dynamicStartUrl: false,
  skipWaiting: false,
  scope: "/a",
});

module.exports = withPWA({});
