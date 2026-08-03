


const axios = require("axios");
const https = require("https");
const fs = require("fs");

const axiosBackEnd = axios.create({
  httpsAgent: new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 5000,
    maxSockets: 5,        // evita overload
    maxFreeSockets: 2,
    rejectUnauthorized: false
  }),
  timeout: 15000
});

let backendURL = "";

if (process.env.BACKEND_URL) {
  backendURL = process.env.BACKEND_URL;
  console.log("URL BACKEND Para Parametro : BACKEND_URL");
  console.log("URL BACKEND:", backendURL);
} else {
  const url_file = JSON.parse(fs.readFileSync("./backend_url.json", "utf8"));
  console.log("==>",url_file);
  backendURL = url_file.backend_url;
  console.log("URL BACKEND Para Local!! - backend_url.json", backendURL);
}


module.exports = {axiosBackEnd, backendURL};