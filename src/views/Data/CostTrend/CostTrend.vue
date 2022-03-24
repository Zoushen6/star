<template>
    <div class="position-relative">

        <div>
            <el-popover
                placement="bottom-start"
                width="280"
                trigger="hover"
                popper-class="data-trend-detail">
                <div><span v-html="content"></span></div>
                <el-button type="text" class="data-desc" slot="reference">数据解读</el-button>
            </el-popover>

            <div class="customized-checkbox">
                <el-button :class="date===item?'button-active':''" size="mini" v-for="(item,idx) in allDate" :key="idx"
                           @click="chooseDate(item)">近{{item}}天
                </el-button>
            </div>

        </div>
        <div ref="chart" class="chart" style="height: 300px" v-loading="loading">

        </div>
    </div>
</template>

<script>

    import * as echarts from 'echarts';
    import {animationDuration, AxisColor, BgColor, TextColor, AxisLineWidth} from "@views/Data/ChartSetting";
    import {colors, XProp, YProp} from "@views/Data/CostTrend/CostTrend.js";

    export default {
        name: "CostTrend",
        created() {
            this.chartData = this.handleData();
        },
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
            this.chart = null
        },
        data() {
            return {
                chart: null,
                loading: false,
                chartData: null,
                content: "",
                date: 7,
                allDate: [7, 15, 30]
            }
        },
        methods: {
            chooseDate(val) {
                this.date = val;
                this.renderChart();
            },
            getDetail() {
                return this.chartData.yAxis.reduce((prev, next) => {
                    const str = `团队【${next.name}】在${next.maxDate} 消耗最高，为${next.max}元；在${next.minDate}消耗最低，为${next.min}元，平均值为${next.average}元。<br/>`
                    return prev + str;
                }, `近${this.date}日，`)
            },
            getLegend(obj) {
                const data = this.chartData.yAxis.map(Data => {
                    return {
                        name: Data.name,
                        textStyle: {color: TextColor},
                        itemStyle: {
                            color: BgColor,
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
                        left: "60px",
                        right: "60px",
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
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: TextColor
                    }
                };
                return obj;
            },
            getYAxis(obj) {
                obj.yAxis = {
                    type: 'value',
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: AxisColor,
                            width: AxisLineWidth
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        color: TextColor
                    }
                };
                return obj;
            },
            getSeries(obj) {
                obj.series = this.chartData.yAxis.map(Data => {
                    return {
                        data: Data.data,
                        type: 'line',
                        name: Data.name,
                        smooth: true,
                        lineStyle: {
                            color: Data.color
                        },
                        animationDuration,
                    };
                });
                return obj;
            },
            handleData(data = []) {
                const chartData = {};
                chartData.xAxis = data.length ? data[0].data.map(it => it[XProp]) : [];
                chartData.yAxis = data.map((item, idx) => {
                    const config = {
                        name: item.group_name,
                        min: item.min,
                        minDate: item.min_date,
                        max: item.max,
                        maxDate: item.max_date,
                        color: colors[idx],
                        average: item.ave,
                        data: []
                    };
                    item.data.forEach(it => {
                        config.data.push(Number(it[YProp]));
                    });
                    return config;
                });
                this.chartData = chartData;
                this.content = this.getDetail();
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
            httpGetData() {
                return this.$http.get("/report/screen/group-trend", {
                    params: {
                        select: this.date
                    }
                })
            },
            renderChart() {
                this.loading = true;
                this.httpGetData().then(res => {
                    if (res.data.code === 200) {
                        this.handleData(res.data.data);
                        this.setOptions();
                    }
                }).finally(() => {
                    this.loading = false;
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
    @import "@views/Data/Data";

    .data-desc {
        margin-left: 8px;
        color: $block-title-color;
    }

    .customized-checkbox {
        margin-right: 10px;
        float: right;
        padding-top: 5px;
    }

</style>
