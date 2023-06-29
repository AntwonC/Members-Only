import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';


const Members = () => {

    const URL = 'http://localhost:3001';

    const passcode = import.meta.env.VITE_MEMBERS_PASSCODE_ENV; // 641113 
    const [userGuess, setUserGuess] = useState('');
    
    const [message, setMessage] = useState('');

    const { state } = useLocation();
    const { userEmail } = state;
    const navigate = useNavigate();

    const turnOnMemberStatus = async () => {
        await fetch(`${URL}/members`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({email: userEmail}),
        })
        .then(response => response.json())
        .then((res) => {
            console.log(res.status);

            if(res.status === 205) {
                console.log("Status changed! Yay!");
                setMessage('You are now a member!');
            }
            
        })
        .catch((err) => {
            console.log(err);
            return err;
        })

    }

    const turnOffMemberStatus = async () => {
        await fetch(`${URL}/members/off`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({email: userEmail}),
        })
        .then(response => response.json())
        .then((res) => {
            console.log(res);

            if(res.status === 205) {
                console.log("Status changed! Yay!");
                setMessage('You are now not a member!');
            }
            
        })
        .catch((err) => {
            console.log(err);
            return err;
        })

    }

    const verifySecret = async () => {
        const d = JSON.stringify(userGuess);
        console.log(userGuess);
        console.log(passcode);
       // console.log(typeof(d));
      //  console.log(typeof(userGuess));
      //  console.log(typeof(passcode));
        if(userGuess === passcode) {
            console.log('Changing status to Member....');
            const res = await turnOnMemberStatus();
            return true;
        }

        console.log('No match!!');

        return false;
    }

    const removeMemberStatus = async () => {
        
       console.log('Changing status to Non-Member....');
       const res = await turnOffMemberStatus();
       return;
    }

    const backToDashboard = () => {
        navigate('/dashboard', {state: {email: userEmail}});
    }
  

    const handleChange = (evt) => {
        const { name, value } = evt.target;
    
        setUserGuess(value);

        console.log(userGuess);
    }

    return ( 
        <div>
            {message ? <h1>{message}</h1> : <h1></h1>}
            {passcode}
            <input placeholder="Enter secret passcode" onChange={handleChange}></input>
            <button onClick={verifySecret}>Enter</button>
            <button onClick={removeMemberStatus}>Become a Non-Member</button>

            
            <button onClick={backToDashboard}>Back to Dashboard</button>
            
        </div>
    )
}

export default Members;