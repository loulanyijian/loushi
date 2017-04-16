var mainVue = new Vue({
	el: '#app',
	data: {
		'activeIndex': '',
		'baseUrl': '',
		'searchKey': '',
		'searchDate': '',
		'dongtaiDay': '',
		'dongtai': '',
		'showType': 'yestady',
		'cityArr': [
			'bj', 'cd', 'cq', 'cs', 'dl', 'gz', 
			'hz', 'hf', 'jn', 'nj', 
			'qd', 'sz', 'sjz', 'sy', 'tj', 
			'wh', 'xm', 'xa', 'yt'
		],
		'cityNameArr': [
			'北京','成都','重庆','长沙','大连','广州',
			'杭州','合肥','济南','南京',
			'青岛','深圳','石家庄','沈阳','天津',
			'武汉','厦门','西安','烟台',
		],
		'mainList': [],
		'nodata': ['dg','fs','hk','ls','qh','san','sh','su','wc','wn','zs','zh']
	},
	methods:{
		showCity: function(i){
			this.activeIndex = i
			this.searchKey = ''
			this.search(util.getTodayString())
			document.getElementById('d1').value = ''
		},
		searchByDate: function(){
			var d = document.getElementById('d1').value
			if (d) {
				this.search(d.replace(/-/g,''))
			}
		},
		search: function(date){
			var _this = this
			_this.baseUrl = 'http://' + this.cityArr[this.activeIndex] + '.fang.lianjia.com'
			var url = '../json/' + this.cityArr[this.activeIndex] + '-' + date + '.json'
			axios.get(url, {})
			    .then(function(res){
			        if (res.data.code === 1){
			        	_this.mainList = res.data.data
			        	_this.fenxi(res.data.data, date)
			        }
			    })
			    .catch(function(err){
			        console.log(err);
			    })
		},
		fenxi: function(mainList, date){
			this.dongtaiDay = this.cityNameArr[this.activeIndex] + date
			if(date === '20170405'){
				this.dongtai = '第一天爬数据，无动态'
			}else{
				this.dongtai = ''
				var zhangjiaArr = [] // 涨价
				var jiangjiaArr = [] // 降价
				var xinkaiArr = [] // 新开盘
				var shouqingArr = [] // 新售罄
				var hengpanArr = [] // 新横盘，即售价为0，之前售价不为0 
				var qipanArr = [] // 新起盘，之前的售价为0，现在不为0
				var oldNumAll = 0 // 旧的楼盘数
				var newNumAll = 0 // 新的楼盘数
				var oldNumFeiLing = 0 // 旧的售价不是0的楼盘数
				var newNumFeiLing = 0 // 新的售价不是0的楼盘数
				var oldPrizeAll = 0
				var newPrizeAll = 0

				var yestady = ''
				if(this.showType == 'all'){
					yestady = '20170405'
				}else{
					yestady = util.getYestody(date)
				}
				var _this = this
				var url = '../json/' + this.cityArr[this.activeIndex] + '-' + yestady + '.json'
				axios.get(url, {})
				    .then(function(res){
				        if (res.data.code === 1){
				        	mainListOld = res.data.data
				        	for(var k in mainListOld){
				        		oldNumAll++
				        		var item = mainListOld[k][0]
				        		if(item.show_price != 0 && item.show_price_unit =='元/平'){
				        			oldPrizeAll += 1*item.show_price
				        			oldNumFeiLing ++
				        		}
				        		if(typeof mainList[k] === 'undefined'){ // 售罄，不在列表里面的
				        			var shouqingObj = {
				        				name:item.resblock_name,
				        				price:item.show_price + item.show_price_unit
				        			}
				        			shouqingArr.push(shouqingObj)
				        		}else{ // 未售罄，还在售的，分情况考虑
				        			itemNew = mainList[k][0]
				        			itemNew.show_price = 1 * itemNew.show_price
				        			item.show_price = 1 * item.show_price
				        			if(item.show_price != 0){ // 之前不是售价0
				        				if(itemNew.show_price == 0){ // 新横盘
				        					var hengpanObj = {
				        						name:item.resblock_name,
				        						price:item.show_price + item.show_price_unit
				        					}
				        					hengpanArr.push(hengpanObj)
				        				}else if(itemNew.show_price > item.show_price){ // 涨价了
				        					var zhangjiaObj = {
				        						name:item.resblock_name,
				        						price:item.show_price + item.show_price_unit + 
				        								'----' + itemNew.show_price + itemNew.show_price_unit
				        					}
				        					zhangjiaArr.push(zhangjiaObj)
				        				}else if(itemNew.show_price < item.show_price){ // 降价了
				        					var jiangjiaObj = {
				        						name:item.resblock_name,
				        						price:item.show_price + item.show_price_unit + 
				        								'----' + itemNew.show_price + itemNew.show_price_unit
				        					}
				        					jiangjiaArr.push(jiangjiaObj)
				        				}
				        			}else{
				        				if(itemNew.show_price != 0){ // 新起盘
				        					var qipanObj = {
				        						name:item.resblock_name,
				        						price:itemNew.show_price + itemNew.show_price_unit
				        					}
				        					qipanArr.push(qipanObj)
				        				}
				        			}
				        		}
				        	}

				        	for(var k in mainList){
				        		newNumAll++
				        		var itemNew = mainList[k][0]
				        		if(itemNew.show_price != 0 && itemNew.show_price_unit =='元/平'){
				        			newPrizeAll += 1*itemNew.show_price
				        			newNumFeiLing ++
				        		}
				        		if(typeof mainListOld[k] === 'undefined'){ // 新开盘，不在旧列表里面的
				        			var xinkaiObj = {
				        				name:itemNew.resblock_name,
				        				price:itemNew.show_price + itemNew.show_price_unit
				        			}
				        			xinkaiArr.push(xinkaiObj)
				        		}
				        	}

				        	_this.dongtai += '旧楼盘数:' + oldNumAll + ', ' + '均价：' + parseInt(oldPrizeAll/oldNumFeiLing) + '元/平<br>'
				        	_this.dongtai += '新楼盘数:' + newNumAll + ', ' + '均价：' + parseInt(newPrizeAll/newNumFeiLing) + '元/平<br>'
				        	_this.dongtai += '涨价楼盘:' + JSON.stringify(zhangjiaArr) + '<br>'
				        	_this.dongtai += '降价价楼盘:' + JSON.stringify(jiangjiaArr) + '<br>'
				        	_this.dongtai += '新横盘楼盘:' + JSON.stringify(hengpanArr) + '<br>'
				        	_this.dongtai += '新起盘楼盘:' + JSON.stringify(qipanArr) + '<br>'
				        	_this.dongtai += '新开楼盘:' + JSON.stringify(xinkaiArr) + '<br>'
				        	_this.dongtai += '新售罄楼盘:' + JSON.stringify(shouqingArr) + '<br>'
				        }
				    })
				    .catch(function(err){
				        console.log(err);
				    })
			}
		}
	},
	created: function(){

	}
});