import { useState } from 'react';
import Link from 'next/link';
import signUpStyles from '../../styles/SignUp.module.css';


const SignUp = () => {

    const [signUpInfo, setSignUpInfo] = useState({
        signUpEmail: '',
        signUpPassword: '',
        signUpConfirmPassword: '',
    });

    const signUpButtonClicked = (e) => {
        e.preventDefault();
        console.log('Sign Up button clicked... verify user data next');
        console.log(`Email: ${signUpInfo.signUpEmail}`);
        console.log(`Password: ${signUpInfo.signUpPassword}`);
        console.log(`Confirm Password: ${signUpInfo.signUpPassword}`);
    }

    const handleChange = (evt) => {
        const { name, value } = evt.target;
    
        setSignUpInfo((prevState) => ({ ...prevState, [name]: value}));
    }

    return (
        <div>
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