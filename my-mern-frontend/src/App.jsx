import React, { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
console.log('API Base URL: ', API_BASE_URL);

function App() {
	const entries = [
		{id: 1, title: 'Note 1', content: 'Hello note 1'},
		{id: 2, title: 'Note 2', content: 'Hello note 2'},
		{id: 3, title: 'Note 3', content: 'Hello note 3'},
	]
	return (
		<>
			<NoteForm/>
		</>
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

function NoteList(prop){
	const notes = prop.notes;

	return(
		<>
			{
				notes.length > 0 ? 
					notes.map(item => (
						<div key={item.id}>
							<h1>{item.title}</h1>
							<p>{item.content}</p>
						</div>
					)) 
					:
					<h1>No notes to display</h1>
			}	
		</>
	);
}

function NoteForm(){
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
		console.log('Title: ', title);
		console.log('Content: ', content);
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

export default App
