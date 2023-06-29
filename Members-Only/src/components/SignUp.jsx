import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '/styles/SignUp.css';

const SignUp = () => {
    
    const URL = 'http://localhost:3001';
    const passcode = import.meta.env.VITE_ADMIN_PASSCODE_ENV; // secret passcode for admin access

    const [signUpInfo, setSignUpInfo] = useState({
        signUpFirstName: '',
        signUpLastName: '',
        signUpEmail: '',
        signUpPassword: '',
        signUpConfirmPassword: '',
        isAdmin: 0,
    });
    
    const [errors, setErrors] = useState('');
    const [success, setSuccess] = useState('');

    const [checkbox, setCheckbox] = useState(false);
    const [userGuess, setUserGuess] = useState('');

    const clearsAllInputs = () => {
        console.log(`Attempting to clear all inputs....`);
       // setSignUpInfo((prevState) => ({ ...prevState, [prevState]: ''}));
          const cleanSlate = ({
            signUpFirstName: '',
            signUpLastName: '',
            signUpEmail: '',
            signUpPassword: '',
            signUpConfirmPassword: '',
            isAdmin: 0,
          });
  
          setErrors('');
          
          setSignUpInfo(cleanSlate);
    }

    const addUserToDatabase = async () => {
      await fetch(`${URL}/`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signUpInfo),
      })
        .then((res) => {
          console.log(res);
          if(res.status === 404) {
            const jsonData = res.json();
           return jsonData.then((data) => {
              //console.log(data.message);
              throw Error(data.message);
            });

          } else if (res.status === 403) {

            const jsonData = res.json();
            console.log(jsonData);
          return jsonData.then((data) => {
               const signUp = data.errors[0].param;

               if(signUp === 'signUpEmail') {
                  throw Error('Invalid email');
               } else if (signUp === 'signUpPassword') {
                  throw Error('Minimum password of 5 characters long');
               } else if (signUp === 'signUpConfirmPassword') {
                  throw Error('Must fill in the confirm password field!');
               }
            })
          } else if (res.status === 205) {
            console.log("SignUp Successful");
            //location.reload();
            clearsAllInputs();
            setSuccess("Sign-Up Successful!");
          }
           
        })
        .catch((err) => {
          console.log(`Error from signup.js: ${err.message}`);
          setErrors(err.message);
         // setErrors(err.message);
        }); 
    }

    const signUpButtonClicked = async (evt) => {
          evt.preventDefault();

          // Check if Admin checkbox is checked
          // check user guess and then continue sign-up if correct
          // if not correct then show error
          // continue if correct
          if(checkbox === true) { // check password
            if(userGuess === passcode) {
              // continue to add admin 
              const addUser = await addUserToDatabase();
              return ;
            } else { // wrong secret admin password, reject sign-up
              console.log('Wrong admin password, try again or sign-up as a normal user');
              setErrors('Wrong admin password, try again or sign-up as a normal user');
              return ;
            }
          }

          const addUser = await addUserToDatabase();

          

          console.log('Sign Up button clicked... verify user data next.. send user data to database...');
          console.log(`Email: ${signUpInfo.signUpEmail}`);
          console.log(`Password: ${signUpInfo.signUpPassword}`);
          console.log(`Confirm Password: ${signUpInfo.signUpConfirmPassword}`);
  
          
      } 

    const handleChange = (evt) => {
        const { name, value } = evt.target;
    
        setSignUpInfo((prevState) => ({ ...prevState, [name]: value}));
    }


    const handleAdminChange = (evt) => {
      const { name, value } = evt.target;
  
      setUserGuess(value);

  }

    const handleCheckbox = (evt) => {
        if(evt.target.checked) {
          console.log('Checkbox is checked');
          setCheckbox(true);
          setSignUpInfo((prevState) => ({
            ...prevState,
            isAdmin: 1
          }))
        } else {
          console.log('Checkbox is NOT checked');
          setCheckbox(false);
          setSignUpInfo((prevState) => ({
            ...prevState,
            isAdmin: 0
          }))
        }
    }

    return ( 
        <div>
            <Navbar />

            <form className="signUpFormContainer">
                <label htmlFor="signUpFirstName">First Name: </label>
                <input type="text" name="signUpFirstName" onChange={handleChange}></input>
                <label htmlFor="signUpLastName">Last Name: </label>
                <input type="text" name="signUpLastName" onChange={handleChange}></input>
                <label htmlFor="signUpEmail">Email: </label>
                <input type="text" name="signUpEmail" onChange={handleChange}></input>
                <label htmlFor="signUpPassword">Password: </label>
                <input type="password" name="signUpPassword" onChange={handleChange}></input>
                <label htmlFor="signUpConfirmPassword">Confirm Password: </label>
                <input type="password" name="signUpConfirmPassword" onChange={handleChange}></input>
                <div className="buttonContainer">
                  
                  <label htmlFor="isAdminBox">
                    <input type="checkbox" name="isAdminBox" onChange={handleCheckbox} value="admin"/>
                    Admin
                  </label>
                  
                  <button className="signUpButton" onClick={signUpButtonClicked}>Sign Up</button>
                </div>
            </form>

            <input type="text" className="adminPasswordField" name="secretAdminPassword" placeholder="Admin password" onChange={handleAdminChange}></input>

        </div>
    )
}

export default SignUp;
