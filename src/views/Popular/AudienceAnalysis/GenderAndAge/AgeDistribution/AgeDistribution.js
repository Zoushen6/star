export let ageOption = {
    title: {
        left: 'center',
        textStyle: {
            fontSize: 14,
            fontWeight: 'normal',
            fontColor: '#333333'
        }
    },
    tooltip: {
        show: true,
        formatter: function (params) {
            let res = params.data.name + ': ' + params.data.value + '\n' + '占比: ' + params.data.convert + '%';
            return res
        }
    },
    legend: {
        orient: 'vertical',
        icon: "circle",
        itemGap: 17,
        itemWidth: 7,
        itemHeight: 7,
        right: '18%',
        top: '22%',
        data: [
            {name: '18-23岁'},
            {name: '24-30岁'},
            {name: '31-40岁'},
            {name: '41-50岁'},
            {name: '50岁以上'},
            {name: '其他'}
        ],
        formatter: function (params) {
            let res;
            ageOption.series[0].data.forEach(it => {
                if (it.name === params) {
                    res = params + '    ' + it.value;
                }
            })
            return res
        }
    },
    series: [
        {
            type: 'pie',
            radius: ['45%', '70%'],
            center: ["35%", "45%"],
            minAngle: 10,
            //无数据占位圆
            showEmptyCircle: false,
            data: [],
            itemStyle: {
                borderWidth: 3,
                borderColor: '#fff',
                color: (params) => {
                    let colorList = {
                        '18-23岁': '#5773FF',
                        '24-30岁': '#FFA34B',
                        '31-40岁': '#40D2C4',
                        '41-50岁': '#FFBD27',
                        '50岁以上': '#FF7775',
                        '其他': '#666666'
                    };
                    return colorList[params.name];
                },
            },
            label: {
                show: false
            },
            emphasis: {
                //鼠标移动到相应模块突出
                scale: true,
                scaleSize: 10
            }
        }
    ]
};

export const ageHeader = [
    {
        "prop": "age_name",
        "label": "年龄",
        "align": "center",
        "minWidth": "80",
    },
    {
        "prop": "cost",
        "label": "消耗(元)",
        "align": "center",
        "minWidth": "100",
        "sortable": "descending",
    },
    {
        "prop": "show",
        "label": "展示数",
        "align": "center",
        "minWidth": "100",
        "sortable": "descending",
    },
    {
        "prop": "click",
        "label": "点击数",
        "align": "center",
        "minWidth": "100",
        "sortable": "descending",
    },
    {
        "prop": "convert",
        "label": "转化数",
        "align": "center",
        "minWidth": "100",
        "sortable": "descending",
    },
];