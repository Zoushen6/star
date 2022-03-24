<template>
    <div class="setting-box flex-vertical flex-1 overflow-hidden">
        <material-info-form
            :isVideo="isVideo"
            :isDisable="disableMultiOp"
            @search="searchFn"
            @command="operations"
        ></material-info-form>
        <material-content
            class="flex-1 overflow-hidden"
            ref="materialContent"
            :List="materialList"
            :ListLoading="loading"
            :isVideo="isVideo"
            :totalNum="total"
            :currentPage.sync="currentPage"
            :page-size.sync="pageSize"
            @itemClick="handleClick"
            @checkChange="checkChange"
            @size-change="val=>{pageSizeChange(materialListLoad,this,val)}"
            @current-change="val=>{pageChange(materialListLoad,this,val)}"
        ></material-content>

        <video-detail-info v-if="isVideo" ref="detailInfo" :info="curItem" @addLabel="openDialog('addLabel')" @dialogClose="resetSingleOp"></video-detail-info>

        <picture-detail-info v-else ref="detailInfo" :info="curItem" @addLabel="openDialog('addLabel')" @dialogClose="resetSingleOp"></picture-detail-info>

        <add-label-dialog ref="addLabel" :media-id="mediaId" :label-id.sync="curItem.label_ids" :is-multi-op="isMultiOp" @success="handleAddLabelSuccess" @dialogClose="resetMultiOp"></add-label-dialog>

        <message-push-dialog ref="messagePush" :media-id="mediaId" @success="handleSuccess" @dialogClose="resetOp"></message-push-dialog>

        <video-share-dialog
            v-if="isVideo"
            ref="share"
            :is-multi-op="isMultiOp"
            :material-id="mediaId"
            :material-list="materialList"
            :url="curItem.resource_url"
            @dialogClose="handleCopySuccess">
        </video-share-dialog>

        <delete-material-dialog ref="deleteMaterial" :media-id="mediaId" @success="()=>{this.materialListLoad(1)}" @dialogClose="resetOp"></delete-material-dialog>

        <text-dialog ref="textDialog" :text="dialogText"></text-dialog>

    </div>
</template>

<script>

    import MaterialInfoForm from "@views/Idea/Material/MaterialInfoForm";
    import MaterialContent from "@views/Idea/Material/MaterialContent";
    import AddLabelDialog from "@views/Idea/Material/AddLabelDialog";
    import PictureDetailInfo from "@views/Idea/Material/PictureDetailInfo";
    import LibraryMixin from "@views/Idea/Material/LibraryMixin";
    import DeleteMaterialDialog from "@views/Idea/Material/DeleteMaterialDialog";
    import MessagePushDialog from "@views/Idea/Material/MessagePushDialog";
    import VideoShareDialog from "@views/Idea/Material/VideoShareDialog";
    import VideoDetailInfo from "@views/Idea/Material/VideoDetailInfo";
    import TextDialog from "@components/dialog/TextDialog";


    export default {
        name: "MaterialLibrary",
        components: {
            TextDialog,
            MessagePushDialog,
            DeleteMaterialDialog,
            PictureDetailInfo,
            AddLabelDialog,
            VideoShareDialog,
            VideoDetailInfo,
            MaterialInfoForm,
            MaterialContent
        },
        mixins: [LibraryMixin],
        // 数据格式化
        computed: {
        },

        props:{
            isVideo: {
                type: Boolean,
                default: true
            }
        },

        activated() {
            this.materialListLoad(1)
        },

        deactivated() {
            this.searchForm = [];
        },

        data() {
            return {
            }
        },
        methods: {

            axiosMaterialList(page) {
                return this.$http.get("/media/media/index", {
                    params: {
                        product_id: this.searchForm.product_id,
                        industry_id: this.searchForm.industry_id,
                        user_id: this.searchForm.user_id,
                        creatives: this.searchForm.creatives,
                        origin_id: this.searchForm.origin_id,
                        label_ids: this.searchForm.label_ids,
                        group_id: this.searchForm.all_videoTeam,
                        department_id: this.searchForm.all_videoDepartment,
                        file_name:this.searchForm.file_name,
                        type: this.isVideo ? 1 : 2, //1video 2picture
                        page,
                        page_size: this.pageSize,
                    }
                })
            },

        }
    }
</script>

<style scoped lang="scss">

</style>

