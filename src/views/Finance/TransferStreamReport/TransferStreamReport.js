export let header = [
    {
        "prop": "stat_datetime",
        "label": "业务发生时间",
        "fixed": true,
        "width": "160",
        "sortable": "descending",
    },
    {
        "prop": "transfer_out_adv_id",
        "label": "转出方账户ID",
        "width": "200",
    },
    {
        "prop": "transfer_out_adv_name",
        "label": "转出方账户名称",
        "width": "200",
    },
    {
        "prop": "transfer_out_adv_type",
        "label": "转出方账户类型",
        "width": "160",
    },
    {
        "prop": "transfer_out_adv1_id",
        "label": "转出方一代账户ID",
        "width": "160",
    },
    {
        "prop": "transfer_out_adv1_name",
        "label": "转出方一代账户名称",
        "width": "200",
    },
    {
        "prop": "transfer_out_cus_id",
        "label": "转出方客户ID",
        "width": "200",
    },
    {
        "prop": "transfer_out_cus_name",
        "label": "转出方客户名称",
        "width": "180",
    },
    {
        "prop": "transfer_in_adv_id",
        "label": "转入方账户ID",
        "width": "150",
    },
    {
        "prop": "transfer_in_adv_name",
        "label": "转入方账户名称",
        "width": "150",
    },
    {
        "prop": "transfer_in_adv_type",
        "label": "转入方账户类型",
        "width": "150",
    },
    {
        "prop": "transfer_in_adv1_id",
        "label": "转入方一代账户ID",
        "width": "180",
    },
    {
        "prop": "transfer_in_adv1_name",
        "label": "转入方一代账户名称",
        "width": "180",
    },
    {
        "prop": "transfer_in_adv_cus_id",
        "label": "转入方客户ID",
        "width": "180",
    },
    {
        "prop": "transfer_in_adv_cus_name",
        "label": "转入方客户名称",
        "width": "120",
    },
    {
        "prop": "transfer_type",
        "label": "转账类型",
        "width": "80",
    },
    {
        "prop": "transfer_un_grants",
        "label": "转账非赠款",
        "width": "150",
        "sortable": "descending",
    },
    {
        "prop": "transfer_grants",
        "label": "转账赠款",
        "width": "150",
        "sortable": "descending",
    },
    {
        "prop": "transfer_balance",
        "label": "转账总金额",
        "width": "150",
        "sortable": "descending",
    },
    {
        "prop": "operator",
        "label": "操作人",
        "width": "150",
    },
    {
        "prop": "ad_platform",
        "label": "平台类型",
        "width": "150",
    }
];

export let accountType = [
    {
        id: 'adv',
        value: '账户名称或ID'
    },{
        id: 'agent',
        value: '代理商账户名称或ID'
    }
];

export let transferInAccountType = [
    {
        id: 'transfer_in_adv_id',
        value: '账户名称或ID'
    },{
        id: 'transfer_in_agent_id',
        value: '代理商账户名称或ID'
    }
];

export let transferOutAccountType = [
    {
        id: 'transfer_out_adv_id',
        value: '账户名称或ID'
    },{
        id: 'transfer_out_agent_id',
        value: '代理商账户名称或ID'
    }
];

//转账类型
export let transferAccountType = [
    {
        value: '加款'
    },
    {
        value: '退款'
    }
];

export let InAccountType = [
    {
        value: '广告代理商'
    },
    {
        value: '广告主'
    },
    {
        value: '虚拟广告主'
    }
];

export let OutAccountType = [
    {
        value: '广告代理商'
    },
    {
        value: '广告主'
    },
    {
        value: '虚拟广告主'
    }
];
