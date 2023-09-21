const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
  dynamicStartUrl: false,
  cacheOnFrontEndNav: true,
  scope: "/a",
});

module.exports = withPWA({});
