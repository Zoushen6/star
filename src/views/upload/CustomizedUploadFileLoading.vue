<template>
    <!-- 上传提示弹窗  -->
    <customized-dialog
        title="提示"
        :width="507"
        :visible="dialogVisible"
        @close="closeDialog"
    >
        <p>正在上传中，请耐心等待...</p>
    </customized-dialog>
    <!-- 上传提示弹窗  -->
</template>

<script>
import DialogMixin from "@mixins/DialogMixin";
export default {
    name: "CustomizedUploadFile",

    mixins: [DialogMixin],
}
</script>

<style scoped lang="scss">
</style>