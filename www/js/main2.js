var mainVue = new Vue({
	el: '#app',
	data: {
		'activeIndex': '',
		'baseUrl': '',
		'searchKey': '',
		'searchDate': '',
		'dongtaiDay': '',
		'dongtai': '',
		'cityArr': ['sh', 'su'],
		'cityNameArr': ['上海', '苏州'],
		'mainList': [],
	},
	methods: {
		showCity: function(i) {
			this.activeIndex = i
			this.searchKey = ''
			this.search(util.getTodayString())
		},
		searchByDate: function() {
			var d = document.getElementById('d1').value
			if (d) {
				this.search(d.replace(/-/g, ''))
			}
		},
		search: function(date) {
			var _this = this
			_this.baseUrl = 'http://' + this.cityArr[this.activeIndex] + '.fang.lianjia.com/detail/'
			var url = '../json/' + this.cityArr[this.activeIndex] + '-' + date + '.json'
			axios.get(url, {})
				.then(function(res) {
					if (res.data.errno === 0) {
						_this.mainList = res.data.dataList
					}
				})
				.catch(function(err) {
					console.log(err);
				})
		}
	}
});