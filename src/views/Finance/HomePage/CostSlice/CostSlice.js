export let option = {
    dataset: {
        source: [{
            "cost": "0元<近三日平均消耗<500元",
            "total": 0,
            "ratio": 0
        }, {
            "cost": "500元<=近三日平均消耗<1000元",
            "total": 0,
            "ratio": 0
        }, {
            "cost": "1000元<=近三日平均消耗<5000元",
            "total": 0,
            "ratio": 0
        },{
            "cost": "近三日平均消耗>=5000元",
            "total": 0,
            "ratio": 0
        }]
    },
    yAxis: {
        type: 'category',
        axisTick: {
            show: false,
        },
        axisLine: {
            show: false
        }
    },
    xAxis: {
        type: 'value',
        show: false
    },
    grid: {
        left: '1%',
        right: '5%',
        top: '5%',
        bottom: '0',
        containLabel: true
    },
    series: [
        {
            name: '总消耗',
            type: 'bar',
            barWidth: 28,
            symbolSize: 8,
            symbol: 'circle',
            itemStyle: {
                color: (params) =>{
                    let colorList = ['#E3E8FA','#C5D0F5','#A2B5F8','#859BEA'];
                    return colorList[params.dataIndex];
                },
            },
            //鼠标移到柱状图柱子上的颜色
            emphasis: {
                itemStyle: {
                    color: 'inherit',
                }
            },
            label: {
                show: true,
                position: 'insideLeft',
                color: '#333333',
                formatter: (params) => {
                    return params.data.total + "家 " + "(" + params.data.ratio + "%)"
                }
            },
            encode: {
                x: ['ratio'],
                y: ['cost']
            }
        },

    ]
};
