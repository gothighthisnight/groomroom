import { Router } from 'express'
import bcrypt from 'bcrypt'
import pool from '../db/connection.js'

const router = Router()

router.post('/register', async (req, res) => {
    const { full_name, login, email, password, password_repeat, agree } = req.body

    if (!full_name || !login || !email || !password || !password_repeat || !agree) {
        return res.send('Заполните все поля')
    }

    if (!/^[А-Яа-яЁё\s]+$/.test(full_name)) {
        return res.send('ФИО должно содержать только кириллические буквы и пробелы')
    }

    if (!/^[a-zA-Z-]+$/.test(login)) {
        return res.send('Логин должен содержать только латиницу и дефис')
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.send('Невалидный формат email-адреса')
    }

    if (password !== password_repeat) {
        return res.send('Пароли не совпадают')
    }

    if (!agree) {
        return res.send('Согласие на обработку данных должно быть отмечено')
    }

    const existing_user = await pool.query(
        `SELECT id FROM users WHERE login = $1 OR email = $2`,
        [ login, email ]
    )

    if (existing_user.rows.length > 0) {
        return res.send('Пользователь с такими данными уже существует')
    }

    const hash = await bcrypt.hash(password, 10)

    await pool.query(
        `INSERT INTO users (full_name, login, email, password)
        VALUES ($1, $2, $3, $4)`,
        [ full_name, login, email, hash ]
    )

    res.redirect('/')
})

router.post('/login', async (req, res) => {
    const { login, password } = req.body
    
    const result = await pool.query(
        'SELECT * FROM users WHERE login=$1',
        [ login ]
    )

    if (result.rows.length == 0) {
        return res.send('Неверный логин')
    }

    const user = result.rows[0]
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        return res.send('Неверный пароль')
    }

    req.session.user = {
        id : user.id,
        full_name : user.full_name,
        login : user.login,
        email : user.email,
        role : user.role
    }

    if (user.role == 'admin') {
        return res.redirect('/groom')
    }

    res.redirect('/user')
})

router.get('/logout', (req, res) => {
    if (!req.session) {
        return res.redirect('/')
    }

    req.session.destroy((e) => {
        if (e) {
            console.log(e)
            return res.send('Ошибка при выходе')
        }

        return res.redirect('/')
    })
})

export default router