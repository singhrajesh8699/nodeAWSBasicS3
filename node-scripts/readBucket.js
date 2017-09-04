var express = require('express');
var AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({ accessKeyId: 'AKIAJKESL7HTU6HA2BQQ', 
	secretAccessKey: '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' });


//var file = require('fs').createWriteStream('test.csv');

//s3.getObject(params).createReadStream().pipe(file);

let app = express();
app.get('/download', function(req, res){
	var s3 = new AWS.S3();
    var filename= 'test.zip';
    var params = {Bucket: 'prudhvitest', Key: 'raj/'+filename};
    
	fs.writeFile(filename, '', function(err){
       if(err) {
           console.log(filename,err);
        }else{
        	var file = fs.createWriteStream(filename);
		    var stream= s3.getObject(params).createReadStream();
				stream.pipe(file);
				stream.on('error', function(err){
	    		    console.log(err);
			           });
				stream.on('finish', function(){
	    		    res.download(__dirname+'/'+filename,filename,function(err){
				    	fs.unlink(__dirname+'/'+filename);
				    	  console.log("download success")
				    });
			     });
			}
	});
});

app.listen(8081);