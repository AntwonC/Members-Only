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


const getPost = async () => {
    const selectQuery = `SELECT * FROM (
        SELECT * FROM post ORDER BY id DESC LIMIT 5
      ) as p ORDER BY id`;

    /* SELECT * FROM (
        SELECT * FROM post ORDER BY id DESC LIMIT 3
      ) as p ORDER BY id */
    // get the last 3 
    const result = await new Promise((resolve, reject) => {
        membersDatabase.query(selectQuery, (err, res) => {
            if(err) {
                reject(err);
            }
            //console.log(res[0].dateTime);
            const dataResult = JSON.parse(JSON.stringify(res));

            if(dataResult.length === 0) {
                reject('No data available...');
            } else {
                    let arr = [];
                for(let i = 0; i < dataResult.length; i++) {
                   //console.log(dataResult[i]);
                    arr.push(dataResult[i]);
                    
                }
              //  console.log(arr);
                resolve(arr);

            }

        })
    })

    return result;
}

const getAllPost = async () => {
    const selectQuery = `SELECT * FROM (
        SELECT * FROM post ORDER BY id DESC 
      ) as p ORDER BY id`;

    /* SELECT * FROM (
        SELECT * FROM post ORDER BY id DESC LIMIT 3
      ) as p ORDER BY id */
    // get the last 3 
    const result = await new Promise((resolve, reject) => {
        membersDatabase.query(selectQuery, (err, res) => {
            if(err) {
                reject(err);
            }
            //console.log(res[0].dateTime);
            const dataResult = JSON.parse(JSON.stringify(res));

            if(dataResult.length === 0) {
                reject('No data available...');
            } else {
                    let arr = [];
                for(let i = 0; i < dataResult.length; i++) {
                   //console.log(dataResult[i]);
                    arr.push(dataResult[i]);
                    
                }
              //  console.log(arr);
                resolve(arr);

            }

        })
    })

    return result;
}
const createPost = async (firstName, lastName, text, title, dateTime) => {

    let tempText = text.replaceAll("'", "''");
    

    const insertQuery = `INSERT INTO post (id, firstName, lastName, title, text, dateTime) 
    VALUES
   (NULL, '${firstName}', '${lastName}', '${title}', '${tempText}', '${dateTime}')`;
  

    console.log(`Datetime here ${dateTime}`);
    const id = await new Promise((resolve, reject) => {
        membersDatabase.query(insertQuery, async (err, res) => {
                if(err) reject(err);
                // create post here
                resolve(res);


            })
           
        
    });

    console.log(id);
    
   // const postQuery = `INSERT INTO post VALUES ('${firstName}, ${lastName}, ${title}, ${text}, ${dateTime}')`;

  /*  const result = await new Promise((resolve, reject) => {
        membersDatabase.query(postQuery, (err, res) => {
            if(err) {
                console.log(err);
                reject('Error happened....');
            }

            resolve(205);
        })
    }) */

    //return result;
}

const getUserName = async (userEmail) => {
    const nameQuery = `SELECT firstName, lastName FROM users WHERE email='${userEmail}'`;

    let result = await new Promise((resolve, reject) => {
        membersDatabase.query(nameQuery, (err, res) => {
            if(err) {
                reject('Error happened....');
            }

            console.log('-------------------------');
            console.log(`First and Last Name for this User`);
            console.log(res);
            console.log('-------------------------');

            const dataResult = JSON.parse(JSON.stringify(res));

            if(dataResult.length === 0) {
                reject('No first and last name for this user..');
            } else {
                const fullName = dataResult[0].firstName + ' ' + dataResult[0].lastName;
                console.log(`First Name: ${dataResult[0].firstName}`);
                console.log(`Last Name: ${dataResult[0].lastName}`);
                console.log(fullName);
                resolve(fullName.trim());
            }

        });
    });

    return result;
}

