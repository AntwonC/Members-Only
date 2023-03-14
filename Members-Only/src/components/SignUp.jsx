import { useState } from 'react';
import { Link } from 'react-router-dom';
import '/styles/SignUp.css';

const SignUp = () => {
    
    const [signUpInfo, setSignUpInfo] = useState({
        signUpFirstName: '',
        signUpLastName: '',
        signUpEmail: '',
        signUpPassword: '',
        signUpConfirmPassword: '',
    });


    const handleChange = (evt) => {
        const { name, value } = evt.target;
    
        setSignUpInfo((prevState) => ({ ...prevState, [name]: value}));
    }

    return ( 
        <div>

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
                <button className="signUpButton">Sign Up</button>
            </form>

            <div className="buttonContainer">
                <button className="homeButton">
                    <Link to={"/"}>Back to Home</Link>
                </button>
                <button className="loginButton">
                    <Link to={"/login"}>Go to Login</Link>
                </button>
     
            </div>
        </div>
    )
}

export default SignUp;
