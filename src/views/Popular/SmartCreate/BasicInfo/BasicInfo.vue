<template>
    <div class="flex-vertical flex-1 m-l-r-16 container">
        <el-form class="customized-form padding-top background-white p-l-r-24" :model="formData" :rules="rules"
                 ref="formData">
            <div class="title">基础信息</div>
            <div class="flex-1">
                <el-form-item prop="account" class="search-content long-item" label="投放账户" label-width="100px">
                    <el-select @change="changeAccount" @visible-change="visibleChange"
                               v-model="formData.account" placeholder="请选择投放账户" multiple
                               clearable
                               :multiple-limit="20">
                        <el-option v-for="item in formData.accountList" :key="item.advertiser_id" :label="item.name"
                                   :value="item.advertiser_id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="adGroup" label="广告组" label-width="100px">
                    <el-button class="customized-button iconfont icon-select-item" @click="select">选择广告组</el-button>
                    <span class="title-number">{{ formData.tableData.length }}/100</span>
                    <div v-if="formData.tableData.length" class="f-r pointer"
                         style="padding-right: 120px;color: #4063DF"
                         @click="clearTableData">清空
                    </div>
                </el-form-item>
            </div>
        </el-form>

        <!-- 表格区 -->
        <div class="background-white table" v-if="formData.tableData.length">
            <customized-table
                class="flex-1 customized-table has-border mini-table p-l-r-24"
                ref="customizedTable"
                :scroll-in-table="false"
                :table-height="null"
                :Header="header"
                :Data="formData.tableData"
                :showPagination="false"
            >
                <template v-slot:status="{row}">
                    <el-switch
                        v-model="row.status === 'CAMPAIGN_STATUS_ENABLE'"
                        active-color="#4063DF"
                        inactive-color="#D9D9D9"
                    >
                    </el-switch>
                </template>
                <template v-slot:operation="{row}">
                    <span style="cursor: pointer;color: #4063DF" @click="deleteItem(row,row.camp_id)">删除</span>
                </template>
            </customized-table>
        </div>
        <!-- 表格区 -->

        <!-- 弹窗 -->
        <customized-dialog
            title="选择广告组"
            :width="960"
            :visible="visibleDialog"
            @close="closeDialog"
            :showFooter="true"
            @submit="submitData"
            @cancel="closeDialog"
        >
            <div class="dialog-box">
                <div class="left">
                    <div class="advertiser-account" :class="formData.adAccountList.length ? '' : 'empty-data'">
                        <div class="title">广告账号</div>
                        <div class="advertiser-item">
                            <div v-for="item in formData.adAccountList" :key="item.advertiser_id"
                                 class="item-account pointer"
                                 :class="adAccount === item.advertiser_id ? 'bg-color' : ''">
                                <div @click="handleAdAccount(item.advertiser_id)">
                                    <span class="inline-block title-content">{{ item.name }}</span>
                                    <span v-if="item.selectedNumber" class="inline-block both-select-number"
                                          :class="adAccount === item.advertiser_id ? 'select-number' : 'not-select-number'">
                                    {{ item.selectedNumber }}
                                </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="advertiser">
                        <div class="title">
                            <span class="m-r-5">广告组</span>
                        </div>
                        <div :class="list.length ? '' : 'empty-data'">
                            <div class="dialog-input">
                                <el-input
                                    @input="handleInput"
                                    placeholder="请输入内容"
                                    v-model="dialogInputValue">
                                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                                </el-input>
                            </div>
                            <el-checkbox-group class="checkbox-group overflow-auto"
                                               v-model="checkList" v-loading="loading"
                                               style="margin-left: 12px;">
                                <el-checkbox @change="val=>{handleCheckedChange(val,it)}" style="width: 100%"
                                             :disabled="disabled"
                                             v-for="it in list" :key="it.camp_id" :label="it.camp_id">
                                    {{ it.name }}
                                </el-checkbox>
                            </el-checkbox-group>
                            <el-pagination
                                @current-change="handleCurrentChange"
                                :pager-count="5"
                                :page-count="pageCount"
                                :current-page.sync="currentPage"
                                layout="total, prev, pager, next"
                                :total="totals">
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <div class="right" :class="selectedList.length ? '' : 'empty-data'">
                    <div class="title">
                        <span>已选({{ selectedList.length }})</span>
                        <span class="f-r pointer" @click="clearData">清空</span>
                    </div>
                    <div class="overflow-auto">
                        <div class="item-content flex-space-between m-r-0" v-for="(item,index) in selectedList"
                             :key="item.camp_id">
                            <span :title="item.name">{{ item.name | handleLength(15) }}</span>
                            <span class="iconfont icon-delete-dialog pointer"
                                  @click="deleteDialogData(item,index)"></span>
                        </div>
                    </div>
                </div>
            </div>
        </customized-dialog>
        <!-- 弹窗 -->
    </div>
