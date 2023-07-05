const router = require('express').Router()
const authUserToken = require('../../middlewares/authUserToken')
const rateLimit = require('express-rate-limit')
const { check } = require('express-validator')
const { registerUser, loginUser, getMe } = require('../../controllers/users/usersController')


const limiter = rateLimit({
    windowMs: 8 * 60 * 1000,
    max: 30,
    message: "Too many requests. Please, try again later"
})


router.get('/me', limiter, authUserToken, getMe)
router.post('/register', limiter, [
        check('firstName').isLength({ min: 3, max: 40 }),
        check('lastName').isLength({ min: 3, max: 40 }),
        check('email').isEmail().withMessage('Please, provide a valid email'),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characteres')
    ],
    registerUser
)
router.post('/login', limiter, [
        check('email').isEmail().withMessage('Please, provide a valid email'),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characteres')       
    ],
    loginUser
)






module.exports = router;