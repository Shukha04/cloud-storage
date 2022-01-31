import './Navbar.scss'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { API_URL } from '../../config'
import { getFiles, searchFiles } from '../../actions/file'
import logo from '../../assets/img/logo.svg'
import { showLoader } from '../../reducers/app'
import { logout } from '../../reducers/user'
import avatarLogo from '../../assets/img/avatar.svg'

const Navbar = () => {
	const isAuth = useSelector(state => state.user.isAuth)
	const currentDir = useSelector(state => state.file.currentDir)
	const user = useSelector(state => state.user.user)
	const dispatch = useDispatch()
	const [searchName, setSearchName] = useState('')
	const [searchTimeout, setSearchTimeout] = useState(false)
	const avatar = user.avatar ? API_URL + user.avatar : avatarLogo

	function searchChangeHandler(e) {
		setSearchName(e.target.value)
		if (searchTimeout) {
			clearTimeout(searchTimeout)
		}
		dispatch(showLoader())
		if (e.target.value !== '') {
			setSearchTimeout(setTimeout((value) => {
				dispatch(searchFiles(value))
			}, 500, e.target.value))
		} else {
			dispatch(getFiles(currentDir))
		}
	}

	return (
		<div className='navbar'>
			<div className='container'>
				<img src={logo} alt='' className='navbar__logo' />
				<div className='navbar__header'>Cloud Storage App</div>
				{isAuth && <input
					className='navbar__search'
					type='text'
					placeholder='Search...'
					value={searchName}
					onChange={searchChangeHandler}
				/>}
				{!isAuth && <div className='navbar__login'><NavLink to='/login'>Sign in</NavLink></div>}
				{!isAuth && <div className='navbar__registration'><NavLink to='/registration'>Sign up</NavLink></div>}
				{isAuth && <div className='navbar__login' onClick={() => dispatch(logout())}>Log out</div>}
				{isAuth && <NavLink to='/profile'>
					<img src={avatar} alt='' className='navbar__avatar' />
				</NavLink>}
			</div>
		</div>
	)
}

export default Navbar
