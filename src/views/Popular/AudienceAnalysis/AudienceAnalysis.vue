<template>
    <div class="m-l-r-16">

        <!-- 筛选条件 -->
        <el-form class="customized-form background-white padding-top p-l-r-24" :inline="true" :model="formData"
                 ref="form">
            <el-form-item class="long-item" prop="account">
                <el-select @visible-change="visibleChange" v-model="formData.account" placeholder="投放账号" clearable
                           multiple filterable>
                    <el-option v-for="it in formData.accountList" :key="it.advertiser_id" :label="it.name"
                               :value="it.advertiser_id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="dateValue">
                <customized-time-picker
                    class="time-picker long-item"
                    :date.sync="formData.dateValue"
                    :shortcutsSetting="shortcutsSetting"
                    :max-date="0"
                    :min-date="minDate"
                ></customized-time-picker>
            </el-form-item>
            <el-form-item class="search-btn">
                <el-button type="primary" @click="searchFn">查询</el-button>
                <el-button class="reset" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- /筛选条件 -->

        <!-- 年龄和性别分布 -->
        <el-row :gutter="16">
            <el-col :span="12" :xs="24">
                <common-distribution
                    v-loading="genderLoading"
                    ref="gender"
                    title="性别分布"
                    :types="gender"
                    :option="genderOption"
                    :header="genderHeader"
                    :tableData="genderTableData"
                    @changeData="changeData"
                    @changeTable="changeTable"
                    @sort="sortChange"
                ></common-distribution>
            </el-col>
            <el-col :span="12" :xs="24">
                <common-distribution
                    v-loading="ageLoading"
                    ref="age"
                    title="年龄分布"
                    :types="age"
                    :option="ageOption"
                    :header="ageHeader"
                    :tableData="ageTableData"
                    @changeData="changeData"
                    @changeTable="changeTable"
                    @sort="sortChange"
                ></common-distribution>
            </el-col>
        </el-row>
        <!-- /年龄和性别分布 -->

        <!-- 地域分布 -->
        <div class="data-board home-padding background-white m-t-16 m-b-16">
            <geographical-distribution ref="geographical" :form-data="formData"></geographical-distribution>
        </div>
        <!-- /地域分布 -->
    </div>
</template>

<script>
import common from "@tools/common";
import {LastSeveralDays} from "@tools/DateUtils.js";
import GeographicalDistribution
    from "@views/Popular/AudienceAnalysis/GeographicalDistribution/GeographicalDistribution.vue";
import {ageOption, ageHeader} from "@views/Popular/AudienceAnalysis/GenderAndAge/AgeDistribution/AgeDistribution.js";
import CommonDistribution from "@views/Popular/AudienceAnalysis/GenderAndAge/components/CommonDistribution.vue";
import {
    genderOption,
    genderHeader
} from "@views/Popular/AudienceAnalysis/GenderAndAge/GenderDistribution/GenderDistribution.js";

