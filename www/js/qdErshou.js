Vue.filter('getSchool', function(value) {
    return value && value.school_name
})

Vue.filter('getFive', function(value) {
    return value
})

var mainVue = new Vue({
    el: '#app',
    data: {
        searchKey: '',
        mainList: [],
        showType: 0,
        louList: [],
        guanzhuList: ['中南海湾新城', '海尔地产·山海湾', '朱雀台',
            '亚德里亚海湾', '凤凰城', '千城凤梧金沙', '天泰阳光海岸', '提香海岸', '千禧银杏苑',
            '观海华庭二期', '中冶爱彼岸', '中冶爱彼岸二期'
        ],
        dongtai: '',
        onlyChange: false
    },
    created: function() {
        var _this = this
        var url = '../qdErshouJson/qdErshou' + '-' + util.getTodayString() + '.json'
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
            var url = '../qdErshouJson/qdErshou' + '-' + util.getYestody(util.getTodayString()) + '.json'
            axios.get(url, {})
                .then(function(res) {
                    if (res.data.status === 0) {
                        var yesList = res.data.data.sort(sortNumber)
                        for (let item of todayList) {
                            for (let item2 of yesList) {
                                if (item2.id == item.id) {
                                    if (item2.bs_avg_unit_price != item.bs_avg_unit_price || 
                                        item2.house_count != item.house_count) {
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
            var url = '../qdErshouJson/' + id + '-' + util.getTodayString() + '.json'
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
            var url = '../qdErshouJson/' + id + '-' + util.getYestody(util.getTodayString()) + '.json'
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
        var value1 = a.avg_unit_price * 1;
        var value2 = b.avg_unit_price * 1;
        return value2 - value1;
    }
}
