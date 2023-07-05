const router = require('express').Router()
const authUserToken = require('../../middlewares/authUserToken')
const rateLimit = require('express-rate-limit')
const { check } = require('express-validator')
const { getMyGoals, setGoal, updateGoal, deleteGoal } = require('../../controllers/goals/goalsController')


const limiter = rateLimit({
    windowMs: 8 * 60 * 1000,
    max: 30,
    message: "Too many requests. Please, try again later"
})

router.get('/my', limiter, authUserToken, getMyGoals)
router.post('/create', limiter, check('text').isLength({ max: 1000 }), authUserToken, setGoal)
router.put('/update/:id', limiter, check('text').isLength({ max: 1000 }), authUserToken, updateGoal)
router.delete('/delete/:id', limiter, authUserToken, deleteGoal)



module.exports = router;