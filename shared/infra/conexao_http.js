


const axios = require("axios");
const https = require("https");
const fs = require("fs");

const axiosWorker = axios.create({
  httpsAgent: new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 5000,
    maxSockets: 5,        // evita overload
    maxFreeSockets: 2,
    rejectUnauthorized: false
  }),
  timeout: 15000
});

let workerURL = "";

if (process.env.WORKER_URL) {
  workerURL = process.env.WORKER_URL;
  console.log("URL BACKEND Para Parametro : BACKEND_URL");
  console.log("URL BACKEND:", workerURL);
} else {
  const url_file = JSON.parse(fs.readFileSync("./worker_url.json", "utf8"));
  console.log("==>",url_file);
  workerURL = url_file.worker_url;
  console.log("URL BACKEND Para Local!! - worker_url.json", workerURL);
}


module.exports = {axiosWorker, workerURL};