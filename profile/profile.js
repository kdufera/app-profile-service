'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const validator = require('validator'); 
const axios = require('axios'); 



const ProfileSchema = new mongoose.Schema({
    id: {
        type:String,
        required:true,
        trim: true,
        minlength:6
    },
    imageType: {
        type: String,
        required: true,
        minlength: 5,
        maxlength:10

    },
    imageUrl: {
        type: String,
        required: true,
        minlength:20,
        maxlength:200
    },
    uploadedDate: {
        type: Date,
        required: true,
        maxlength:30

    }
});


ProfileSchema.methods.saveImageInfo = function () {
    var profile = this;
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWMxZTA5OWJkMTM0M2U4MWRiY2MxZTciLCJlbWFpbCI6InByb2ZpbGVAdnQuZWR1IiwiYWNjZXNzIjoiYXV0aCIsImlzcyI6IjIwMjAtMDUtMThUMDE6MTA6NDkuMTY3WiIsImlhdCI6MTU4OTc2NDI0OX0.yGUw2Zq-2XNxCFF-E1DlRnju07H1iNtpp6_lmIOMtJE";
    // TODO: can utilize auth service to issue a new web token. This token is used to authenticate b/w the two services.
    return profile.save().then((acg) => { 
        let userProfile = {
            userId: profile.id,
            imageType: profile.imageType,
            imageUrl : profile.imageUrl,
            token:token
        }
        if(!acg) {
            return Promise.reject("unable to save user profile");
        } else {
         axios.post('http://localhost:5000/api/v1/image/saveImage', {userProfile}).then(res => {
                if(res.statusCode == 200) {
                    // maybe added a sentFlag and update
                }
            });
            return Promise.resolve("user profile saved"); 
        }
    });
}


ProfileSchema.methods.checkForValidToken = function (token)  {
    var decoded;
    try {
        decoded = jwt.verify(token,"test_jwt_key");
    } catch (err) {
        if(err) {
            return Promise.reject("Error with token"); 
        }
    };
    return Promise.resolve(decoded);
}


const Profile = mongoose.model('Profile', ProfileSchema);
module.exports = {Profile};