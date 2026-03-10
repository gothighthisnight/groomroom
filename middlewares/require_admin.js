export default function require_admin (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/')
    }

    if (req.session.user.role !== 'admin') {
        return res.redirect('/')
    }

    next()
}