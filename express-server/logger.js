var winston = require( 'winston' ),
	fs = require( 'fs' ),
	logDir='log', 
	env = process.env.NODE_ENV || 'development',
	logger,
	path = require('path');

winston.setLevels( winston.config.npm.levels );
winston.addColors( winston.config.npm.colors );

var logDirectory = path.join(__dirname, logDir)
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

logger = new( winston.Logger )({
	transports: [
		new winston.transports.Console( {
			level: 'warn',
			colorize: true
		} ),
		new winston.transports.File( {
			//level: env === 'development' ? 'debug' : 'info',
			level:'debug',
			filename: logDirectory + '/logs.log',
			maxsize: 1024 * 1024 * 10 ,// 10MB,
			name:'locallog'
		} ),
		new winston.transports.File( {
			level:'info',
			filename: __dirname + '/routes/uploads/logs.log',
			maxsize: 1024 * 1024 * 10, // 10MB
			name:'s3log',
			json:false
		} ),
    ],
	exceptionHandlers: [
		new winston.transports.File( {
			filename: logDirectory + '/exceptions.log'
		} )
    ],

    exitOnError: false
} );

module.exports = logger;
