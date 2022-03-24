import {LastSeveralDays, CurWeek, CurMonth} from "@tools/DateUtils";

export const colors = [{
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [{
        offset: 0, color: '#0069F2' // 0% 处的颜色
    }, {
        offset: 1, color: '#00C8FF' // 100% 处的颜色
    }],
    global: false // 缺省为 false
}, '#FFA34B', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
export const XProp = "product_name";
export const YProps = [{key: "cost", legend: "总消耗", type: 'bar'}, {key: "rise", type: 'line'}];
