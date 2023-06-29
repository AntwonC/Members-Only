import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Home from './Home';
import NavbarDashboard from './NavbarDashboard';
import '/styles/Dashboard.css';
import '/styles/NavbarDashboard.css';

"use client"

const Dashboard = () => {

    const URL = 'http://localhost:3001';

    const [info, setInfo] = useState({
        userName: ''
    });
    const [userText, setUserText] = useState('');
    const [messageContent, setMessageContent] = useState({
        firstName: '',
        lastName: '',
        text: '',
        title: '',
        dateTime: ''
    })
    const [data, setData] = useState([]);
    const [toggleAllMessage, setToggleAllMessage] = useState(false);
    const [displayMsgBox, setDisplayMsgBox] = useState(false);
    const [updateMessage, setUpdateMessage] = useState(0);
    const [isMember, setIsMember] = useState(-1);
    const [isAdmin, setIsAdmin] = useState(-1);

    const { state } = useLocation();
    const { email } = state;
    const navigate = useNavigate();

    const toMembersPage = () => {
        navigate('/members', {state: {userEmail: email}});
    }

    const showMsgBox = () => {
        setDisplayMsgBox(!displayMsgBox);
    }

    const showAllPosts = async () => {
        const result = await fetch(`${URL}/dashboard/allPosts`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then((res) => {
            console.log(res['arr'][0].dateTime);
            console.log(res);
            setData(res['arr']);
            setToggleAllMessage(!toggleAllMessage);
           // setUpdateMessage(Math.random());
            return res;
        })

    }

    function fallbackRender({ error, resetErrorBoundary }) {
        // Call resetErrorBoundary() to reset the error boundary and retry the render.
      
        return (
          <div>
            <p>Something went wrong:</p>
            
          </div>
        );
      }


    const destroySession = async () => {
        await fetch(`${URL}/dashboard/logout`, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({userEmail: email}),
        })
        .then((res) => {
            console.log(`res: ${res}`)

            if(res.status === 205) {
                console.log('This user session will be destroyed.. redirect to login page!');


                const href = '/login';
                
            } else if (res.status === 405) {
                throw Error('Error happened trying to destroy this session..');
            }
        })
        .catch((err) => {
            console.log('Fetch error');
            console.log(err);
            return err;
        })
    }
    
    const confirmSession = async () => {
        await fetch(`${URL}/dashboard`, {
             method: 'POST',
             mode: 'cors',
             headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json'
             },
             body: JSON.stringify({userEmail: email}),
         })
         .then((response) => response.json())
         .then((res) => {
            console.log(res);

            if(res.status === 205) { // Show name instead
                console.log(res.fullName);
                const newData = { userName: res.fullName };
                setInfo(newData);

                console.log(info.userName);
            } else if (res.status === 405) {
                navigate('/login');
            }
         });
         
     }

    const createPost = async () => {
        var MyDate = new Date();
        
        const date = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth()+1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);

        const time = MyDate.toLocaleTimeString().slice(0, 7);
        const datetime = `${date} ${time}`;
        console.log(time);
        console.log(datetime);

        const name = info.userName.split(' ');
        const fName = name[0];
        const lName = name[1];

        console.log(fName);
        console.log(lName);
        

        const tempContent = {
            firstName: fName,
            lastName: lName,
            text: userText,
            title: email,
            dateTime: datetime,
        };

        setMessageContent(tempContent);
        console.log(tempContent);
        await fetch(`${URL}/dashboard/create`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(tempContent),
        })
        .then(response => response.json())
        .then((res) => {
            console.log(res);

            if(res.status === 205) {
                setUpdateMessage(Math.random());
                console.log(updateMessage);
                console.log('You created a post!! Wooohooo!!!');
            }
            
        })
        .catch((err) => {
            console.log(err);
            return err;
        })

    }

    const getMemberStatus = async () => {
        await fetch(`${URL}/dashboard/status`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({userEmail: email})
        })
        .then((response) => response.json())
        .then((res) => {
            console.log(res);
            console.log(res.memStatus);
            if(res.status === 205) {
                console.log(`Got member status for user ${email}`);
                setIsMember(res.memStatus); // set member status for this user
            } else if(res.status === 404) {
                throw Error(`Couldn't get the memberStatus for ${email}`);
            }
        }); 
    }

    const getStatusOfAdmin = async () => {
        await fetch(`${URL}/dashboard/adminStatus`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({userEmail: email})
        })
        .then((response) => response.json())
        .then((res) => {
            console.log(res);

            if(res.status === 205) {
                console.log(`Got admin status for user ${email}`);
                setIsAdmin(res.admin); // set member status for this user
            } else if(res.status === 404) {
                throw Error(`Couldn't get the adminStatus for ${email}`);
            }
        }); 
    }

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        
        setUserText(value);
    }

     useEffect(() => { 

        const getData = async () => {
            const response = await confirmSession();
           // const newData = await response.json();
            console.log(response);
        }

        const getStatus = async () => {
            const memberStatus = await getMemberStatus();
            console.log('member status');
            console.log(memberStatus);
        }

        const getStatusAdmin = async () => {
            const adminStatus = await getStatusOfAdmin();
        }
        console.log(email);
        
        const result = {userEmail: email};
        setInfo(result);
        getData();
        getStatus();
        getStatusAdmin();

     }, [])


    return (
        <div>
            <ErrorBoundary fallback={<div>Something went wrong.. </div>}>
            <NavbarDashboard
                logoutLogic={destroySession}
                name={info.userName}
                createMessage={showMsgBox}
            />
            

            {isAdmin === 1
                ?
                <div>
                    <button onClick={showAllPosts}>Show All Messages</button>
                </div>
                :
                null
            }

            <div className="button-container">
                
                <button className="members-button" onClick={toMembersPage}>Join the Members Club!</button>
            </div>


            {displayMsgBox === true
                ?
                <div className="chatroom-container">
                <textarea className="chat" onChange={handleChange}rows="10" cols="30"></textarea>
                <button className="send-button" onClick={createPost}>Send</button>
                </div>
                :
                null   
            }

            <Home 
                userEmail={email}
                changes={updateMessage}
                member={isMember}
                admin={isAdmin}
                allMessages={data}
                toggle={toggleAllMessage}
                />
            
            </ErrorBoundary>



        
            
        </div>
    )     
}

export default Dashboard;