const checkSession = async (userEmail) => {
    const query = `SELECT * FROM sessions`;

    let result = await new Promise((resolve, reject) => {
        membersDatabase.query(query, (err, res) => {
            if(err) {
                reject('Error happened...');
            }
          //  console.log('res');

            console.log(typeof res);
            const databaseInfo = JSON.parse(JSON.stringify(res));

            if(databaseInfo.length === 0) {
                console.log('No data fetched from sessions DB');
                reject('No data fetched from sessions DB..');
            } else {
                const temp = JSON.parse(databaseInfo[0].data); // the session data
                console.log('-------------------------');
                for(let i = 0; i < databaseInfo.length; i++) {
                    const data = JSON.parse(databaseInfo[i].data);
                    console.log(data.email);
                    console.log(userEmail);
                    if(data.email === userEmail) {
                        console.log("data has to be resolved here");
                        resolve(data);
                    }
                }

                reject('User was not found in session database.');
                console.log('-------------------------');
               /* console.log('-----------------------------');   
               console.log(temp);  // this is a string ... need to convert to json        
               console.log('-----------------------------'); */
               //  console.log(databaseInfo.data);
               // resolve(databaseInfo);
            }

        })
    });

    return result;

}

const getSessionId = async (userEmail) => {
    const query = `SELECT * FROM sessions`;

    let result = await new Promise((resolve, reject) => {
        membersDatabase.query(query, (err, res) => {
            if(err) {
                reject('Error happened...');
            }

            console.log(typeof res);
            const databaseInfo = JSON.parse(JSON.stringify(res));

            if(databaseInfo.length === 0) {
                console.log('No data fetched from sessions DB');
                reject('No data fetched from sessions DB..');
            } else {
                const temp = JSON.parse(databaseInfo[0].data); // the session data
                console.log('-------------------------');
                for(let i = 0; i < databaseInfo.length; i++) {
                    const data = JSON.parse(databaseInfo[i].data);
                    
                    if(data.email === userEmail) {
                       // console.log(data);
                        resolve(databaseInfo[i].session_id);
                    }
                }

                reject('User was not found in session database.');
                console.log('-------------------------');
               /* console.log('-----------------------------');   
               console.log(temp);  // this is a string ... need to convert to json        
               console.log('-----------------------------'); */
               //  console.log(databaseInfo.data);
               // resolve(databaseInfo);
            }

        })
    })

    return result;
}

const getUserMemberStatus = async (userEmail) => {
    const getMemberStatusQuery = `SELECT memberStatus FROM users WHERE email='${userEmail}'`;

    let result = await new Promise((resolve, reject) => {
        membersDatabase.query(getMemberStatusQuery, (err, res) => {
            if(err) {
                reject('Error happened....');
            }

            const dataResult = JSON.parse(JSON.stringify(res));
            
            console.log(dataResult);
            if(dataResult.length === 0) {
                reject(`Can't get member status somehow...`);
            } else {
                const memStatus = dataResult[0].memberStatus;
                console.log('Inside getUserMemberStatus()');
                console.log(`memStatus: ${memStatus}`);
                resolve(memStatus);
            }
        });
    });
    console.log(result);
    return result;
}

const getUserAdminStatus = async (userEmail) => {
    const getAdminStatusQuery = `SELECT admin FROM users WHERE email='${userEmail}'`;

    let result = await new Promise((resolve, reject) => {
        membersDatabase.query(getAdminStatusQuery, (err, res) => {
            if(err) {
                reject('Error happened....');
            }

            const dataResult = JSON.parse(JSON.stringify(res));
            
            console.log(dataResult);
            if(dataResult.length === 0) {
                reject(`Can't get admin status somehow...`);
            } else {
                const adminStatus = dataResult[0].admin;
                console.log('Inside getAdminMemberStatus()');
                console.log(`adminStatus: ${adminStatus}`);
                resolve(adminStatus);
            }
        });
    });
    console.log(result);
    return result;
}

const deleteMessage = async (id) => {
    const deleteQuery = `DELETE FROM post WHERE id='${id}'`;

    const result = await new Promise((resolve, reject) => {
        membersDatabase.query(deleteQuery, (err, res) => {
            if(err) {
                reject('Error happened...');
            }

            resolve(res);
        })
    });

    return result;
}

router.get('/posts', async (req, res) => {
    try {
        const posts = await getPost();
      //  console.log(posts);
        return res.json({arr: posts});

    } catch(err) {
        console.log(`Error in routes/dashboard/post: ${err}`);
        return res.status(405).json({message: 'Error happened trying to retrieve posts'});
    }
})


