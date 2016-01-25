// Require components & depen
var fs 			= 	require('fs');
var path 		= 	require('path');
var express 	= 	require('express');
var bodyParser 	= 	require('body-parser');
var logger 		= 	require('morgan');
var router 		= 	express.Router();

var api 		= 	require('./routes/api');
var router 		= 	require('./routes/index');

// Main intialized application
var app 	=	express();
// Port setting
app.set('port', (process.env.PORT || 3000));
// Directory configuration
// app.use(express.static('./build'));
app.use('/', express.static(path.join(__dirname, './build')));
app.use('/assets', express.static('./node_modules'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/*
* =====================================================
* Middleware
* =====================================================
*/
router.use(logger());

 

/*
* =====================================================
* Public Router
* =====================================================
*/
app.use('/api', api);
app.use('/', router);

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
