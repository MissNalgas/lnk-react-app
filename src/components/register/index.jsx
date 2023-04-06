import React, { useEffect, useState } from 'react';
import { TextInput } from '../Input';
import loginStyles from '../Login/Login.module.css';
import styles from './index.module.css';
import { getUser, postUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ERROR_TIMEOUT = 4000;

export default function Register() {

	const [form, setForm] = useState({firstname: '', lastname: '', nickname: ''});
	const [error, _setError] = useState('');
	const setError = (errorMessage) => {
		setTimeout(() => _setError(''), ERROR_TIMEOUT);
		_setError(errorMessage);
	}
	const navigate = useNavigate();


	const register = (label) => (event) => setForm(s => ({...s, [label]: event.target.value}));

	useEffect(() => {
		
		getUser().then(user => {
			if (user) {
				navigate('/');
			}
		}).catch(() => {
			navigate('/login');
		});


	}, []);

	const onSubmit = (e) => {
		e.preventDefault();
		const { firstname, lastname, nickname } = form;

		if (!firstname) return setError('You have to enter your firstname');
		if (!lastname) return setError('You have to enter your lastname');
		if (!nickname) return setError('You have to enter your nickname');

		if (nickname.includes(' ')) {
			setError('Your nickname can\'t have spaces');
			return;
		}
		postUser(form).then(() => {
			navigate('/');
		}).catch(err => {
			setError(err.toString());
		});
	}

	return (
		<div className={styles.container}>
			<h1>Lnk</h1>
			<p>
				Enter your information to start using LNK.
			</p>
			<form onSubmit={onSubmit}>
				<TextInput onChange={register('firstname')} value={form.firstname} label='Firstname' id='firstname'/>
				<TextInput onChange={register('lastname')} value={form.lastname} label='Lastname' id='lastname'/>
				<TextInput onChange={register('nickname')} value={form.nickname} label='Nickname' id='nickname'/>
				<div className={loginStyles.buttonContainer}>
					<button type='submit'>Register</button>
				</div>
				{error && (
					<p className={loginStyles.errorContainer}>
						{error}
					</p>

				)}
			</form>
		</div>
	);
}
