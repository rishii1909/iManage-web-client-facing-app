// next.config.js
const withAntdLess = require('next-plugin-antd-less');

API_URL='https://stark-fortress-44852.herokuapp.com/'

module.exports = withAntdLess({
  // optional
  modifyVars: { 
	  '@primary-color': '#D7263D', 
	  '@border-radius-base' : '4px'
	},
  env: {
    API_URL: process.env.API_URL || 'https://stark-fortress-44852.herokuapp.com',
  },
  // optional
  lessVarsFilePath: './src/styles/variables.less',
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


