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
    socialMediaType: {
        type: String,
        required: true,
        minlength: 5,
        maxlength:10

    },
    socialMediaUrl: {
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


ProfileSchema.methods.saveUserSocialMediaInfo = function () {
    var profile = this;
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWMyYzFlODcwOTg1ZjAwMTZjOTEwNjUiLCJlbWFpbCI6InByb2ZpbGVAdnQuZWR1IiwiYWNjZXNzIjoiYXV0aCIsImlzcyI6IjIwMjAtMDUtMThUMTc6MTI6MDguMDg3WiIsImlhdCI6MTU4OTgyMTkyOH0.VIYeoR1z2-Jph9PCyPnrBp9NkK7X3IgwJ4Xw4UkPc6s";
    return profile.save().then((acg) => { //TDOD: based  on user input should 
        //update currently stored FB,TW, or IG URL before saving a new record
        let scrapeProfile = {
            userId: profile.id,
            socialMediaType: profile.socialMediaType,
            socialMediaUrl : profile.socialMediaUrl,
            token:token
        }

        if(!acg) {
            return Promise.reject("unable to save user profile");
        } else {
         axios.post('https://picnic-scrape.herokuapp.com/api/v1/scrape/saveSocialMedia', {scrapeProfile}).then(res => {
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