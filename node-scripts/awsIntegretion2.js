var streamingS3 = require('streaming-s3'),
    fs = require('fs');
 
var fStream = fs.createReadStream('ChannaMereya.mp4');
var uploader = new streamingS3(fStream, {accessKeyId: 'AKIAJKESL7HTU6HA2BQQ', secretAccessKey: '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'},
  {
    Bucket: 'prudhvitest',
    Key: 'ChannaMereya.mp4',
    ContentType: 'video/mp4'
  }
);
  
uploader.begin(); // important if callback not provided. 
 
/*uploader.on('data', function (bytesRead) {
  console.log(bytesRead, ' bytes read.');
});*/
 
/*uploader.on('part', function (number) {
  console.log('Part ', number, ' uploaded.');
});
 */
// All parts uploaded, but upload not yet acknowledged. 
uploader.on('uploaded', function (stats) {
  console.log('Upload stats: ', stats);
});
 
uploader.on('finished', function (resp, stats) {
  console.log('Upload finished: ', resp);
});
 
uploader.on('error', function (e) {
  console.log('Upload error: ', e);
});