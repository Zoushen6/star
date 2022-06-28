let option = {
    tooltip: {
        trigger: 'item',
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
    visualMap: {
        type: 'piecewise',//分段型
        orient: 'vertical',//水平
        itemWidth: 12,
        itemHeight: 12,
        itemGap: 12,
        min: 0,
        max: 1500,
        left: '5%',
        top: '50%',
        text: ['高', '低'],//取值范围的文字
        inRange: {
            color: ['#b2d1ff', '#0065f8']//取值范围的颜色
        },
        show: true//图注
    },
    geo: {
        map: 'china',
        roam: false,//不开启缩放和平移
        zoom: 1.23,//视角缩放比例
        // layoutCenter: ['60%', '50%'],
        // // 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
        // layoutSize: 400,
        label: {
            show: false,//显示地名
            fontSize: '10',
        },
        itemStyle: {
            borderColor: '#ebebeb',
            borderWidth: 1,
            color: '#f5f5f5'
        },
        emphasis: { //高亮状态
            label: {
                show: false,//显示地名
            },
            itemStyle: {
                areaColor: '#cff5ff',
                emphasis: {
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    borderWidth: 0,
                }
            }
        },
        select: {//点击选择状态
            label: {

            },
            itemStyle: {
                areaColor: '#cff5ff',//鼠标选择区域颜色
            },
        }

    },
    series: [
        {
            type: 'map',
            geoIndex: 0,
            data: []
        }
    ]
};
export {
    option
}
