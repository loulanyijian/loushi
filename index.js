import request from 'request'
import fs from 'fs'

import config from './config.js'
import util from './src/util.js'

function getCity(name){
	request({
		uri: 'http://' + name + config.base
	}, function(err, response, body) {
		//如果数据量比较大，就需要对返回的数据根据日期、酒店ID进行存储，如果获取数据进行对比的时候直接读文件
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