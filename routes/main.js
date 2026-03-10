import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT pet_name, pet_photo
            FROM requests
            WHERE status = 'done'
            ORDER BY created_at DESC
            LIMIT 4`
        )

        res.render('index', {
            user : req.session.user || null,
            requests : result.rows
        })
    } catch (e) {
        console.log(e)
        res.send('Ошибка загрузки главной страницы')
    }
})

export default router