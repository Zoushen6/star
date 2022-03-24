<template>
    <div class="container" v-loading="loading">
        <div>
            <span class="form-title">{{title}}</span>
            <el-form class="customized-form inline-block f-r" :inline="true">
                <el-form-item class="short-item">
                    <el-select v-model="date" placeholder="昨日" @change="listLoad">
                        <el-option v-for="(item,key) in AllDate" :key="key" :label="item.label.substring(0,item.label.length-2)"
                                   :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  v-for="item in buttonList" :key="item.value" size="mini" class="chart-table-button">
                    <el-button :class="buttonStyle == item.value ? 'button-active' : ''" @click="buttonClick(item.value)">
                        <span class="iconfont" :class="item.iconName"></span>
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-show="buttonStyle === 'chart'" ref="chart" :class="list && list.length ? '' : 'empty-chart'"  style="height: 388px" ></div>

        <customized-table
            v-show="buttonStyle === 'table'"
            class="customized-table white-table mini-table has-border without-pagination"
            :max-height="null"
            :showPagination="false"
            :Data="list"
            :Header="header"
        >
            <template v-slot:rank="{row}">
                <svg-icon v-if="showRankIcon(list.indexOf(row) + 1)" :icon-name="rankIcons[list.indexOf(row) + 1]">
                </svg-icon>
                <span :class="showRankIcon(list.indexOf(row) + 1)?'offset':''">{{list.indexOf(row) + 1}}</span>
            </template>
            <template v-slot:circleRatio="{row}">
                <span>{{row.circleRatio.toFixed(2) + "%"}}</span>
            </template>
        </customized-table>

    </div>
</template>

<script>
import HomePageMixin from "@views/Finance/HomePage/HomePageMixin";
import * as echarts from 'echarts';
import {option,RankIcons} from "@views/Finance/HomePage/CommonCostRank/CommonCostRank.js";
import {AllDate} from "@tools/DateUtils";

export default {
    name: "CommonCostRank",

    props: {
        company_id:[String,Number],
        header:Array,
        title:String,
        xAxis_data:String,
        module: String
    },

    mixins: [HomePageMixin],

    created(){
    },

    computed:{
        rankIcons:function () {
            return RankIcons;
        }
    },

    data(){
        return{
            date:'yesterday',
            option:{},
            list:[],
            AllDate,
            buttonList: [
                {
                    iconName:'icon-chart',
                    value:'chart',
                },{
                    iconName:'icon-table',
                    value:'table',
                }
            ],
            buttonStyle: 'chart',
        }
    },

    mounted(){
        //深拷贝option 防止共用一个option覆盖数据  (两个替代品Option分别给两个组件，改option时互相不干扰)
        this.option = this.$common.deepCopy(option, this.option);
        this.initChart();
        this.listLoad();
    },

    methods: {
        searchFn(){
            this.listLoad()
        },

        buttonClick(value){
            this.buttonStyle = value;
            if(this.buttonStyle === "chart"){
                this.paintChart();
            }
        },

        initChart() {
            this.chart = echarts.init(this.$refs.chart);
            this.resizeChart()
        },

        paintChart() {
            this.optionData(this.list);
            this.chart.clear();
            this.chart.setOption(this.option, true);
        },

        showRankIcon(rank) {
            return rank <= 3;
        },

        axiosList() {
            return this.$http.get("/report/finance/data", {
                params: {
                    date_type: this.date,
                    company_id: this.company_id,
                    module: this.module
                }
            });
        },

        optionData(data){
            const xAxis = [];
            const series = [];
            data.forEach((item) => {
                xAxis.push(item[this.xAxis_data]);
                series.push(item['cost']);
            })
            this.option.xAxis.data = xAxis;
            this.option.series[0].data = series;
        },

        listLoad(){
            this.loading = true;
            this.axiosList().then((res) => {
                if (res && res.data.code === 200){
                    this.list = res.data.data.list;
                }
            }).catch((err) => {
                console.warn(err)
            }).finally(() => {
                this.loading = false;
                this.buttonClick(this.buttonStyle);
            })
        },

    }
}
</script>

<style scoped lang="scss">
    @import "src/views/Finance/white-table";

    .container {
        height: 419px;
    }

    .el-button--mini {
        padding: 6px 0;
        border: 0;
        background-color: $font-color-white;
        .iconfont {
            font-size: 18px;
        }
    }

    .button-active {
        .icon-chart:before {
            color: $theme-color;
        }
        .icon-table:before {
            color: $theme-color;
        }
    }

    /deep/.customized-table {
        //父级可用大小775.5px   fit-content max-content min-content取到776px(浏览器好像不支持)  100%或其他都是775.5px
        //99.99%取到775.42px  后面的小数大于等于0.5时 客户消耗排行表格右border就显示不出来 小于可以
        //微调homepage :gutter=16.1  宽度小数不是0.5也可以显示border
        width: 99.99%;
        height: 388px;
        .el-table {
            .el-table__cell {
                border-right: 1px solid $bg-color-divider;
                border-bottom: 1px solid $bg-color-divider;
            }

            th.el-table__cell.is-leaf {
                border-top: 1px solid $bg-color-divider;
                &:first-child{
                    border-left: 1px solid $bg-color-divider;
                }
            }

            tbody {
                tr {
                    td:nth-child(1) {
                        border-left: 1px solid $bg-color-divider;
                    }
                }
            }
        }
    }

    .icon {
        width: 23px;
        height: 18px;
        display: inline-block;
        transform: translate(5px, 4px);
    }

    .offset {
        color: white;
        display: inline-block;
        transform: translate(-10px, 3px) scale(0.7);
    }

    .customized-form {
        .chart-table-button:last-child {
            margin-right: 0;
        }
    }
</style>
