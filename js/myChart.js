import utils from './utils.js'

function hm2hh (hm) {
  hm = hm || ''
  hm = '' + hm
  hm = hm.replace(':', '.')
  let hms = hm.split('.')
  if(hms.length < 2) {
    hms.push(0)
  }
  
  return +hms[0] + (+((+hms[1])/60.0).toFixed(2))
}

function hh2hm (hh) {
  hh = hh || ''
  hh = '' + hh
  
  let hhs = hh.split('.')
  if(hhs.length < 2) {
    hhs.push(0)
  }
  
  let h = +hhs[0]
  
 
  
  let ht = +hh - h
  
  let m = Math.round(ht*60)
  
  if(m < 0) {
    h = h -1
    m = m + 60
  }
  
   if(h < 0) {
    h = h + 24
  }
  
  if(m<10){
    m = '0' + m
  }
  return h + ":" + m
}


function showData(dataDy, dataVa){
  let timeLengthData = []
  dataVa.map(ad => {
    timeLengthData.push(ad.value[1] - ad.value[0])
  })

  let option = {
    legend: {
      show: true,
      bottom: 0,
      formatter: function(name){
        if (name == '睡眠时间') {
          return `${name}(绿色-12点前睡，粉色-小于6小时，蓝色-正常)`
        } else {
          return name
        }
      },
      data: [{
        name: '睡眠时间',
        itemStyle: {
          borderColor: '#fff',
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [{
                offset: 0, color: '#7bd9a5' // 0% 处的颜色
            }, {
                offset: 0.5, color: '#59c4e6' // 100% 处的颜色
            }, {
              offset: 1, color: '#edafda' // 100% 处的颜色
          }],
            global: false // 缺省为 false
          } 
        }
      }, {
        name: '睡眠时长'
      }]
    },
    title: {
      text: "2022"
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function(a){
        let s = a[0].data.value[1]
        let e = a[0].data.value[2]
        let sl = hh2hm(e-s)
        sl = sl.replace(":", ".") + " 小时"
        let t = a[0].data.value[5]
        
        let dw = utils.getDayOfWeek("2022-" + a[0].axisValue)

        return  `<span style="font-weight:bold">${a[0].axisValue}（${dw}）</span> <br>
        睡：${hh2hm(s)} <br>
        起：${hh2hm(e)} <br>
        长：${sl} <br>
        备注：${t}
        `
      }
    },
    grid: {
      left: 40,
      right: 40,
    },
    xAxis: {
      data: dataDy
    },
    yAxis: [
          {
            scale: true,
            splitArea: {
              show: true
            }
          }
        ],
    dataZoom: [
      {
        type: 'inside',
        start: dataDy.length-30,
      },
      {
        show: true,
        type: 'slider',
        bottom: 60,
        start: dataDy.length-30,
        end: dataDy.length,
        minValueSpan: 30
      }
    ],
    series: [
      {
        name: '睡眠时间',
        type: 'candlestick',
        data: dataVa
      },
      {
        name: '睡眠时长',
        type: 'line',
        lineStyle: {
          type: 'dotted'
        },
        data: timeLengthData,
        markLine: { 
          data: [{ type: 'average', name: 'Avg' }],
          label: {
            position: 'insideEndTop',
            formatter: '平均时长：{c}'
          }
        }
      }
    ]
  };

  var myChart = echarts.init(document.getElementById('myChart'));
  myChart.setOption(option);

  window.addEventListener("resize", () => {
      myChart.resize();
  });
}


// test {{
function getAndShowData_test(callback) {
  var note = g_note

  let noteList = note.split('\n')
  let dataDy = []
  let dataVa = []
  noteList.map(ad => {
    let adList = ad.split('-')
    
    dataDy.push(adList[0].substr(0,2) + '-' + adList[0].substr(2, 2))
    
    let text = ''
    if(adList.length >= 4) {
      text = adList[3]
    }
    let s = hm2hh(adList[1])
    let e = hm2hh(adList[2])
    if (s > e) {
      s = s - 24
    }
    
    let c1 = '#7bd9a5'
    let c2 = '#59c4e6'
    let c3 = '#edafda'
    let cc = c1
    if(s > 0) {
      cc = c2
    }
    
    if((e-s) < 6) {
      cc = c3
    }
    
    let itemStyle = {
      color: cc,
      color0: cc,
      borderColor: cc,
      borderColor0: cc
    }
      
    dataVa.push({
      value: [
        s, e, s, e, text
      ],
      itemStyle:itemStyle
    })
  })
  
  callback && callback(dataDy, dataVa)
}

// getAndShowData_test(showData);

// test }}

function getAndShowData(callback) {

  let apiRoot = "/api"
  let url = apiRoot + '/sleep-2022/list'
  axios.get(url)
  .then( res => {
    let noteList = res.data || []
    let dataDy = []
    let dataVa = []
    noteList.map(ad => {
      // {"_id":"61ed614b420ccf11fdf727e9","day":"01-23","start":"00:04","end":"07:00","text":"hello"}
      dataDy.push(ad.day)
      
      let text = ad.text
      let s = hm2hh(ad.start)
      let e = hm2hh(ad.end)
      if (s > e) {
        s = s - 24
      }
      
      let c1 = '#7bd9a5'
      let c2 = '#59c4e6'
      let c3 = '#edafda'
      let cc = c1
      if(s > 0) {
        cc = c2
      }
      
      if((e-s) < 6) {
        cc = c3
      }
      
      let itemStyle = {
        color: cc,
        color0: cc,
        borderColor: cc,
        borderColor0: cc
      }
        
      dataVa.push({
        value: [
          s, e, s, e, text
        ],
        itemStyle:itemStyle
      })
    })
    callback && callback(dataDy, dataVa)
    
  })
  .catch(error => {
    vant.Notify({ type: 'danger', message: '获取数据失败' });
    console.log("list fail: ", error)
  })
}

getAndShowData(showData);