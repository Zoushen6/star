<template>
    <div class="h-100 flex-vertical p-b-32 border-box overflow-auto-y">
        <router-link class="uniform-link iconfont m-l-16" to="/idea/order">返回</router-link>
        <div class="background-white border-radius-4 m-l-16 m-r-16 container flex-1">
            <el-collapse v-model="activeNames" class="el-collapse-arrow-text">
                <el-collapse-item name="1">
                    <template slot="title">
                        <span class="uniform-title">需求信息</span><span class="uniform-desc">（需求信息提交后不可修改，请仔细填写呦）</span>
                    </template>
                    <!-- 需求信息 -->
                    <div class="needInfo">
                        <el-form label-width="100px" :model="needRuleForm" :rules="needRules" ref="needRuleForm">
                            <el-form-item label="下单时间" v-if="orderID">
                                <el-input :disabled="!!orderID" :value="creative_time"></el-input>
                            </el-form-item>
                            <el-form-item label="需求名称" prop="demand_name">
                                <el-input maxlength="100" :disabled="!!orderID"
                                          v-model="needRuleForm.demand_name"></el-input>
                            </el-form-item>
                            <el-form-item label="产品名称" prop="product_id">
                                <el-select :disabled="!!orderID" v-model="needRuleForm.product_id"
                                           placeholder="请选择">
                                    <el-option
                                        v-for="(it,index) in productNameType"
                                        :key="index"
                                        :label="it.item"
                                        :value="it.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="产品线名称" class="product-line">
                                <el-select v-model="needRuleForm.productLineOptions" placeholder="请选择" disabled>
                                    <el-option
                                        v-for="item in productLineOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="产品行业" prop="product_industry">
                                <el-select v-model="needRuleForm.product_industry" placeholder="请选择"
                                           :disabled="!!orderID">
                                    <el-option
                                        v-for="(it,index) in productIndustry"
                                        :key="index"
                                        :label="it.item"
                                        :value="it.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="投放链接">
                                <el-input v-model="needRuleForm.link"
                                          :disabled="!!orderID"></el-input>
                            </el-form-item>
                            <el-form-item label="产品LOGO">
                                <el-upload
                                    v-if="!orderID"
                                    class="upload-demo logo inline-block"
                                    ref="upload"
                                    :limit=1
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    :on-change="beforeUpload"
                                    accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                                    :auto-upload="false">
                                    <el-button slot="trigger" size="small">选取文件</el-button>
                                </el-upload>
                                <div v-else :class="url?'logo':''">
                                    <el-button :disabled="!url" :type="url?'':'info'" @click="openDialog('logoDialog')" size="small">
                                        打开文件
                                    </el-button>
                                </div>
                            </el-form-item>
                            <el-form-item label="产品说明">
                                <el-input type="textarea" v-model="needRuleForm.product_description"
                                          :disabled="!!orderID"></el-input>
                            </el-form-item>
                            <el-form-item label="接单团队" prop="group_id">
                                <el-select v-model="needRuleForm.group_id"
                                           placeholder="请选择"
                                           :disabled="!!orderID">
                                    <el-option
                                        v-for="it in groupType"
                                        :key="it.group_id"
                                        :label="it.group_name"
                                        :value="it.group_id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="下单类型" prop="order_type">
                                <el-radio-group v-model="needRuleForm.order_type" v-for="(it,index) in orderType"
                                                :key="index" :disabled="!!orderID">
                                    <el-radio :label="it.id-0" size="medium">{{ it.item }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="需求类型" prop="demand_type">
                                <el-radio-group v-model="needRuleForm.demand_type" v-for="item in demandType"
                                                :key="item.id" :disabled="!!orderID">
                                    <el-radio :label="item.id-0">{{ item.item }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="投放媒体" prop="media" class="media-type">
                                <el-radio-group v-model="needRuleForm.media" v-for="(it,index) in mediaType"
                                                :key="index" :disabled="!!orderID">
                                    <el-radio :label="it.id-0">{{ it.item | handleLength(5) }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="截止日期" prop="end_time">
                                <el-col :span="11">
                                    <el-date-picker
                                        :disabled="!!orderID"
                                        type="date"
                                        placeholder="选择日期"
                                        v-model="needRuleForm.end_time"
                                        style="width: 100%;"
                                        :picker-options="this.pickerOptions()"
                                    ></el-date-picker>
                                </el-col>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!-- 需求信息 -->
                </el-collapse-item>
                <el-collapse-item name="2">
                    <template slot="title">
                        <span class="uniform-title">订单信息</span><span class="uniform-desc">（订单信息提交后不可修改，请仔细填写呦）</span>
                    </template>
                    <!-- 订单信息 -->
                    <div class="orderInfo">
                        <el-form label-width="100px" :model="orderRuleForm" :rules="orderRules" ref="orderRuleForm">
                            <el-form-item label="订单名称" prop="order_name">
                                <el-input maxlength="100" v-model="orderRuleForm.order_name"
                                          :disabled="!!orderID"></el-input>
                            </el-form-item>
                            <el-form-item label="素材类型" prop="material_type">
                                <el-radio-group v-model="orderRuleForm.material_type"
                                                v-for="(it,index) in materialType"
                                                :key="index" :disabled="!!orderID">
                                    <el-radio :label="it.id-0">{{ it.item }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="特殊要求">
                                <el-input type="textarea" v-model="orderRuleForm.special_requirement"
                                          :disabled="!!orderID"></el-input>
                            </el-form-item>
                            <el-form-item label="风险提示语">
                                <el-input type="textarea" v-model="orderRuleForm.prompt"
                                          :disabled="!!orderID"></el-input>
                            </el-form-item>
                            <el-form-item v-if="!orderStatus">
                                <el-button type="primary" size="small" :disabled="!(userOrderAuth & POST_ORDER_AUTH)"
                                           @click="onSubmit('needRuleForm','orderRuleForm')">确认发布
                                </el-button>
                            </el-form-item>

                            <!-- 待接单或拒单 -->
                            <el-form-item v-if="getAuth(GET_ORDER_AUTH)">
                                <el-button class="button-length" size="small" type="success" @click="openTextDialog('getOrder','提示', '确定接单吗?')">接单</el-button>
                                <el-button class="button-length" size="small" type="primary" @click="goto('order')">取消</el-button>
                            </el-form-item>
                            <!-- 待接单或拒单 -->
                        </el-form>
                    </div>
                    <!-- 订单信息 -->
                </el-collapse-item>
                <el-collapse-item name="3" class="delivery-item"
                                  v-if="(orderMask & (STATUS_MAKE_ING | STATUS_NOT_SIGN | STATUS_NOT_DELIVER | STATUS_REJECT_VISA | STATUS_DELIVER_ING | STATUS_NOT_AUDIT | STATUS_OVERDUE))">
                    <template slot="title">
                        <span class="uniform-title">创意交付及确认</span>
                    </template>

                    <!-- 状态为制作中的运营和管理员视角 and 状态为已过期的所有用户视角 -->
                    <delivery-making-and-overdue
                        :orderStatus="orderStatus"
                        :orderName="orderName"
                        :groupName="groupName"
                        :overdueResource="overdueResource"
                    ></delivery-making-and-overdue>
                    <!-- 状态为制作中的运营和管理员视角 and 状态为已过期的所有用户视角 -->

                    <!-- 状态为未过审时table数据 -->
                    <div class="w-100" v-if="overdueResource.length && getAuth(GET_NOT_AUDIT_AUTH)">
                        <span class="m-t-20 m-b-20 inline-block font-14">未过审创意：</span>
                        <upload-table
                            :fileList="overdueResource"
                            @rowClick="rowClick"
                        ></upload-table>
                    </div>
                    <!-- 状态为未过审时table数据 -->

                    <!-- 状态为制作中、待签收、待投放、投放中以及未过审时table数据 -->
                    <div class="new-delivery w-100" v-if="orderMask & (STATUS_MAKE_ING|STATUS_NOT_SIGN|STATUS_NOT_DELIVER|STATUS_DELIVER_ING|STATUS_NOT_AUDIT)">
                        <!--排除：订单状态为制作中，且用户没有提交权限-->
                        <span v-if="!(orderMask&(STATUS_MAKE_ING|STATUS_NOT_AUDIT) && !(userOrderAuth & SUBMIT_AUTH))" class="m-b-20 inline-block">{{deliveryTitle}}</span>
                        <el-button
                            class="iconfont icon-upload customized-button f-r overflow-hidden continue-upload inline-block"
                            @click="openDialog('uploadDialog')"
                            v-if="getAuth(SUBMIT_AUTH) && resource.length!==0"
                        >继续上传
                        </el-button>
                        <upload-file v-if="getAuth(SUBMIT_AUTH) && resource.length === 0" @upload="openDialog('uploadDialog')">
                        </upload-file>
                        <upload-table
                            ref="uploadTable"
                            :Selection="showSelection"
                            :fileList="resource"
                            @selectionChange="getTableSelection"
                            @rowClick="rowClick"
                            v-if="getAuth(SUBMIT_AUTH) && resource.length!==0 || orderMask&(STATUS_NOT_SIGN|STATUS_NOT_DELIVER|STATUS_DELIVER_ING)"
                        ></upload-table>
                    </div>
                    <!-- 状态为制作中、待签收、待投放、投放中以及未过审时table数据 -->

                    <div v-if="getAuth(BIND_SIGN_AUTH_ACCEPT) && isOperation=='1'" class="w-100 text-center m-t-50">
                        <el-button class="button-length" size="small" type="success" @click="orderSign">签收</el-button>
                        <el-button class="button-length" size="small" type="danger" @click="openDialog('rejectSign')">拒签</el-button>
                        <el-button class="button-length" size="small" type="primary" @click="goto('order')">取消</el-button>
                    </div>

                    <!-- 状态为待投放时关联头条账户 -->
                    <el-form v-if="getAuth(DELIVER_AUTH)" ref="deliveryForm" :model="deliveryForm">
                        <el-form-item label="选择渠道" prop="channel" class="channel">
                            <el-select v-model="deliveryForm.channel" placeholder="请选择">
                                <el-option
                                    v-for="item in channels"
                                    :key="item.item"
                                    :label="item.item"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="投放账户" prop="headLineID" v-if="deliveryForm.channel">
                            <el-select
                                v-model="deliveryForm.headLineID"
                                filterable
                                remote
                                multiple
                                :popper-append-to-body="false"
                                :remote-method="headLineSearch"
                                @visible-change="headLineSearch('')"
                                v-loadmore="headLineScroll"
                                placeholder="选择账户ID">
                                <el-option
                                    v-for="(item,index) in optionsHeadlineAccount"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.advertiser_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="medium" type="primary" @click="addDialog">确认加入账户</el-button>
                        </el-form-item>
                    </el-form>
                    <!-- 状态为待投放时关联头条账户 -->

                    <!-- 已拒签状态重新交付 -->
                    <reject-sign-order
                        v-if="orderMask&STATUS_REJECT_VISA"
                        :info="deliveryRuleForm"
                        :order-id="orderID"
                        :resubmit="showResubmit"
                        @resubmit="resubmitHandler"
                    ></reject-sign-order>
                    <!-- 已拒签状态重新交付 -->

                    <!-- 交付和重新交付 -->
                    <div class="overdue m-b-20">
                        <el-button class="button-length customized-button"
                                   type="primary"
                                   @click="openTextDialog('delivery', '提示', '确定此订单所需素材均上传完成？', 'iconfont icon-delivery-sure')"
                                   v-if="getAuth(SUBMIT_AUTH) && resource.length !== 0"
                        >{{isResubmitOrder ? "重新交付" : "交付"}}</el-button>
                    </div>
                    <!-- 交付和重新交付 -->

                </el-collapse-item>
            </el-collapse>
        </div>

        <!-- 查看关联账户弹窗 -->
        <account-dialog ref="showAccount" :info="curResourceRow" @dialogClose="resetCurRow"></account-dialog>
        <!-- 查看关联账户弹窗 -->

        <!-- 添加关联账户弹窗 -->
        <add-account-dialog ref="addAccountDialog" :order-id="orderID" :info="deliveryForm" @success="handleAddIdSuccess"></add-account-dialog>
        <!-- 添加关联账户弹窗 -->

        <!-- 删除弹窗 -->
        <delete-item-dialog
            ref="delete"
            :orderId="orderID"
            :resourceId="curResourceRow.resource_id"
            @success="orderDetailData"
            @dialogClose="resetCurRow"
        ></delete-item-dialog>
        <!-- 删除弹窗 -->

        <!-- 查看未过审原因弹窗 -->
        <overdue-dialog
            ref="overdueReason"
            :info="curResourceRow"
            @success="handleOverdueReason"
            @dialogClose="resetCurRow"
        ></overdue-dialog>
        <!-- 查看未过审原因弹窗 -->

        <!-- 上传文件弹窗 -->
        <delivery-upload-dialog
            ref="uploadDialog"
            :fileTypes="needRuleForm.demand_type"
            :isResubmit="isResubmitOrder"
            @openUploadLoading="openDialog('uploadLoading')"
            @closeUploadLoading="closeDialog('uploadLoading')"
            @uploadFinish="openDialog('uploadSuccess')"
            @updateDetail="orderDetailData"
        ></delivery-upload-dialog>
        <!-- 上传文件弹窗 -->

        <!-- 上传文件中和上传成功弹窗 -->
        <customized-upload-file-loading ref="uploadLoading"></customized-upload-file-loading>
        <customized-upload-file-success ref="uploadSuccess" @dialogClose="handleUploadSuccess"></customized-upload-file-success>
        <!-- 上传文件中和上传成功弹窗 -->

        <!-- 拒签弹窗 -->
        <reject-sign-dialog ref="rejectSign" :order-id="orderID"></reject-sign-dialog>
        <!-- 拒签弹窗 -->

        <!-- 文本弹窗(交付和重新交付) -->
        <text-dialog ref="textDialog" :title="textDialogInfo.title" :text="textDialogInfo.text" :show-footer="true" :text-class="textDialogInfo.classes"
                     @success="handleTextDialogSuccess" @dialogClose="resetTextDialog"></text-dialog>
        <!-- 文本弹窗(交付和重新交付) -->

        <!-- 发布需求上传logo弹窗 -->
        <logo-dialog ref="logoDialog" :url="url"></logo-dialog>
        <!-- 发布需求上传logo弹窗 -->

    </div>

</template>

<script>
import {mapState} from 'vuex';
import axios from 'axios';
import InfoFormMixin from "@mixins/InfoFormMixin";
import DialogMixin from "@mixins/DialogMixin";
import OrderAuthorityMixin from "@mixins/OrderAuthorityMixin";
import {CopyContent} from "@tools/Copy";
import CustomizedUploadFileLoading from "@views/upload/CustomizedUploadFileLoading.vue";
import CustomizedUploadFileSuccess from "@views/upload/CustomizedUploadFileSuccess.vue";
import UploadFile from "@views/Idea/OrderDetail/OrderDetailDelivery/UploadFile.vue";
import DeliveryUploadDialog from "@views/Idea/OrderDetail/OrderDetailDelivery/DeliveryUploadDialog.vue";
import UploadTable from "@views/Idea/OrderDetail/OrderDetailDelivery/UploadTable.vue";
import DeleteItemDialog from "@views/Idea/OrderDetail/OrderDetailDelivery/DeleteItemDialog.vue";
import OverdueDialog from "@views/Idea/OrderDetail/OrderDetailDelivery/OverdueDialog.vue";
import AccountDialog from "@views/Idea/OrderDetail/OrderDetailDelivery/AccountDialog.vue";
import AddAccountDialog from "@views/Idea/OrderDetail/OrderDetailDelivery/AddAccountDialog.vue";
import RejectSignDialog from "@views/Idea/OrderDetail/OrderDetailDelivery/RejectSignDialog.vue";
import RejectSignOrder from "@views/Idea/OrderDetail/OrderDetailDelivery/RejectSignOrder.vue";
import TextDialog from "@/components/dialog/TextDialog.vue";
import LogoDialog from "@views/Idea/OrderDetail/OrderDetailDelivery/LogoDialog.vue";
import DeliveryMakingAndOverdue from "@views/Idea/OrderDetail/OrderDetailDelivery/DeliveryMakingAndOverdue.vue";
import {needForm,orderForm,deliveryForm,needRules,orderRules} from "@views/Idea/OrderDetail/OrderDetail.js";

export default {

    name: "OrderDetail",
    components: {
        DeliveryMakingAndOverdue,
        LogoDialog,
        TextDialog,
        RejectSignOrder,
        RejectSignDialog,
        AddAccountDialog,
        AccountDialog,
        OverdueDialog,
        DeleteItemDialog,
        UploadTable,
        DeliveryUploadDialog,
        UploadFile,
        CustomizedUploadFileSuccess,
        CustomizedUploadFileLoading
    },

    mixins: [InfoFormMixin, OrderAuthorityMixin, DialogMixin],

    data() {
        return {
            orderName: '',
            groupName: '',
            fileType: "",
            orderStatus: "",
            creative_time: "",
            orderID: Number(this.$route.query.order_id),
            url: "",
            activeNames: ['1', '2', '3'],
            needRules,
            orderRules,
            rawFile: null,
            videoFile: null,
            needRuleForm: needForm,
            orderRuleForm: orderForm,
            deliveryRuleForm: deliveryForm,
            rejectFileList: [],
            resource: [],
            overdueResource: [],
            optionsHeadlineAccount: [],
            deliveryForm: {
                channel: '',
                checkedValue: [],
                headLineID: []
            },
            curAdvertiserPage: 1,
            totalAdvertiser: 10,
            advertiserKey: '',
            curResourceRow: {
                advertiser: [],
                resource_id: '',
                reject_reason: '',
                modification_opinions: '',
                id: ''
            },
            hasReSubmit: false, //是否点击重新交付,作用是当未过审的状态流转到假制作中的标识
            textDialogInfo: {
                title: "",
                text: "",
                classes: "",
                cmd: ""
            },
            strategy: {
                getOrder: this.getOrderHandler,
                delivery: this.deliveryHandler
            },
            deliveryTableStrategy: {
                delete: this.openDialog,
                showAccount: this.openDialog,
                copyFile: this.copyFile,
                downLoadFile: this.downLoadFile,
                overdueReason: this.openDialog,
            },
            isOperation: "",
            imageUrl: "",
        };
    },

    created() {
        this.curResourceRowCopy = Object.assign({},this.curResourceRow);
        this.textDialogInfoCopy = Object.assign({},this.textDialogInfo);
    },

    // 数据格式化
    computed: {
        showSelection() {
            return this.getAuth(this.DELIVER_AUTH);
        },
        showResubmit() {
            return this.getAuth(this.RE_SUBMIT_AUTH);
        },
        orderMask() {
            return this.GetStatusMask(this.orderStatus);
        },
        orderOpMask() {
            return this.GetOrderOpMask(this.orderMask);
        },
        deliveryTitle() {
            return this.overdueResource.length ? "新提交创意：" : "创意交付：";
        },
        // 未过审和已拒签的重新提
        isResubmitOrder() {
            return this.hasReSubmit || this.orderMask & this.STATUS_NOT_AUDIT;
        },
        ...mapState({
            userOrderAuth: state => state.global.userOrderAuth,
            token: state => state.global.token,
        })
    },

    activated: async function () {
        if (this.$route.query.order_id) {
            await this.orderDetailData();
            if (this.orderMask & this.STATUS_REJECT_VISA) {
                await this.rejectSignDetail();
            }
            this.activeNames = this.getAuth(this.STATUS_MAKE_ING) ? ['1', '2', '3'] : ['3'];
        }
    },

    deactivated() {
        this.resetDetailData();
        this.$router.go(0);
    },

    methods: {

        openDialog(dialog) {
            if (this.$refs[dialog]) this.$refs[dialog].openDialog();
        },

        closeDialog(dialog) {
            if (this.$refs[dialog]) this.$refs[dialog].closeDialog();
        },

        // 表格行点击事件
        rowClick(row, cmd) {
            this.curResourceRow = row;
            this.deliveryTableStrategy[cmd](cmd);
        },

        CopyContent,

        // 表格复制功能
        copyFile() {
            this.CopyContent(this.curResourceRow.resource_url);
            this.resetCurRow();
        },

        // 表格下载功能
        downLoadFile(){
            this.$common.downLoadPicture(this.curResourceRow.resource_url,this.curResourceRow.resource_name);
            this.resetCurRow();
        },

        resetCurRow() {
            this.curResourceRow = this.curResourceRowCopy;
        },

        // 表格筛选的全部数据
        getTableSelection(val) {
            this.deliveryForm.checkedValue = val;
        },

        // 重新交付
        resubmitHandler() {
            this.orderStatus = "3";
            this.hasReSubmit = true;
        },

        openTextDialog(cmd, title="", text="", classes="") {
            this.textDialogInfo = {cmd, title , text, classes};
            this.openDialog('textDialog');
        },

        handleTextDialogSuccess() {
            this.strategy[this.textDialogInfo.cmd]();
        },

        resetTextDialog() {
            this.textDialogInfo = this.textDialogInfoCopy;
        },

        // 接单
        getOrderHandler() {
            this.$http.get("/order/accept", {
                params: {
                    order_id: this.orderID,
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: "接单成功！",
                        type: 'success'
                    });
                    this.closeDialog('textDialog');
                    this.orderDetailData();
                }
            })
        },

        // 交付和重新交付
        deliveryHandler() {
            const prefix = this.hasReSubmit ? "重新交付" : "交付";
            this.$http.post("/order/delivery", {
                order_id: this.orderID,
            }).then(res => {
                if (res.data.code === 200) {
                    this.$message.success(prefix + "成功");
                    this.hasReSubmit = false;
                    this.goto('order');
                } else {
                    this.$message.error(prefix + "失败")
                }
            })
        },

        // 订单确认签收
        orderSign() {
            this.$http.get("/order/receive", {
                params: {
                    order_id: this.$route.query.order_id,
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: "签收成功！",
                        type: 'success'
                    });
                    this.goto('order');
                }
            })
        },

        // 《上传成功弹窗》关闭时先关闭《上传弹窗》，再重新获取订单数据
        handleUploadSuccess() {
            this.closeDialog('uploadDialog');
            this.orderDetailData();
        },

        handleOverdueReason(opinions) {
            this.curResourceRow.modification_opinions = opinions;
        },

        headLineScroll() {
            if (this.totalAdvertiser < (this.curAdvertiserPage + 1)) return;
            this.headLineChange(this.advertiserKey, this.curAdvertiserPage + 1);
        },

        headLineSearch(val) {
            this.optionsHeadlineAccount = [];
            this.advertiserKey = val;
            this.headLineChange(val);
        },

        //选择账户下拉
        headLineChange(key = '', page = 1) {
            this.$http.get("/user/advertiser/list", {
                params: {
                    page: page,
                    page_size: 10,
                    search: key,
                    channel: this.deliveryForm.channel,
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.curAdvertiserPage = res.data.data.pagination.current_page;
                    this.totalAdvertiser = res.data.data.pagination.page_count;
                    this.optionsHeadlineAccount.push(...res.data.data.list);
                }
            })
        },

        //权限获取
        getAuth(auth) {
            return Boolean(this.userOrderAuth & this.orderOpMask & auth);
        },

        resetDetailData() {
            this.$refs.needRuleForm.resetFields();
            this.$refs.orderRuleForm.resetFields();
        },

        pickerOptions() {
            return {
                disabledDate(time) {
                    return time.getTime() < new Date() - 3600 * 1000 * 24 || time.getTime() > new Date() - 3600 * 1000 * 24 * -93;
                },
            };
        },

        //订单详情
        orderDetail() {
            return this.$http.get("order/order-detail", {
                params: {
                    order_id: this.$route.query.order_id,
                }
            })
        },

        //详情数据
        orderDetailData: async function () {
            this.resource = [];
            this.overdueResource = [];
            const res = await this.orderDetail();
            if (res.data.code === 200) {
                let obj = res.data.data;
                this.orderName = obj.order_name;
                this.groupName = obj.group_name;
                this.isOperation = obj.is_operation;
                // 如果当前还处于重新交付中，则把当前状态改为假状态“制作中”
                this.orderStatus = this.hasReSubmit ? "3" : obj.status;
                this.creative_time = obj.create_time;
                this.needRuleForm.demand_name = obj.demand_name;
                this.needRuleForm.product_industry = obj.product_industry;
                this.needRuleForm.end_time = Number(obj.end_time * 1000);
                this.needRuleForm.order_type = Number(obj.order_type);
                this.needRuleForm.media = Number(obj.media);
                this.needRuleForm.demand_type = Number(obj.demand_type);
                this.needRuleForm.product_id = obj.product_id;
                this.needRuleForm.group_id = this.orderID ? Number(obj.group_id) : '';
                this.needRuleForm.link = obj.link;
                this.needRuleForm.product_description = obj.product_description;
                this.orderRuleForm.material_type = Number(obj.material_type);
                this.orderRuleForm.order_name = obj.order_name;
                this.orderRuleForm.special_requirement = obj.special_requirement;
                this.orderRuleForm.prompt = obj.prompt;
                this.url = obj.url ? obj.url : "";
                if (obj.resource) {
                    obj.resource.forEach(item => {
                        item.order_mask = this.orderOpMask;
                        item.order_status = this.orderMask;
                        if (item.media_status === "3") {
                            this.overdueResource.push(item);
                        } else {
                            this.resource.push(item);
                        }
                    })
                }
            }
        },

        addDialog() {
            this.$refs.deliveryForm.validate((valid) => {
                if (valid && this.deliveryForm.checkedValue.length && this.deliveryForm.channel && this.deliveryForm.headLineID.length) {
                    this.openDialog('addAccountDialog');
                } else {
                    this.$message("请选择渠道和需要加入的投放账户和创意内容");
                }
            })
        },

        handleAddIdSuccess() {
            this.$refs.deliveryForm.resetFields();
            this.orderDetailData();
        },

        //上传图片文件
        beforeUpload(file, fileList) {
            let type = file.raw.type;
            if (type == "image/png" || type == "image/jpeg") {
                this.needRuleForm.file = fileList[0].raw;
            } else {
                this.$message.error("上传图片类型错误")
            }
        },

        //发布需求
        requestDemand() {
            const obj = {};
            obj.end_time = this.$common.getNewDay(this.needRuleForm.end_time);
            const res = {...this.needRuleForm, ...this.orderRuleForm, ...obj};
            const formData = new FormData();
            Object.keys(res).forEach(key => {
                formData.append(key, res[key]);
            });
            formData.append('file', this.rawFile);
            return axios({
                url: '/order/release',
                method: 'post',
                data: formData,
                processData: false,// 告诉axios不要去处理发送的数据(重要参数)
                contentType: false,   // 告诉axios不要去设置Content-Type请求头
                headers: {
                    'Authorization': this.token
                }
            })
        },

        //确认发布需求
        onSubmit() {
            let flag = true;
            this.$refs.needRuleForm.validate((valid) => {
                flag = flag && valid;
            });
            this.$refs.orderRuleForm.validate((valid) => {
                flag = flag && valid;
            });
            if (flag) {
                this.requestDemand().then(res => {
                    if (res.data.code === 200) {
                        this.rawFile = null;
                        this.resetDetailData();
                        this.$message({
                            message: "发布成功！",
                            type: 'success'
                        });
                        this.goto('order');
                    }
                })
            }
        },

        goto(name) {
            this.$router.push({name});
        },

        //拒签理由详情返回
        rejectSignDetail: async function () {
            const res = await this.$http.get("/order/reject-detail", {
                params: {
                    order_id: this.$route.query.order_id,
                }
            });
            if (res.data.code === 200) {
                this.deliveryRuleForm.refusal = res.data.data.list.order.reject_reason;
                if (res.data.data.list.resource.length !== 0) {
                    res.data.data.list.resource.forEach(item=>{
                        this.rejectFileList.push(item.url)
                    })
                    this.deliveryRuleForm.rejectFileName = this.rejectFileList.join(',');
                }
            }
        }

    }
}
</script>

<style scoped lang="scss">
    @import "OrderDetail";
</style>