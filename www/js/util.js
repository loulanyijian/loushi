var util = {
	getTodayString:function(dStr){
		let d = dStr ? new Date(dStr) : new Date()
		let year = d.getFullYear()
		let month = d.getMonth()+1
		month = month < 10 ? '0' + month : month
		let date = d.getDate()
		date = date < 10 ? '0' + date : date
		return year + month + date
	},
	getYestody:function(date){
		var d = date.substr(0,4) + '-' + date.substr(4,2) + '-' + date.substr(6,2)
		var dStr = new Date(d).getTime()
		dStr -= 24 * 3600 * 1000
		return this.getTodayString(dStr)
	}
}