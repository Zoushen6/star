export let needForm = {
    demand_name: "",
    product_industry: "",
    end_time: "",
    order_type: 1,
    media: 1,
    demand_type: 1,
    product_id: "",
    group_id: "",
    link: "",
    product_description: "",
    productLineOptions: "",
};

export let orderForm = {
    material_type: 1,
    order_name: "",
    special_requirement: "",
    prompt: "",
    reason: "",
    signReason: "",
};

export let deliveryForm = {
    fromSingleReason: "",
    rejectFileName: "",
    refusal: "",
};

export let needRules = {
    product_industry: [
        {required: true, message: "请选择产品行业"}
    ],
    product_id: [
        {required: true, message: "请选择产品名称"}
    ],
    order_type: [
        {required: true, message: "请选择下单类型", trigger: 'change'}
    ],
    media: [
        {required: true, message: "请选择投放媒体", trigger: 'change'}
    ],
    end_time: [
        {type: "date", required: true, message: "请选择截止日期"}
    ],
    group_id: [
        {required: true, message: "请选择接单团队"}
    ],
    demand_type: [
        {required: true, message: "请选择需求类型"}
    ],
    demand_name: [
        {required: true, message: "请输入需求名称"}
    ],
};

export let orderRules = {
    order_name: [
        {required: true, message: "请输入订单名称"}
    ],
    material_type: [
        {required: true, message: "请选择素材类型", trigger: 'change'}
    ],
    signReason: [
        {required: true, message: "请输入拒签理由"}
    ]
};