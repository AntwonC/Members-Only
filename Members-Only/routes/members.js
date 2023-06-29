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

const turnOnStatus = async (userEmail) => {
    const updateQuery = `UPDATE users 
                         SET memberStatus = ${1}
                         WHERE email = '${userEmail}'`;

    let result = await new Promise((resolve, reject) => {
        membersDatabase.query(updateQuery, (err, res) => {
            if(err) {
                console.log(err);
                reject('Error happened...');
            }


            resolve(205);

        })
    });

    return result;

}

const turnOffStatus = async (userEmail) => {
    const updateQuery = `UPDATE users 
                         SET memberStatus = ${0}
                         WHERE email = '${userEmail}'`;

    let result = await new Promise((resolve, reject) => {
        membersDatabase.query(updateQuery, (err, res) => {
            if(err) {
                console.log(err);
                reject('Error happened...');
            }


            resolve(205);

        })
    });

    return result;

}

router.post('/', async (req, res) => {
    const { email } = req.body;
    
    try {
        const callStatus = await turnOnStatus(email);
        if(callStatus === 205) {
            return res.json({status: 205});       
        } else {
            throw new Error('Error in changing status...');
        }
    } catch(err) {
        console.log(`Error in routes/members.js: ${err}`);
        return res.json({status: 405});
    }


    

});

router.post('/off', async (req, res) => {
    const { email } = req.body;
   
    try {
        const callStatus = await turnOffStatus(email);
        if(callStatus === 205) {
            return res.json({status: 205});       
        } else {
            throw new Error('Error in changing status...');
        }
    } catch(err) {
        console.log(`Error in routes/members.js: ${err}`);
        return res.json({status: 405});
    }


    

});

module.exports = router;