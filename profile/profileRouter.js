'use strict';

const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {Profile} = require('./profile');

router.post('/saveSocialMedia',function(req, res) {

	let body = _.pick(req.body,['socialMediaType','socialMediaUrl','token']); //TODO: Token must be sent via header
	var profile = new Profile({
		socialMediaType:body.socialMediaType,
		socialMediaUrl:body.socialMediaUrl,
		uploadedDate: new Date()
	});

	profile.checkForValidToken(body.token).then((validToken) => {
		if(validToken) {
			profile.id = validToken._id;
			profile.saveUserSocialMediaInfo().then((data) => {
				if(data) {
					res.status(200).send();
				} else  {
					res.status(401).send();
				}
			});
		}
	}).catch((err) => {
		res.status(401).send();
		console.log(err)
	});

});

module.exports = router;
