import Data from "@views/Data/Data.scss";

export const animationDuration = 3000;
export const color = Data.dataColorBlueSecondary;
export const TextColor = Data.textColorSecondary;
export const colors = ["#FFD427","#00EBFC"];
export const AxisColor = "rgba(85, 193, 255, 0.4)";
export const BgColor = "#08294C";
export const AxisLineWidth = 1;
export const AreaGradient = [{
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [{
        offset: 0, color: 'rgba(255, 212, 39, 0.2)' // 0% 处的颜色
    }, {
        offset: 1, color: 'rgba(14, 206, 241, 0)' // 100% 处的颜色
    }],
    global: false // 缺省为 false
}, {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [{
        offset: 0, color: 'rgba(14, 206, 241, 0.2)' // 0% 处的颜色
    }, {
        offset: 1, color: 'rgba(14, 206, 241, 0)' // 100% 处的颜色
    }],
    global: false // 缺省为 false
}];
