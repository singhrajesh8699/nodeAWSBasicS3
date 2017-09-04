
// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('node-uuid');

AWS.config.update({ accessKeyId: 'AKIAJKESL7HTU6HA2BQQ', 
	secretAccessKey: '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' });
// Create an S3 client
var s3 = new AWS.S3();

// Create a bucket and upload something into it
var bucketName = 'prudhvitest' + uuid.v4();
var keyName = 'raj.txt';

s3.createBucket({Bucket: bucketName}, function() {
  var params = {Bucket: bucketName, Key: keyName, Body: 'Hello World!'};
  s3.putObject(params, function(err, data) {
    if (err)
      console.log(err)
    else
      console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
  });
});
