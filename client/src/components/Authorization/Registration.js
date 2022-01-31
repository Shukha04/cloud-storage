import './Authorization.scss'
import { useState } from 'react'
import { registration } from '../../actions/user'
import Input from '../../utils/input/Input'

const Registration = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	return (
		<div className='authorization'>
			<div className='authorization__header'>Registration</div>
			<Input type='text' placeholder='Email' value={email} setValue={setEmail} />
			<Input type='password' placeholder='Password' value={password} setValue={setPassword} />
			<button className='authorization__btn' onClick={() => registration(email, password)}>Sign up</button>
		</div>
	)
}

export default Registration