export default {
    name: "AudienceAnalysis",
    components: {GeographicalDistribution, CommonDistribution},
    data() {
        return {
            ageHeader,
            ageOption,
            genderHeader,
            genderOption,
            shortcutsSetting: ['yesterday', 'lastSeven', 'lastThirty', 'lastWeek', 'lastMonth'],
            minDate: Math.ceil((new Date - new Date("2018-1-1")) / (3600 * 24 * 1000)),
            formData: {
                account: [],
                accountList: [],
                dateValue: LastSeveralDays(1, 1),
            },
            gender: 'gender',
            age: 'age',
            ageTableData: [],
            genderTableData: [],
            genderLoading: false,
            ageLoading: false,
            ageType: '',
            genderType: ''
        }
    },
    activated() {
        this.searchFn();
        this.getAdAccount();
    },
    deactivated() {
        this.reset();
    },
    methods: {

        visibleChange() {
            this.getAdAccount();
        },

        //选择指标
        changeData(val, title) {
            title === '年龄分布' ? this.ageType = val : this.genderType = val;
            title === '年龄分布' ? this.getAgeData() : this.getGenderData();
        },

        //table & chart 切换
        changeTable(val, title) {
            title === '年龄分布' ? this.getAgeData() : this.getGenderData();
        },

        //table排序
        sortChange(title) {
            title === '年龄分布' ? this.getAgeData() : this.getGenderData();
        },

        //获取广告账号
        getAdAccount() {
            this.$http.get('/tt/adv/select').then(res => {
                if (res.data.code === 200) {
                    this.formData.accountList = res.data.data;
                }
            })
        },

        //获取性别分布
        requestGenderData() {
            return this.$http.get('/tt/report/list', {
                params: {
                    type: 'gender',
                    metrics: this.$refs.gender.buttonStyle === 'chart' ? this.$refs.gender.selectValue : '',
                    stat_start_time: common.getNewDay(this.formData.dateValue[0]),
                    stat_end_time: common.getNewDay(this.formData.dateValue[1]),
                    advertiser_id: this.formData.account.join(','),
                    order: this.$refs.gender.order,
                    sort: this.$refs.gender.sort
                }
            })
        },

        //获取年龄分布
        requestAgeData() {
            return this.$http.get('/tt/report/list', {
                params: {
                    type: 'age',
                    metrics: this.$refs.age.buttonStyle === 'chart' ? this.$refs.age.selectValue : '',
                    stat_start_time: common.getNewDay(this.formData.dateValue[0]),
                    stat_end_time: common.getNewDay(this.formData.dateValue[1]),
                    advertiser_id: this.formData.account.join(','),
                    order: this.$refs.age.order,
                    sort: this.$refs.age.sort
                }
            })
        },

        //处理性别数据
        getGenderData() {
            this.genderLoading = true;
            this.genderOption.series[0].data = [];
            this.requestGenderData().then(res => {
                if (res.data.code === 200) {
                    res.data.data.list.forEach(it => {
                        if (this.genderType === 'show') {
                            this.genderOption.series[0].data.push(
                                {name: it.gender_name, value: it.show, convert: it.show_radio}
                            )
                        } else if (this.genderType === 'click') {
                            this.genderOption.series[0].data.push(
                                {name: it.gender_name, value: it.click, convert: it.click_radio}
                            )
                        } else if (this.genderType === 'convert') {
                            this.genderOption.series[0].data.push(
                                {name: it.gender_name, value: it.convert, convert: it.convert_radio}
                            )
                        } else {
                            this.genderOption.series[0].data.push(
                                {name: it.gender_name, value: it.cost, convert: it.cost_radio}
                            )
                        }
                    })
                    this.$refs.gender.optionChart();
                    this.genderTableData = res.data.data.list;
                }
            }).finally(() => {
                this.genderLoading = false;
            });
        },

        //处理年龄数据
        getAgeData() {
            this.ageLoading = true;
            this.ageOption.series[0].data = [];
            this.requestAgeData().then(res => {
                if (res.data.code === 200) {
                    res.data.data.list.forEach(it => {
                        if (this.ageType === 'show') {
                            this.ageOption.series[0].data.push(
                                {name: it.age_name, value: it.show, convert: it.show_radio}
                            )
                        } else if (this.ageType === 'click') {
                            this.ageOption.series[0].data.push(
                                {name: it.age_name, value: it.click, convert: it.click_radio}
                            )
                        } else if (this.ageType === 'convert') {
                            this.ageOption.series[0].data.push(
                                {name: it.age_name, value: it.convert, convert: it.convert_radio}
                            )
                        } else {
                            this.ageOption.series[0].data.push(
                                {name: it.age_name, value: it.cost, convert: it.cost_radio}
                            )
                        }
                    })
                    this.$refs.age.optionChart();
                    this.ageTableData = res.data.data.list;
                }
            }).finally(() => {
                this.ageLoading = false;
            });
        },

        //查询
        searchFn() {
            this.getGenderData();
            this.getAgeData();
            this.$refs.geographical.searchFn();
        },

        //重置
        reset() {
            this.$refs.form.resetFields();
        }
    }
}
</script>

<style scoped lang="scss">
.home-padding {
    padding: 16px 24px;
}

/deep/ .el-range-editor .el-range-input {
    color: $font-color-base;
}
</style>
<style lang="scss">
@import "HomePage";
</style>