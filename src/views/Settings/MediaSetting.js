let header = [
    {
        "prop": "id",
        "label": "编号",
    },
    {
        "prop": "item",
        "label": "媒体名称",
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