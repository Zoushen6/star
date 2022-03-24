let option = {
    xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            interval: 0,
            rotate: 45 ,
            formatter: function (val) {
                if(val.length > 7){
                    return  val.substring(0,7) + "..."
                }
                return val
            },
        },

        axisTick: {
            show: false,
        },
        axisLine: {
            show: false
        }
    },
    yAxis: [{
        type: 'value',
        min: 0,
        position: 'left',
        axisLabel: {
            formatter: '{value}'
        },
        splitLine: {
            lineStyle: {
                color: "#ebebeb"
            }
        }
    },
  ],
    grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        textStyle:{
            fontWeight:'normal',
        }
    },
    series: [
        {
            name: '总消耗',
            data: [],
            type: 'bar',
            barWidth : 28,
            symbolSize: 8,
            symbol:'circle',
            itemStyle:{
                color:'#4063DF',
                borderColor:'#4063DF',
            },
        },
    ]
};

const RankIcons = {
    1: "champion",
    2: "second",
    3: "third",
};
export {
    option,RankIcons
}
