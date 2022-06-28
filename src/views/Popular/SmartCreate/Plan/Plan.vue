<template>
    <div class="flex-vertical flex-1 m-l-r-16 container">
        <el-form class="customized-form padding-top background-white p-l-r-24" :model="formData" :rules="strategyRules"
                 ref="strategyFormData">
            <div class="title">计划</div>
            <div class="flex-1">
                <el-form-item prop="strategy" label="广告策略" label-width="100px">
                    <el-button class="customized-button iconfont icon-select-item" @click="selectStrategy">选择策略
                    </el-button>
                    <div v-if="formData.tableData.length" class="f-r pointer"
                         style="padding-right: 120px;color: #4063DF"
                         @click="clearStrategyTableData">清空
                    </div>
                </el-form-item>
            </div>
        </el-form>

        <!-- 策略表格区 -->
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
                <template v-slot:operation="{row}">
                    <span style="cursor: pointer;color: #4063DF" @click="deleteStrategy(row)">删除</span>
                </template>
            </customized-table>
        </div>
        <!-- 策略表格区 -->

        <el-form class="customized-form padding-top background-white p-l-r-24 directional-form" :model="formData"
                 :rules="directionalRules"
                 ref="formData">
            <div class="flex-1">
                <el-form-item prop="directional" label="用户定向" label-width="100px">
                    <el-button class="customized-button iconfont icon-select-item" @click="selectDirectional">选择定向
                    </el-button>
                    <div v-if="formData.directionalTableData.length" class="f-r pointer"
                         style="padding-right: 120px;color: #4063DF"
                         @click="clearDirectionalTableData">清空
                    </div>
                </el-form-item>
            </div>
        </el-form>

        <!-- 定向表格区 -->
        <div class="background-white table" v-if="formData.directionalTableData.length">
            <customized-table
                class="flex-1 customized-table has-border mini-table p-l-r-24"
                ref="customizedTable"
                :scroll-in-table="false"
                :table-height="null"
                :Header="_header"
                :Data="formData.directionalTableData"
                :showPagination="false"
            >
                <template v-slot:operation="{row}">
                    <span style="cursor: pointer;color: #4063DF" @click="deleteItem(row.audience_package_id)">删除</span>
                </template>
            </customized-table>
        </div>
        <!-- 定向表格区 -->

        <!-- 弹窗 -->
        <customized-dialog
            :title="title"
            :width="dialogWidth"
            :visible="visibleDialog"
            @close="closeDialog"
            :showFooter="true"
            :disabled="disabledSubmit"
            @submit="submitData"
            @cancel="closeDialog"
        >
            <div class="dialog-box">
                <!-- 打开策略弹窗内容 -->
                <div v-if="title === '选择广告策略'">
                    <el-form class="customized-form strategy-form">
                        <el-form-item label="投放账户" label-width="80px" class="long-item account-item">
                            <div>
                                <span class="select-account-item" v-for="(ite,idx) in accountList"
                                      :key="ite.advertiser_id">
                                    <span class="account-title">{{ ite.name }}</span>
                                    <span class="iconfont icon-account-delete" @click="deleteAccount(idx)"></span>
                                </span>
                            </div>
                        </el-form-item>
                        <el-form-item label="下载方式" label-width="80px" class="long-item">
                            <el-button-group>
                                <el-button @click="handleLink(1)" :class="downloadType === 1 ? 'btn' : ''">下载链接
                                </el-button>
                                <el-button @click="handlePage(2)" :class="downloadType === 2 ? 'btn' : ''">落地页
                                </el-button>
                            </el-button-group>
                        </el-form-item>
                        <el-form-item label="广告位置" label-width="80px" class="long-item">
                            <el-button-group>
                                <el-button @click="clickOther('UNIVERSAL')"
                                           :class="adAddress === 'UNIVERSAL' ? 'btn' : ''">通投智选
                                </el-button>
                                <el-button @click="clickOther('SMART')" :class="adAddress === 'SMART' ? 'btn' : ''">
                                    系统优选广告位
                                </el-button>
                                <el-button @click="selectMedia('MANUAL')" :class="adAddress === 'MANUAL' ? 'btn' : ''">
                                    首选媒体
                                </el-button>
                            </el-button-group>
                        </el-form-item>
                        <el-form-item v-if="media || adAddress === 'MANUAL'" label-width="80px" class="plan-item">
                            <div class="media plan-radio"
                                 style="width: 460px;min-height: 102px">
                                <el-radio-group v-model="radio">
                                    <el-radio @change="changeRadio" v-for="item in mediaList" :key="item.value"
                                              :label="item.value">
                                        {{ item.desc }}
                                    </el-radio>
                                </el-radio-group>
                            </div>
                        </el-form-item>
                        <el-form-item label="广告计划" label-width="80px" class="long-item plan-item">
                            <div class="media" :class="adPlanList.length ? '' : 'empty-data'"
                                 style="width: 522px;min-height: 282px">
                                <div class="flex m-b-10">
                                    <div>
                                        <el-input
                                            @input="handleInput"
                                            placeholder="请输入内容"
                                            v-model="dialogInputValue">
                                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                                        </el-input>
                                    </div>
                                    <div class="pointer m-l-15" style="color: #4063DF"
                                         @click="handleRefresh">
                                        <span class="iconfont icon-refresh"></span>
                                        <span>刷新</span>
                                    </div>
                                </div>
                                <div class="plan-radio">
                                    <el-radio-group v-model="checked" v-loading="loading">
                                        <el-radio @change="getAdPlanItem(ite)" v-for="(ite,idx) in adPlanList"
                                                  :key="idx" :label="ite.ad_id">
                                            {{ ite.name }}
                                        </el-radio>
                                    </el-radio-group>
                                </div>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <!-- 打开策略弹窗内容 -->

                <!-- 打开定向弹窗内容 -->
                <div v-else>
                    <el-form class="customized-form directional-form" :inline="true">
                        <el-form-item label-width="80px" class="long-item">
                            <el-input
                                placeholder="请输入定向包名称关键词"
                                v-model="directionalInputValue">
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label-width="80px">
                            <el-button type="primary" class="long-button" @click="searchFn">查询</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="selected-all">
                        <el-checkbox
                            :indeterminate="isIndeterminate"
                            v-model="checkAll"
                            :disabled="disabled"
                            @change="handleCheckAllChange">
                            全选
                        </el-checkbox>
                        <span class="m-l-16">已选&nbsp;{{ checkedItem.length }}个&nbsp;定向包</span>
                        <div class="flex item-select" :class="checkedList.length ? '' : 'empty-data'"
                             v-loading="loading">
                            <div v-for="(item,index) in checkedList" :key="index" class="m-b-30">
                                <el-checkbox-group v-model="checkedItem" @change="handleCheckedCitiesChange">
                                    <el-checkbox :disabled="disabled" :label="item.audience_package_id"
                                                 :title="item.name">
                                        {{ item.name | handleLength(15) }}
                                    </el-checkbox>
                                </el-checkbox-group>
                                <div class="middle both-style">
                                    <div>
                                        <span class="title">定向包类型：</span>
                                        <span>{{ item.landing_type ? item.landing_type : '-' }}</span>
                                    </div>
                                    <div>
                                        <span class="title">投放范围：</span>
                                        <span>{{ item.delivery_range ? item.delivery_range : '-' }}</span>
                                    </div>
                                    <div>
                                        <span class="title">地域：</span>
                                        <span>{{ item.district ? item.district : '-' }}</span>
                                    </div>
                                    <div>
                                        <span class="title">性别：</span>
                                        <span>{{ item.gender ? item.gender : '-' }}</span>
                                    </div>
                                    <div>
                                        <span class="title">年龄：</span>
                                        <span>{{ item.age ? item.age : '-' }}</span>
                                    </div>
                                    <div>
                                        <span class="title">定向人群包：</span>
                                        <span>{{ item.retargeting_tags ? item.retargeting_tags : '-' }}</span>
                                    </div>
                                    <div>
                                        <span class="title">排除人群包：</span>
                                        <span>
                                            {{ item.retargeting_tags_exclude ? item.retargeting_tags_exclude : '-' }}
                                        </span>
                                    </div>
                                    <div>
                                        <span class="title">行为兴趣：</span>
                                        <span>{{ item.interest_action_mode ? item.interest_action_mode : '-' }}</span>
                                    </div>
                                    <div>
                                        <span class="title">行为场景：</span>
                                        <span>{{ item.action_scene ? item.action_scene : '-' }}</span>
                                    </div>
                                    <div>
                                        <span class="title">行为天数：</span>
                                        <span>{{ item.action_days ? item.action_days : '-' }}</span>
                                    </div>
                                    <div>
                                        <span class="title">行为类目词：</span>
                                        <span>{{ item.action_categories ? item.action_categories : '-' }}</span>
                                    </div>
                                    <div>
                                        <span class="title">行为关键词：</span>
                                        <span>{{ item.action_words ? item.action_words : '-' }}</span>
                                    </div>
                                    <div>
                                        <span class="title">手机品牌：</span>
                                        <span>{{ item.device_brand ? item.device_brand : '-' }}</span>
                                    </div>
                                    <div>
                                        <span class="title">手机价格：</span>
                                        <span>{{ item.launch_price ? item.launch_price : '-' }}</span>
                                    </div>
                                    <div>
                                        <span class="title">职业状态：</span>
                                        <span>{{ item.career ? item.career : '-' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div style="text-align: center">
                        <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-size="pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="totals">
                        </el-pagination>
                    </div>
                </div>
                <!-- 打开定向弹窗内容 -->
            </div>
        </customized-dialog>
        <!-- 弹窗 -->
    </div>
</template>

<script>
import ThrottleMixin from "@/mixins/ThrottleMixin";
import {strategyHeader, directionalHeader} from "@views/Popular/SmartCreate/Plan/Plan.js";
import CustomizedDialog from "@/components/CustomizedDialog.vue";

export default {
    name: "Plan",
    components: {CustomizedDialog},
    mixins: [ThrottleMixin],
    props: {
        account: {
            type: Array
        },
        campid: {
            type: Array
        }
    },
    created() {
        this.header = strategyHeader;
        this._header = directionalHeader;
    },
    watch: {
        formData: {
            handler: function (val) {
                this.$emit('planListChange', val)
            },
            deep: true,
            immediate: true
        },
        checkedItem: {
            handler: function (val) {
                if (val.length < 1) {
                    this.disabled = false;
                } else {
                    this.disabled = true;
                }
            },
            deep: true,
            immediate: true
        },
        account: {
            handler: function (val) {
                this.advertiserId = [];
                val.forEach(it => {
                    this.advertiserId.push(it.advertiser_id);
                })
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        return {
            downloadType: 1,
            adAddress: 'MANUAL',
            media: false,
            formData: {
                tableData: [],
                directionalTableData: [],
                itemAdvertiserId: '',
                adId: '',
                audience_package_id: ''
            },
            strategyRules: {
                strategy: [
                    {required: true, validator: this.adStrategy}
                ]
            },
            directionalRules: {
                directional: [
                    {required: true, validator: this.adDirectional}
                ]
            },
            _header: [],
            visibleDialog: false,
            accountList: [],
            mediaList: [],
            title: '',
            dialogWidth: 0,
            dialogInputValue: '',
            directionalInputValue: '',
            radio: '',
            checked: '',
            adPlanList: [],
            checkAll: false,
            checkedItem: [],
            checkedList: [],
            isIndeterminate: false,
            advertiserId: [],
            currentPage: 1,
            pageSize: 0,
            totals: 0,
            loading: false,
            disabled: false,
            disabledSubmit: false
        }
    },
    deactivated() {
        this.reset();
        this.checkedList = [];
        this.checkAll = false;
    },
    methods: {
        //重置数据
        reset() {
            this.advertiserId = [];
            this.formData.tableData = [];
            this.formData.directionalTableData = [];
            if (this.$refs.formData) this.$refs.formData.resetFields();
            if (this.$refs.strategyFormData) this.$refs.strategyFormData.resetFields();
        },

        //验证
        handleValidStrategyFormData() {
            if (this.$refs.strategyFormData) {
                return new Promise((resolve) => {
                    this.$refs.strategyFormData.validate((valid) => {
                        if (valid) {
                            resolve(valid)
                        }
                    })
                })
            }
        },

        handleValidFormData() {
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
        //验证广告策略
        adStrategy(rule, value, callback) {
            if (this.formData.tableData && this.formData.tableData.length) {
                callback()
            } else {
                callback(new Error('请选择广告策略'))
            }
        },
        //验证广告定向
        adDirectional(rule, value, callback) {
            if (this.formData.directionalTableData && this.formData.directionalTableData.length) {
                callback()
            } else {
                callback(new Error('请选择定向包'))
            }
        },
        //删除表格中的某一条data
        deleteItem(id) {
            let temp = this.formData.directionalTableData.find(it => it.audience_package_id === id);
            this.checkedItem.forEach((item, index) => {
                if (id === item) {
                    this.checkedItem.splice(index, 1)
                }
            })
            if (this.checkedItem.length !== this.checkedList.length) this.checkAll = false;
            this.formData.directionalTableData.splice(temp, 1);
        },
        //打开选择策略弹窗
        selectStrategy() {
            this.visibleDialog = true;
            this.getMediaList();
            this.title = '选择广告策略';
            this.accountList = this.account;
            this.dialogWidth = 650;
            this.disabledSubmit = false;
            if (this.formData.tableData.length) this.disabledSubmit = true;
        },
        //打开选择定向弹窗
        selectDirectional() {
            this.visibleDialog = true;
            this.getDirectionalList();
            this.title = '定向包选择';
            this.dialogWidth = 928;
            this.disabledSubmit = false;
            if (this.formData.directionalTableData.length) this.disabledSubmit = true;
        },
        //关闭或取消弹窗
        closeDialog() {
            this.media = false;
            this.downloadType = 1;
            this.adAddress = 'MANUAL';
            this.dialogInputValue = '';
            this.checked = '';
            this.radio = '';
            this.adPlanList = [];
            this.directionalInputValue = '';
            if (!this.formData.directionalTableData.length) {
                this.checkedItem = [];
                if (this.checkedList.length !== this.checkedItem.length) {
                    this.checkAll = false;
                }
            }
            this.isIndeterminate = false;
            this.handleValidStrategyFormData();
            this.handleValidFormData();
            this.visibleDialog = false;
        },
        //定向包列表
        getDirectionalList() {
            this.loading = true;
            this.$http.get('/tt/au/list', {
                params: {
                    keyword: this.directionalInputValue,
                    advertiser_id: JSON.stringify(this.advertiserId),
                    page: this.currentPage,
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.checkedList = res.data.data.list;
                    this.currentPage = res.data.data.pagination.current_page;
                    this.pageSize = res.data.data.pagination.page_size;
                    this.totals = res.data.data.pagination.total;
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        //获取计划策略
        getPlan(advertiserId, adId) {
            this.$http.get('/tt/ad/strategy', {
                params: {
                    advertiser_id: advertiserId,
                    ad_id: adId
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.formData.tableData.push(res.data.data);
                }
            }).finally(() => {
                this.handleValidStrategyFormData();
            })
        },
        //删除策略
        deleteStrategy(val) {
            this.formData.tableData.splice(val, 1);
            if (!this.formData.tableData.length) this.disabledSubmit = false;
        },
        //弹窗确认
        submitData() {
            if (this.title === '选择广告策略') {
                if (this.checked && this.advertiserId.length) {
                    this.getPlan(this.formData.itemAdvertiserId, this.formData.adId);
                    this.closeDialog();
                } else {
                    this.$message.warning('请选择投放账户和广告计划');
                    this.visibleDialog = true;
                }
            } else {
                if (!this.checkedItem.length) {
                    this.visibleDialog = true;
                    this.$message.warning('请选择定向包')
                } else {
                    this.checkedList.forEach(ite => {
                        this.checkedItem.forEach(it => {
                            if (ite.audience_package_id === it) {
                                this.formData.audience_package_id = it;
                                let temp = this.formData.directionalTableData.find(item => item.audience_package_id === it);
                                temp ? Object.assign(temp, ite) : this.formData.directionalTableData.push(ite);
                            }
                        })
                    })
                    this.closeDialog();
                }
            }
        },
        //清空策略table数据
        clearStrategyTableData() {
            this.formData.tableData = [];
            if (!this.formData.tableData.length) this.disabledSubmit = false;
        },
        //清空定向包table数据
        clearDirectionalTableData() {
            this.checkedItem = [];
            this.checkAll = false;
            this.formData.directionalTableData = [];
        },
        //删除投放账户
        deleteAccount(id) {
            this.accountList.splice(id, 1)
        },
        //输入框
        handleInput() {
            this.throttle(this.getAdPlanList, this, 1000)
        },
        //刷新
        handleRefresh() {
            this.getAdPlanList();
        },
        //下载链接
        handleLink(val) {
            this.downloadType = val;
        },
        //落地页
        handlePage(val) {
            this.downloadType = val;
        },
        //获取首选媒体列表
        getMediaList() {
            this.$http.get('/tt/get-inventory-type').then(res => {
                if (res.data.code === 200) {
                    this.mediaList = res.data.data;
                }
            })
        },
        //首选媒体切换
        changeRadio() {
            this.getAdPlanList();
        },
        //获取广告计划列表
        getAdPlanList() {
            if (this.accountList.length && this.campid.length && this.radio) {
                this.loading = true;
                this.$http.get('/tt/ad/select', {
                    params: {
                        keyword: this.dialogInputValue,
                        advertiser_id: JSON.stringify(this.advertiserId),
                        campaign_id: JSON.stringify(this.campid),
                        inventory_type: this.radio
                    }
                }).then(res => {
                    if (res.data.code === 200) {
                        this.adPlanList = res.data.data.list;
                    }
                }).finally(() => {
                    this.loading = false;
                })
            } else {
                this.$message.warning('请先选择投放账户,广告组以及首选媒体')
            }
        },
        //首选媒体
        selectMedia(val) {
            this.getMediaList();
            this.media = true;
            this.adAddress = val;
        },
        //点击其他两个
        clickOther(val) {
            this.radio = '';
            this.media = false;
            this.adAddress = val;
            this.adPlanList = [];
        },
        //查询
        searchFn() {
            this.getDirectionalList();
        },
        handleCheckAllChange(val) {
            this.checkedList.forEach(it => {
                this.checkedItem.push(it.audience_package_id)
            })
            this.disabled = this.checkedItem.length > 1;
            this.checkedItem = val ? this.checkedItem : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.checkedList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkedList.length;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        //获取广告策略列表参数
        getAdPlanItem(val) {
            this.formData.itemAdvertiserId = val.advertiser_id;
            this.formData.adId = val.ad_id;
        },
    }
}
</script>

<style scoped lang="scss">
@import "src/views/Popular/SmartCreate/CommonStyle";

.container {

    .directional-form {
        padding-top: 0px;

        .long-item {
            /deep/ .el-input__inner {
                max-width: 225px;
                width: 225px;
            }
        }
    }

    /deep/ .el-dialog__body {
        padding-bottom: 0;
    }

    .dialog-box {

        .strategy-form {
            .account-item {
                div {
                    width: 522px;
                    max-width: 522px;
                    min-height: 50px;
                    border: 1px solid #DCDFE6;
                    border-radius: 4px;
                    padding: 13px 12px 11px 12px;
                    box-sizing: border-box;

                    .select-account-item {
                        position: relative;
                        display: inline-block;
                        height: 26px;
                        line-height: 26px;
                        border-radius: 4px;
                        margin-right: 12px;
                        background-color: #f4f4f5;
                        border-color: #e9e9eb;
                        color: #909399;
                        padding-right: 12px;

                        .account-title {
                            padding: 5px 8px;
                            font-size: $font-size-addition;
                            color: $font-color-auxiliary;
                        }

                        .icon-account-delete {
                            position: absolute;
                            top: 0px;
                            right: 3px;
                            cursor: pointer;
                        }
                    }
                }
            }

            .plan-item {
                /deep/ .el-input__inner {
                    width: 364px;
                    max-width: 364px;
                }

                .plan-radio {
                    overflow: auto;
                    max-height: 225px;

                    /deep/ .el-radio__inner {
                        vertical-align: text-top;
                    }

                    /deep/ .el-radio__label {
                        text-overflow: ellipsis;
                        white-space: normal;
                        line-height: 18px;
                        vertical-align: text-top;
                        display: inline-block;
                        font-size: $font-size-addition;
                        color: $font-color-base;
                        padding-right: 12px;
                    }

                    /deep/ .el-radio__input.is-checked + .el-radio__label {
                        color: $theme-color;
                    }
                }
            }
        }

        /deep/ .el-checkbox__label {
            font-size: $font-size-base !important;
        }

        .customized-form {
            /deep/ .el-button-group {

                .btn:not(:last-child) {
                    border-color: $theme-color;
                    background-color: white;
                    z-index: 100;

                    span {
                        color: $theme-color;
                    }
                }

                .btn:last-child {
                    border-color: $theme-color;
                    background-color: white;

                    span {
                        color: $theme-color;
                    }
                }

                .el-button {
                    span {
                        font-size: $font-size-addition;
                        color: $font-color-auxiliary;
                    }
                }
            }

            .media {
                border: 1px solid #EBEBEB;
                border-radius: 4px;
                padding: 12px 12px 0 12px;
                box-sizing: border-box;

                /deep/ .el-radio-group {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);

                    .el-radio__input.is-checked .el-radio__inner::after {
                        transform: translate(-50%, -50%) scale(2);
                        background-color: $theme-color;
                    }

                    .el-radio__input.is-checked .el-radio__inner {
                        background-color: white;
                    }

                    .el-radio {
                        margin-bottom: 12px;
                    }
                }

                .plan-radio {
                    /deep/ .el-radio-group {
                        display: block;
                        width: 100%;

                        .el-radio {
                            width: 100%;
                        }
                    }
                }
            }
        }

        .selected-all {
            /deep/ .el-checkbox-group {
                width: 208px;
                height: 44px;
                border: 1px solid #EBEBEB;
                background-color: #F5F5F5;
                padding: 10px 0 14px 12px;
                box-sizing: border-box;
            }

            .item-select {
                flex-wrap: wrap;
                justify-content: space-between;
                min-height: 300px;
                max-height: 380px;
                overflow: auto;

                .both-style {
                    border: 1px solid #EBEBEB;
                    border-top: none;
                    overflow: auto;
                    max-height: 296px;

                    div {
                        max-width: 175px;
                        padding: 4px 0 4px 12px;
                        font-size: $font-size-addition;

                        .title {
                            color: $font-color-auxiliary;
                        }
                    }
                }
            }
        }
    }
}
</style>