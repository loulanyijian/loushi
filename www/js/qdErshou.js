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
        guanzhuList:['中南海湾新城','龍城御苑','海尔地产·山海湾','鲁商蓝岸国际','朱雀台',
        			'亚德里亚海湾','凤凰城','天泰阳光海岸','提香海岸','千禧银杏苑',
        			'千禧龙花园','康大风和日丽','观海华庭二期','唐岛湾']
    },
    created: function() {
        var _this = this
        var url = '../qdErshouJson/qdErshou' + '-' + util.getTodayString() + '.json'
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
            var url = '../qdErshouJson/' + id + '-' + util.getTodayString() + '.json'
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
