/* app.js

	Copyright 2017 Fast Dog Coding, LLC

	Licensed under the Apache License, Version 2.0 (the "License"); you may not
	use this file except in compliance with the License. You may obtain a copy
	of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
	WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
	License for the specific language governing permissions and limitations
	under the License.
*/
'use strict';

// Required modules
const express  = require('express'),
      hbs      = require('hbs'),
      cfenv    = require('cfenv');

// create a new express server
let app = express();

// express set up
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
let appEnv = cfenv.getAppEnv();

// set up handlebars view plugin (hbs)
hbs.registerPartials(__dirname + '/views/partials', () => {
	console.log('- Handlebars: partials loaded.');
});

// Routes
app.get('/', (req, res, next) => {
	let resume = require('./data/resume.json');
	res.status(200)
		.render('layout', resume);
});

// Error handler
app.use(function (err, req, res, next) {
	if (res.headersSent) {
		return next(err);
	}
	err.statusCode = err.statusCode || 500;
	console.dir(err);

	res.status(err.statusCode)
		.render('layout', err);
});

// Start server on the specified port and binding host
app.listen(appEnv.port || '3002', appEnv.bind, function () {
	console.log("Started server listening at " + appEnv.url);
});
