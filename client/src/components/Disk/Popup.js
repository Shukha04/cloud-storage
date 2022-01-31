import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createDir } from '../../actions/file'
import { setPopupDisplay } from '../../reducers/file'
import Input from '../../utils/input/Input'

const Popup = () => {
	const [folderName, setFolderName] = useState('')
	const popupDisplay = useSelector(state => state.file.popupDisplay)
	const currentDir = useSelector(state => state.file.currentDir)
	const dispatch = useDispatch()

	function createDirHandler() {
		dispatch(createDir(currentDir, folderName))
		setFolderName('')
		dispatch(setPopupDisplay('none'))
	}

	return (
		<div className='popup' onClick={() => dispatch(setPopupDisplay('none'))} style={{ display: popupDisplay }}>
			<div className='popup__content' onClick={(e) => e.stopPropagation()}>
				<div className='popup__header'>
					<div className='popup__title'>Create new folder</div>
					<button className='popup__close' onClick={() => dispatch(setPopupDisplay('none'))}>X</button>
				</div>
				<Input type='text' placeholder='Folder name' value={folderName} setValue={setFolderName} />
				<button className='popup__create' onClick={createDirHandler}>Create</button>
			</div>
		</div>
	)
}

export default Popup