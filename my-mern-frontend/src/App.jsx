import React, { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
console.log('API Base URL: ', API_BASE_URL);

function App() {
	const [message, setMessage] = useState('Loading backend message...');
	const [error, setError] = useState(null);
	
	useEffect(() => {
		const fetchTestMessage = async () => {
			try {
				const response = await axios.get(`${API_BASE_URL}/notes`);

				setMessage(
					`Successfully connected to backend. 
					Example response data length: ${response.data.length}
					notes.`);
				setError(null);
			} catch(err) {
				console.error('Error connecting to backend:', err);
				setError('Failed to connect to backend. Check console for details. Make sure your backend server is running and CORS is configured.');
        		setMessage('Backend connection failed.');
			}
		};

		fetchTestMessage();
	}, []);

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
			
			<h1 className="text-4xl font-bold text-gray-800 mb-6">MERN Note App Frontend</h1>
			
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">Backend Connection Status:</h2>
				{ 
					error ? 
					<p className="text-red-600 text-lg">{error}</p> : 
					<p className="text-green-600 text-lg">{message}</p>
				}

				<p className="mt-4 text-gray-600">
					This is your React frontend. We'll build out the authentication and note management UI here.
				</p>
			</div>

		</div>
	);	
}

export default App
