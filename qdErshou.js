import request from 'request'
import fs from 'fs'

import util from './src/util.js'

var url = 'http://ajax.lianjia.com/ajax/mapsearch/area/community?min_longitude=120&max_longitude=120.5&min_latitude=35.93&max_latitude=35.98&&city_id=370200&min_house_year=1&max_house_year=18&min_price=50&max_price=300&min_area=50&max_area=200'

var url2 = 'http://ajax.lianjia.com/ajax/housesell/area/community?ids={xxx}&limit_offset=0&limit_count=100&sort=price_desc&&city_id=370200'

var j = request.jar();
var cookie = request.cookie('lianjia_uuid=feee582b-a051-4394-91be-7e318d74b250; select_city=610100; lianjia_ssid=b05a618a-2a27-44cb-9a0b-80dd78f80038')

function getAll() {
    j.setCookie(cookie, url);
    request({ url: url, jar: j }, function(err, response, body) {
        var filePath = __dirname + '/qdErshouJson/qdErshou-' + util.getTodayString() + '.json';

        if (fs.exists(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Del file ' + filePath);
        }

        fs.writeFile(filePath, body, 'utf8', function(err) {
            if (err) {
                throw err;
            }

            console.log('Save ' + filePath + ' ok~');
            getEveryPan(body)
        });

        console.log('黄岛整体楼盘信息 ok~');
    });
}

function getEveryPan(data){
	data = JSON.parse(data)
	console.log(data.data.length)

	function getLoupan(item){
		let url3 = url2.replace('{xxx}',item.id)
		j.setCookie(cookie, url);
		request({ url: url3, jar: j }, function(err, response, body) {
		    var filePath = __dirname + '/qdErshouJson/' + item.id + '-' + util.getTodayString() + '.json';

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

		    console.log(item.name + ' ok~');
		});
	}
	for(let item of data.data){
		getLoupan(item)
	}
}

getAll()