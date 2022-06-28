<template>
    <div class="flex-vertical flex-1 overflow-hidden">
        <material-info-form
            :isVideo="isVideo"
            :isDisable="disableMultiOp"
            ref="materialForm"
            @search="searchFn"
            @command="operations"
        ></material-info-form>
        <material-content
            class="flex-1 overflow-hidden"
            ref="materialContent"
            :List="materialList"
            :ListLoading="loading"
            :isVideo="isVideo"
            :checked-list="checkedList"
            :totalNum="total"
            :currentPage.sync="currentPage"
            :page-size.sync="pageSize"
            @itemClick="handleClick"
            @checkChange="checkChange"
            @handleRefresh="handleRefresh"
            @size-change="val=>{pageSizeChange(materialListLoad,this,val)}"
            @current-change="val=>{pageChange(materialListLoad,this,val)}"
        ></material-content>
    </div>
</template>

<script>

    import MaterialInfoForm from "./MaterialInfoForm";
    import MaterialContent from "./MaterialContent";
    import LibraryMixin from "./LibraryMixin";


    export default {
        name: "MaterialLibrary",
        components: {
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
            },
            checkedList:{
                type: Array,
            },
        },

        mounted() {
            this.materialListLoad(1)
        },

        data() {
            return {
            }
        },
        methods: {

            getList() {
                this.$refs.materialForm.searchFn()
            },

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

            resetForm() {
                this.$refs.materialForm.resetForm('searchForm');
            },

            cancelChecked() {
                this.$refs.materialContent.cancelChecked();
            },

            handleRefresh() {
                this.getList()
            }

        }
    }
</script>

<style scoped lang="scss">

</style>

