function handleSize(num){
    if (num >= 1073741824) {
        num = num / (1073741824).toFixed(2) + "GB";
    } else if (num >= 1048576) {
        num = (num / 1048576).toFixed(2) + "MB";
    } else if (1048576 >= num && num >= 1024) {
        num = (num / 1024).toFixed(2) + "KB";
    } else {
        num = num + "B";
    }
    return num;
}

let fileSize = (row) => {
    return handleSize(row.size)
}

export let header = [
    {
        "prop": "raw",
        "label": "上传列表",
        "width": "auto",
        "showSlot": true,
        "slotName": 'video',
    },
    {
        "prop": "size",
        "label": "文件大小",
        "width": "auto",
        "formatter": fileSize,
    },
    {
        "prop": "name",
        "label": "文件名称",
        "width": "auto",
    },
    {
        "prop": "operate",
        "label": "操作",
        "width": "auto",
        "showSlot": true,
        "slotName": 'button',
        "childSlots": [
             {
                "slotName": 'deleteFile',
                "buttonName": '删除',
            }
        ]
    },
]