const path = require('path')

const express = require('express')
const mongoose = require('mongoose')
const config = require('config')

const authRoutes = require('./routes/auth')
const fileRoutes = require('./routes/file')

const fileUpload = require('express-fileupload')
const cors = require('./middleware/cors')
const filePath = require('./middleware/filepath')

const app = express()
const PORT = process.env.PORT || config.get('serverPort')

app.use(fileUpload({}))
app.use(cors)
app.use(filePath(path.resolve(__dirname, 'files')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('static'))

app.use('/api/auth', authRoutes)
app.use('/api/file', fileRoutes)

const start = async () => {
	try {
		await mongoose.connect(config.get('database')).then(() => {

			app.listen(PORT, () => {
				console.log('Server is running on port ', PORT)
			})
		})
	} catch (e) {

	}
}

start()