import React from 'react';
import {useState} from  'react';
import jwt from 'jsonwebtoken';
import {useNavigate} from 'react-router-dom';
import { response } from 'express';

const Dashboard = () =>{
        const [tempHabits, setTempHabit] = useState([]);
        const [habit, setHabit] = useState([]);
        const [tempType, setTempType] = useState([]);
        const [type, setType] = useState([]);
        const navigate = useNavigate();
        const token = localStorage.getItem('token');
        if(token){
            const user = jwt.decode(token);
            if(!user){
                localStorage.removeItem('token');
                navigate('/login', { replace : true });
            }else{
                populateDashboard();
            }
        }
        async function populateDashboard(){
            const response = await fetch('http://localhost:1337/api/habits',{
                method : 'GET',
                headers : {
                    'x-access-token' : localStorage.getItem('token'),
                },
            })
            if(!response.ok){
                throw new console.error('Error');
            }
            const data = await response.json();
            if(data.status === 'ok'){
                setHabit(data.habit);
                setType(data.type);
            }else{
                alert(data.error);
            }
        }
        async function updateHabit() {
            const response = await fetch('http://localhost:1337/api/habits',{
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json',
                    'x-access-token' : localStorage.getItem('token'),
                },
                body : JSON.stringify({
                    habit : tempHabits,
                    type : tempType
                })
             })
            const data = response.json();
            if(!response.ok){
                console.log('error');
            }else{
                console.log(data); 
            }
            if(data.status === 'ok'){
                setTempHabit('');
                setTempType('');
                setHabit(data.habit);
                setType(data.type);
            }else{
                alert(data.error);
            }
        }
        const logout = async function logoutfunction(){
            localStorage.clear();
            console.warn('You will be logged out');
            navigate('/login', {replace : true});
        }
        async function deleteHabit(n){
            let habit = tempHabits[n];
            let type = tempType[n];
            const reponse = await fetch('http://localhost:1337/api/Deletehabit',{
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json',
                    'x-access-token' : localStorage.getItem('token'),
                },
                body : JSON.stringify({
                        habit : habit,
                        type : type,
                        index : n
                    })
            })
        }
        return( <div>
                    <div>
                    <h1>Habits List</h1>
                    {habit.map((habit, index) => (
                        <ul>
                            <li key={index}>{habit}</li>
                            <button key={index} value='delete' onCLick={deleteHabit(index)}></button>
                        </ul>
                        
                        
                    ))}
                    <h1>Types</h1>
                    {type.map((type, index) => (
                        <p key={index}>{type}</p>
                    ))}
                    </div>
                    <form onSubmit={updateHabit}>
                        <input type='text' placeholder='Habits' value={tempHabits} onChange={ e => setTempHabit(e.target.value)}></input>
                        <input type='text' placeholder='Type' value={tempType} onChange={ e => setTempType(e.target.value)}></input>
                        <input type='submit' value='Update Habit'></input><br></br>
                        <input type='button' value='logout' onClick={logout}></input><br></br>
                    </form>
                </div>
              )
    }

export default Dashboard;