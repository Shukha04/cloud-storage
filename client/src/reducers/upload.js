const SHOW_UPLOADER = 'SHOW_UPLOADER'
const HIDE_UPLOADER = 'HIDE_UPLOADER'
const ADD_UPLOAD_FILE = 'ADD_UPLOAD_FILE'
const REMOVE_UPLOAD_FILE = 'REMOVE_UPLOAD_FILE'
const CHANGE_UPLOAD_FILE = 'CHANGE_UPLOAD_FILE'

const defaultState = {
	visible: false,
	files: []
}

export default function uploadReducer(state = defaultState, action) {
	switch (action.type) {
		case SHOW_UPLOADER:
			return { ...state, visible: true }
		case HIDE_UPLOADER:
			return { ...state, visible: false }
		case ADD_UPLOAD_FILE:
			return { ...state, files: [...state.files, action.payload] }
		case REMOVE_UPLOAD_FILE:
			return { ...state, files: [...state.files.filter(f => f.id !== action.payload)] }
		case CHANGE_UPLOAD_FILE:
			return {
				...state,
				files: [
					...state.files.map(f =>
						f.id === action.payload.id
						? { ...f, progress: action.payload.progress }
						: { ...f })
				]
			}
		default:
			return state
	}
}

export const showUploader = () => ({ type: SHOW_UPLOADER })
export const hideUploader = () => ({ type: HIDE_UPLOADER })
export const addUploadFile = (file) => ({ type: ADD_UPLOAD_FILE, payload: file })
export const removeUploadFile = (fileId) => ({ type: REMOVE_UPLOAD_FILE, payload: fileId })
export const changeUploadFile = (payload) => ({ type: CHANGE_UPLOAD_FILE, payload: payload })