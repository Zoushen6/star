<template>
    <customized-dialog
        v-loading.fullscreen.lock="fullscreenLoading"
        title="确定加入账户"
        class="customized-dialog"
        :width="507"
        :visible="dialogVisible"
        @close="closeDialog"
        :showFooter="true"
        @submit="submit"
        @cancel="closeDialog"
    >
        <p>确定加入账户ID吗？</p>
    </customized-dialog>
</template>

<script>
import DialogMixin from "@mixins/DialogMixin";
export default {
    name: "AddAccountDialog",
    mixins: [DialogMixin],
    props: {
        info: {
            type: Object,
            default(){
                return {
                    channel: '',
                    pid: "",
                    checkedValue: [],
                    headLineID: [],
                }
            }
        },
        orderId: Number
    },
    data(){
        return {
            fullscreenLoading: false
        }
    },
    methods: {
        submit() {
            this.fullscreenLoading = true;
            this.$message("正在加入账户ID");
            this.$http.post('/media/file/file-upload', {
                advertiser_ids: this.info.headLineID.join(','),
                pid: this.info.pid,
                resource_ids: this.info.checkedValue.map(it=>it.resource_id).join(","),
                order_id: this.orderId,
            }).then(res => {
                if (res.data.code === 200) {
                    this.$message.success("同步数据中，请稍后查看！");
                    this.$emit('success');
                    this.fullscreenLoading = false;
                    this.closeDialog();
                }else {
                    this.fullscreenLoading = false;
                    this.$message.error("加入失败，请重新加入！");
                }
            })
        },
    }
}
</script>

<style scoped>

</style>