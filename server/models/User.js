const { Schema, model, ObjectId } = require('mongoose')

const UserSchema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	storageSpace: { type: Number, default: 1024 ** 3 * 10 },
	usedSpace: { type: Number, default: 0 },
	avatar: { type: String },
	files: [{ type: ObjectId, def: 'File' }]
})

module.exports = model('User', UserSchema)