router.get('/allPosts', async (req, res) => {
    try {
        const posts = await getAllPost();
      //  console.log(posts);
        return res.json({arr: posts});

    } catch(err) {
        console.log(`Error in routes/dashboard/post: ${err}`);
        return res.status(405).json({message: 'Error happened trying to retrieve all posts'});
    }
})
router.post('/', async (req, res) => {
    //console.log(req.session);
    const { userEmail } = req.body;
    console.log(req.body);
    console.log(`loginEmail in userDashboard: ${userEmail}`); // Obv doesn't work on browser refresh

    try {
        await checkSession(userEmail) // function to check if current user is allowed to stay logged in
        .then(async (data) => {
            console.log(`data in userDashBoard`);
            console.log(data);

            if(data.email === userEmail) {
                console.log('The email is in session database. Allow user to stay logged in!');

                await getUserName(userEmail) // function to get the user's first and last name
                .then((userFullName) => {
                    console.log(`userFullName: |${userFullName}|`);
                    const jsonData = {"fullName": userFullName };
                    console.log(jsonData);
                    const temp = JSON.parse(JSON.stringify(jsonData));
                    console.log(typeof temp);
                    console.log(temp);
                    console.log(`User Full Name: ${userFullName}`);
                    
                    return res.json({fullName: userFullName, status: 205});
                })

                //res.status(205).send
               // return res.status(205).json({message: 'User is in sessions database!'});
            } else { // emails do not match
                throw Error('No session data for this user is available.');
            }
        })
    } catch(err) {
        console.log(`Error in routes/userDashBoard.js: ${err}`);
        return res.json({status: 405});
    }
});

router.post('/logout', async (req, res) => {
    
    const { userEmail } = req.body;

    try {
        await getSessionId(userEmail)
        .then((userSessionID) => {
            console.log('---------------------------------');
            console.log('Session ID for this user');
            req.sessionStore.destroy(userSessionID);
            console.log(userSessionID);
            console.log('---------------------------------');
            return res.status(205).json({message: 'This user session is destroyed!'});
        })
        
    } catch(err) {
        console.log(`Error in routes/userDashBoard.js/logout: ${err}`);
        return res.status(405).json({message: 'Error happened trying to destroy session'});
    }
})

router.post('/create', async (req, res) => {
    const { firstName, lastName, text, title, dateTime } = req.body;
    console.log(firstName);
    console.log(lastName);
    console.log(title);
    console.log(`dateTime in CREATE ${dateTime}`);
    
    try {
        const postCreation = await createPost(firstName, lastName, text, title, dateTime);
        //console.log(postCreation);
        return res.json({status: 205});
    } catch(err) {
        console.log(err);
        return res.json({status: 405});
    }

})

router.post('/status', async (req, res) => {
    const { userEmail } = req.body;

    try {
        const memberStatus = await getUserMemberStatus(userEmail);
        console.log('In route /status... ');
        console.log(memberStatus);
        if(memberStatus === 1) { // is a member
            return res.json({status: 205, memStatus: memberStatus});
        } else if(memberStatus === 0) {
            return res.json({status: 205, memStatus: memberStatus});
        }
    } catch(err) {
        console.log('Error happened trying to get status....');
        return res.json({status: 405});
    }
})

router.post('/adminStatus', async (req, res) => {
    const { userEmail } = req.body;

    try {
        const adminStatus = await getUserAdminStatus(userEmail);
        console.log('In route /status... ');
        console.log(adminStatus);
        if(adminStatus === 1) { // is an admin
            return res.json({status: 205, admin: adminStatus});
        } else if(adminStatus === 0) {
            return res.json({status: 205, admin: adminStatus});
        }
    } catch(err) {
        console.log('Error happened trying to get status....');
        return res.json({status: 405});
    }
})

router.post('/delete', async (req, res) => {
    const { id } = req.body;
    
    try {
        console.log('Deleting a post..');
        const deleteResult = await deleteMessage(id);
        return res.json({status: 205});
    } catch(err) {
        return res.json({status: 405, error: 'Something went wrong when trying to delete..'});
    }

})



module.exports = router;