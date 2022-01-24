import utils from './utils.js'

Vue.use(vant.Lazyload);

let apiRoot = "/api"

new Vue({
  el: "#myList",
  data(){
    return {
      showDialog: false,
      showTimePopup: false,
      defaultTime: '00:00',
      currentDate: null,
      timeType: '',  //day start end 
      datetimePickerType: '', // time month-day
      datetimePickerTitle: '',
      monthDay: '',
      startTime: '00:00',
      endTime: '07:00',
      description: '',
      _id: null,

      loading: true,
      finished: false,
      list: [] //{day: , start: ,end: , text}
    }
  },
  mounted () {
    this.currentDate = new Date()
    this.getData()

  },
  watch: {
    currentDate(newValue, oldValue) {
      let m = this.currentDate.getMonth()+1
      let d = this.currentDate.getDate()
      if (m < 10) {
        m = '0' + m
      }
      if (d < 10) {
        d = '0' + d
      }

      this.monthDay = m  + '-' + d
    },
    timeType(newValue, oldValue) {
      if(this.timeType == 'day') {
        this.datetimePickerType = 'month-day'
        this.datetimePickerTitle = '选择日期'
      } else {
        this.datetimePickerType = 'time'
        this.datetimePickerTitle = '选择时间'
      }
    }
  },
  methods: {
    getRandColor(){
      return '#f00'
    },
    getData() {
      let url = apiRoot + '/sleep-2022/list'
      axios.get(url)
      .then( res => {
        this.list = res.data || []
        this.list.reverse()
        this.list.map(it => {
          it.dayWithWeek = utils.getDayOfWeek("2022-" + it.day)
        })
        this.loading = false
        this.finished = true
      })
      .catch(error => {
        vant.Notify({ type: 'danger', message: '获取数据失败' });
        console.log("list fail: ", error)
        this.loading = false
        this.finished = true
      })
    },
    startEditMonthDay() {
      // this.defaultTime = this.monthDay
      
      this.defaultTime = new Date((new Date()).getFullYear() + "-" + this.monthDay)
      this.timeType = 'day'
      this.showTimePopup = true;
    },
    dateFormatter(type, val) {
      if (type === 'month') {
        return `${val}月`;
      } else if (type === 'day') {
        return `${val}日`;
      }
      return val;
    },
    startEditStartTime() {
      this.timeType = 'start'
      this.showTimePopup = true;
      this.defaultTime = this.startTime
    },
    startEditEndTime() {
      this.timeType = 'end'
      this.showTimePopup = true;
      this.defaultTime = this.endTime
    },
    onConfirmTime(value) {
      console.log('onConfirmTime', value);
      if(this.timeType == 'start') {
        this.startTime = value
      } else if(this.timeType == 'end') {
        this.endTime = value
      } else if(this.timeType == 'day') {
        this.currentDate = value
      } 
      
      this.showTimePopup = false;
    },
    submitForm(values) {
      let urlFix = this._id? 'update': 'create'
      
      let data = {
        day: this.monthDay,
        start: this.startTime,
        end: this.endTime,
        text: this.description
      }
      if(this._id) {
        data["_id"] = this._id
      }
      this.loading = true
      this.finished = false
      let url = apiRoot + '/sleep-2022/' + urlFix
      axios.get(url, {
        params: data
      })
      .then(res => {
        vant.Notify({ type: 'success', message: '提交成功' });
        window.location.reload()
      })
      .catch(error => {
        this.loading = false
        this.finished = true
        vant.Notify({ type: 'danger', message: '提交失败' });
        console.log("create fail: ", error)
      })
    },
    createData(){
      this.showDialog=true
      this._id = null
    },
    editData(item){
      this.monthDay = item.day
      this.startTime = item.start
      this.endTim = item.end
      this.description = item.text
      this._id = item._id

      this.showDialog = true
    },
    deleteData(item){
      vant.Dialog.confirm({
        title: '提交',
        message: '确认删除该条记录？',
      })
      .then(() => {
        let data = {
          _id: item._id,
        }
        let url = apiRoot + '/sleep-2022/delete'
        this.loading = true
        this.finished = false
        axios.get(url, {
          params: data
        })
        .then(res => {
          vant.Notify({ type: 'success', message: '删除成功' });
          window.location.reload()
        })
        .catch(error => {
          this.loading = false
          this.finished = true
          vant.Notify({ type: 'danger', message: '删除失败' });
          console.log("create fail: ", error)
        })
      })
      .catch(() => {
        // on cancel
      });
    }
  }
})







