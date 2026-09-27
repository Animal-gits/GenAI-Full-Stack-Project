import multer from "multer"

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {

        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF files are allowed"))
        }

        cb(null, true)
    }
})


export {upload}