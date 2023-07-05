const router = require('express').Router()
const usersRoutes = require('./users/userRoutes')
const goalsRoutes = require('./goals/goalsRoutes')


// Direct to user routes
router.use('/v1/api/users', usersRoutes)

// Direct to goals routes
router.use('/v1/api/goals', goalsRoutes)




module.exports = router;