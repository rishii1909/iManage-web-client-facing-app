// next.config.js
const withAntdLess = require("next-plugin-antd-less");

const ec2_url = "https://imanage.host";
const heroku_url = "stark-fortress-44852.herokuapp.com";
const local_url = "http://localhost:3000/";
const http_local_url = "http://localhost:5002";

module.exports = withAntdLess({
  // optional
  modifyVars: {
    "@primary-color": "#D7263D",
    "@border-radius-base": "4px",
  },
  env: {
    API_URL: http_local_url,
    WEB_URL: local_url,
    CUR_SYM: "$",
    STRIPE_PK_KEY:
      "pk_test_51M6He9SJzdKRJDdX5CfJ78vj9PLrbbFRnd7uZwglylINoO7509DOxYuByuCFOEAiDn79KqnSFI8YHr7esng0mI7L00SkrvRZQP",
  },
  // optional
  lessVarsFilePath: "./src/styles/variables.less",
  // optional
  lessVarsFilePathAppendToEndOfContent: false,
  // optional https://github.com/webpack-contrib/css-loader#object
  cssLoaderOptions: {},

  // Other Config Here...

  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
    };
    return config;
  },

  // ONLY for Next.js 10, if you use Next.js 11, delete this block
  //future: {
  //  webpack5: true,
  //},
});
