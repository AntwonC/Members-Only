import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Login = () => {

    const URL = 'http://localhost:3001';

    const [loginInfo, setLoginInfo] = useState({
        loginEmail: '',
        loginPassword: ''
    });

    const [errors, setErrors] = useState('');
    const navigate = useNavigate();
    //const router = useRouter();

    const loginButtonClicked = async (evt) => {
        evt.preventDefault();
       // console.log('Sign Up button clicked... verify user data next.. send user data to database...');
        console.log(`Email: ${loginInfo.loginEmail}`);
        console.log(`Password: ${loginInfo.loginPassword}`);
       // console.log(`Confirm Password: ${signUpInfo.signUpConfirmPassword}`);

        await fetch(`${URL}/login`, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginInfo),
            
          })
            .then((res) => {
              // once figure out how to return correct status codes
              //console.log(res.json());
              //redirectToUsersPage();
              console.log(res);

              if(res.status === 405) {
                const jsonData = res.json();

                  return jsonData.then((data) => {
                    //console.log(data.message);
                    throw Error(data.message);
                  });

              } else if(res.status === 404) {
                const jsonData = res.json();
                    console.log(jsonData);
                  return jsonData.then((data) => {
                      //console.log(data.message);
                      throw Error(data.message);
                    });

              } else if (res.status === 403) {

                const jsonData = res.json();
                console.log(jsonData);

                  return jsonData.then((data) => {
                      const login = data.errors[0].param;

                      if(login === 'loginEmail') {
                          throw Error('Invalid email');
                      } else if (login === 'loginPassword') {
                          throw Error('Minimum password of 5 characters long');
                      }
                    }) 
              } else if (res.status === 205) {
                console.log("Login Successful");
                console.log(res);
                const href = '/dashboard'; // Router push to go client-side routes
                navigate('/dashboard', {state: {email: loginInfo.loginEmail}}); // dashboard
                /*router.push({
                  pathname: href,
                  query: {
                    email: loginInfo.loginEmail
                  }
                }); */
                //location.reload();
              //  clearsAllInputs();
               // setSuccess("Sign-Up Successful!");
              }
               
            })
            .catch((err) => {
              console.log(`Error from login.js: ${err.message}`);
              setErrors(err.message);
            }); 
    } 


    const handleChange = (evt) => {
        const { name, value } = evt.target;
        
        setLoginInfo((prevState) => ({ ...prevState, [name]: value}));
    }

    return (
        <div>
          <Navbar />
            <form>
                <label htmlFor="loginEmail">Email: </label>
                <input type="text" name="loginEmail" onChange={handleChange}></input>
                <label htmlFor="loginPassword">Password: </label>
                <input type="password" name="loginPassword" onChange={handleChange}></input>
                <button onClick={loginButtonClicked}>Login</button>
            </form>

            <div>This is the login page!</div>
            <button>
                <Link to={"/signUp"}>Back to SignUp Page</Link>
            </button>
        </div>
    )
}

export default Login;