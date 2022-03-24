export let planList = [
    {
        value: '广告主账户或ID',
        id: 'advertiser'
    },{
        value: '代理商名称或ID',
        id: 'agent'
    },
];

export let header = [
    {
        "prop": "stat_datetime",
        "fixed":true,
        "width":'160',
        "label": "统计时间",
        "sortable": "descending",
    },{
        "prop": "advertiser_id",
        "label": "广告主账户ID",
        "width": "150",
        "fixed":true,
    },{
        "prop": "advertiser_name",
        "label": "广告主账户名称",
        "width": "220",
        "fixed":true,
    },{
        "prop": "agent_child_id",
        "label": "代理商子账户ID",
        "width": "160",
    },{
        "prop": "agent_child_name",
        "label": "代理商子帐户名称",
        "width": "160",
    },{
        "prop": "agent_id",
        "label": "代理商帐户ID",
        "width": "180",
    },{
        "prop": "agent_name",
        "label": "代理商帐户名称",
        "width": "180",
    },{
        "prop": "shared_grants_cost",
        "label": "共享赠款支出",
        "width": "150",
        "sortable": "descending",
    },{
        "prop": "cost",
        "label": "总支出",
        "width": "100",
        "sortable": "descending",
    },{
        "prop": "income",
        "label": "总存入",
        "width": "100",
        "sortable": "descending",
    },{
        "prop": "transfer_out",
        "label": "总转出",
        "width": "100",
        "sortable": "descending",
    },{
        "prop": "transfer_in",
        "label": "总转入",
        "width": "100",
        "sortable": "descending",
    },{
        "prop": "un_grants_balance",
        "label": "非赠款余额",
        "width": "120",
        "sortable": "descending",
    },{
        "prop": "grants_balance",
        "label": "赠款余额",
        "width": "120",
        "sortable": "descending",
    },{
        "prop": "balance",
        "label": "日终结余",
        "width": "120",
        "sortable": "descending",
    },{
        "prop": "frozen",
        "label": "冻结余额",
        "width": "120",
        "sortable": "descending",
    }
];