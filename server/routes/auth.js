const Router = require('express').Router
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator')
const router = new Router()
const jwt = require('jsonwebtoken')
const config = require('config')
const authMiddleware = require('../middleware/auth')
const File = require('../models/File')
const fileServices = require('../services/file')

router.post('/registration',
	[
		check('email', 'Invalid email').isEmail(),
		check('password', 'Password should contain from 8 to 32 letters').isLength({ min: 8, max: 32 })
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: 'Validation error', errors })
			}

			const { email, password } = req.body

			const candidate = await User.findOne({ email })
			if (candidate) {
				return res.status(400).json({ message: 'This email is already registered' })
			}

			const hashedPass = await bcrypt.hash(password, 10)
			const user = await new User({ email, password: hashedPass })

			await user.save()
			await fileServices.createDir(req, new File({ user: user.id, name: '' })
			)
			return res.json({ message: 'User was created' })
		} catch (e) {
			res.send('Server error')
		}
	}
)

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body

		const user = await User.findOne({ email })
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		const validPassword = await bcrypt.compare(password, user.password)
		if (!validPassword) {
			return res.status(400).json({ message: 'Wrong credentials' })
		}

		const token = jwt.sign({ id: user._id }, config.get('secretKey'), { expiresIn: '1h' })

		return res.json({
			token,
			user: {
				id: user.id,
				email: user.email,
				storageSpace: user.storageSpace,
				usedSpace: user.usedSpace
			}
		})
	} catch (e) {
		res.send('Server error')
	}
})

router.get('/auth', authMiddleware, async (req, res) => {
	try {
		const user = await User.findById(req.user.id)

		const token = jwt.sign({ id: user._id }, config.get('secretKey'), { expiresIn: '1h' })

		return res.json({
			token,
			user: {
				id: user.id,
				email: user.email,
				storageSpace: user.storageSpace,
				usedSpace: user.usedSpace,
				avatar: user.avatar
			}
		})
	} catch (e) {
		res.send('Server error')
	}
})

module.exports = router