Vue.filter('getSchool', function(value) {
    return value && value.school_name
})

Vue.filter('getFive', function(value) {
    return value
})

Vue.filter('qudian', function(value) {
    value += ''
    return value.substring(0, value.indexOf('.'))
})

var mainVue = new Vue({
    el: '#app',
    data: {
        searchKey: '',
        mainList: [],
        showType: 0,
        louList: [],
        guanzhuList: ['济南万科城', '盖佳花园'],
        dongtai: '',
        onlyChange: false
    },
    created: function() {
        var _this = this
        var url = '../jnErshouJson/jnErshou' + '-' + util.getTodayString() + '.json'
        axios.get(url, {})
            .then(function(res) {
                if (res.data.status === 0) {
                    let sortArr = res.data.data.sort(sortNumber)
                        // _this.mainList = sortArr.sort(compare())
                    _this.showList(sortArr.sort(compare()))
                }
            })
            .catch(function(err) {
                console.log(err);
            })
    },
    methods: {
        showList: function(todayList) {
            var _this = this
            var url = '../jnErshouJson/jnErshou' + '-' + util.getYestody(util.getTodayString()) + '.json'
            axios.get(url, {})
                .then(function(res) {
                    if (res.data.status === 0) {
                        var yesList = res.data.data.sort(sortNumber)
                        for (let item of todayList) {
                            for (let item2 of yesList) {
                                if (item2.id == item.id) {
                                    if (item2.bs_avg_unit_price != item.bs_avg_unit_price) {
                                        item.zhangDie = '有变化'
                                    } else {
                                        item.zhangDie = ''
                                    }
                                    break
                                }
                            }
                        }
                        _this.mainList = todayList
                    }
                })
                .catch(function(err) {
                    console.log(err);
                })
        },
        showPan: function(id) {
            var _this = this
            var url = '../jnErshouJson/' + id + '-' + util.getTodayString() + '.json'
            axios.get(url, {})
                .then(function(res) {
                    if (res.data.status === 0) {
                        _this.louList = res.data.data.list
                        _this.showType = 1
                        _this.showDuibi(id, res.data.data.list)
                    }
                })
                .catch(function(err) {
                    console.log(err);
                })
        },
        showDuibi: function(id, todayList) {
            var _this = this
            _this.dongtai = ''
            var url = '../jnErshouJson/' + id + '-' + util.getYestody(util.getTodayString()) + '.json'
            axios.get(url, {})
                .then(function(res) {
                    if (res.data.status === 0) {
                        let zhangjiaList = []
                        let jiangjiaList = []
                        let xinshangList = []
                        let maichuList = []

                        var yesList = res.data.data.list
                        for (let item of todayList) {
                            let hasNum = 0
                            for (let item2 of yesList) {
                                if (item2.house_code == item.house_code) {
                                    hasNum++
                                    if (item2.price_total * 1 > item.price_total * 1) {
                                        let obj = {
                                            name: item.title,
                                            value: item2.price_total + '----' + item.price_total + '万'
                                        }
                                        jiangjiaList.push(obj)
                                    } else if (item2.price_total * 1 < item.price_total * 1) {
                                        let obj = {
                                            name: item.title,
                                            value: item2.price_total + '----' + item.price_total + '万'
                                        }
                                        zhangjiaList.push(obj)
                                    }
                                    break
                                }
                            }
                            if (!hasNum) {
                                let obj = {
                                    name: item.title,
                                    value: item.price_total + '万'
                                }
                                xinshangList.push(obj)
                            }
                        }

                        for (let item of yesList) {
                            let hasNum = 0
                            for (let item2 of todayList) {
                                if (item2.house_code == item.house_code) {
                                    hasNum++
                                    break
                                }
                            }
                            if (!hasNum) {
                                let obj = {
                                    name: item.title,
                                    value: item.price_total + '万'
                                }
                                maichuList.push(obj)
                            }
                        }

                        _this.dongtai += '<br><br><br><br>'
                        _this.dongtai += '<span class="red">' + todayList[0].community_name + '……房数:</span>' + todayList.length + '<br><br>'
                        _this.dongtai += '<span class="red">涨价的……' + zhangjiaList.length + '个:</span>' + JSON.stringify(zhangjiaList) + '<br><br>'
                        _this.dongtai += '<span class="red">降价的……' + jiangjiaList.length + '个:</span>' + JSON.stringify(jiangjiaList) + '<br><br>'
                        _this.dongtai += '<span class="red">新上的……' + xinshangList.length + '个:</span>' + JSON.stringify(xinshangList) + '<br><br>'
                        _this.dongtai += '<span class="red">刚卖出的……' + maichuList.length + '个:</span>' + JSON.stringify(maichuList) + '<br><br>'
                    }
                })
                .catch(function(err) {
                    console.log(err);
                    _this.todayChange = '这个小区刚上新二手房'
                })
        }
    }
})

function sortNumber(a, b) {
    return b - a
}

function compare() {
    return function(a, b) {
        var value1 = a.bs_avg_unit_price * 1;
        var value2 = b.bs_avg_unit_price * 1;
        return value2 - value1;
    }
}
