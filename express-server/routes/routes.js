
var express = require('express');
var router = express.Router();
const path = require('path');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: __dirname+'/uploads/' });
var streamingS3 = require('streaming-s3');
var zlib     = require('zlib');
var AWS = require('aws-sdk');
var aws =require('../models/AWSConfiguration/aws')
var logger = require("../logger");
var AdmZip = require('adm-zip');
var rimraf = require('rimraf');
var jsforce = require('jsforce');
var conn = new jsforce.Connection();

/*//url parameter  localhost:port/p/123
router.get('/p/:id', function(req, res){
 res.send(req.params.id);
});

//query parameter  localhost:port/p?id=123
router.get('/p', function(req, res){
 res.send(req.query.id);
});

router.post('/p', function(req, res){
  var people = [
    { name: 'Dave', location: 'Atlanta' },
    { name: 'Santa Claus', location: 'North Pole' },
    { name: 'Man in the Moon', location: 'The Moon' }
  ];

  var peopleJSON = JSON.stringify(people);
  res.send(peopleJSON);
   
  });*/

router.all('/', function(req, res,next){
 res.render('upload');
});

function uploadFile(readerStream,file,filename,fileObject){
 var uploader=new streamingS3(readerStream, {accessKeyId: 'AKIAJKESL7HTU6HA2BQQ', secretAccessKey: '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'},
	  {
	    Bucket: 'prudhvitest',
	    Key: filename+'/'+file,
	    ContentType: fileObject.mimetype
	  });
 	uploader.begin();
	uploader.on('finished', function (resp, stats) {
	  console.log('Upload finished: ', resp);
      fs.unlink(__dirname+'/uploads/'+file)
	  logger.debug("successfully upload file :",file);
	 /*rimraf(__dirname+'/uploads', function () { console.log('done'); });
	  res.writeHead(200, {'Content-Type': 'text/html'});
	  res.write("successfully upload");
      res.end(); */  
	});
	uploader.on('error', function (e) {
	  console.log('Upload error: ', e);
	  logger.debug("error while uploading file :",fileObject.originalname);
	  logger.debug("Error",e);
	  rimraf(__dirname+'/uploads', function () { console.log('done'); });
	 });
}
 
function uploadCallBack(fileObject,filename){
  return new Promise(function(resolve,reject){
	if(!fileObject.originalname.match(/\.(zip|tar|gz|7z|zipx|tar.gz|tar.bz2)$/)) {
		logger.info("successfully upload file :",filename[0]+'.zip',function (err, level, msg, meta) {
		  var zip = new AdmZip();
	      zip.addLocalFile(fileObject.path);
	      zip.writeZip(__dirname+'/uploads/'+filename[0]+'.zip');
          resolve('succes')
		});
	}else{
		logger.info("successfully upload file :",fileObject.originalname,function (err, level, msg, meta) {
			resolve('succes')
		});
	}
  })	 
}

router.post('/uploadFile', upload.single('uploadFile'), function (req, res, next) {
    if (!req.file){
    	     logger.debug("No files were uploaded")
      return res.status(400).send('No files were uploaded.');
    }

    let fileObject = req.file;
    var readerStream='';
    var filename=fileObject.originalname.split("."); 
	uploadCallBack(fileObject,filename).then(function(resolve){
	  fs.readdir(__dirname+'/uploads', (err, files) => {
		logger.debug("readdirSync",err);
        if(!files || files.length === 0) {
        	rimraf(__dirname+'/uploads', function () { console.log('done'); });
		    console.log('provided folder'+ __dirname+'/uploads'+'is empty or does not exist.');
		    logger.debug('provided folder'+ __dirname+'/uploads'+'is empty or does not exist.')
		    return res.status(400).send('provided folder'+ __dirname+'/uploads'+'is empty or does not exist.');
		   }
		files.forEach( function (file){
			console.log(file)
		  if(file.match(/\.(zip|log)$/)) {
	        readerStream = fs.createReadStream(__dirname+'/uploads/'+file);
		    uploadFile(readerStream,file,filename[0],fileObject);
		   }else{
		   	fs.unlink(__dirname+'/uploads/'+file)
		   }
	    })
	  }) 
	}).catch(function(err){
		logger.debug("uploadCallBack",err);
	})
	 res.writeHead(200, {'Content-Type': 'text/html'});
	 res.write("successfully upload");
     res.end();
});

router.get('/download', function(req, res){
    res.render('download');
});

router.post('/downloadFile', function(req, res){
    
	var s3 = new aws.S3();
    var filename= req.body.fileName;
    var foldername=req.body.folderName;
    console.log(foldername+'/'+filename)
    var bucketName=req.body.bucketName;
    var params = {Bucket: bucketName, Key: foldername+'/'+filename};
    
	fs.writeFile(__dirname+'/'+filename, '', function(err){
       if(err) {
           console.log(err);
           logger.debug("Error",err);
        }else{
        	var file = fs.createWriteStream(__dirname+'/'+filename);
		    var stream= s3.getObject(params).createReadStream();
				stream.pipe(file);
				stream.on('error', function(err){
	    		    console.log(err);
	    		    logger.debug("stream Error",err);
			           });
				stream.on('finish', function(){
					logger.debug("File successfully stream");
	    		    res.download(__dirname+'/'+filename,filename,function(err){
	    		    	logger.debug("File successfully Download :", filename);
				    	fs.unlink(__dirname+'/'+filename);
				    	logger.debug("File successfully deleted :", filename);
				         });
			    });
			}
	});
 
});

module.exports = router;