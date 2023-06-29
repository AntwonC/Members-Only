const express = require('express');
const cors = require('cors');
const router = express.Router();
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const membersDatabase = require('../database/formConnection');

router.use(cors());
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const checkUserSession = async (loginEmail) => {
    const sessionQuery = `SELECT * FROM sessions`;

    let sessionQueryResult = await new Promise((resolve, reject) => {

        membersDatabase.query(sessionQuery, (err, res) => {
            if (err) {
                reject('Error happened while checking user session....');
            }

            const databaseInfo = JSON.parse(JSON.stringify(res));
            
            if(databaseInfo.length === 0) {
                console.log(`No session data available`);
                reject(`No session data available..`);
            } else {
                
                const temp = JSON.parse(databaseInfo[0].data); // the session data
                console.log('-------------------------');
                for(let i = 0; i < databaseInfo.length; i++) {
                    const data = JSON.parse(databaseInfo[i].data);
                    
                    if(data.email === loginEmail) {
                        console.log(data);
                        resolve(data);
                    }
                }
               // console.log(databaseInfo.length);
              //  console.log('temp');
               // console.log(temp);
                console.log('-------------------------');
               // resolve(temp);
            }

            reject(`Nothing found`);
        })
    })

    return sessionQueryResult;
}

const comparePasswords = async (userPassword, databasePassword) => {

    const comparePasswords = await bcrypt.compare(userPassword, databasePassword);
    console.log(`comparePasswords: ${comparePasswords}`);
    if(comparePasswords) {
        return 205;
    } else {
        return 404;
    }
}

const authenticateUserLogin = async (loginEmail, loginPassword) => {
    const getUserFromDatabase = `SELECT email, password FROM users WHERE email='${loginEmail}'`;

    let result = await new Promise((resolve, reject) => {

      membersDatabase.query(getUserFromDatabase, (err, res) => {

            if(err) {
                reject('Error happened...');
            }
            
            console.log(`res: ${res}`);
            //resolve(res);
            const databaseInfo = Object.values(JSON.parse(JSON.stringify(res)));
            
            console.log(databaseInfo);
            if(databaseInfo.length === 0) {
                console.log('Email is not in our records...');
                reject('Email is not in our records. Go to sign-up page to register!');
            } else {
                const comparedPasswordsResult = comparePasswords(loginPassword, databaseInfo[0].password);
                const promiseResult = comparedPasswordsResult.then((outcome) => {
                    if(outcome === 205) {
                        console.log(`Login Successful!`);
                        resolve(205);
                    } else {
                        console.log(`Passwords did not match..`);
                        reject('Incorrect password..');
                    }
     
                });
            }
        })
    });

    return result;
}



router.post('/', 
    body('loginEmail').isEmail(),
    body('loginPassword').isLength({min: 5}),
async (req, res) => {
    console.log('Hello from login route!');

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) {
        return res.status(403).json({errors: errors.array()});
    } 

    const { loginEmail, loginPassword } = req.body;

    console.log(`loginEmail: ${loginEmail}`);
    console.log(`loginPassword: ${loginPassword}`);

    const saltRounds = 10;
    let userLoggedIn = false;

    try {
        await authenticateUserLogin(loginEmail, loginPassword)
        .then((result) => {
            console.log(`result: ${result}`);

            if(result === 205) { // 205 = Able to authenticate user login information
                console.log(req.sessionID);
                
                    checkUserSession(loginEmail)
                    .then((data) => {
                        console.log('data');
                        console.log(data);

                        if(data.email === loginEmail) {
                            // redirect to user dashboard
                            //return res.status(205).json({message: 'Send user to their dashbaord. Session exists'});
                            console.log('A match!');
                            userLoggedIn = true;
                            return res.status(205).json({message: 'Login Successful!'});
                        }
                    
                    })
                    .catch((err) => {
                        console.log(`Error while checking session: ${err}`);
                        req.session.email = loginEmail; // create session data
                        console.log("Session should be created...");
                        return res.status(205).json({message: 'Login Successful!'});
                        //throw Error('Session is not available for this user.');
                    });
                        console.log(`userLoggedIn: ${userLoggedIn}`);

                   // const temp = JSON.parse(JSON.stringify(checkSession));
                   // console.log(`temp: ${temp}`);
                
                //req.session.loggedIn = true; // loggedIn status true because its successful login
                 //req.session.sessID = req.sessionID;
                 //req.session.id = req.sessionID;
                 //console.log(req.session);
               // console.log(`req.session.email: ${req.session.email}`);
            } else {
                throw Error('Incorrect password.');
            } 
        })
    } catch(err) {
        console.log(`Error in routes/login.js: ${err}`);
        return res.status(404).json({message: err});
    }
   // return res.status(206).json({message: 'Made a request to login route..'});
})

module.exports = router;