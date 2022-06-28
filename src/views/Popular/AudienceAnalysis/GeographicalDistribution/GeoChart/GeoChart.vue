<template>
    <div>
        <div ref="chart"  style="height: 400px;"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import geoJson from './china.json'
echarts.registerMap('china', geoJson);
import HomePageMixin from "@views/Popular/AudienceAnalysis/HomePageMixin";
import {option} from "@views/Popular/AudienceAnalysis/GeographicalDistribution/GeoChart/GeoChart.js";
import {geoCoordMap,geoOption} from "@views/Popular/AudienceAnalysis/GeographicalDistribution/GeoChart/CityGeoChart.js"

export default {
    name: "GeoChart",

    mixins: [HomePageMixin],

    props: {
        list: {
            type: Array,
        },
        activeName: {
            type: String
        }
    },

    watch: {
        list: {
            handler: function (val) {
                this.List = val;
            },
            immediate:true,
        },

        activeName: {
            handler: function (val) {
               this.judgeActiveName()
            },
        },

    },

    mounted(){
        this.initChart();
        this.judgeActiveName()
    },

    data() {
        return {
            geoCoordMap,
            geoOption,
            option,
            List:[]
        }
    },

    methods: {
        initChart() {
            this.chart = echarts.init(this.$refs.chart);
            this.resizeChart();
        },

        judgeActiveName() {
            if(this.activeName === 'city') {
                this.revertCityGeo()
                //设置最大值  不然超出max的item不会显示在地图上
                if(this.List.length) {
                    this.geoOption.visualMap.max = this.List[0].value;
                }
                this.paintChart(this.geoOption)
            }else {
                if(this.List.length) {
                    this.option.visualMap.max = this.List[0].value;
                }
                this.option.series[0].data = this.List;
                this.paintChart()
            }
        },

        paintChart(option = this.option) {
            // this.optionData(this.list);
            // this.chart.clear();
            this.chart.setOption(option, true);
        },


        revertCityGeo() {
            let data = this.convertData(this.List)
            this.geoOption.series[0].data = data;
            this.geoOption.series[1].data = data.sort(function (a, b) {
                return b.value[2] - a.value[2];
            }).slice(0, 6);
        },

        convertData(data) {
            let res = [];
            for (let i = 0; i < data.length; i++) {
                let geoCoord = this.geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value),
                        ratio: data[i].ratio,
                        label: data[i].label,
                    });
                }
            }
            return res;
        }

    }
}
</script>

<style scoped>

</style>