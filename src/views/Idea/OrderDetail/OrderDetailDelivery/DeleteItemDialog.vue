<template>
    <!-- 删除弹窗 -->
    <customized-dialog
        title="提示"
        :width="507"
        :visible="dialogVisible"
        @close="closeDialog"
        :showFooter="true"
        @submit="submit"
        @cancel="closeDialog"
    >
        <p>确认删除吗？</p>
    </customized-dialog>
    <!-- 删除弹窗 -->
</template>

<script>
import DialogMixin from "@mixins/DialogMixin";

export default {
    name: "DeleteItemDialog",

    mixins: [DialogMixin],

    props: {
        orderId: {
            type:Number,
        },
        resourceId: {
            type: [Number, String],
        },
    },

    methods:{
        submit(){
            this.$http.post("/media/file/delete", {
                resource_id: this.resourceId,
                order_id: this.orderId,
            }).then(res => {
                if (res.data.code === 200) {
                    this.$message({
                        message: "删除成功！",
                        type: 'success'
                    });
                    this.$emit('success');
                    this.closeDialog();
                }
            })
        },
    }
}
</script>

<style scoped>

</style>