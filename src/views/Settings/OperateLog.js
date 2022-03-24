let header = [
    {
        "prop": "result",
        "label": "操作结果",
        "showSlot": true,
        "align":'center',
        "slotName":"opResult"
    },
    {
        "prop": "create_time",
        "label": "操作时间",
    },
    {
        "prop": "department_name",
        "showTooltip":true,
        "className": "height-limit",
        "label": "操作部门",
    },
    {
        "prop": "group_name",
        "showTooltip":true,
        "className": "height-limit",
        "label": "操作团队",
    },
    {
        "prop": "username",
        "showTooltip":true,
        "className": "height-limit",
        "label": "用户名称",
    },
    {
        "prop": "role_name",
        "label": "用户角色",
    },
    {
        "prop": "title",
        "label": "操作内容",
    }
];
export default header;