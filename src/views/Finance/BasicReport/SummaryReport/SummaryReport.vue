<template>
    <div class="flex-vertical flex-1">
        <el-form class="customized-form padding-top background-white p-l-r-24 m-l-r-16" :inline="true" :model="optionsForm"
                 :rules="addOptionsRule" ref="addOptions">
            <div class="flex">
                <span class="inline-block form-item-title">基础筛选</span>
                <div class="flex-1">
                    <el-form-item prop="dateValue">
                        <customized-time-picker
                            class="time-picker long-item"
                            :date.sync="optionsForm.dateValue"
                            :shortcutsSetting="shortcutsSetting"
                            :max-date="1"
                            :min-date="minDate"
                        ></customized-time-picker>
                    </el-form-item>
                    <el-form-item prop="selectValue" :required="false" class="search-content">
                        <el-input placeholder="请输入所要查询的内容" v-model="optionsForm.inputValue"
                                  class="long-item input-with-select">
                            <el-select v-model="optionsForm.selectValue" slot="prepend" placeholder="选择类型" clearable>
                                <el-option v-for="item in selectType" :key="item.id" :label="item.value"
                                           :value="item.id"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <!--        暂时用不到 先不删            -->
                    <!--                    <el-form-item prop="material" :required="false">-->
                    <!--                        <el-select v-model="optionsForm.material" placeholder="全部素材类型" prop="productName" :disabled="!!this.optionsForm.channel" class="middle-item" clearable>-->
                    <!--                            <el-option v-for="item in materialType" :key="item.id" :label="item.value"-->
                    <!--                                       :value="item.id"></el-option>-->
                    <!--                        </el-select>-->
                    <!--                    </el-form-item>-->
                    <!--                    <el-form-item prop="channel" :required="false">-->
                    <!--                        <el-select v-model="optionsForm.channel" placeholder="全部渠道" prop="productName" :disabled="!!this.optionsForm.material" class="middle-item" clearable>-->
                    <!--                            <el-option v-for="item in channelType" :key="item.id" :label="item.value"-->
                    <!--                                       :value="item.id"></el-option>-->
                    <!--                        </el-select>-->
                    <!--                    </el-form-item>-->
                    <el-form-item class="long-item" prop="agentCustomer">
                        <el-select v-model="optionsForm.agentCustomer" placeholder="全部代理商客户" clearable @change="getAgentCustomer">
                            <el-option v-for="item in optionsForm.agentCustomerList" :key="item.company_id"
                                       :label="item.company_name"
                                       :value="item.company_id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="agent-account-item" prop="agentAccount">
                        <el-select v-model="optionsForm.agentAccount" placeholder="全部代理商账户" clearable @change="getAgentAccount">
                            <el-option v-for="item in optionsForm.agentAccountList" :key="item.agent_id"
                                       :label="item.agent_name"
                                       :value="item.agent_id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="search-btn">
                        <el-button type="primary" @click="search('addOptions')">查询</el-button>
                        <el-button class="reset" @click="reset">重置</el-button>
                    </el-form-item>
                </div>
            </div>

            <div class="flex">
                <span class="inline-block form-item-title">数据筛选</span>
                <el-form-item class="flex-1 m-b-0 m-r-0" prop="addOptions">
                    <div v-for="(item,idx) in optionsForm.addOptions" :key="idx">
                        <el-form-item class="middle-item">
                            <el-select v-model="item.column" placeholder="请选择消耗类型" clearable>
                                <el-option v-for="item in consumptionList" :key="item.id" :label="item.value"
                                           :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="middle-item">
                            <el-select v-model="item.condition" placeholder="区间" clearable>
                                <el-option v-for="item in intervalList" :key="item.value" :label="item.value"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="middle-item">
                            <el-input v-model="item.value"></el-input>
                        </el-form-item>
                        <span v-if="optionsForm.addOptions.length!==1" class="iconfont icon-delete pointer"
                              @click="deleteItem(idx)"></span>
                    </div>
                </el-form-item>
            </div>
            <span class="iconfont icon-add add-title pointer inline-block" @click="addSelect">添加筛选</span>
        </el-form>
        <basic-report
            ref="basicReport"
            :tableHeader="header"
            showCost="summary"
            storageName="financeCenterSummaryReport"
            sumUrl="/report/finance/get-sum"
            tableDataUrl="/report/finance/index"
            :formData="optionsForm"
        ></basic-report>
    </div>
</template>

