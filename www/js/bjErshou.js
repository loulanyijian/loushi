Vue.filter('getSchool', function(value) {
    return value && value.school_name
})

Vue.filter('getFive', function(value) {
    return value
})

Vue.filter('qudian', function(value) {
    value += ''
    return value.substring(0,value.indexOf('.'))
})

var mainVue = new Vue({
    el: '#app',
    data: {
        searchKey: '',
        mainList: [],
        showType: 0,
        louList: [],
        guanzhuList:['前进花园一区','龙腾苑六区','星河湾']
    },
    created: function() {
        var _this = this
        var url = '../bjErshouJson/bjErshou' + '-' + util.getTodayString() + '.json'
        axios.get(url, {})
            .then(function(res) {
                if (res.data.status === 0) {
                    let sortArr = res.data.data.sort(sortNumber)
                    _this.mainList = sortArr.sort(compare())
                }
            })
            .catch(function(err) {
                console.log(err);
            })
    },
    methods: {
        showPan: function(id) {
            var _this = this
            var url = '../bjErshouJson/' + id + '-' + util.getTodayString() + '.json'
            axios.get(url, {})
                .then(function(res) {
                    if (res.data.status === 0) {
                        _this.louList = res.data.data
                        _this.showType = 1
                    }
                })
                .catch(function(err) {
                    console.log(err);
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
