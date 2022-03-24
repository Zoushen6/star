<template>
    <!--删除弹窗-->
    <customized-dialog
        :visible="dialogVisible"
        class="deleteDialog"
        :show-footer="true"
        :width="507"
        @cancel="closeDialog"
        @submit="subDeletePic"
        @close="closeDialog"
    >
        <p style="text-align:left; margin:-6px 0 24px 5px">确定删除选中的素材吗？</p>
    </customized-dialog>
    <!--/删除弹窗-->
</template>

<script>
    import DialogMixin from "@mixins/DialogMixin";

    export default {
        name: "DeleteMaterialDialog",

        mixins: [DialogMixin],

        props: {
            mediaId: Array
        },

        methods: {
            subDeletePic() {
                this.axiosDelete(this.mediaId.join(",")).then((res) => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        this.closeDialog();
                        this.$emit('success');
                    }
                }).catch((error) => {
                    console.warn(error);
                }).finally(() => {
                });
            },

            axiosDelete(media_ids) {
                return this.$http.post("/media/media/delete-media", {media_ids});
            },
        }

    }
</script>

<style scoped>

</style>
