var AWS = require('aws-sdk');

AWS.config.update({ accessKeyId: 'AKIAJKESL7HTU6HA2BQQ', 
	secretAccessKey: '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' });

var s3 = new AWS.S3();
var params = {Bucket: 'prudhvitest'};


s3.listObjects(params, function(err, data) {
   if (err) console.log(err, err.stack); 
   else     console.log(data);
});