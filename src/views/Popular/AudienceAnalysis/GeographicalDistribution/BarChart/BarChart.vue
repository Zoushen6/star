<template>
    <div>
        <div ref="chart" :class="list && list.length ? '' : 'empty-chart'"  style="height: 400px;"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import HomePageMixin from "@views/Popular/AudienceAnalysis/HomePageMixin";
import {option} from "@views/Popular/AudienceAnalysis/GeographicalDistribution/BarChart/BarChart.js";

export default {
    name: "GeoChart",

    mixins: [HomePageMixin],

    props: {
        list: {
            type:Array,
        }
    },

    watch: {
        list: {
            handler: function (val) {
                let data =  JSON.parse(JSON.stringify(val))
                this.List = data.slice(0, 10).reverse();
            },
            immediate: true
        },
    },

    mounted(){
        this.initChart();
        this.paintChart();
    },

    data() {
        return {
            option,
            List:[]
        }
    },

    methods: {
        initChart() {
            this.chart = echarts.init(this.$refs.chart);
            this.resizeChart();
        },

        paintChart() {
            // this.chart.clear();
            this.option.dataset.source = this.List;
            this.chart.setOption(this.option, true);
        },

    }
}
</script>

<style scoped>

</style>