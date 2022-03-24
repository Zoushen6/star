<template>
    <div class="position-relative">
        <el-row class="search-container f-r">
            <el-col :span="12">
                <customized-time-picker
                    :date.sync="trendDate"
                    :shortcutsSetting="shortcutsSettings"
                    :max-date="0"
                    size="mini">
                </customized-time-picker>
            </el-col>
            <el-col :span="12">
                <el-input v-model="advertiser_id" class="input-with-select" prefix-icon="el-icon-search"
                          size="mini" placeholder="请输入投放账号ID">
                    <el-button slot="append" @click="renderChart">搜索</el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-row class="middle-content clear-both">
            <el-col :span="10" class="data">
                <el-row type="flex" class="data-header" :gutter="20">
                    <el-col :span="4"></el-col>
                    <el-col :span="6"><span class="data-header-cell">最大值</span></el-col>
                    <el-col :span="6"><span class="data-header-cell">最小值</span></el-col>
                    <el-col :span="6"><span class="data-header-cell">平均值</span></el-col>
                </el-row>
                <template v-for="(value,key) in chartData">
                    <el-row type="flex" v-if="!(value instanceof Array) && value" class="data-body" :gutter="20">
                        <el-col :span="4" class="little-block-wrapper">
                            <span class="little-block" :style="{backgroundColor:value?value.color:'#FFFFFF'}"></span>
                        </el-col>
                        <el-col :span="6">{{value.max}}</el-col>
                        <el-col :span="6">{{value.min}}</el-col>
                        <el-col :span="6">{{value.average}}</el-col>
                    </el-row>
                </template>
            </el-col>
            <el-col :span="14">
                <el-checkbox-group v-model="checkedOptions" size="mini" :min="1" :max="2">
                    <el-checkbox v-for="(value,key) in allOptions" :label="key" :key="key" size="mini">{{value}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-col>
        </el-row>
        <div ref="chart" class="chart" style="height: 280px" v-loading="loading">

        </div>
    </div>
</template>

<script>

    import * as echarts from 'echarts';
    import {
        colors,
        animationDuration,
        AxisColor,
        AreaGradient,
        TextColor,
        BgColor,
        AxisLineWidth
    } from "@views/Data/ChartSetting";
    import {Options, XProp} from "@views/Data/AccountTrend/AccountTrend.js";
    import TimePickerMixin from "@mixins/TimePickerMixin";
    import {LastSeveralDays} from "@tools/DateUtils";

    export default {
        name: "AccountTrend",
        mixins: [TimePickerMixin],
        created() {
            this.allOptions = Options;
            this.checkedOptions = Object.keys(Options).slice(0, 2);
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
                allOptions: null,
                checkedOptions: null,
                advertiser_id: "",
                trendDate: LastSeveralDays(7, 1)
            }
        },
        methods: {
            getLegend(obj) {
                const data = this.checkedOptions.map(option => {
                    const Data = this.chartData[option];
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
                    bottom: "8%",
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
                    grid:{
                        top:"10%",
                        left:"80px",
                        right:"80px",
                        bottom:"25%"
                    }
                };
                return Object.assign(obj, defaults);
            },
            getXAxis(obj) {
                obj.xAxis = {
                    type: 'category',
                    data: this.chartData[XProp],
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
                obj.yAxis = this.checkedOptions.map((option, idx) => {
                    return {
                        type: 'value',
                        position: idx ? 'right' : 'left',
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: AxisColor,
                                width: AxisLineWidth,
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            color: TextColor
                        }
                    }
                });
                return obj;
            },
            getSeries(obj) {
                obj.series = this.checkedOptions.map((option, idx) => {
                    const Data = this.chartData[option];
                    return {
                        data: Data.data,
                        type: 'line',
                        name: Data.name,
                        smooth: true,
                        yAxisIndex: idx,
                        lineStyle: {
                            color: Data.color
                        },
                        areaStyle: {
                            color: AreaGradient[idx]
                        },
                        animationDuration,
                    };
                });
                return obj;
            },
            handleData(data = []) {
                const chartData = {};
                chartData[XProp] = [];
                this.checkedOptions.forEach((item, idx) => {
                    chartData[item] = {
                        data: [],
                        min: Number.MAX_SAFE_INTEGER,
                        max: Number.MIN_SAFE_INTEGER,
                        sum: 0,
                        name: Options[item],
                        color: colors[idx]
                    }
                });
                data.forEach(item => {
                    chartData[XProp].push(item[XProp]);
                    this.checkedOptions.forEach(option => {
                        let num = Number(item[option]);
                        chartData[option].data.push(num);
                        chartData[option].min = Math.min(chartData[option].min, num);
                        chartData[option].max = Math.max(chartData[option].max, num);
                        chartData[option].sum += num;
                    });
                });
                this.checkedOptions.forEach(item => {
                    if (!chartData[XProp].length) {
                        chartData[item].average = 0;
                        chartData[item].min = 0;
                        chartData[item].max = 0;
                        return;
                    }
                    chartData[item].average = (chartData[item].sum / chartData[XProp].length).toFixed();
                });
                this.chartData = chartData;
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
                return this.$http.get("/report/screen/account-trend", {
                    params: {
                        start_date: this.$common.getNewDay(this.trendDate[0]),
                        end_date: this.$common.getNewDay(this.trendDate[1]),
                        advertiser_id: this.advertiser_id,
                        select: JSON.stringify(this.checkedOptions)
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
                }).finally(()=>{
                    this.loading = false;
                });
            },
            initChart() {
                this.chart = echarts.init(this.$refs.chart, 'dark');
                this.renderChart();
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "@views/Data/Data";

    .search-container {
        color: $block-title-color;
        width: 58%;
        margin-right: 0.5%;

        .el-date-editor--daterange.el-input__inner {
            width: 200px;
            padding: 2px 8px;
        }

        /deep/ .el-input__inner {
            height: 26px;
            background-color: transparent;
            border-color: $data-border-color;
        }

        /deep/ .el-range-input,
        /deep/ .el-input__icon,
        /deep/ .el-range-separator,
        /deep/ .el-input__inner {
            color: $data-color-blue;
        }

        /deep/ .el-range-input {
            background-color: transparent;
        }

        /deep/ .el-input__inner::placeholder {
            color: #7DD5FF !important;
            font-size: 10px;
        }

        /deep/ .el-input__inner::-webkit-input-placeholder {
            color: #7DD5FF !important;
            opacity: 0.5;
            font-size: 12px;
        }

        /deep/ .el-input-group__append {
            background-color: $data-border-color;
            color: #7DD5FF;
            border-color: $data-border-color;
        }

        /deep/ .el-range__close-icon {
            display: none;
        }
    }

    .middle-content {
        height: 70px;
        padding-top: 10px;

        .el-checkbox {
            margin-right: 15px;
            margin-bottom: 12px;
        }

        /deep/ .el-checkbox__input + span.el-checkbox__label {
            color: $text-color-secondary;
            font-size: $font-size-addition;
            font-weight: $font-weight-base;
        }

        /deep/ .el-checkbox__input .el-checkbox__inner {
            background-color: #031122;
            border-color: rgba(85,211,255,0.7);
            width: $font-size-addition;
            height: $font-size-addition;
        }

        /deep/.el-checkbox__input.is-checked .el-checkbox__inner {
            border-color: $block-title-color;
        }

        /deep/ .el-checkbox__inner:after {
            border: 1px solid $block-title-color !important;
            border-top: 0 !important;
            border-left: 0 !important;
            top: 0;
            left: 3px;
        }
    }

    .data {
        padding-top: 5px;
        color: $data-color-blue;
        font-size: $font-size-mini;
        line-height: 18px;

        .little-block-wrapper {
            text-align: right;
            padding-right: 20px;
        }

        .little-block {
            display: inline-block;
            width: 6px;
            height: 3px;
            vertical-align: middle;
        }

        .data-header-cell {
            display: inline-block;
            transform: scale(0.8);
            transform-origin: left top;
        }

        .data-body {
            color: $text-color-secondary;
        }
    }
</style>
