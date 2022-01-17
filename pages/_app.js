import axios from 'axios';
import '../styles/globals.css'
 require("antd/dist/antd.less");
 require('dotenv').config()

//  axios.defaults.withCredentials = true;
 
 String.prototype.toSentenceCase= function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
 }

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
