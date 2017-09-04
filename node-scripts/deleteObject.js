var AWS = require('aws-sdk');

AWS.config.update({ accessKeyId: 'AKIAJKESL7HTU6HA2BQQ', 
	secretAccessKey: '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' });

var s3 = new AWS.S3();
var params = {Bucket: 'prudhvitest', Key: 'raj1.txt'};


s3.deleteObject(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);
});