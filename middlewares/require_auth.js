export default function require_auth (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/')
    }

    next()
}