import path from 'path'
import { fileURLToPath } from 'url'

import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'))
    },
    filename : (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const file_filter = (req, file, cb) => {
    const allowed_mime_types = [ 'image/jpeg', 'image/bmp' ]

    if (allowed_mime_types.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Разрешены только JPEG и BMP'))
    }
}

const upload = multer({
    storage,
    fileFilter : file_filter,
    limits : {
        fileSize : 2 * 1024 * 1024
    }
})

export default upload