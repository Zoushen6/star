<template>
    <!--添加标签弹窗-->
    <customized-dialog
        :title="dialogTitle"
        class="customized-dialog"
        :visible="dialogVisible"
        :show-footer="true"
        :width="600"
        @cancel="closeDialogCallback"
        @submit="submit"
        @close="closeDialogCallback"
    >
        <el-form element-loading-background="transparent" ref="addForm" :model="addForm" :rules="addRules"
                 label-width="80px" label-position="right"
                 class="dialog-form">
            <el-form-item label="选择标签" prop="addList">
                <el-select v-model="addForm.addList" :loading="labelLoading" placeholder="请选择"multiple collapse-tags clearable>
                    <el-option
                        v-for="item in labelList"
                        :key="item.label_id"
                        :label="item.label_name"
                        :value="item.label_id"
                        :disabled="item.disabled"
                    >
                    </el-option>
                    <div class="m-l-r-10 add-label" :slot="labelList.length ? null : 'empty'">
                        <div class="add-new-label customized-button pointer" v-show="!isClickAddNewLabel"
                             @click="() => {this.isClickAddNewLabel = true}">+添加新标签
                        </div>
                        <div v-show="isClickAddNewLabel" class="add-label-input">
                            <el-input v-model="inputLabel" placeholder="请输入内容" maxlength="20" :clearable="false">
                            </el-input>
                            <el-button type="text" size="mini" @click="addLabel" :disabled="!inputLabel">确定</el-button>
                            <el-button type="text" size="mini" @click="() => {this.isClickAddNewLabel = false;this.inputLabel = ''}">取消</el-button>
                        </div>
                    </div>
                </el-select>
            </el-form-item>

        </el-form>
    </customized-dialog>
    <!--/添加标签弹窗-->
</template>

<script>

    import DialogMixin from "@mixins/DialogMixin";

    export default {
        name: "AddLabelDialog",
        mixins: [DialogMixin],
        data() {
            return {
                isClickAddNewLabel: false,
                labelLoading:false,
                labelList: [],
                addForm: {
                    addList: []
                },
                addRules: {
                    addList: [
                        {required: true, message: "标签不能为空"}
                    ]
                },
                inputLabel: ""
            }
        },

        props: {
            mediaId: {
                type: [String, Array, Number],
                required: true
            },
            labelId: {
                type: Array,
                default: []
            },
            isMultiOp: {
                type: Boolean
            }
        },

        watch: {
            dialogVisible: {
                handler: function (val) {
                    if (val) {
                        this.clearValidate();
                        this.getLabelList();
                    }
                }
            },

            labelId: {
                handler: function (val) {
                    // 先赋值再打开弹窗
                    this.addForm.addList = val;
                }
            },

            isMultiOp(val) {
                this.dialogTitle = val ? "批量添加标签" : "添加标签";
            }
        },
        methods: {
            axiosAddLabel() {
                return this.$http.post("/media/media/add-label", {
                    label_name: this.inputLabel
                })
            },

            labelBind() {
                let url, params = {};
                if (this.mediaId.length === 1) {
                    url = "/media/media/media-label";
                    params.media_id = this.mediaId.join(",");
                } else {
                    url = "/media/media/batch-media-label";
                    params.media_ids = this.mediaId.join(",");
                }
                params.label_ids = this.addForm.addList.join(",");
                return this.$http.post(url, params);
            },

            axiosLabel() {
                return this.$http.get("/media/media/label-list", {
                    params: {}
                })
            },

            getLabelList() {
                this.axiosLabel().then((res) => {
                    if (res.data.code === 200) {
                        this.labelList = res.data.data;
                        this.labelList.forEach(item => {
                            item.disabled = this.addForm.addList.some(it => it === item.label_id);
                        })
                    }
                }).catch((error) => {
                    console.warn(error);
                })
            },

            addLabel() {
                this.labelLoading = true;
                this.axiosAddLabel().then((res) => {
                    if (res.data.code === 200) {
                        this.isClickAddNewLabel = false;
                        this.inputLabel = '';
                        this.getLabelList();
                    }
                }).catch((error) => {
                    console.warn(error);
                }).finally(() => {
                    this.labelLoading = false;
                });
            },

            resetFields() {
                if (this.$refs.addForm) this.$refs.addForm.resetFields();
            },

            clearValidate() {
                if (this.$refs.addForm) this.$refs.addForm.clearValidate();
            },

            submit() {
                this.$refs.addForm.validate(valid => {
                    if (valid) {
                        this.labelBind().then(res => {
                            if (res.data.code === 200) {
                                // 相信后端一波，直接更新不去重新拉取列表
                                // this.$emit("labelId:update", this.addForm.addList);
                                this.$emit("update:labelId", this.addForm.addList);
                                let label = res.data.data.label ? res.data.data.label : "";
                                this.$emit('success', label);
                                this.closeDialog();
                            }
                        })
                    }
                })
            },

            closeDialogCallback() {
                this.labelList = [];
                this.closeDialog();
            }
        }
    }
</script>

<style scoped lang="scss">

    .add-new-label {
        color: $theme-color;
        padding: 8px;
    }

    .add-label {
        .el-input {
            margin-right: 10px;
        }

        /deep/ .el-input__inner, .el-input {
            width: 220px;
        }

        /deep/ .el-input__inner {
            height: 28px;
        }

        .add-label-input {
            line-height: 40px;
        }

        /deep/ .el-input__validateIcon {
            display: none !important;
        }
    }


</style>
