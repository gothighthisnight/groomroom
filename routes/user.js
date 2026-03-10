import { Router } from 'express'
import require_auth from '../middlewares/require_auth.js'
import pool from '../db/connection.js'
import upload from '../middlewares/upload.js'

const router = Router()

router.get('/', require_auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM requests
            WHERE user_id = $1
            ORDER BY created_at DESC`,
            [ req.session.user.id ]
        )

        res.render('user', {
            user : req.session.user,
            requests : result.rows
        })
    } catch (e) {
        console.log(e)
        res.send('Ошибка загрузки заявок')
    }
})

router.post('/request', require_auth, upload.single('pet_photo'), async (req, res) => {
    try {
        const { pet_name } = req.body

        if (!pet_name) {
            return res.send('Введите кличку питомца')
        }

        if (!req.file) {
            return res.send('Загрузите фото питомца')
        }

        await pool.query(
            `INSERT INTO requests (user_id, pet_name, pet_photo, status)
            VALUES ($1, $2, $3, $4)`,
            [ req.session.user.id, pet_name, req.file.filename, 'new' ]
        )

        res.redirect('/user')
    } catch (e) {
        console.log(e)
        res.send('Ошибка создания заявки')
    }
})

router.post('/delete/:id', require_auth, async (req, res) => {
    try {
        const request_id = req.params.id

        await pool.query(
            `DELETE FROM requests
            WHERE id = $1 AND user_id = $2 AND status = 'new'`,
            [ request_id, req.session.user.id ]
        )

        res.redirect('/user')
    } catch (e) {
        console.log(e)
        res.send('Ошибка удаления заявки')
    }
})

export default router