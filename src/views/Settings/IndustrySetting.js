let header = [
    {
        "prop": "id",
        "label": "编号",
    },
    {
        "prop": "item",
        "label": "一级行业名称/二级行业名称",
    },
    {
        "prop": "convert_cost",
        "label": "操作",
        "showSlot": true,
        "slotName": 'button',
        "childSlots": [
            {
                "slotName": 'edit',
                "buttonName": '编辑',
            },
        ]
    }

];
export default header;