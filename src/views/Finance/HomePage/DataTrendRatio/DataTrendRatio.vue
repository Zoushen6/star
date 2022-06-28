<template>
    <div  v-loading="loading">
        <div>
            <span class="form-title">数据趋势对比</span>
            <el-form class="customized-form inline-block f-r" :inline="true">
                <el-form-item class="short-item">
                    <el-select v-model="firstItem" placeholder="请选择" @change="handleSelect">
                        <el-option v-for="(item,key) in radioList" :key="key" :label="item.label" :disabled="secondItem===key"
                                   :value="key"></el-option>
                    </el-select>
                </el-form-item>

                <span class="radio-text">对比</span>

                <el-form-item class="short-item">
                    <el-select v-model="secondItem" placeholder="请选择" @change="handleSelect">
                        <el-option v-for="(item,key) in radioList" :key="key" :label="item.label" :disabled="firstItem===key"
                                   :value="key"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item class="short-item">
                    <el-select v-model="date" placeholder="近七日" @change="handleSelect">
                        <el-option v-for="(item,key) in allDate" :key="key" :label="item.label.substring(0,item.label.length-2)"
                                   :value="key"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div ref="chart" :class="list && list.length ? '' : 'empty-chart'"  style="height: 400px;"></div>
    </div>
</template>

<script>
import HomePageMixin from "@views/Finance/HomePage/HomePageMixin";
import * as echarts from 'echarts';
import {option} from "@views/Finance/HomePage/DataTrendRatio/DataTrendRatio.js";
import {AllDate} from "@tools/DateUtils";

export default {
    name: "DataTrendRatio",

    mixins: [HomePageMixin],

    props: {
        company_id: String
    },

    computed: {
        allDate: function () {
            //浅拷贝
            let newAllDate = Object.assign({},AllDate);
            delete newAllDate.yesterday;
            return newAllDate;
        },
        selectItem: function () {
            return [this.firstItem,this.secondItem]
        }
    },

    data(){
        return{
            date:'lastSeven',
            option,
            list:[],
            firstItem:"cost",
            secondItem:"company",
            radioList:{
                "cost": {
                    label:'总消耗',
                },
                "company": {
                    label:'有消耗公司',
                },
                "advertiser": {
                    label:'有消耗账户',
                },
                "grants_cost": {
                    label:'赠款消耗',
                },
            }
        }
    },

    mounted(){
        this.initChart();
        this.handleSelect();
    },

    methods: {
        searchFn(){
            this.handleSelect()
        },

        handleSelect(){
            this.loading = true;
            this.axiosList().then((res) => {
                if (res && res.data.code === 200){
                    this.list = res.data.data.list;
                }
            }).catch((err) => {
                console.warn(err)
            }).finally(() => {
                this.loading = false;
                this.paintChart();
            })
        },

        optionData(data){
            const chartData = this.selectItem.map(item => this.radioList[item].label);
            this.option.legend.data = this.chartData;
            this.option.series[0].name = chartData[0];
            this.option.series[1].name = chartData[1];
            const xAxis = [];
            const firstSeries = [];
            const secondSeries = [];
            data.forEach((item) => {
                xAxis.push(item['stat_datetime']);
                firstSeries.push(item[this.selectItem[0]])
                secondSeries.push(item[this.selectItem[1]])
            });
            this.option.xAxis.data = xAxis;
            this.option.series[0].data = firstSeries;
            this.option.series[1].data = secondSeries;
        },

        initChart() {
            this.chart = echarts.init(this.$refs.chart);
            this.resizeChart();
        },

        paintChart() {
            this.optionData(this.list);
            this.chart.clear();
            this.chart.setOption(this.option, true);
        },

        axiosList() {
            return this.$http.get("/report/finance/data", {
                params: {
                    date_type: this.date,
                    contrast_one:this.selectItem[0],
                    contrast_two:this.selectItem[1],
                    company_id: this.company_id,
                    module: "trend"
                }
            });
        },
    }
}
</script>

<style scoped lang="scss">

    .radio-text {
        margin-right: 8px;
        margin-left: -10px;
        line-height: 32px;
        font-size: $font-size-addition;
        color: $font-color-auxiliary;
    }

    @media screen and (max-width: 1366px) {
        /deep/.customized-form {
            .short-item {
                .el-input__inner, &.el-input__inner {
                    min-width: 100px;
                    width: 9vw;
                    max-width: 180px;
                }
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }

    .customized-form {
        .short-item:last-child {
            margin-right: 0;
        }
    }
</style>
