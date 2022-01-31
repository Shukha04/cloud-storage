import './Uploader.scss'
import { useDispatch, useSelector } from 'react-redux'
import { hideUploader } from '../../../reducers/upload'
import UploadFile from './UploadFile'

const Uploader = () => {
	const files = useSelector(state => state.uploader.files)
	const isVisible = useSelector(state => state.uploader.visible)
	const dispatch = useDispatch()

	return isVisible &&
		<div className='uploader'>
			<div className='uploader__header'>
				<div className='uploader__title'>Downloads</div>
				<button className='uploader__close' onClick={() => dispatch(hideUploader())}>X</button>
			</div>
			{files.map(file =>
				<UploadFile key={file.id} file={file} />
			)}
		< /div>
}

export default Uploader