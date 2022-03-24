let option = {
    tooltip: {
        trigger: 'axis',
        textStyle:{
            fontWeight:'normal',
        }
    },
    legend: {
        x:'center',
        y:'bottom',
        itemGap:30,
        itemWidth:17,
        itemHeight:8,
        data: ['总消耗', '转化成本'],
        itemStyle: {
            borderWidth: 1.5,
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '11%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: [],
        axisTick: {
            show: true,
            inside: true,
            lineStyle: {
                color: '#EBEBEB'
            }
        },
        axisLabel: {

        },
        axisLine: {
            show: false
        }
    },
    yAxis: [
        {
            type: 'value',
            nameLocation:'end',
            axisTick:{
                show: false ,
            },
            splitLine: {
                lineStyle: {
                    color: "#ebebeb"
                }
            }

        },{
            type: 'value',
            axisTick:{
                show: false,
            },
            splitLine: {
               show:false
            }
        }
    ],
    series: [
        {
            name: '总消耗',
            type: 'line',
            symbolSize: 8,
            showSymbol:false,
            itemStyle:{
                color:'#2B4DFF',
                borderColor:'#2B4DFF',
            },
            data: []
        },
        {
            name: '转化成本',
            type: 'line',
            symbolSize: 8,
            showSymbol:false,
            itemStyle:{
                color:'#FFA34B',
                borderColor:'#FFA34B',
            },
            yAxisIndex: 1,
            data: []
        },
    ]
};
export {
    option
}
