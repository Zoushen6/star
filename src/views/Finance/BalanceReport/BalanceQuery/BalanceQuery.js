export let planList = [
    {
        value: '广告主账户或ID',
        id: 'advertiser'
    },{
        value: '广告主公司名称或ID',
        id: 'company'
    },
];

export let header = [
    {
        "prop": "advertiser_id",
        "label": "广告主账户ID",
        "minWidth": "200"
    },{
        "prop": "advertiser_name",
        "label": "广告主账户名称",
        "minWidth": "250"
    },{
        "prop": "company_id",
        "label": "广告主公司ID",
        "minWidth": "150"
    },{
        "prop": "company_name",
        "label": "广告主公司名称",
        "minWidth": "250"
    },{
        "prop": "st",
        "label": "签约公司",
        "minWidth": "120"
    },{
        "prop": "balance",
        "label": "总余额",
        "minWidth": "110",
        "sortable": "descending",
    },{
        "prop": "valid_balance",
        "label": "总可用余额",
        "minWidth": "110",
        "sortable": "descending",
    },{
        "prop": "transferred_balance",
        "label": "总可转余额",
        "minWidth": "110",
        "sortable": "descending",
    },{
        "prop": "un_grants_cost",
        "label": "近7日非赠款消耗",
        "minWidth": "140",
        "sortable": "descending",
    },{
        "prop": "st",
        "label": "未来7日预算",
        "minWidth": "120",
    },{
        "prop": "st",
        "label": "尚可充值余额",
        "minWidth": "120",
    },
]