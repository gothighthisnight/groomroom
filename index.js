import express from 'express'
import session from 'express-session'

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import main_route from './routes/main.js'
import user_route from './routes/user.js'
import admin_route from './routes/admin.js'
import auth_route from './routes/auth.js'
import { init_db } from './db/init.js'

const app = express()

app.use(express.urlencoded({ extended : true }))
app.use(express.json())

app.use(session({
    secret : 'groomroom_secret_key',
    resave : false,
    saveUninitialized : false
}))

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/', main_route)
app.use('/user', user_route)
app.use('/groom', admin_route)
app.use('/', auth_route)

const start = async function () {
    try {
        await init_db()
        app.listen(3000)
    } catch (e) {
        console.log('ошибка запуска сервера', e)
    }
}

start()