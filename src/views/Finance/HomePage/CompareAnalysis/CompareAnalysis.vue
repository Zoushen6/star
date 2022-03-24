<template>
    <div v-loading="loading">
        <span class="form-title">{{ title }}</span>
        <div class="inline-block f-r">
            <el-form class="customized-form inline-block" :inline="true">
                <el-form-item class="short-item">
                    <el-select v-model="costValue" placeholder="请选择" @change="handleCompareData">
                        <el-option v-for="(item,key) in costList" :key="key" :label="item.value"
                                   :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="short-item">
                    <el-select v-model="date" placeholder="请选择" @change="handleCompareData">
                        <el-option v-for="(item,key) in AllDate" :key="key"
                                   :label="item.label.substring(0,item.label.length-2)"
                                   :value="key"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div ref="chart" :class="chartData && chartData.length ? '' : 'empty-chart'" style="height: 455px"></div>
    </div>
</template>

<script>
import HomePageMixin from "@views/Finance/HomePage/HomePageMixin";
import {option} from "@views/Finance/HomePage/CompareAnalysis/CompareAnalysis.js";
import * as echarts from "echarts";
import {AllDate} from "@tools/DateUtils";

export default {
    name: "CompareAnalysis",
    mixins: [HomePageMixin],
    props: {
        title: {
            type: String,
            default: '行业Top5对比分析'
        },
        company_id: {
            type: [Number, String]
        },
        module: String,
        xAxis_data: String,
    },
    data() {
        return {
            date: 'lastSeven',
            option,
            AllDate,
            costValue: 'cost',
            costList: {
                'cost': {
                    value: '总消耗',
                },
                'convert_cost': {
                    value: '转化成本',
                }
            },
            chartData: [],
        }
    },
    mounted() {
        this.initChart();
        this.handleCompareData();
    },
    methods: {
        searchFn(){
            this.compareData();
        },

        handleCompareData() {
            this.compareData();
            this.modifyOption();
        },

        //修改与图例相关option的data
        modifyOption() {
            this.option.legend.data[0] = this.costList[this.costValue].value;
            this.option.series[0].name = this.costList[this.costValue].value;
            this.option.legend.data[1] = this.AllDate[this.date].legend;
            this.option.series[1].name = this.AllDate[this.date].legend;
        },

        initChart(){
            this.chart = echarts.init(this.$refs.chart);
            this.resizeChart()
        },

        setOptions() {
            this.chart.clear();
            let Option = this.option;
            Option.xAxis.data = this.chartData.map(item=>{return item[this.xAxis_data]});
            Option.series.forEach((it, idx) => {
                it.data = this.chartData.map(item => {
                    return idx === 0 ? item.cost : item.rise;
                });
            })
            this.chart.setOption(Option, true);
        },

        compareData() {
            this.loading = true;
            this.$http.get("/report/finance/data", {
                params: {
                    module: this.module,
                    date_type: this.date,
                    filter: this.costValue,
                    company_id: this.company_id,
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.chartData = res.data.data.list.sort((a,b)=>{
                        return b.cost - a.cost;
                    })
                    this.setOptions();
                }
            }).catch((err)=>{
                console.warn(err)
            }).finally(() => {
                this.loading = false;
            });
        },
    }
}
</script>

<style scoped lang="scss">

.customized-form {
    .short-item:last-child {
        margin-right: 0;
    }
}
</style>
