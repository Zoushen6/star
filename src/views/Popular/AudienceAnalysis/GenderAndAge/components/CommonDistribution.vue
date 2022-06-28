<template>
    <div class="container background-white">
        <el-form class="customized-form m-t-16 padding-top" :inline="true">
            <span class="title">{{ title }}</span>
            <div>
                <el-form-item class="short-item" v-show="buttonStyle === 'chart'">
                    <el-select @change="changeItem" v-model="selectValue">
                        <el-option v-for="it in selectList" :key="it.value" :label="it.name"
                                   :value="it.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button v-for="it in buttonList" :key="it.value"
                               @click="clickChange(it.value)"
                               size="mini"
                               :class="buttonStyle === it.value ? 'button-active' : ''">
                        <span class="iconfont" :class="it.iconName"></span>
                    </el-button>
                </el-form-item>
            </div>
        </el-form>
        <div class="p-l-r-24">
            <div v-show="buttonStyle === 'chart'"
                 :class="tableData && tableData.length ? '' : 'empty-chart'"
                 style="height: 350px"
                 ref="chart"></div>

            <customized-table
                v-show="buttonStyle === 'table'"
                class="customized-table white-table mini-table has-border"
                :max-height="null"
                :showPagination="false"
                :Data="tableData"
                :Header="header"
                @sort-change="sortChangeHandle"
            ></customized-table>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import HomePageMixin from "@views/Finance/HomePage/HomePageMixin";

export default {
    name: "CommonDistribution",
    mixins: [HomePageMixin],
    props: {
        title: String,
        option: {
            type: Object
        },
        header: {
            type: Array
        },
        tableData: {
            type: Array
        },
        types: String
    },
    data() {
        return {
            selectValue: 'cost',
            selectList: [
                {name: '消耗(元)', value: 'cost'},
                {name: '展示数', value: 'show'},
                {name: '点击数', value: 'click'},
                {name: '转化数', value: 'convert'},
            ],
            buttonStyle: 'chart',
            buttonList: [
                {
                    iconName: 'icon-pie',
                    value: 'chart',
                }, {
                    iconName: 'icon-table',
                    value: 'table',
                }
            ],
            order: null,
            sort: null
        }
    },
    mounted() {
        this.initChart();
        this.optionChart();
    },
    deactivated() {
        this.selectValue = 'cost';
    },
    methods: {
        //排序
        sortChangeHandle(data) {
            if (data.order) {
                this.order = data.prop;
                this.sort = data.order === 'descending' ? 'desc' : 'asc';
            } else {
                this.order = null;
                this.sort = null;
            }
            this.$emit('sort', this.title);
        },

        changeItem(val) {
            this.$emit('changeData', val, this.title);
        },

        clickChange(val) {
            this.buttonStyle = val;
            if (val === 'chart') this.optionChart();
            this.$emit('changeTable', val, this.title);
        },

        //初始化echarts
        initChart() {
            this.chart = echarts.init(this.$refs.chart);
            this.resizeChart();
        },

        //设置echarts数据
        optionChart() {
            this.chart.clear();
            this.chart.setOption(this.option, true);
        }
    }
}
</script>

<style scoped lang="scss">
@import "src/views/Popular/AudienceAnalysis/white-table";
@import "src/views/Popular/AudienceAnalysis/GenderAndAge/CommonStyle";

.el-button--mini {
    padding: 6px 0;
    border: 0;
    background-color: $font-color-white;

    .iconfont {
        font-size: 18px;
    }
}

.button-active {
    .icon-pie:before {
        color: $theme-color;
    }

    .icon-table:before {
        color: $theme-color;
    }
}

.customized-form {
    .middle-item {
        /deep/ .el-input__inner {
            color: $font-color-base;
        }
    }
}
</style>