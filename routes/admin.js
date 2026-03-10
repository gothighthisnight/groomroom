import { Router } from 'express'
import require_admin from '../middlewares/require_admin.js'
import pool from '../db/connection.js'
import upload from '../middlewares/upload.js'

const router = Router()

router.get('/', require_admin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT requests.*, users.login
            FROM requests
            JOIN users ON requests.user_id = users.id
            ORDER BY requests.created_at DESC`
        )

        res.render('admin', {
            user : req.session.user,
            requests : result.rows
        })
    } catch (e) {
        console.log(e)
        res.send('Ошибка загрузки заявок')
    }
})

router.post('/update-status/:id', require_admin, upload.single("result_photo"), async (req, res) => {
    try {
        const request_id = req.params.id

        const result = await pool.query(
            `SELECT * FROM requests WHERE id = $1`,
            [ request_id ]
        )

        if (result.rows.length == 0) {
            return res.send('Заявка не найдена')
        }

        const request = result.rows[0]

        if (request.status == 'new') {
            await pool.query(
                `UPDATE requests SET status = 'processing' WHERE id = $1`,
                [ request_id ]
            )

            return res.redirect('/groom')
        }

        if (request.status == 'processing') {
            if (!req.file) {
                return res.send('Нужно загрузить фото результата')
            }

            await pool.query(
                `UPDATE requests SET status = 'done', result_photo = $1 WHERE id = $2`,
                [ req.file.filename, request_id ]
            )

            return res.redirect('/groom')
        }

        return res.send('Нельзя изменить статус этой заявки')
    } catch (e) {
        console.log(e)
        res.send('Ошибка изменения статуса заявки')
    }
})

export default router