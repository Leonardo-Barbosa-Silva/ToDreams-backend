const goalsModel = require('../../models/goal/goalsModel')
const usersModel = require('../../models/user/usersModel')


module.exports = {

    //@desc Get goals
    //@route GET v1/api/goals/my
    //@acess Private
    getMyGoals: async (req, res) => {
        try {

            // Check user auth
            if (!req.user) {
                return res.status(401).json({ message: 'User not logged' })
            }

            const goals = await goalsModel.find({
                user: req.user._id
            })

            return res.status(200).json({
                message: 'Successfully get user goals',
                item: goals
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: 'Internal server error' })
        }
    },

    //@desc Create goal
    //@route POST v1/api/goals/create
    //@acess Private
    setGoal: async (req, res) => {
        try {

            // Check user auth
            if (!req.user) {
                return res.status(401).json({ message: 'User not logged' })
            }

            const goalCreated = await goalsModel.create({
                user: req.user._id,
                text: req.body.text || ""
            })

            return res.status(201).json({
                message: 'Successfully created a goal',
                item: goalCreated
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: 'Internal server error' })
        }
    },

    //@desc Update goal
    //@route PUT v1/api/goals/:id
    //@acess Private
    updateGoal: async (req, res) => {
        try {

            // Check user auth
            if (!req.user) {
                return res.status(401).json({ message: 'User not logged' })
            }

            const goal = await goalsModel.findById(req.params.id)

            if (!goal) {
                return res.status(400).json({ message: 'Goal not found' })
            }
            if (goal.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not allowed to update this goal' })
            }

            const goalUpdated = await goalsModel.findByIdAndUpdate(req.params.id, {
                text: req.body.text || ""
            }, {
                new: true
            })

            return res.status(201).json({
                message: 'Successfully updated goal',
                item: goalUpdated
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: 'Internal server error' })
        }
    },

    //@desc Delete goal
    //@route DELETE /v1/api/goals/:id
    //@acess Private
    deleteGoal: async (req, res) => {
        try {

            // Check user auth
            if (!req.user) {
                return res.status(401).json({ message: 'User not logged' })
            }

            const goal = await goalsModel.findById(req.params.id)

            if (!goal) {
                return res.status(400).json({ message: 'Goal not found' })
            }
            if (goal.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message:'User not allowed to delete this goal' })
            }

            const goalDelted = await goalsModel.findByIdAndDelete(req.params.id)

            return res.status(201).json({
                message: 'Successfully deleted goal',
                _id: goalDelted._id
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: 'Internal server error' })
        }
    }
}