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

const authenticateUserSignUp =  (signUpFirstName, signUpLastName, signUpEmail, signUpPassword, signUpConfirmPassword) => {
    console.log(`IN authenticateUserSignUp() -> signUpEmail: ${signUpEmail}`);
    console.log(`IN authenticateUserSignUp() -> signUpPassword: ${signUpPassword}`);
    const userNameQuery = `SELECT email FROM users WHERE email='${signUpEmail}'`;

     return  new Promise((resolve, reject) => 
            membersDatabase.query(userNameQuery, (err, res) => {

            if(err) {
                console.log(`Error in routes/signUp.js when authenticating user signup: ${err}`);
                reject('Error happened....');
            }
            console.log(res);
 

            //console.log(`res.length: ${res.length}`);

            if(signUpFirstName === '' || signUpLastName === '') {
                reject('Must fill in your first and last name!');
            } else if(signUpPassword === signUpConfirmPassword) {
                //statusCode = 205;
                console.log('PASSWORDS MATCH!!!');
                resolve(205);
            } else {
                reject('Passwords do not match...');
            }
        })
    );

    

}
// INSERT INTO users VALUES ('Admin' 'User', 'anthonychen33@gmail.com', )
const callInsertUser = (saltRounds, userPlainTextPassword, signUpFirstName, signUpLastName, signUpEmail, signUpPassword, signUpConfirmPassword) => {
    return bcrypt.hash(userPlainTextPassword, saltRounds)
     .then((hashedPass) => {
         const insertQuery = `INSERT INTO users VALUES('${signUpFirstName.trim()}', '${signUpLastName.trim()}', '${signUpEmail.trim()}', '${hashedPass}', 0, 0)`;
         // Inserting into database here
         membersDatabase.query(insertQuery, (err, insertRes) => {
             //console.log(err);
             if(err) return 406;
             console.log('Insert query ran. Should be added to the database');
             return 205;
         // next();
         //return res.status(205).json({message: "Sign Up Successful"});
         }) 
     })
 }

const insertUser = async (signUpFirstName, signUpLastName, signUpEmail, signUpPassword, signUpConfirmPassword, isAdmin) => {
    const saltRounds = 10;
    const userPlainTextPassword = signUpPassword;

    return await new Promise((resolve, reject) => {
            // Search for dupe
            const dupeQuery = `SELECT email FROM users WHERE email='${signUpEmail}'`;

          /*  membersDatabase.query(dupeQuery, (err, res) => {
                if(err) reject(406);

                if(res.length > 0) {
                    console.log('Dupe exists');
                    reject(406);
                }
                console.log('No dupe otherwise');
                
                // resolve(205);
                
            }) */
            bcrypt.hash(userPlainTextPassword, saltRounds)
                .then((hashedPass) => {
                    const insertQuery = `INSERT INTO users VALUES('${signUpFirstName.trim()}', '${signUpLastName.trim()}', '${signUpEmail.trim()}', '${hashedPass}', 0, '${isAdmin}')`;
                    // Inserting into database here
                    membersDatabase.query(insertQuery, (err, insertRes) => {
                        //console.log(err);
                        if(err) reject(406);
                        console.log('Insert query ran. Should be added to the database');
                        resolve(205);
                    // next();
                    //return res.status(205).json({message: "Sign Up Successful"});
                    }) 
                })
           // const result = callInsertUser(saltRounds, userPlainTextPassword, signUpFirstName, signUpLastName, signUpEmail, signUpPassword, signUpConfirmPassword);
           // resolve(result);


    })

   

}


router.post('/',
    body('signUpEmail').isEmail(),
    body('signUpPassword').isLength({min: 5}),
    body('signUpConfirmPassword').isLength({min: 5}),
 (req, res) => {

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) {
        return res.status(403).json({errors: errors.array()});
    }

    const { signUpFirstName, signUpLastName, signUpEmail, signUpPassword, signUpConfirmPassword, isAdmin } = req.body;
    console.log(`signUpFirstName: ${signUpFirstName}`);
    console.log(`signUpLastName: ${signUpLastName}`);
    console.log(`signUpEmail: ${signUpEmail}`);
    console.log(`signUpPassword: ${signUpPassword}`);
    console.log(`signUpConfirmPassword: ${signUpConfirmPassword}`);

    try {
         authenticateUserSignUp(signUpFirstName, signUpLastName, signUpEmail, signUpPassword, signUpConfirmPassword)
        .then((result) => {
            console.log(`Result: ${result}`);
            
            if(result === 205) {
                // Insert user into database
                   const insert = insertUser(signUpFirstName, signUpLastName, signUpEmail, signUpPassword, signUpConfirmPassword, isAdmin);
                   insert
                    .then((insertRes) => {
                        console.log(`insert: ${insertRes}`);
                        if(insertRes === 205) {
                             console.log('Successfully added to database');
                             return res.status(205).json({message: "Sign Up Successful"});
                    }
                            
                })  
            }  

        
               // return res.status(206).json({message: "Sign Up Successful"});
           

        })
    } catch(err) {
        console.log(`Error in routes/index.js: ${err}`);
        return res.status(404).json({message: err});
    }
   
    
    //res.status(205).render('pages/index');
})  


module.exports = router;