export let genderOption = {
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
        bottom: '5%',
        icon: "circle",
        itemWidth: 7,
        itemHeight: 7,
        data: [
            {name: '男'},
            {name: '女'},
            {name: '其他'}
        ]
    },
    series: [
        {
            type: 'pie',
            radius: '70%',
            center: ["50%", "45%"],
            minAngle: 10,
            //无数据占位圆
            showEmptyCircle: false,
            data: [],
            itemStyle: {
                borderWidth: 3,
                borderColor: '#fff',
                color: (params) => {
                    let colorList = {'男': '#5773FF', '女': '#FFA34B', '其他': '#666666'};
                    return colorList[params.name];
                },
            },
            label: {
                show: false
            },
            emphasis: {
                scale: true,
                scaleSize: 10
            }
        }
    ]
};

export const genderHeader = [
    {
        "prop": "gender_name",
        "label": "性别",
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