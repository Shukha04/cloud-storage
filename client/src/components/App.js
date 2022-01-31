import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { auth } from '../actions/user'
import Disk from './Disk/Disk'
import Navbar from './Navbar/Navbar'
import './App.scss'
import Registration from './Authorization/Registration'
import Login from './Authorization/Login'
import Profile from './Profile/Profile'

const App = () => {
	const isAuth = useSelector(state => state.user.isAuth)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(auth())
	}, [])

	return (
		<BrowserRouter>
			<div className='app'>
				<Navbar />
				<div className='wrap'>
					{!isAuth ?
					 <Routes>
						 <Route path='/registration' element={<Registration />} />
						 <Route path='/login' element={<Login />} />
						 <Route
							 path='*'
							 element={<Navigate to='/login' />}
						 />
					 </Routes> :
					 <Routes>
						 <Route path='/' element={<Disk />} />
						 <Route path='/profile' element={<Profile />} />
						 <Route
							 path='*'
							 element={<Navigate to='/' />}
						 />
					 </Routes>
					}
				</div>
			</div>
		</BrowserRouter>
	)
}

export default App
