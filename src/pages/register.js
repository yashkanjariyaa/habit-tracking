import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 

  async function registerUser(event){
    event.preventDefault();
    const response = await fetch('http://localhost:1337/api/register', {
      method : 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
    const data = await response.json();
    if( data.status === 'ok'){
      navigate('/login');
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={registerUser}>
      <input 
        type='text' 
        placeholder='Username' 
        value={username}
        onChange={(e) => setUsername(e.target.value)}></input><br></br>
      <input 
        type='email' 
        placeholder='Email' 
        value={email}
        onChange={(e) => setEmail(e.target.value)}></input><br></br>
      <input 
        type='text' 
        placeholder='Password' 
        value={password}
        onChange={(e) => setPassword(e.target.value)}></input><br></br>
        <input type='submit' value='Register'></input>
        </form>
    </div>
  );
}
export default App;
