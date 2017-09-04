var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
  var data = ''; 
// Create a readable stream  
var readerStream = fs.createReadStream('source.txt');
var writerStream = fs.createWriteStream('destination.txt');  
// Set the encoding to be utf8.   
readerStream.setEncoding('UTF8');  
// Handle stream events --> data, end, and error  
readerStream.on('data', function(chunk) {  
   data += chunk;  
});  
readerStream.on('end',function(){  
   writerStream.write(data,'UTF8');
   writerStream.end(); 
   res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();   
});  

writerStream.on('finish', function() {  
    console.log("Write completed.");  
});  
writerStream.on('error', function(err){  
   console.log(err.stack);  
});  

readerStream.on('error', function(err){  
   console.log(err.stack);  
});  
console.log("Program Ended");  

}).listen(8000);


 
 


