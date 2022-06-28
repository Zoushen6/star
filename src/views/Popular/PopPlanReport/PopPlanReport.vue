<template>
    <div class="flex-vertical flex-1 m-l-r-16">
        <el-form class="customized-form padding-top background-white p-l-r-24" :inline="true" :model="formData"
                 ref="formData">
            <div class="flex">
                <div class="flex-1">
                    <el-form-item prop="planStatus" class="search-content long-item">
                        <el-select v-model="formData.planStatus" placeholder="计划状态" clearable>
                            <el-option v-for="it in planStatus" :key="it.value" :label="it.name"
                                       :value="it.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="associatedUser" class="search-content long-item">
                        <el-select v-model="formData.associatedUser" filterable placeholder="关联用户" clearable>
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
                    <el-form-item prop="modifyPlanStatus" class="search-content long-item">
                        <el-select :disabled="!checkedList.length" @change="changeStatus"
                                   v-model="formData.modifyPlanStatus" placeholder="批量修改计划状态"
                                   clearable>
                            <el-option v-for="it in planStatus" :key="it.value" :label="it.name"
                                       :value="it.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="search-btn">
                        <el-button type="primary" @click="searchFn">查询</el-button>
                        <el-button class="reset" @click="reset">重置</el-button>
                    </el-form-item>
                </div>
            </div>
        </el-form>

        <!-- 表格区 -->
        <div class="background-white m-t-b-20 flex-1 flex-vertical table-box">
            <div class="report-title p-l-r-24 m-b-16">
                <div class="inline-block f-r">
                    <el-button @click="downloadReport(1)" class="customized-button">
                        <span class="iconfont icon-download"></span>下载报表
                    </el-button>
                </div>
            </div>
            <customized-table
                class="flex-1 customized-table has-border mini-table p-l-r-24"
                ref="customizedTable"
                :scroll-in-table="false"
                :Selection="Selection"
                @selectItem="selectItem"
                @selectAll="selectAll"
                @selectionChange="getTableSelection"
                :Header="header"
                :loading="loading"
                :Data="tableData"
                :total="total"
                :page-size="pageSize"
                :current-page="currentPage"
                @size-change="val=>{pageSizeChange(tableLoad,this,val)}"
                @current-change="val=>{pageChange(tableLoad,this,val)}"
                @sort-change="sortChangeHandle"
            >
                <template v-slot:status="{row}">
                    <el-switch
                        v-model="row.operation === 'enable'"
                        active-color="#4063DF"
                        inactive-color="#D9D9D9"
                        @change="val=>switchTheRoleStatus(val,row)"
                    ></el-switch>
                </template>
            </customized-table>
        </div>
        <!-- /表格区 -->
    </div>
</template>

<script>
import {LastSeveralDays} from "@tools/DateUtils.js";
import PaginationMixin from "@mixins/PaginationMixin";
import {header} from '@views/Popular/PopPlanReport/PopPlanReport.js'
import common from "@/tools/common";
import FinanceReportMixin from "@views/Finance/FinanceReportMixin";

export default {
    name: "PopPlanReport",
    mixins: [PaginationMixin, FinanceReportMixin],
    created() {
        this.header = header;
    },
    data() {
        return {
            shortcutsSetting: ['yesterday', 'lastSeven', 'lastThirty', 'lastWeek', 'lastMonth'],
            minDate: Math.ceil((new Date - new Date("2018-1-1")) / (3600 * 24 * 1000)),
            formData: {
                planStatus: '',
                associatedUser: '',
                dateValue: LastSeveralDays(7, 0),
                modifyPlanStatus: '',
                accountList: []
            },
            order: null,
            sort: null,
            Selection: true,
            tableData: [],
            planStatus: [
                {
                    name: '开启',
                    value: 'enable'
                },
                {
                    name: '暂停',
                    value: 'disable'
                }
            ],
            total: 0,
            export: '',
            checkedList: [],
            loading: false
        }
    },
    activated() {
        this.tableLoad();
        this.getAdAccount();
    },
    deactivated() {
        this.reset();
    },
    methods: {
        getAdAccount() {
            this.$http.get('/tt/adv/select').then(res => {
                if (res.data.code === 200) {
                    this.formData.accountList = res.data.data;
                }
            })
        },

        requestTable(page = 1) {
            return this.$http.get('/tt/ad/list', {
                params: {
                    operation: this.formData.planStatus,
                    advertiser_id: this.formData.associatedUser,
                    start_date: common.getNewDay(Number(this.formData.dateValue[0])),
                    end_date: common.getNewDay(Number(this.formData.dateValue[1])),
                    order: this.order,
                    sort: this.sort,
                    is_export: this.export ? this.export : '',
                    page: page,
                    page_size: this.pageSize,
                },
                responseType: this.export ? 'blob' : ''
            })
        },

        tableLoad(num) {
            this.loading = true;
            this.requestTable(num).then(res => {
                if (res.data.code === 200) {
                    this.tableData = res.data.data.list;
                    this.total = res.data.data.pagination.total;
                    this.currentPage = num;
                }
            }).finally(() => {
                this.loading = false;
            });
        },

        selectItem(val) {
            if (!val.length) {
                this.checkedList = [];
            }
        },

        selectAll(val) {
            if (!val.length) {
                this.checkedList = [];
            }
        },

        getTableSelection(val) {
            val.forEach(ite => {
                let temp = this.checkedList.find(it => it === ite.id);
                temp ? Object.assign(temp, ite) : this.checkedList.push(ite.id);
            })
        },

        //批量修改状态
        changeStatus(val) {
            if (this.checkedList.length) {
                this.$http.post('/tt/ad/operate', {
                    operation: val,
                    ids: JSON.stringify(this.checkedList)
                }).then(res => {
                    if (res.data.code === 200) {
                        this.tableLoad();
                        this.formData.modifyPlanStatus = '';
                        this.checkedList = [];
                    }
                })
            }
        },

        //手动更改状态
        switchTheRoleStatus(val, row) {
            this.$http.post('/tt/ad/operate', {
                operation: row.operation === 'disable' ? 'enable' : 'disable',
                ids: JSON.stringify([row.id])
            }).then(res => {
                if (res.data.code === 200) {
                    this.tableLoad();
                    this.formData.modifyPlanStatus = '';
                    this.checkedList = [];
                }
            })
        },

        searchFn() {
            this.tableLoad();
        },

        reset() {
            this.checkedList = [];
            this.$refs.formData.resetFields();
        },

        //下载报表
        downloadReport(val) {
            this.export = val;
            this.requestTable().then(res => {
                common.downloadFileBlob(res);
            }).finally(() => {
                this.export = '';
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import "src/views/Finance/ReportCommon";

/deep/ .el-input input::-webkit-input-placeholder {
    color: $font-color-base;
    opacity: 1;
}

.table-box {
    padding-top: 16px;
}

/deep/ .el-checkbox__inner::after {
    border-color: $theme-color;
    height: 7px;
    left: 3.5px;
    top: 1px;
    border-width: 2px;
}

/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
    background: #fff;
}

</style>