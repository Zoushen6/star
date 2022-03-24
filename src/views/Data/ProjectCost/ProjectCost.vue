<template>
    <div class="position-relative">
        <div class="customized-checkbox f-r m-r-15">
            <el-button :class="date===key?'button-active':''" size="mini" v-for="(value,key) in allDate" :key="key"
                       @click="chooseDate(key)">{{value.label}}
            </el-button>
        </div>
        <div ref="chart" class="chart clear-both" style="height: 300px" v-loading="loading">

        </div>
    </div>
</template>

<script>

    import * as echarts from 'echarts';
    import {animationDuration, AxisColor, TextColor, BgColor, AxisLineWidth} from "@views/Data/ChartSetting.js";
    import {colors, XProp, YProps} from "@views/Data/ProjectCost/ProjectCost.js";
    import {AllDate,GetCurDates} from "@tools/DateUtils";

    export default {
        name: "ProjectCost",
        mounted() {
            this.$nextTick(() => {
                this.initChart()
            })
        },
        beforeDestroy() {
            if (!this.chart) {
                return
            }
            this.chart.dispose();
            this.chart = null;
        },
        computed:{
            allDate: function () {
                return AllDate;
            }
        },
        data() {
            return {
                chart: null,
                loading: false,
                date: "yesterday",
            }
        },
        methods: {
            chooseDate(val) {
                this.date = val;
                this.renderChart();
            },
            getLegend(obj) {
                const data = YProps.map((option, idx) => {
                    const Data = this.chartData[option.key];
                    return {
                        name: Data.name,
                        textStyle: {color: TextColor},
                        itemStyle: {
                            color: idx ? BgColor : Data.color,
                            borderWidth: 2,
                            borderColor: Data.color,
                        }
                    };
                });
                obj.legend = {
                    data,
                    bottom: "3%",
                    itemWidth: 12,
                    itemHeight: 6
                };
                return obj;
            },
            getDefaults(obj) {
                const defaults = {
                    color: colors,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    backgroundColor: "transparent",
                    grid: {
                        top: "30px",
                        left: "80px",
                        right: "80px",
                        bottom: "60px"
                    }
                };
                return Object.assign(obj, defaults);
            },
            getXAxis(obj) {
                obj.xAxis = {
                    type: 'category',
                    data: this.chartData.xAxis,
                    axisLine: {
                        lineStyle: {
                            color: AxisColor,
                            width: AxisLineWidth
                        }
                    },
                    axisLabel: {
                        color: TextColor
                    },
                    axisTick: {
                        show: false
                    }
                };
                return obj;
            },
            getYAxis(obj) {
                obj.yAxis = YProps.map((option, idx) => {
                    return {
                        type: 'value',
                        position: idx ? 'right' : 'left',
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: AxisColor
                            }
                        },
                        splitLine: {
                            show: !idx,
                            lineStyle: {
                                color: AxisColor,
                                width: AxisLineWidth
                            }
                        },
                        axisLabel: {
                            color: TextColor
                        },
                        axisTick: {
                            show: false
                        }
                    }
                });
                return obj;
            },
            getSeries(obj) {
                obj.series = YProps.map((option, idx) => {
                    const Data = this.chartData[option.key];
                    return {
                        data: Data.data,
                        type: Data.type,
                        name: Data.name,
                        smooth: true,
                        yAxisIndex: idx,
                        lineStyle: {
                            color: Data.color
                        },
                        areaStyle: idx ? null : {
                            color: colors[idx]
                        },
                        animationDuration,
                    };
                });
                return obj;
            },
            getLegendName() {
                return this.allDate[this.date].legend;
            },
            setOptions() {
                let Option = {};
                const chain = this.$common.compose(this.getDefaults, this.getLegend, this.getSeries, this.getXAxis, this.getYAxis);
                Option = chain(Option);
                this.chart.clear();
                /**
                 * setOption 第二个参数为notMerge https://echarts.apache.org/zh/api.html#echartsInstance.setOption
                 */
                this.chart.setOption(Option, true);
            },
            handleData(data = []) {
                const chartData = {};
                chartData.xAxis = [];
                YProps.forEach((item, idx) => {
                    chartData[item.key] = {
                        data: [],
                        min: Number.MAX_SAFE_INTEGER,
                        max: Number.MIN_SAFE_INTEGER,
                        sum: 0,
                        type: item.type,
                        name: item.legend ? item.legend : this.getLegendName(),
                        color: colors[idx]
                    }
                });
                data.forEach(item => {
                    chartData.xAxis.push(item[XProp]);
                    YProps.forEach(option => {
                        let num = Number(item[option.key]);
                        chartData[option.key].data.push(num);
                        chartData[option.key].min = Math.min(chartData[option.key].min, num);
                        chartData[option.key].max = Math.max(chartData[option.key].max, num);
                        chartData[option.key].sum += num;
                    });
                });
                YProps.forEach(item => {
                    if (!chartData.xAxis.length) {
                        chartData[item.key].average = 0;
                        chartData[item.key].min = 0;
                        chartData[item.key].max = 0;
                        return;
                    }
                    chartData[item.key].average = (chartData[item.key].sum / chartData.xAxis.length).toFixed(2);
                });
                this.chartData = chartData;
            },
            httpGetData() {
                const date = GetCurDates(this.date)
                this.loading = true;
                return this.$http.get("/report/screen/product-cost", {
                    params: {
                        start_date: date[0],
                        end_date: date[1]
                    }
                }).finally(() => {
                    this.loading = false;
                })
            },
            renderChart() {
                this.httpGetData().then(res => {
                    if (res.data.code === 200) {
                        this.handleData(res.data.data);
                        this.setOptions();
                    }
                });
            },
            initChart() {
                this.chart = echarts.init(this.$refs.chart, 'dark');
                this.renderChart();
            }
        }
    }
</script>

<style scoped lang="scss">
</style>
