import './File.scss'
import { useDispatch, useSelector } from 'react-redux'
import { deleteFile, downloadFile } from '../../../../actions/file'
import fileLogo from '../../../../assets/img/file.svg'
import folderLogo from '../../../../assets/img/folder.svg'
import { pushToStack, setCurrentDir } from '../../../../reducers/file'
import sizeFormat from '../../../../utils/sizeFormat'

const File = ({ file }) => {
	const dispatch = useDispatch()
	const currentDir = useSelector(state => state.file.currentDir)
	const view = useSelector(state => state.file.view)

	const openDirHandler = (file) => {
		if (file.type === 'dir') {
			dispatch(pushToStack(currentDir))
			dispatch(setCurrentDir(file._id))
		}
	}

	async function downloadClickHandler(e) {
		e.preventDefault()
		e.stopPropagation()

		await downloadFile(file)
	}

	function deleteClickHandler(e) {
		e.preventDefault()
		e.stopPropagation()

		dispatch(deleteFile(file))
	}

	if (view === 'list') {
		return (
			<div className='file' onClick={() => openDirHandler(file)}>
				<img src={file.type === 'dir' ? folderLogo : fileLogo} alt='' className='file__img' />
				<div className='file__name'>{file.name}</div>
				<div className='file__date'>{file.date.slice(0, 10)}</div>
				<div className='file__size'>{sizeFormat(file.size)}</div>
				{file.type !== 'dir' &&
				<button onClick={downloadClickHandler} className='file__btn file__download'>Download</button>}
				<button onClick={deleteClickHandler} className='file__btn file__delete'>Delete</button>
			</div>
		)
	}

	if (view === 'plate') {
		return (
			<div className='file-plate' onClick={() => openDirHandler(file)}>
				<img src={file.type === 'dir' ? folderLogo : fileLogo} alt='' className='file-plate__img' />
				<div className='file-plate__name'>{file.name}</div>
				<div className='file-plate__btns'>
					{file.type !== 'dir' &&
					<button onClick={downloadClickHandler} className='file-plate__btn file-plate__download'>Download</button>}
					<button onClick={deleteClickHandler} className='file-plate__btn file-plate__delete'>Delete</button>
				</div>
			</div>
		)
	}
}

export default File