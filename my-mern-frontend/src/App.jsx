import React, { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import { useAuth } from './context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log('API Base URL: ', API_BASE_URL);

function Home() {
	const [notes, setNotes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const {logout} = useAuth();

	const fetchNotes = async () => {
		try {
			await new Promise(resolve => setTimeout(resolve, 2000));
			const response = await axios.get(`${API_BASE_URL}/notes`);
	
			setNotes(response.data);
			setError(null);
		} catch (error) {
			console.log('Error: ', error.message)
			setError(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNotes();
	}, [loading]);

	const onSubmitNote = async (newNoteData) => {
		try {
			setLoading(true);
			const response = await axios.post(`${API_BASE_URL}/notes`, newNoteData);

			setNotes(prevNotes => [...prevNotes, response.data]);
			console.log('Note added successfully', response.data);
		} catch (error) {
			console.error('Error adding note: ', error);
			setError(new Error('Failed to add note. Please try again.'));
		}
	};

	if (loading) return <h1> Loading Notes </h1>
	if (error !== null) return <h1> Error: {error.message}</h1>

	return (
		<>
			<button onClick={logout}>Log out</button>
			<NoteForm onSubmitNote={onSubmitNote}/>
			<NoteList notes = {notes}/>
		</>
	);	
}

function App(){
	
	const { isLoggedIn } = useAuth();

	return(
		<>
			{
				isLoggedIn === true ? <Home/> : 
				
				<> 
					<Login/> 
					<Register/>
				</>
			}
		</>
	);
}

function Login(){
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);

	const { login } = useAuth();
	
	const handleLogin = async (e) => {
		e.preventDefault();
		setError(null);

		try{
			await login(username, password);
			setUsername('');
			setPassword('');
		} catch (error) {
			setError(error.response?.data?.message || 'Registration failed. Please try again.');
		}
	}

	return(
		<>
			<form onSubmit={handleLogin}>
				<fieldset>
					<label htmlFor="username">Username</label>
					<input 
						id = 'username'
						type="text" 
						name='username'
						value={username}
						onChange={e => setUsername(e.target.value)} 
						required/>

					<label htmlFor="password">Password</label>
					<input 
						id='password'
						type="password" 
						name='password'
						value={password}
						onChange={e => setPassword(e.target.value)}
						required/>
				</fieldset>
				<button type='submit'>Log in</button>
				{
					error ? <p>{error}</p> : <></>
				}
			</form>
		</>
	);
}

function Register(){
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	const { register } = useAuth();
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);

		if(password !== confirm){
			setError('Password doesn\'t match');
			return;
		}

		try{
			await register(username, password);
			setSuccess(true);
			setUsername('');
			setPassword('');
			setConfirm('');
		} catch (error) {
			setError(error.response?.data?.message || 'Registration failed. Please try again.');
		}
	}

	return(
		<>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<label htmlFor="username">Username</label>
					<input 
						id = 'username'
						type="text" 
						name='username'
						value={username}
						onChange={e => setUsername(e.target.value)} 
						required/>

					<label htmlFor="password">Password</label>
					<input 
						id='password'
						type="password" 
						name='password'
						value={password}
						onChange={e => setPassword(e.target.value)}
						required/>

					<label htmlFor="confirm">Confirm Password</label>
					<input 
						id='confirm'
						type="password" 
						name='confirm'
						value={confirm}
						onChange={e => setConfirm(e.target.value)}
						required/>
				</fieldset>
				<button type='submit'>Register</button>
				{
					error ? <p>{error}</p> : <></>
				}
			</form>
		</>
	);
};

function NoteList({notes}){
	return(
		<>
			{
				notes.length > 0 ? 
					notes.map(item => (
						<div key={item.id || item._id}>
							<h1>{item.title}</h1>
							<p>{item.content}</p>
							<p>{item.userId.username}</p>
						</div>
					)) 
					:
					<h1>No notes to display</h1>
			}	
		</>
	);
}

function NoteForm({onSubmitNote}){
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');

	const onTitleChange = (event) => {
		setTitle(event.target.value);
	}

	const onContentChange = (event) => {
		setContent(event.target.value);
	}

	const submitForm = (event) => {
		event.preventDefault();

		if(!title.trim() || !content.trim()){
			alert('Please enter both title and content');
			return;
		}

		console.log('Title: ', title);
		console.log('Content: ', content);
		
		onSubmitNote({title, content});
		
		setTitle('');
		setContent('');
	}

	return(
		<form onSubmit={submitForm}>
			<fieldset>
				<label htmlFor="title">TITLE</label>
				<input type="text" name='title' value={title} onChange={onTitleChange}/>

				<label htmlFor="content">CONTENT</label>
				<textarea name="content" value={content} onChange={onContentChange}/>

				<button type='submit'>SUBMIT</button>
			</fieldset>
		</form>
	);
}


function ToggleMessage(){
	const [message, setMessage] = useState(true);

	function toggle(){
		setMessage(!message);
	}
	
	return(
		<div>
			<h1>Message is {message == true ? 'ON' : 'OFF'}</h1>
			<button onClick={toggle}>Click me</button>
		</div>
	);
}

export default App
