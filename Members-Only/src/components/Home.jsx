import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import moment  from 'moment';
import Navbar from '../components/Navbar';
import '/styles/Home.css';

const Home = ({ userEmail, changes, member, admin, allMessages, toggle }) => {

    const URL = 'http://localhost:3001';

    const [data, setData] = useState([]);

    const [disableBlur, setDisableBlur] = useState(false);
    const [showBlur, setShowBlur] = useState(false);
    const [deleteUpdate, setDeleteUpdate] = useState(-1);

    const getPosts = async () => {

        
        const result = await fetch(`${URL}/dashboard/posts`, {
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
            return res;
        })

    }

    const getAllPosts = async () => {

        
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
            return res;
        })

    }
    

    const messageInfo = (id) => {
        console.log(id);
        
        //  <div className='deleteMessage' onClick={() => messageInfo(post.id)}>X</div>
    }

    const deleteMessage = async (postId) => {
        // how to pick a message to delete? id? 

        await fetch(`${URL}/dashboard/delete`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({id: postId}),
        })
        .then((response) => response.json())
        .then((res) => {

            console.log(res);

            if(res.status === 205) {
                console.log('Post is deleted from DB');
                setDeleteUpdate(Math.random());
                return res;
            }
        })
    }

    const convertTime = (jsonDateTime) => {
        let x = moment(jsonDateTime).valueOf();
        let y = moment(x).format('MM-DD-YYYY hh:mm:ss');
        return y;
    }
            /* 
            Scenario 1: not logged in => blur
            Scenario 2: logged in, member => no blur
            Scenario 3: logged in, not member => blur
            */
    const messageList = (post) => {

        console.log(showBlur);

        if(userEmail === undefined) {
            return (<div className='received-msg' key={post.id}>
                    <div className='received-chats-name'>
                        <h1 className='username blurry'>{post.firstName} {post.lastName}</h1>
                        <div className='received-msg-inbox'>
                            <p>{post.text}</p>
                            <span className='time blurry'>{convertTime(post.dateTime)}</span>
                        </div>
                    </div>
                    </div> )
        } else if(userEmail !== undefined && admin === 1) { // is admin => no blur
            return (<div className='received-msg' key={post.id}>
                    <div className='deleteMessage' onClick={() => deleteMessage(post.id)}>X</div>
                    <div className='received-chats-name'>                  
                        <h1 className='username'>{post.firstName} {post.lastName}
                        
                        </h1>
                        <div className='received-msg-inbox'>
                            <p>
                           
                                {post.text}
                            </p>
                            <span className='time'>{convertTime(post.dateTime)}</span>
                            
                        </div>
                    </div>

                    </div> )
        } else if(userEmail !== undefined && member === 1) { // logged in, member => no blur
            return (<div className='received-msg' key={post.id}>
                    <div className='received-chats-name'>
                        <h1 className='username'>{post.firstName} {post.lastName}</h1>
                        <div className='received-msg-inbox'>
                            <p>{post.text}</p>
                            <span className='time'>{convertTime(post.dateTime)}</span>
                        </div>
                    </div>
                    </div> )
        } else if(userEmail !== undefined && member === 0) { // logged in, no member => blur
            return (<div className='received-msg' key={post.id}>
                    <div className='received-chats-name'>
                        <h1 className='username blurry'>{post.firstName} {post.lastName}</h1>
                        <div className='received-msg-inbox'>
                            <p>{post.text}</p>
                            <span className='time blurry'>{convertTime(post.dateTime)}</span>
                        </div>
                    </div>
                    </div> )
        }

    }

    /*                 <div>{post.firstName}</div>
                 <div>{post.lastName}</div> */

    useEffect(() => {
        console.log(userEmail);
        console.log(`admin: ${admin}`);
        if(userEmail === undefined) {
            setShowBlur(true);
         } else {
            setShowBlur(false);
         }

        getPosts();
    }, [changes])

    useEffect(() => {
        if(toggle === true) {
            getAllPosts();
        } else {
            getPosts();
        } 
    }, [allMessages, deleteUpdate])



    

    return (
        <div className='homeContainer'>
            {(userEmail === undefined) ? <Navbar /> : null }
            <div className='chat-page'>
                <div className='chats'>
                    <div className='msg-page'>
                        {data.map(post => messageList(post))}
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Home;