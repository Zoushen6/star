let option = {
    dataset: {
        source: []
    },
    tooltip: {
        formatter: function (params) {
            //要原点的话 params.marker
            if(params.value) {
                let val = params.name + '</br>' +
                    params.marker + params.data.label + ' ' + params.data.value + ' 占比: ' + params.data.ratio + '%'
                return val
            }else {
                return params.name
            }
        }
    },
    xAxis: {
        type: 'value',
        show: false
    },
    yAxis: {
        type: 'category',
        axisTick: {
            show: false,
        },
        axisLine: {
            show: false
        },
        axisLabel: {
            color: '#333333',
            padding: [0,35,0,0]
        }
    },
    grid: {
        left: '15%',
        right: '10%',
        top: '5%',
        bottom: '0',
        containLabel: true
    },
    series: [
        {
            type: 'bar',
            barWidth: 10,
            itemStyle: {
                color:'#4063DF',
                borderRadius: 5,
            },
            label: {
                show:true,
                position: 'right',
                distance: 10
            },
            encode: {
                x: ['value'],
                y: ['name']
            }
        }
    ]
};
export {
    option
}