const fileServices = require('../services/file')
const User = require('../models/User')
const File = require('../models/File')
const config = require('config')
const fs = require('fs')
const uuid = require('uuid')

class FileControllers {
	async createDir(req, res) {
		try {
			const { name, type, parent } = req.body

			const file = await new File({ name, type, parent, user: req.user.id })
			const parentFile = await File.findById(parent)
			if (!parentFile) {
				file.path = name
				await fileServices.createDir(req, file)
			} else {
				file.path = `${parentFile.path}/${file.name}`
				await fileServices.createDir(req, file)
				parentFile.children.push(file._id)
				await parentFile.save()
			}
			await file.save()

			return res.json(file)
		} catch (err) {
			return res.status(400).json(err)
		}
	}

	async fetchFiles(req, res) {
		try {
			const { sort } = req.query
			let files

			switch (sort) {
				case 'name':
					files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ name: -1 })
					break
				case 'type':
					files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ type: -1 })
					break
				case 'date':
					files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ date: -1 })
					break
				default:
					files = await File.find({ user: req.user.id, parent: req.query.parent })
					break
			}
			return res.json(files)
		} catch (err) {
			return res.status(500).json({ message: 'Can not get files' })
		}
	}

	async uploadFile(req, res) {
		try {
			const file = req.files.file

			const parent = await File.findOne({ user: req.user.id, _id: req.body.parent })
			const user = await User.findById(req.user.id)

			if (user.usedSpace + file.size > user.storageSpace) {
				return res.status(400).json({ message: 'There is no space on the storage' })
			}

			user.usedSpace = user.usedSpace + file.size

			let path

			if (parent) {
				path = `${req.filePath}/${user._id}/${parent.path}/${file.name}`
			} else {
				path = `${req.filePath}/${user._id}/${file.name}`
			}

			if (fs.existsSync(path)) {
				return res.status(400).json({ message: 'File already exists' })
			}
			file.mv(path)

			const type = file.name.split('.').pop()
			let filePath = file.name
			if (parent) {
				filePath = parent.path + '/' + file.name
			}

			const dbFile = await new File({
				name: file.name,
				type,
				size: file.size,
				path: filePath,
				parent: parent?._id,
				user: user._id
			})

			await dbFile.save()
			await user.save()

			res.json(dbFile)
		} catch (err) {
			return res.status(500).json({ message: 'Upload error' })
		}
	}

	async downloadFile(req, res) {
		try {
			const file = await File.findOne({ _id: req.query.id, user: req.user.id })
			const path = fileServices.getPath(req, file)
			console.log(path)
			if (fs.existsSync(path)) {
				return res.download(path, file.name)
			}
			return res.status(400).json({ message: 'Download error' })
		} catch (err) {
			res.status(500).json({ message: 'Download error' })
		}
	}

	async deleteFile(req, res) {
		try {
			const file = await File.findOne({ _id: req.query.id, user: req.user.id })
			if (!file) {
				return res.status(400).json({ message: 'File not found' })
			}
			fileServices.deleteFile(req, file)
			await file.remove()
			return res.json({ message: 'File was deleted' })
		} catch (err) {
			res.status(500).json({ message: 'Delete error' })
		}
	}

	async searchFile(req, res) {
		try {
			const searchName = req.query.search
			let files = await File.find({ user: req.user.id })
			files = files.filter(file => file.name.includes(searchName))

			return res.json(files)
		} catch (err) {
			res.status(500).json({ message: 'Search error' })
		}
	}

	async uploadAvatar(req, res) {
		try {
			const file = req.files.file
			const user = await User.findById(req.user.id)

			const avatarName = uuid.v4() + '.jpg'

			file.mv(config.get('staticPath') + '/' + avatarName)
			user.avatar = avatarName
			await user.save()
			return res.json(user)
		} catch (err) {
			res.status(500).json({ message: 'Upload avatar error' })
		}
	}

	async deleteAvatar(req, res) {
		try {
			const user = await User.findById(req.user.id)
			fs.unlinkSync(config.get('staticPath') + '/' + user.avatar)
			user.avatar = null
			await user.save()
			return res.json(user)
		} catch (err) {
			res.status(500).json({ message: 'Delete avatar error' })
		}
	}
}

module.exports = new FileControllers()
