<template>
    <div  v-loading="loading">
        <div>
            <div class="tab-box">
                <el-tabs v-model="activeName" @tab-click="handleClickTab">
                    <el-tab-pane label="省级分布" name="province"></el-tab-pane>
                    <el-tab-pane label="地级市分布" name="city"></el-tab-pane>
                </el-tabs>
            </div>
            <el-form class="customized-form inline-block f-r" :inline="true" >
                <el-form-item class="short-item" v-show="buttonStyle === 'chart'">
                    <el-select v-model="selectValue" placeholder="请选择" @change="handleSelect">
                        <el-option v-for="(item,key) in selectList" :key="key" :label="item"
                                   :value="key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  v-for="item in buttonList" :key="item.value" size="mini" class="chart-table-button">
                    <el-button :class="buttonStyle == item.value ? 'button-active' : ''" @click="buttonClick(item.value)">
                        <span class="iconfont" :class="item.iconName"></span>
                    </el-button>
                </el-form-item>
            </el-form>
            <el-row class="m-b-16 chart" :gutter="16" v-show="buttonStyle === 'chart'">
                <el-col :span="12" :xs="24" >
                    <geo-chart ref="geoChart" :list="list" :active-name="activeName"></geo-chart>
                </el-col>
                <el-col :span="12" :xs="24" >
                    <bar-chart ref="barChart" :list="list"></bar-chart>
                </el-col>
            </el-row>

            <customized-table
                v-show="buttonStyle === 'table'"
                class="customized-table white-table mini-table has-border without-pagination m-t-16"
                :max-height="400"
                :showPagination="false"
                @sort-change="sortChangeHandle"
                :Data="tableList"
                :Header="header"
            >
            </customized-table>
        </div>
    </div>
</template>

<script>
import common from "@tools/common";
import GeoChart from "./GeoChart/GeoChart.vue";
import BarChart from "./BarChart/BarChart.vue";
import {header} from "./GeographicalDistribution.js"

export default {
    name: "GeographicalDistribution",

    components:{GeoChart,BarChart},

    props: {
        company_id: String,
        formData: Object
    },

    computed: {

    },

    data(){
        return {
            header,
            date:'lastSeven',
            list: [],
            tableList: [],
            loading: false,
            order: 'cost',
            sort: 'desc',
            activeName: 'province',
            selectValue:"cost",
            selectList:{
                "cost": '消耗(元)',
                "show": '展示数',
                "click": '点击数',
                "convert": '转化数',
            },
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

    created() {
    },

    mounted(){
    },

    methods: {

        searchFn() {
            this.getList();
        },

        getList() {
            this.loading = true;
            this.axiosList().then((res) => {
                if (res && res.data.code === 200){
                    //表格数据处理
                    let list = JSON.parse(JSON.stringify(res.data.data.list));
                    this.tableList = list.slice(0,10)
                    this.list = res.data.data.list.reduce((res,next) => {
                        let item = {
                            name: this.activeName === 'city'? next.city_name : next.province_name,
                            value: parseFloat(next[this.selectValue]),
                            ratio: next[this.selectValue + '_radio'],
                            label: this.selectList[this.selectValue],
                        };
                        if(parseFloat(next[this.selectValue])) {
                            res.push(item)
                        }
                        return res
                    },[]).sort(function (a, b) {
                        return b.value - a.value;
                    });
                }
            }).catch((err) => {
                console.warn(err)
            }).finally(() => {
                this.loading = false;
                this.$refs.geoChart.judgeActiveName()
                this.$refs.barChart.paintChart()
            })
        },

        sortChangeHandle(data){
            if (data.order) {
                this.order = data.prop;
                this.sort = data.order === 'descending' ? 'desc' : 'asc';
            } else {
                this.order = null;
                this.sort = null;
            }
            this.getList();
        },


        handleClickTab(tab, event) {
            this.activeName = tab.name;
            this.getList();
            this.$nextTick(() => {
                this.$refs.barChart.paintChart()
            })
            this.header[0].label = this.activeName === 'city' ? '城市分布' : '省级分布'
            this.header[0].prop = this.activeName === 'city' ? 'city_name' : 'province_name'
            // console.log(tab, event);
        },

        handleSelect(){
            this.getList()
            // this.$nextTick(() => {
            //     this.$refs.geoChart.judgeActiveName()
            //     this.$refs.barChart.paintChart()
            // })
        },

        buttonClick(value){
            this.buttonStyle = value;
            if(this.buttonStyle === "chart"){
                this.$nextTick(() => {
                    this.$refs.geoChart.judgeActiveName()
                    this.$refs.barChart.paintChart()
                })
            }
        },

        axiosList() {
            return this.$http.get("/tt/report/list", {
                params: {
                    type: this.activeName,
                    order: this.order?this.order: 'cost',
                    sort: this.sort?this.sort: 'desc',
                    stat_start_time: common.getNewDay(this.formData.dateValue[0]),
                    stat_end_time: common.getNewDay(this.formData.dateValue[1]),
                    advertiser_id: this.formData.account.join(','),
                    // metrics: 'click'
                }
            });
        },

    }
}
</script>

<style scoped lang="scss">
@import "../white-table.scss";

.radio-text {
    margin-right: 8px;
    margin-left: -10px;
    line-height: 32px;
    font-size: $font-size-addition;
    color: $font-color-auxiliary;
}

.tab-box {
    display: inline-block;
    /deep/.el-tabs__item {
        height: 35px;
    }

    /deep/.el-tabs__nav-wrap {
    }

    /deep/.el-tabs__nav-wrap::after {
        height: 0;
    }

    /deep/.el-tabs__header {
        margin: 0;
    }
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

/deep/.customized-table {
    //父级可用大小775.5px   fit-content max-content min-content取到776px(浏览器好像不支持)  100%或其他都是775.5px
    //99.99%取到775.42px  后面的小数大于等于0.5时 客户消耗排行表格右border就显示不出来 小于可以
    //微调homepage :gutter=16.1  宽度小数不是0.5也可以显示border
    height: 400px;
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

.el-button--mini {
    padding: 6px 0;
    border: 0;
    background-color: $font-color-white;
    .iconfont {
        font-size: 18px;
    }
}

/deep/.customized-form {

    .chart-table-button {
        .el-button {
            margin-right: 0;
        }
    }

    .chart-table-button:last-child {
        margin-right: 0;
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
</style>
