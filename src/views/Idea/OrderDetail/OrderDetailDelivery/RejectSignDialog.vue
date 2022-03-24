<template>
    <customized-dialog
        title="提示"
        class="customized-dialog"
        :visible="dialogVisible"
        :width="507"
        :show-footer="true"
        @close="closeDialog"
        @submit="submit"
    >
        <el-form class="reject dialog-form" :model="addForm" :rules="rules" ref="addForm">
            <p>请填写拒签理由：</p>
            <el-form-item prop="reason">
                <el-input maxlength="500" show-word-limit
                          v-model="addForm.reason" type="textarea"></el-input>
            </el-form-item>
        </el-form>
    </customized-dialog>
</template>

<script>
import DialogMixin from "@mixins/DialogMixin";
export default {
    name: "RejectSignDialog",
    mixins: [DialogMixin],
    data(){
        return {
            addForm: {
                reason: "",
            },
            rules:{
                reason: [
                    { required: true, message: '请填写拒签理由' }
                ]
            },
        }
    },
    props: {
        orderId: Number
    },
    methods: {
        //确认拒签
        submit() {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$http.get("/order/refuse", {
                        params: {
                            order_id: this.orderId,
                            reason: this.addForm.reason,
                        }
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                message: "拒签成功！",
                                type: 'success'
                            });
                            this.$router.push({name: 'order'});
                        }
                    })
                }
            });
        },
    }
}
</script>

<style scoped lang="scss">

/deep/ .el-textarea .el-textarea__inner {
    min-height: 110px!important;
}

</style>