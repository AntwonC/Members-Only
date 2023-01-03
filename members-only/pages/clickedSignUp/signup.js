import { useState } from 'react';
import Link from 'next/link';
import signUpStyles from '../../styles/SignUp.module.css';


const SignUp = () => {
    
    const URL = 'http://localhost:3001';

    const [signUpInfo, setSignUpInfo] = useState({
        signUpEmail: '',
        signUpPassword: '',
        signUpConfirmPassword: '',
    });

    const [errors, setErrors] = useState('');


    const signUpButtonClicked = async (evt) => {
        evt.preventDefault();
        console.log('Sign Up button clicked... verify user data next.. send user data to database...');
        console.log(`Email: ${signUpInfo.signUpEmail}`);
        console.log(`Password: ${signUpInfo.signUpPassword}`);
        console.log(`Confirm Password: ${signUpInfo.signUpConfirmPassword}`);

        await fetch(`${URL}/`, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(signUpInfo),
          })
            .then((res) => {
              // once figure out how to return correct status codes
              //console.log(res.json());
              //redirectToUsersPage();
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
                   }
                })
              } else if (res.status === 205) {
                console.log("SignUp Successful");
              }
               
            })
            .catch((err) => {
              console.log(`Error from signup.js: ${err.message}`);
              setErrors(err.message);
             // setErrors(err.message);
            });
    }

    const handleChange = (evt) => {
        const { name, value } = evt.target;
    
        setSignUpInfo((prevState) => ({ ...prevState, [name]: value}));
    }

    return (
        <div>
          <div>{errors}</div>
            <form className={signUpStyles.formContainer}>
                <label htmlFor="signUpEmail">Email: </label>
                <input type="text" name="signUpEmail" onChange={handleChange}></input>
                <label htmlFor="signUpPassword">Password: </label>
                <input type="password" name="signUpPassword" onChange={handleChange}></input>
                <label htmlFor="signUpConfirmPassword">Confirm Password: </label>
                <input type="password" name="signUpConfirmPassword" onChange={handleChange}></input>
                <button className={signUpStyles.signUpButton} onClick={signUpButtonClicked}>Sign Up</button>
            </form>

            
            <div>You are at the SIGN-UP page!</div>
            <button>
                <Link href="/">Back to Home</Link>
            </button>
        </div>
    );
}

export default SignUp;