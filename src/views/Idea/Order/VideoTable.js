let oe_convert_rate = (row) => {
    return row.oe_convert_rate + " %";
};

let oe_ctr = (row) => {
    return row.oe_ctr + " %";
};

let oe_valid_play_rate = (row) => {
    return row.oe_valid_play_rate + " %";
};

let oe_play_over_rate = (row) => {
    return row.oe_play_over_rate + " %";
};

let play_3s_ratio = (row) => {
    return row.play_3s_ratio + " %";
}

let HEADER = [
    {
        "prop": "name",
        "label": "视频",
        "width": "320",
        "align": "auto",
        "fixed": true,
        "showSlot": true,
        "slotName": 'video',
    },
    {
        "prop": "convert_cost",
        "label": "操作",
        "width": "150",
        "showSlot": true,
        "fixed": true,
        "slotName": 'buttons',
        "childSlots":[
            {
                "slotName": 'buttonCopyLink',
                "buttonName": '复制链接',
            },
            {
                "slotName": 'buttonDataTrend',
                "buttonName": '数据趋势',
            },
        ]
    },
    {
        "prop": "cost",
        "label": "总消费",
        "width": "120",
        "fixed": true,
        "sortable": "descending"
    },
    {
        "prop": "oe_cost",
        "label": "消费",
        "width": "120",
        "sortable": "descending"
    },
    {
        "prop": "oe_show",
        "label": "展示数",
        "width": "120"
    },
    {
        "prop": "oe_click",
        "label": "点击量",
        "width": "120"
    },
    {
        "prop": "oe_ctr",
        "label": "点击率",
        "formatter":oe_ctr
    },
    {
        "prop": "oe_avg_click_cost",
        "label": "点击单价"
    },
    {
        "prop": "oe_convert",
        "label": "转化量"
    },
    {
        "prop": "oe_convert_rate",
        "label": "点击转化率",
        "width": "100",
        "formatter":oe_convert_rate
    },
    {
        "prop": "oe_convert_cost",
        "label": "转化成本"
    },
    {
        "prop": "oe_total_play",
        "label": "总播放数"
    },
    {
        "prop": "oe_valid_play",
        "label": "有效播放数",
        "width": "100"
    },
    {
        "prop": "oe_valid_play_rate",
        "label": "有效播放率",
        "width": "100",
        "formatter":oe_valid_play_rate
    },{
        "prop": "oe_like",
        "label": "点赞数"
    },{
        "prop": "oe_comment",
        "label": "评论数"
    },{
        "prop": "oe_share",
        "label": "分享数"
    },{
        "prop": "oe_play_25_feed_break",
        "width": "110",
        "label": "25%播放进度"
    },{
        "prop": "oe_play_50_feed_break",
        "width": "110",
        "label": "50%播放进度"
    },{
        "prop": "oe_play_75_feed_break",
        "width": "110",
        "label": "75%播放进度"
    },{
        "prop": "oe_play_100_feed_break",
        "width": "110",
        "label": "99%播放进度"
    },{
        "prop": "oe_play_over_rate",
        "label": "播完率",
        "formatter":oe_play_over_rate
    }
];

let VIDEOHEADER = [
    {
        "prop": "name",
        "label": "视频",
        "width": "320",
        "align": "auto",
        "fixed": true,
        "showSlot": true,
        "slotName": 'video',
    },
    {
        "prop": "convert_cost",
        "label": "操作",
        "width": "150",
        "showSlot": true,
        "fixed": true,
        "slotName": 'buttons',
        "childSlots":[
            {
                "slotName": 'buttonCopyLink',
                "buttonName": '复制链接',
            },
            {
                "slotName": 'buttonDataTrend',
                "buttonName": '数据趋势',
            },
        ]
    },
    {
        "prop": "cost",
        "label": "总消费",
        "width": "120",
        "fixed": true
    },
    {
        "prop": "oe_cost",
        "label": "消费",
        "width": "120"
    },
    {
        "prop": "oe_cpm",
        "label": "素材曝光数",
        "width": "120"
    },
    {
        "prop": "play_3s_ratio",
        "label": "3s播放率",
        "formatter":play_3s_ratio
    },
    {
        "prop": "impression_1k_cost",
        "label": "平均千次曝光花费",
        "width": "130",
    },
    {
        "prop": "oe_avg_click_cost",
        "label": "平均点击单价",
        "width": "120",
    },
    {
        "prop": "oe_share",
        "label": "分享数"
    },
    {
        "prop": "oe_comment",
        "label": "评论数"
    },
    {
        "prop": "oe_like",
        "label": "点赞数"
    },
    {
        "prop": "report",
        "label": "举报数"
    },
    {
        "prop": "download_started",
        "label": "安卓下载开始数",
        "width": "120",
    },
    {
        "prop": "activation",
        "label": "激活数"
    },
    {
        "prop": "event_pay",
        "label": "付费次数"
    }
];

let option = {
    tooltip: {
        trigger: 'axis',
    },
    legend: {
        x:'center',
        y:'bottom',
        itemGap:30,
        itemWidth:24,
        itemHeight:16,
        data: ['消费', '转化率']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '11%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: [
        {
            type: 'value',
            nameLocation:'end',
            axisTick:{
                show: false ,
            },

        },{
            type: 'value',
            axisTick:{
                show: false ,
            },
            axisLabel: {
                formatter: (value) => {
                    return Number(value*100).toFixed(2) + '%';
                }
            },
        }
    ],
    series: [
        {
            name: '消费',
            type: 'line',
            symbolSize: 8,
            symbol:'circle',
            itemStyle:{
                color:'#2B4DFF',
                borderColor:'#2B4DFF',
            },
            data: []
        },
        {
            name: '转化率',
            type: 'line',
            symbolSize: 8,
            symbol:'circle',
            itemStyle:{
                color:'#40D2C4',
                borderColor:'#40D2C4',
            },
            yAxisIndex: 1,
            data: []
        },
    ]
};

export {
    HEADER,option,VIDEOHEADER
}