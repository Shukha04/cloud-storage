import axios from 'axios'
import { API_URL } from '../config'
import { hideLoader, showLoader } from '../reducers/app'
import { addFile, deleteFileAction, setFiles } from '../reducers/file'
import { addUploadFile, changeUploadFile, showUploader } from '../reducers/upload'

export function getFiles(dirId, sort) {
	return async dispatch => {
		try {
			dispatch(showLoader())
			let url = `${API_URL}api/file`

			if (dirId) {
				url = url + '?parent=' + dirId
			}

			if (sort) {
				url = url + '?sort=' + sort
			}

			const response = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')} `
				}
			})
			dispatch(setFiles(response.data))
		} catch (err) {
			alert(err.response.data.message)
		} finally {
			dispatch(hideLoader())
		}
	}
}

export function createDir(dirId, name) {
	return async dispatch => {
		try {
			const response = await axios.post(`${API_URL}api/file`, {
				name,
				parent: dirId,
				type: 'dir'
			}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')} `
				}
			})
			dispatch(addFile(response.data))
		} catch (err) {
			alert(err.response.data.message)
		}
	}
}

export function uploadFile(file, dirId) {
	return async dispatch => {
		try {
			const formData = new FormData()
			formData.append('file', file)
			if (dirId) {
				formData.append('parent', dirId)
			}

			const uploadFile = { name: file.name, progress: 0, id: Date.now() }

			dispatch(showUploader())
			dispatch(addUploadFile(uploadFile))

			const response = await axios.post(`${API_URL}api/file/upload`, formData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				},
				onUploadProgress: (event) => {
					const totalLength =
						event.lengthComputable
						? event.total
						: event.target.getResponseHeader('content-length') ||
							event.target.getResponseHeader('x-decompressed-content-length')
					if (totalLength) {
						uploadFile.progress = Math.round((event.loaded * 100) / totalLength)
						dispatch(changeUploadFile(uploadFile))
					}
				}
			})
			dispatch(addFile(response.data))
		} catch (err) {
			alert(err.response.data.message)
		}
	}
}

export async function downloadFile(file) {
	const response = await fetch(`${API_URL}api/file/download?id=${file._id}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`
		}
	})
	if (response.status === 200) {
		const blob = await response.blob()
		const downloadUrl = window.URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = downloadUrl
		link.download = file.name
		document.body.appendChild(link)
		link.click()
		link.remove()
	}
}

export function deleteFile(file) {
	return async dispatch => {
		try {
			const response = await axios.delete(`${API_URL}api/file?id=${file._id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			dispatch(deleteFileAction(file._id))
			alert(response.data.message)
		} catch (err) {
			alert(err.response.data.message)
		}
	}
}

export function searchFiles(search) {
	return async dispatch => {
		try {
			const response = await axios.get(`${API_URL}api/file/search?search=${search}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			dispatch(setFiles(response.data))
		} catch (err) {
			alert(err.response.data.message)
		} finally {
			dispatch(hideLoader())
		}
	}
}