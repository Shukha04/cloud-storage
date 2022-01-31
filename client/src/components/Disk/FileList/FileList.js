import './FileList.scss'
import { useSelector } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import File from './File/File'

const FileList = () => {
	const files = useSelector(state => state.file.files)
	const view = useSelector(state => state.file.view)

	if (files.length === 0) {
		return <div className='loader'>There is no files</div>
	}

	if (view === 'plate') {
		return (
			<div className='fileplate'>
				{files.map(file =>
					<File key={file._id} file={file} />
				)}
			</div>
		)
	}

	if (view === 'list') {
		return (
			<div className='filelist'>
				<div className='filelist__header'>
					<div className='filelist__name'>File name</div>
					<div className='filelist__date'>Date</div>
					<div className='filelist__size'>Size</div>
				</div>
				<TransitionGroup>
					{files.map(file =>
						<CSSTransition key={file._id} timeout={500} classNames={'file'} exit={false}>
							<File file={file} />
						</CSSTransition>
					)}
				</TransitionGroup>
			</div>
		)
	}

}

export default FileList