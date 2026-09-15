const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../../conciliador-backend/upload/");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const uploadArquivoArker = multer({ storage });

module.exports = uploadArquivoArker;
