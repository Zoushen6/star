export const paginationLayout = {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
};
export const iconList = {
        1:"champion",
        2:"second",
        3:"third",
        4:"justsoso"
};
export const orderSortRule = [
    {
        label:"按消费降序排序",
        value:1
    },{
        label:"按消费升序排序",
        value:2
    }
];
export const videoOrderSort = {
        1:['cost','desc'],
        2:['cost','asc'],
        3:['stat_start_time','desc'],
        4:['stat_start_time','asc'],
};
export const rankRange = [
    {
        label:"昨日排行",
        value:1,
        isPlain:false
    },{
        label:"7日排行",
        value:7,
        isPlain:true
    },{
        label:"30日排行",
        value:30,
        isPlain:true
    },
];