</template>

<script>
import ThrottleMixin from "@mixins/ThrottleMixin";
import {header} from "@views/Popular/SmartCreate/BasicInfo/BasicInfo.js";
import CustomizedDialog from "@/components/CustomizedDialog.vue";

export default {
    name: "BasicInfo",
    components: {CustomizedDialog},
    mixins: [ThrottleMixin],
    created() {
        this.header = header;
    },
    watch: {
        formData: {
            handler: function (val) {
                this.$emit('basicListChange', val)
            },
            deep: true,
            immediate: true
        },
        selectedList: {
            handler: function (val) {
                this.disabled = val.length >= 100;
            },
            deep: true,
            immediate: true
        },
        checkList: {
            handler: function (val) {
                this.formData.adv_info.forEach((ite, idx) => {
                    if (ite.advertiser_id === this.adAccount) {
                        ite.camp_ids = val
                    }
                    this.formData.adAccountList.forEach(item => {
                        if (item.advertiser_id === this.adAccount) {
                            item.selectedNumber = val.length
                        }
                    })
                })
            },
            deep: true,
            immediate: true
        },
        'formData.adAccountList': {
            handler: function (val) {
                if (!val.length) {
                    this.list = [];
                    this.selectedList = [];
                    this.formData.account = [];
                } else {
                    let list = [];
                    val.forEach(it => {
                        list.push(it.advertiser_id)
                    })
                    this.formData.account = list;
                    let temp = [];
                    this.selectedList.forEach(ite => {
                        val.forEach(item => {
                            if (ite.advertiser_id === item.advertiser_id) {
                                temp.push(ite)
                            }
                        })
                    })
                    this.selectedList = temp;
                    let res = [];
                    this.formData.adv_info.forEach(ite => {
                        val.forEach(it => {
                            if (it.advertiser_id === ite.advertiser_id) {
                                res.push(ite)
                            }
                        })
                    })
                    this.formData.adv_info = res;
                }
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        return {
            formData: {
                account: [],
                accountList: [],
                //广告账号列表
                adAccountList: [],
                campaignId: [],
                tableData: [],
                adv_info: []
            },
            rules: {
                account: [
                    {required: true, message: '请选择账户'}
                ],
                adGroup: [
                    {required: true, validator: this.handleAdGroup, trigger: 'blur'}
                ]
            },
            visibleDialog: false,
            dialogInputValue: '',
            checkList: [],
            checked: true,
            adAccount: 0,
            //从接口获取到的最初list
            list: [],
            //已选的list
            selectedList: [],
            pageCount: 0,
            currentPage: 0,
            totals: 0,
            disabled: false,
            loading: false
        }
    },
    activated() {
        this.getAdAccount();
    },
    deactivated() {
        this.reset();
    },
    methods: {
        //获取广告账号
        getAdAccount() {
            this.$http.get('/tt/adv/select').then(res => {
                if (res.data.code === 200) {
                    this.formData.accountList = res.data.data;
                }
            })
        },
        //每个广告账号下的广告组
        getList() {
            this.loading = true;
            this.$http.get('/tt/camp/list', {
                params: {
                    advertiser_id: this.adAccount,
                    keyword: this.dialogInputValue,
                    page: this.currentPage,
                    page_size: 10
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.list = res.data.data.list;
                    this.currentPage = res.data.data.pagination.current_page;
                    this.pageCount = res.data.data.pagination.page_count;
                    this.totals = res.data.data.pagination.total;
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getList();
        },
        //重置数据
        reset() {
            this.formData.adv_info = [];
            this.formData.account = [];
            this.formData.adAccountList = [];
            this.formData.tableData = [];
            this.selectedList = [];
            this.closeDialog();
            this.$refs.formData.resetFields();
        },
        //验证
        handleValid() {
            if (this.$refs.formData) {
                return new Promise((resolve) => {
                    this.$refs.formData.validate((valid) => {
                        if (valid) {
                            resolve(valid)
                        }
                    })
                })
            }
        },
        //验证广告组
        handleAdGroup(rule, value, callback) {
            if (this.formData.tableData.length) {
                callback()
            } else {
                callback(new Error('请选择广告组'))
            }
        },
        //删除表格中的某一条data
        deleteItem(item, id) {
            let temp = this.formData.tableData.findIndex(it => it.camp_id === id);
            this.checkList.forEach((item, index) => {
                if (item === id) {
                    this.checkList.splice(index, 1)
                }
            })
            this.formData.tableData.splice(temp, 1);
            //当删除某条数据的时候可选数据状态随着变化
            this.formData.adv_info.forEach((ite, idx) => {
                if (item.advertiser_id === ite.advertiser_id) {
                    let deleteIndex = ite.camp_ids.findIndex(it => item.camp_id === it);
                    ite.camp_ids.splice(deleteIndex, 1);
                    //广告账号每一条的 选择数变化回显
                    this.formData.adAccountList.forEach(item => {
                        if (item.advertiser_id === ite.advertiser_id) {
                            item.selectedNumber = ite.camp_ids.length
                        }
                    })
                }
            })
            this.formData.account.forEach((ite, idx) => {
                if (idx === 0) {
                    this.adAccount = ite;
                    this.handleAdAccount(ite)
                    this.getList();
                }
            })
            if (!this.formData.tableData.length) {
                this.handleValid();
            }
        },
        changeAccount(val) {
            this.formData.adAccountList = [];
            val.forEach(it => {
                this.formData.accountList.forEach(item => {
                    if (item.advertiser_id === it) {
                        this.formData.adAccountList.push(item)
                    }
                })
            })
            if (!this.formData.account.length) this.formData.adAccountList = [];
        },
        visibleChange() {
            this.getAdAccount();
        },
        //获取广告主
        handleAdvertiser() {
            this.formData.accountList.forEach(ite => {
                this.formData.account.forEach(it => {
                    if (ite.advertiser_id === it) {
                        let temp = this.formData.adAccountList.find(item => item.advertiser_id === it);
                        temp ? Object.assign(temp, ite) : this.formData.adAccountList.push(ite);
                    }
                })
            })
        },
        //打开选择广告组弹窗
        select() {
            this.visibleDialog = true;
            this.formData.accountList.forEach(item => {
                let has = this.formData.adv_info.find(it => it.advertiser_id === item.advertiser_id);
                if (!has) {
                    this.formData.adv_info.push({advertiser_id: item.advertiser_id, camp_ids: []})
                }
            })
            this.formData.account.forEach((ite, idx) => {
                if (idx === 0) {
                    this.adAccount = ite;
                    if (this.formData.adAccountList.length) {
                        this.handleAdAccount(ite);
                        this.getList();
                    }
                }
            })
        },
        resetDialogData() {
            this.adAccount = 0;
            this.list = [];
            this.currentPage = 1;
            this.totals = 0;
            this.dialogInputValue = '';
            this.visibleDialog = false;
            this.handleValid();
        },
        //关闭或取消弹窗
        closeDialog() {
            if (!this.formData.tableData.length) {
                this.checkList = [];
            }
            this.resetDialogData();
        },
        //弹窗确认
        submitData() {
            if (this.selectedList.length) {
                this.formData.tableData = this.selectedList;
                this.selectedList.forEach(it => {
                    this.formData.campaignId.push(it.camp_id);
                })
                this.resetDialogData();
                this.visibleDialog = false;
            } else {
                this.visibleDialog = true;
                this.$message.warning('请选择广告组')
            }
        },
        //清空tableData
        clearTableData() {
            this.checkList = [];
            this.selectedList = [];
            this.formData.tableData = [];
            this.formData.adv_info.forEach(item => {
                item.camp_ids = []
            })
            this.formData.adAccountList.forEach(it => {
                it.camp_ids = [];
                it.selectedNumber = 0;
            })
        },
        //清空弹窗内已选data
        clearData() {
            this.selectedList = [];
            this.checkList = [];
            this.formData.adv_info.forEach(item => {
                item.camp_ids = []
            })
            this.formData.adAccountList.forEach(it => {
                it.camp_ids = [];
                it.selectedNumber = 0;
            })
        },
        //input输入查询
        handleInput() {
            this.throttle(this.getList, this, 500)
        },
        //弹窗单选
        handleCheckedChange(value, item) {
            if (value) {
                this.transformData();
            } else {
                this.selectedList.forEach((ite, idx) => {
                    if (ite.camp_id === item.camp_id) {
                        this.selectedList.splice(idx, 1)
                    }
                })
            }
        },
        //删除弹窗中选中的某一条data
        deleteDialogData(item, index) {
            this.selectedList.splice(index, 1);
            //当删除某条数据的时候可选数据状态随着变化
            this.formData.adv_info.forEach((ite, idx) => {
                if (item.advertiser_id === ite.advertiser_id) {
                    let deleteIndex = ite.camp_ids.findIndex(it => item.camp_id === it);
                    ite.camp_ids.splice(deleteIndex, 1);
                    //广告账号每一条的 选择数变化回显
                    this.formData.adAccountList.forEach(item => {
                        if (item.advertiser_id === ite.advertiser_id) {
                            item.selectedNumber = ite.camp_ids.length
                        }
                    })
                }
            })
            //当所有选中的数据都被删除时全选框状态为false
            if (!this.selectedList.length) {
                this.checkList = [];
            }
        },
        //点击某一个广告账号
        handleAdAccount(val) {
            this.adAccount = val;
            if (this.formData.adv_info) {
                this.formData.adv_info.forEach(ite => {
                    if (ite.advertiser_id === val) {
                        this.checkList = ite.camp_ids;
                    }
                })
            }
            this.currentPage = 1;
            this.getList();
        },
        //广告组选择到已选
        transformData() {
            this.list.forEach(it => {
                this.checkList.forEach(item => {
                    if (it.camp_id === item) {
                        let temp = this.selectedList.find(ite => ite.camp_id === item);
                        temp ? Object.assign(temp, it) : this.selectedList.push(it);
                    }
                })
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import "src/views/Popular/SmartCreate/CommonStyle";

.container {

    .long-item {
        /deep/ .el-input__inner {
            width: 360px;
            max-width: 360px;
        }
    }

    .dialog-box {
        display: flex;

        .title {
            height: 44px;
            padding: 12px 0 12px 12px;
            box-sizing: border-box;
            border-bottom: 1px solid $bg-color-divider;
            background-color: $bg-color-grey;

            .f-r {
                padding: 0 17px 13px 0;
                box-sizing: border-box;
                color: $color-link;

                /deep/ .el-checkbox__label {
                    font-size: $font-size-base;
                }
            }
        }

        .left {
            width: 628px;
            display: flex;
            min-height: 480px;
            border: 1px solid $bg-color-divider;
            margin-right: 11px;

            .advertiser-account {
                width: 276px;
                border-right: 1px solid $bg-color-divider;

                .advertiser-item {
                    overflow: auto;
                    max-height: 436px;
                    min-height: 436px;
                }

                .item-account {
                    min-height: 54px;
                    padding: 10px 12px;
                    box-sizing: border-box;

                    div {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 12px;

                        .title-content {
                            width: 200px;
                        }

                        .both-select-number {
                            min-width: 16px;
                            height: 16px;
                            color: white;
                            line-height: 16px;
                            border-radius: 50%;
                            text-align: center;
                        }

                        .select-number {
                            background-color: $theme-color;
                        }

                        .not-select-number {
                            background-color: #8CA1EC;
                        }
                    }
                }

                .bg-color {
                    background-color: $font-color-plain;
                }
            }

            .advertiser {
                width: 353px;
                height: 44px;

                /deep/ .el-pagination {
                    text-align: center;

                    .el-pager li {
                        min-width: 30px;
                    }
                }

                .checkbox-group {
                    height: 340px;

                    /deep/ .el-checkbox__label {
                        text-overflow: ellipsis;
                        white-space: normal;
                        line-height: 18px;
                        vertical-align: text-top;
                        display: inline-block;
                    }
                }

                .dialog-input {
                    padding: 10px 12px 10px 13px;

                    /deep/ .el-input__inner {
                        height: 32px;
                    }
                }

                .title {

                    /deep/ .el-checkbox__label {
                        color: $theme-color;
                    }
                }
            }
        }

        .right {
            width: 273px;
            min-height: 480px;
            max-height: 480px;
            border: 1px solid $bg-color-divider;

            .overflow-auto {
                width: 100%;
                min-height: 400px;
                max-height: 400px;

                .item-content {
                    width: 100%;
                    height: 36px;
                    padding: 10px 25px 10px 12px;
                    box-sizing: border-box;
                    font-size: $font-size-addition;
                }
            }
        }
    }
}
</style>