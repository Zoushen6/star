import PaginationMixin from "@mixins/PaginationMixin";

const MultiPushDialogText = "已为选择的视频添加标签，请点击视频进入详情查看。";

export default {

    mixins: [PaginationMixin],

    data() {
        return {
            materialList: [],
            checkList: [],
            searchForm: {
                product_id:'',
                user_id:'',
                creatives:'',
                origin_id:'',
            },
            curItem: {
                id: "",
                label_ids: [],
                filename: "",
                resource_url: "",
                label: ""
            },
            curItemBack: null,
            isMultiOp: false,
            dialogText: ""
        }
    },

    created() {
        this.curItemBack = Object.assign({}, this.curItem);
        this.pageSize = 12;
    },

    computed: {
        disableMultiOp() {
            return !this.checkList.length;
        },

        mediaId() {
            if (this.curItem.id) {
                return [this.curItem.id];
            }
            return this.checkList;
        }
    },

    methods:{

        handleClick(item, op) {
            this.curItem = item;
            this.isMultiOp = false;
            this.openDialog(op);
        },

        openDialog(op) {
            if (this.$refs[op]) this.$refs[op].openDialog();
        },

        openTextDialog(text) {
            this.dialogText = text;
            this.openDialog('textDialog');
        },

        handleAddLabelSuccess(label) {
            if (this.isMultiOp) {
                this.openTextDialog(MultiPushDialogText);
                this.handleSuccess();
            } else {
                this.$message.success('标签绑定成功');
                this.curItem.label = label;
            }
        },

        handleSuccess() {
            if (this.isMultiOp) {
                this.clearCheck();
                this.materialListLoad(this.currentPage);
            }
        },

        handleCopySuccess() {
            this.resetOp();
            this.clearCheck();
        },

        clearCheck() {
            this.$refs.materialContent.clearCheck();
        },

        operations(op) {
            this.isMultiOp = true;
            this.openDialog(op);
        },

        //选择素材
        checkChange(list){
            this.$emit("checkChange", list);
        },

        resetMultiOp() {
            this.isMultiOp = false;
        },

        resetSingleOp() {
            this.curItem = this.curItemBack;
        },

        resetOp() {
            if (this.isMultiOp) {
                this.resetMultiOp();
            } else {
                this.resetSingleOp();
            }
        },

        //查询
        searchFn(param) {
            this.searchForm = param;
            this.materialListLoad(1);
        },

        materialListLoad(page) {
            this.loading = true;
            this.axiosMaterialList(page).then((res) => {
                if (res.data.code === 200 && res.data.data.list.length !== 0) {
                    this.materialList = res.data.data.list.map((item) => {
                        item.checkboxValue = false;
                        item.disabled = false;
                        item.clicked = false;
                        this.checkedList.forEach(it => {
                            if(it.id == item.id) {
                                item.checkboxValue = true;
                                item.disabled = true
                            }
                        })
                        return item;
                    });
                }
                this.total = Number(res.data.data.pagination.totalCount);
                this.currentPage = page;
            }).catch((error) => {
                console.warn(error);
            }).finally(() => {
                this.loading = false;
            });
        },

    }
}
