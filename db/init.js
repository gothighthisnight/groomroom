import bcrypt from 'bcrypt'
import pool from './connection.js'

export async function init_db () {
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                full_name TEXT NOT NULL,
                login TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user'
            )`
        )

        await pool.query(
            `CREATE TABLE IF NOT EXISTS requests (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                pet_name TEXT NOT NULL,
                pet_photo TEXT NOT NULL,
                result_photo TEXT,
                status TEXT NOT NULL DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`
        )

        const admin_login = 'admin'
        const admin_password = 'grooming'

        const exitsting_admin = await pool.query(
            `SELECT id FROM users WHERE login = $1`,
            [ admin_login ]
        )

        if (exitsting_admin.rows.length == 0) {
            const hash = await bcrypt.hash(admin_password, 10)

            await pool.query(
                `INSERT INTO users (full_name, login, email, password, role)
                VALUES ($1, $2, $3, $4, $5)`,
                [
                    'Повелитель',
                    'admin',
                    'admin@admin.admin',
                    hash,
                    'admin'
                ]
            )

            console.log('админ создан')
        } else {
            console.log('админ уже был создан')
        }
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}