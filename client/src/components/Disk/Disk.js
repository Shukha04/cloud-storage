import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFiles, uploadFile } from '../../actions/file'
import { setCurrentDir, setPopupDisplay, setView } from '../../reducers/file'
import FileList from './FileList/FileList'
import './Disk.scss'
import Popup from './Popup'
import Uploader from './Uploader/Uploader'

const Disk = () => {
	const dispatch = useDispatch()
	const currentDir = useSelector(state => state.file.currentDir)
	const dirStack = useSelector(state => state.file.dirStack)
	const loader = useSelector(state => state.app.loader)
	const [dragEnter, setDragEnter] = useState(false)
	const [sort, setSort] = useState('type')

	useEffect(() => {
		dispatch(getFiles(currentDir, sort))
	}, [currentDir, sort])

	function showPopupHandler() {
		dispatch(setPopupDisplay('flex'))
	}

	function backClickHandler() {
		const backDirId = dirStack.pop()
		dispatch(setCurrentDir(backDirId))
	}

	function fileUploadHandler(e) {
		const files = [...e.target.files]
		files.forEach(file => dispatch(uploadFile(file, currentDir)))
	}

	function dragEnterHandler(e) {
		e.preventDefault()
		e.stopPropagation()
		setDragEnter(true)
	}

	function dragLeaveHandler(e) {
		e.preventDefault()
		e.stopPropagation()
		setDragEnter(false)
	}

	function dropHandler(e) {
		e.preventDefault()
		e.stopPropagation()
		let files = [...e.dataTransfer.files]
		files.forEach(file => dispatch(uploadFile(file, currentDir)))
		setDragEnter(false)
	}

	if (loader) {
		return (
			<div className='loader'>
				<div className='lds-dual-ring' />
			</div>
		)
	}

	return (
		!dragEnter
		?
		<div
			className='disk'
			onDragEnter={dragEnterHandler}
			onDragLeave={dragLeaveHandler}
			onDragOver={dragEnterHandler}
		>
			<div className='disk__btns'>
				{dirStack.length > 0 && <button className='disk__back' onClick={backClickHandler}>Back</button>}
				<button className='disk__create' onClick={showPopupHandler}>Create folder</button>
				<div className='disk__upload'>
					<label htmlFor='disk__upload-input' className='disk__upload-label'>Upload a file</label>
					<input
						onChange={fileUploadHandler}
						multiple={true}
						type='file'
						id='disk__upload-input'
						className='disk__upload-input'
					/>
				</div>
				<select className='disk__select' value={sort} onChange={(e) => setSort(e.target.value)}>
					<option value='name'>Name</option>
					<option value='type'>Type</option>
					<option value='Date'>Date</option>
				</select>
				<button className='disk__plate' onClick={() => dispatch(setView('plate'))} />
				<button className='disk__list' onClick={() => dispatch(setView('list'))} />
			</div>
			<FileList />
			<Popup />
			<Uploader />
		</div>
		:
		<div
			className='drop-area'
			onDragEnter={dragEnterHandler}
			onDragLeave={dragLeaveHandler}
			onDragOver={dragEnterHandler}
			onDrop={dropHandler}
		>
			Drag files here
		</div>
	)
}

export default Disk