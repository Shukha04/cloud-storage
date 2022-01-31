import './Authorization.scss'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../../actions/user'
import Input from '../../utils/input/Input'

const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const dispatch = useDispatch()

	return (
		<div className='authorization'>
			<div className='authorization__header'>Login</div>
			<Input type='text' placeholder='Email' value={email} setValue={setEmail} />
			<Input type='password' placeholder='Password' value={password} setValue={setPassword} />
			<button className='authorization__btn' onClick={() => dispatch(login(email, password))}>Sign in</button>
		</div>
	)
}

export default Login
