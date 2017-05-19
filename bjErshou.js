import request from 'request'
import fs from 'fs'

import util from './src/util.js'

var arrPa = [{
    min_longitude: 116.1,
    max_longitude: 116.2,
}, {
    min_longitude: 116.2,
    max_longitude: 116.3,
    min_latitude: 39.5,
    max_latitude: 39.85
}, {
    min_longitude: 116.2,
    max_longitude: 116.3,
    min_latitude: 39.85,
    max_latitude: 40.2
}, {
    min_longitude: 116.3,
    max_longitude: 116.4,
    min_latitude: 39.5,
    max_latitude: 39.7
}, {
    min_longitude: 116.3,
    max_longitude: 116.4,
    min_latitude: 39.7,
    max_latitude: 39.75
}, {
    min_longitude: 116.3,
    max_longitude: 116.4,
    min_latitude: 39.75,
    max_latitude: 39.8
}, {
    min_longitude: 116.3,
    max_longitude: 116.4,
    min_latitude: 39.8,
    max_latitude: 39.85
}, {
    min_longitude: 116.3,
    max_longitude: 116.4,
    min_latitude: 39.85,
    max_latitude: 39.9
}, {
    min_longitude: 116.3,
    max_longitude: 116.4,
    min_latitude: 39.9,
    max_latitude: 40
}, {
    min_longitude: 116.3,
    max_longitude: 116.4,
    min_latitude: 40,
    max_latitude: 40.1
}, {
    min_longitude: 116.3,
    max_longitude: 116.4,
    min_latitude: 40.1,
    max_latitude: 40.2
}, {
    min_longitude: 116.4,
    max_longitude: 116.5,
    min_latitude: 39.5,
    max_latitude: 39.85
}, {
    min_longitude: 116.4,
    max_longitude: 116.5,
    min_latitude: 39.85,
    max_latitude: 40.2
}, {
    min_longitude: 116.5,
    max_longitude: 116.6,
    min_latitude: 39.5,
    max_latitude: 39.85
}, {
    min_longitude: 116.5,
    max_longitude: 116.6,
    min_latitude: 39.85,
    max_latitude: 40.2
}, {
    min_longitude: 116.6,
    max_longitude: 116.7,
    min_latitude: 39.5,
    max_latitude: 39.85
}, {
    min_longitude: 116.6,
    max_longitude: 116.7,
    min_latitude: 39.85,
    max_latitude: 40
}, {
    min_longitude: 116.6,
    max_longitude: 116.7,
    min_latitude: 40,
    max_latitude: 40.2
}]
var url = 'http://ajax.lianjia.com/ajax/mapsearch/area/community?min_longitude={min_longitude}&max_longitude={max_longitude}&min_latitude={min_latitude}&max_latitude={max_latitude}&&city_id=110000'

var url2 = 'http://ajax.lianjia.com/ajax/housesell/area/community?ids={xxx}&limit_offset=0&limit_count=100&sort=price_desc&&city_id=110000'

var j = request.jar();
var cookie = request.cookie('lianjia_uuid=feee582b-a051-4394-91be-7e318d74b250; select_city=610100; lianjia_ssid=b05a618a-2a27-44cb-9a0b-80dd78f80038')

function getAll() {
    var dataArr = []
    var dataObj = { status: 0 }

    function getData(i) {
        // console.log(arrPa[i])
        var url0 = url
        url0 = url0.replace('{min_longitude}', arrPa[i].min_longitude)
        url0 = url0.replace('{max_longitude}', arrPa[i].max_longitude)
        if (arrPa[i].min_latitude) {
            url0 = url0.replace('{min_latitude}', arrPa[i].min_latitude)
        } else {
            url0 = url0.replace('{min_latitude}', '39.5')
        }

        if (arrPa[i].max_latitude) {
            url0 = url0.replace('{max_latitude}', arrPa[i].max_latitude)
        } else {
            url0 = url0.replace('{max_latitude}', '40.2')
        }
        console.log(url0)

        j.setCookie(cookie, url0);
        request({ url: url0, jar: j }, function(err, response, body) {
            let obj = JSON.parse(body)
            console.log(obj.data.length)
            dataArr = dataArr.concat(obj.data)

            if (i == arrPa.length - 1) {
                dataObj.data = dataArr
                var filePath = __dirname + '/bjErshouJson/bjErshou-' + util.getTodayString() + '.json';

                if (fs.exists(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log('Del file ' + filePath);
                }

                var saveStr = JSON.stringify(dataObj)

                fs.writeFile(filePath, saveStr, 'utf8', function(err) {
                    if (err) {
                        throw err;
                    }

                    console.log('Save ' + filePath + ' ok~');
                    console.log('all----' + dataArr.length)
                    getEveryPan(dataArr)
                });

                console.log('北京整体楼盘信息 ok~');
            }
        });
    }

    for (let i = 0; i < arrPa.length; i++) {
            setTimeout(function() {
                getData(i)
            }, i * 3000)
        }
    }

    function getEveryPan(data) {
        console.log(data.length)

        function getLoupan(item) {
            let url3 = url2.replace('{xxx}', item.id)
            j.setCookie(cookie, url);
            request({ url: url3, jar: j }, function(err, response, body) {
                var filePath = __dirname + '/bjErshouJson/' + item.id + '-' + util.getTodayString() + '.json';

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
        for (let item of data) {
            setTimeout(function() {
                getLoupan(item)
            }, 200)
        }
    }

    getAll()
