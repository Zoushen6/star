export let option = {
    xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            interval: 0,
            rotate: 45,
            formatter: function (val) {
                let res = val;
                if (res.length > 7) {
                    res = res.substring(0, 7) + "..."
                }
                return res
            },
        },
        //坐标轴刻度
        axisTick: {
            show: false,
        },
        //坐标轴轴线
        axisLine: {
            show: false,
        },
    },
    yAxis: [
        {
            type: 'value',
            position: 'right',
            axisLabel: {
                formatter: '{value}%'
            },
            //坐标轴在grid区域中的分隔线
            splitLine: {
                show: false,
            },
        },
        {
            type: 'value',
            position: 'left',
            axisLabel: {
                formatter: '{value}'
            },
            splitLine: {
                lineStyle: {
                    color: '#ebebeb'
                }
            }
        }
    ],
    grid: {
        left: '4%',
        right: '4%',
        top: '10%',
        bottom: '10%',
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        textStyle:{
            fontWeight: 'normal',
        },
    },
    legend: {
        bottom: '1%',
        left: '36%',
        itemGap: 30,
        itemWidth: 17,
        itemHeight: 8,
        data: ['总消耗', '上一周期环比'],
        itemStyle: {
            borderWidth: 1.5,
        }
    },
    series: [
        {
            name: '总消耗',
            data: [],
            type: 'bar',
            barWidth: 28,
            symbolSize: 8,
            yAxisIndex: 1,
            itemStyle: {
                color: '#4063DF',
                borderColor: '#4063DF',
            },
        },
        {
            name: '上一周期环比',
            data: [],
            type: 'line',
            symbolSize: 8,
            yAxisIndex: 0,
            //折线图默认是否显示拐点
            showSymbol: false,
            itemStyle: {
                color: '#40D2C4',
                borderColor: '#40D2C4',
            },
        },
    ]
};
