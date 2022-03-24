<template>
    <!--推送弹窗-->
    <customized-dialog
        title="推送至其他平台"
        class="customized-dialog"
        :visible="dialogVisible"
        :width="600"
        :showFooter="true"
        @cancel="closeDialogHandler"
        @submit="subSend('addForm')"
        @close="closeDialogHandler"
    >
        <el-form element-loading-background="transparent" ref="addForm" :model="addForm" :rules="addRules"
                 label-width="100px" label-position="right"
                 class="dialog-form">
            <el-form-item label="选择渠道" prop="channel">
                <el-select v-model="addForm.channel" placeholder="请选择">
                    <el-option
                        v-for="item in channels"
                        :key="item.item"
                        :label="item.item"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="投放账户" prop="pid" v-show="addForm.channel">
                <el-select
                    v-model="addForm.pid"
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
        </el-form>
    </customized-dialog>
    <!--/推送弹窗-->
</template>

<script>
    import DialogMixin from "@mixins/DialogMixin";

    export default {
        name: "MessagePushDialog",

        mixins: [DialogMixin],

        data() {
            return {
                addForm: {
                    channel: '',
                    pid: [],
                },
                addRules: {
                    channel: [
                        {required: true, message: "渠道不能为空"}
                    ],
                    pid: [
                        {required: true, message: "投放账户不能为空"}
                    ],
                },
                optionsHeadlineAccount: [],
                channels: [
                    {
                        item: "头条数据",
                        id: 1
                    },
                    {
                        item: "快手数据",
                        id: 2
                    },
                ],
                advertiserKey: "",
                curAdvertiserPage: 0,
                totalAdvertiser: 0
            }
        },

        props: {
            mediaId: Array
        },

        methods: {
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
                        channel: this.addForm.channel,
                    }
                }).then(res => {
                    if (res.data.code === 200) {
                        this.curAdvertiserPage = res.data.data.pagination.current_page;
                        this.totalAdvertiser = res.data.data.pagination.page_count;
                        this.optionsHeadlineAccount.push(...res.data.data.list);
                    }
                })
            },

            headLineScroll() {
                if (this.totalAdvertiser < (this.curAdvertiserPage + 1)) return;
                this.headLineChange(this.advertiserKey, this.curAdvertiserPage + 1);
            },

            //确认推送
            subSend(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axiosSend(this.mediaId.join(",")).then((res) => {
                            if (res.data.code === 200) {
                                this.$message({
                                    message: "推送成功",
                                    type: "success"
                                });
                                this.$emit("success");
                                this.$refs[formName].resetFields();
                                this.closeDialog();
                            }
                        }).catch((error) => {
                            console.warn(error);
                        })
                    }
                })
            },

            axiosSend(resource_ids) {
                return this.$http.post("/media/file/file-upload",
                    {
                        advertiser_ids: this.addForm.pid.join(","),
                        order_id: 0,
                        channel: this.addForm.channel,
                        resource_ids
                    })
            },

            closeDialogHandler() {
                this.$refs.addForm.resetFields();
                this.closeDialog();
            }
        }

    }
</script>

<style scoped lang="scss">

</style>
