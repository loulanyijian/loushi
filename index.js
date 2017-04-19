import request from 'request'
import fs from 'fs'

import config from './config.js'
import util from './src/util.js'

function getCity(name){
	var j = request.jar();
	var cookie = request.cookie('lianjia_uuid=feee582b-a051-4394-91be-7e318d74b250; select_city=610100; lianjia_ssid=b05a618a-2a27-44cb-9a0b-80dd78f80038')
	var url = 'http://' + name + config.base
	j.setCookie(cookie, url);
	request({url: url, jar: j}, function(err, response, body) {
		var filePath = __dirname + '/json/' + name + '-' + util.getTodayString() + '.json';

		if (fs.exists(filePath)) {
			fs.unlinkSync(filePath);
			console.log('Del file ' + filePath);
		}

		fs.writeFile(filePath, body, 'utf8', function(err) {
			if (err) {
				throw err;
			}

			console.log('Save ' + filePath + ' ok~');
		});

		console.log('Fetch ok~');
	});
}

for(let name of config.cityArr){
		getCity(name)
}
