<template>
    <div v-loading="loading">
        <span class="form-title">广告主客户消耗分层</span>
        <div ref="chart" :class="chartData && chartData.length ? '' : 'empty-chart'" style="height: 400px"></div>
    </div>
</template>

<script>
import * as echarts from "echarts";
import {option} from "@views/Finance/HomePage/CostSlice/CostSlice.js";
import HomePageMixin from "@views/Finance/HomePage/HomePageMixin";

export default {
    name: "CostSlice",
    mixins: [HomePageMixin],
    props: {
        company_id: {
            type: [Number, String]
        },
        module: String,
    },
    data() {
        return {
            option,
            chartData: [],
        }
    },
    mounted() {
        this.initChart();
        this.costSliceData();
    },
    methods: {
        searchFn(){
            this.costSliceData();
        },

        initChart() {
            this.chart = echarts.init(this.$refs.chart);
            this.resizeChart()
        },

        setOptions(){
            this.chart.clear();
            let Option = this.option;
            this.chartData.reverse().forEach((item,idx) => {
                Option.dataset.source[idx].total = item.num;
                Option.dataset.source[idx].ratio = item.radio;
            });
            this.chart.setOption(Option, true);
        },

        costSliceData() {
            this.loading = true;
            this.$http.get("/report/finance/data", {
                params: {
                    date_type: 'lastThree',
                    module: 'layer',
                    company_id: this.company_id,
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.chartData = res.data.data.list;
                    if(this.chartData && this.chartData.length)
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
</style>
