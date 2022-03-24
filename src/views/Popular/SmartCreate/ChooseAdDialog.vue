<template>
    <!--    选择广告组-->
    <customized-dialog
        title="选择广告组"
        class="customized-dialog"
        :visible="dialogVisible"
        :width="1200"
        :showFooter="true"
        @cancel="closeDialogHandler"
        @submit="subSend('addForm')"
        @close="closeDialogHandler"
    >
        <el-row :gutter="20">
            <el-col :span="16">
                <el-col :span="8">
                    <div class="tittle">广告账号</div>
                </el-col>
                <el-col :span="8">
                    <div class="tittle">广告组</div>
                </el-col>
            </el-col>
            <el-col :span="8">
                <div class="tittle">已选</div>
            </el-col>
        </el-row>
    </customized-dialog>
    <!--    /选择广告组-->

</template>

<script>
import DialogMixin from "@mixins/DialogMixin";

export default {
    name: "ChooseAdDialog",

    mixins:[DialogMixin],

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
        }
    },

    methods: {

        subSend(formName) {

            this.$emit("success");
        },


        closeDialogHandler() {
            this.closeDialog();
        }
    }
}
</script>

<style scoped lang="scss">
/deep/.el-dialog__body {
    padding: 0;
}
.el-row {
    .el-col {
        .tittle {
            border-bottom: 1px solid #EBEBEB;
        }
        border-right: 1px solid #EBEBEB;

    }
}

</style>
