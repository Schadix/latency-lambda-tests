var AWS = require('aws-sdk');
var s3 = new AWS.S3();

module.exports = function(host, port) {
	var l = require('latency-lambda-client')(host, port);
	return {
		// method: src-bucket, src-key, dest-bucket, dest-key, testid, identifier
		copyS3: function(srcBucket, srcKey, dstBucket, dstKey, testid, identifier, callback) {
			l.sendToLatency(testid, identifier, "Start");
			s3.getObject({
					Bucket: srcBucket,
					Key: srcKey
				},
				function upload(err, data) {
					if (err) {
						callback(err, null);
					} else {
						l.sendToLatency(testid, identifier, "Upload-start");
						s3.putObject({
								Bucket: dstBucket,
								Key: dstKey,
								Body: data.Body
							},
							function(err, data) {
								if (err) {
									callback(err, null);
								} else {
									l.sendToLatency(testid, identifier, "Finish");
									callback(null, 'Successfully copied from ' + srcBucket + '/' + srcKey +
										' and uploaded to ' + dstBucket + '/' + dstKey);
								}
							}
						)
					}
				}
			);
		}
	}
}