import './Uploader.scss'
import { useDispatch } from 'react-redux'
import { removeUploadFile } from '../../../reducers/upload'

const UploadFile = ({ file }) => {
	const dispatch = useDispatch()

	return (
		<div className='upload-file'>
			<div className='upload-file__header'>
				<div className='upload-file__name'>{file.name}</div>
				<button className='file-upload__remove' onClick={() => dispatch(removeUploadFile(file.id))}>X</button>
			</div>
			<div className='upload-file__progress-bar'>
				<div className='upload-file__upload-bar' style={{ width: file.progress + '%' }} />
				<div className='upload-file__percent'>{file.progress}%</div>
			</div>
		</div>
	)
}

export default UploadFile