<script>
import {LastSeveralDays} from "@tools/DateUtils";
import FinanceReportMixin from "@views/Finance/FinanceReportMixin";
import BasicReport from "@views/Finance/BasicReport/BasicReport.vue";
import {planList, header, consumptionList, intervalList} from "@views/Finance/BasicReport/SummaryReport/SummaryReport.js";

export default {
    name: "PlanReport",

    components: {BasicReport},

    mixins: [FinanceReportMixin],

    activated() {
        this.handleAgent();
    },

    deactivated() {
        this.reset();
    },

    data() {
        return {
            selectType: planList,
            header,
            consumptionList,
            intervalList,
            shortcutsSetting: ['yesterday', 'lastSeven', 'lastThirty', 'lastWeek', 'lastMonth'],
            consumption: '',
            interval: '',
            value: '',
            optionsForm: {
                addOptions: [
                    {
                        "column": '',
                        "condition": '',
                        "value": '',
                    }
                ],
                selectValue: 'advertiser_customer',
                inputValue: '',
                material: '',
                channel: '',
                dateValue: LastSeveralDays(7, 1),
                agentCustomer: '',
                agentCustomerList: [],
                agentAccount: '',
                agentAccountList: [],
                filterData: [],
                addOptionsFull: false,
            },
            addOptionsRule: {
                addOptions: [
                    {validator: this.addOptionsValidate, message: "所有的筛选数据必填！"}
                ],
                dateValue: [
                    {validator: this.dateValueValidate, message: "单次查询时间跨度不能超过30天！"}
                ]
            },
        }
    },

    methods: {
        getAgentCustomer(company_id) {
            this.handleAgent({company_id, agent_id: this.optionsForm.agentAccount});
        },

        getAgentAccount(agent_id) {
            this.handleAgent({agent_id, company_id: this.optionsForm.agentCustomer});
        },

        search() {
            this.$refs['addOptions'].validate((valid) => {
                if (!valid) return false;
                this.getAddOptionsList();
                this.$refs.basicReport.tableLoad();
            })
        },

        handleAgent(params) {
            this.$http.get("/report/finance/get-labels",{params}).then(res => {
                if (res.data.code === 200) {
                    this.optionsForm.agentCustomerList = res.data.data.company;
                    this.optionsForm.agentAccountList = res.data.data.agent;
                }
            })
        },

        dateValueValidate(rule, value, callback) {
            if (value.length !== 2) callback(new Error());
            const res = Math.ceil((value[1] - value[0]) / (24 * 3600 * 1000)) <= 30;
            if (res) callback()
            else callback(new Error());
        },

        getAddOptionsList() {
            this.optionsForm.filterData = this.optionsForm.addOptions.map(item => {
                return Object.keys(item).reduce((prev, next) => {
                    prev[next] = item[next];
                    return prev;
                }, {});
            });
        },

        addOptionsFull(value) {
            return value.every(item => {
                return Object.keys(item).every(key => {
                    return Boolean(item[key]);
                });
            });
        },

        addOptionsEmpty(value) {
            return value.every(item => {
                return Object.keys(item).every(key => {
                    return Boolean(!item[key]);
                });
            });
        },

        addOptionsValidate(rule, value, callback) {
            const res = this.addOptionsFull(value) || this.addOptionsEmpty(value);
            this.optionsForm.addOptionsFull = this.addOptionsFull(value);
            if (res) callback()
            else callback(new Error());
        },

        addSelect() {
            if (this.optionsForm.addOptions.length < 5) {
                this.optionsForm.addOptions.push({
                    column: this.consumption,
                    condition: this.interval,
                    value: this.value
                });
            } else {
                this.$message.warning("筛选数据个数最多五个!");
            }
        },

        resetAddOptions() {
            this.optionsForm.addOptions = [{
                "column": '',
                "condition": '',
                "value": '',
            }];
        },

        reset() {
            this.optionsForm.inputValue = '';
            this.$refs.addOptions.resetFields();
            this.handleAgent();
            this.resetAddOptions();
        },

        deleteItem(idx) {
            this.optionsForm.addOptions.splice(idx, 1);
        },
    }
}
</script>

<style scoped lang="scss">
@import "src/views/Finance/ReportCommon";
@import "src/views/Finance/BasicReport/BasicReport";

.add-title {
    margin-left: 65px;
    color: $theme-color;
    font-size: $font-size-addition;
    line-height: $font-size-addition;
    vertical-align: text-top;
}

/deep/ .el-checkbox__label {
    color: $font-color-base;
    font-size: $font-size-base;
    line-height: 32px;
}

/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: $font-color-base;
}

.report-title {
    span {
        vertical-align: middle;
    }
}
</style>
