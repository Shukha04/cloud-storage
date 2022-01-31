const Router = require('express').Router
const router = new Router()
const authMiddleware = require('../middleware/auth')
const fileControllers = require('../controllers/file')

router.post('', authMiddleware, fileControllers.createDir)
router.post('/upload', authMiddleware, fileControllers.uploadFile)
router.post('/avatar', authMiddleware, fileControllers.uploadAvatar)
router.get('', authMiddleware, fileControllers.fetchFiles)
router.get('/download', authMiddleware, fileControllers.downloadFile)
router.get('/search', authMiddleware, fileControllers.searchFile)
router.delete('/', authMiddleware, fileControllers.deleteFile)
router.delete('/avatar', authMiddleware, fileControllers.deleteAvatar)

module.exports = router