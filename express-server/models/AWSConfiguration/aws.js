var AWS = require('aws-sdk');
var zlib     = require('zlib');
var streamingS3 = require('streaming-s3');

AWS.config.update({ accessKeyId: 'AKIAJKESL7HTU6HA2BQQ', 
	secretAccessKey: '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' });

module.exports=AWS;