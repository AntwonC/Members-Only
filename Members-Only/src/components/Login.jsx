import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {

    const [loginInfo, setLoginInfo] = useState({
        loginEmail: '',
        loginPassword: ''
    });

    const handleChange = (evt) => {
        const { name, value } = evt.target;
    
        setLoginInfo((prevState) => ({ ...prevState, [name]: value}));
    }

    return (
        <div>
            <form>
                <label htmlFor="loginEmail">Email: </label>
                <input type="text" name="loginEmail" onChange={handleChange}></input>
                <label htmlFor="loginPassword">Password: </label>
                <input type="password" name="loginPassword" onChange={handleChange}></input>
                <button>Login</button>
            </form>

            <div>This is the login page!</div>
            <button>
                <Link to={"/signUp"}>Back to SignUp Page</Link>
            </button>
        </div>
    )
}

export default Login;