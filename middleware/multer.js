const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    //   image/png
    const ext = file.mimetype.split("/")[1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${file.filename}-${uniqueSuffix}.${ext}`;
    cb(null, filename);
  },
});

module.exports = multer({ storage: storage }).single("photo");
