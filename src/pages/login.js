import { useState } from 'react';
function App() {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 

  async function loginUser(event){
    event.preventDefault();
      const response = await fetch('http://localhost:1337/api/login', {
        method : 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })
    const data = await response.json();

    if(data.user){
      localStorage.setItem('token', data.user);
      alert('Login Successful');
      window.location.href='/dashboard';
    }else{
      alert('Please check your username and password');
    }
    console.log(data);
  }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={loginUser}>
      <input 
        type='text' 
        placeholder='Username' 
        value={username}
        onChange={(e) => setUsername(e.target.value)}></input> <br></br>
      <input 
        type='text' 
        placeholder='Password' 
        value={password}
        onChange={(e) => setPassword(e.target.value)}></input><br></br>
        <input type='submit' value='login'></input>
        </form>
    </div>
  );
}
export default App;
