<template>
    <div class="flex-vertical flex-1 m-l-r-16 container">
        <el-form class="customized-form padding-top background-white p-l-r-24" :model="formData" :rules="formRules"
                 ref="formData">
            <div class="title">创意</div>
            <div class="flex-1">
                <el-form-item label="预计每计划" label-width="100px" :required="true">
                    <el-button-group class="button-group-number">
                        <el-button>视频数</el-button>
                        <el-input v-model="formData.videoNumber"
                                  oninput="if(value > 7 || value < 1 ){value = ''}"
                                  onkeyup="value=value.replace(/[^\d]/g,'');"
                                  @keyup.enter.native="$event => $event.target.blur()"
                                  @blur="() => {if(!formData.videoNumber)formData.videoNumber=3}"
                        ></el-input>
                    </el-button-group>
                    <el-button-group class="button-group-number m-l-24">
                        <el-button>图片数</el-button>
                        <el-input v-model="formData.picNumber"
                                  oninput="if(value > 7 || value < 1 ){value = ''}"
                                  onkeyup="value=value.replace(/[^\d]/g,'');"
                                  @keyup.enter.native="$event => $event.target.blur()"
                                  @blur="() => {if(!formData.picNumber)formData.picNumber=3}"
                        ></el-input>
                    </el-button-group>
                </el-form-item>
                <el-form-item label="预计每视频" label-width="100px" :required="true">
                    <el-button-group class="button-group-number">
                        <el-button>封面数</el-button>
                        <el-input v-model="formData.coverNumber"
                                  onkeyup="value=value.replace(/[^\d]/g,'');"
                                  @keyup.enter.native="$event => $event.target.blur()"
                                  @blur="() => {if(!formData.coverNumber)formData.coverNumber=1}"
                        ></el-input>
                    </el-button-group>
                </el-form-item>
                <el-form-item label="素材" label-width="100px" prop="material">
                    <el-button class="customized-button iconfont icon-add-mv" @click="openDialog(true)"><span class="add-material">添加视频</span>
                    </el-button>
                    <el-button class="customized-button iconfont icon-add-pic" @click="openDialog(false)"><span class="add-material">添加图片</span>
                    </el-button>
                </el-form-item>

                <el-form-item  label-width="100px" v-show="formData.videoList.length||formData.picList.length" >
                    <div class="material-box">
                        <el-tabs v-model="activeName" @tab-click="handleClickTab">
                            <el-tab-pane :label="'视频'+'('+formData.videoList.length+')'" name="first"><material-content-copy ref="videoCopy" :is-video="true" :List="formData.videoList" @itemChange="videoChange"></material-content-copy></el-tab-pane>
                            <el-tab-pane :label="'图片'+'('+formData.picList.length+')'" name="second"><material-content-copy ref="picCopy" :is-video="false" :List="formData.picList" @itemChange="picChange"></material-content-copy></el-tab-pane>
                        </el-tabs>
                    </div>
                </el-form-item>

                <el-form-item label="每个素材下" label-width="100px" :required="true">
                    <el-button-group class="button-group-number">
                        <el-button>标题数</el-button>
                        <el-input v-model="formData.titleNumber"
                                  oninput="if(value > 7 || value < 1 ){value = ''}"
                                  onkeyup="value=value.replace(/[^\d]/g,'');"
                                  @keyup.enter.native="$event => $event.target.blur()"
                                  @blur="() => {if(!formData.titleNumber)formData.titleNumber=1}"
                        ></el-input>
                    </el-button-group>
                </el-form-item>
                <el-form-item label="标题" label-width="100px" prop="tableData">
                    <el-button class="customized-button iconfont icon-select-item" @click="addTitle">添加标题
                    </el-button>
                    <span class="title-number">{{this.formData.tableData.length}}/10</span>
                    <div class="f-r pointer" style="padding-right: 120px;color: #4063DF" @click="clearTableData" v-show="this.formData.tableData.length">清空
                    </div>
                </el-form-item>
            </div>
        </el-form>

        <!-- 表格区 -->
        <div class="background-white table" v-show="this.formData.tableData.length" >
            <customized-table
                class="flex-1 customized-table has-border mini-table p-l-r-24"
                ref="customizedTable"
                :scroll-in-table="false"
                :table-height="null"
                :Header="header"
                :Data="formData.tableData"
                :showPagination="false"
            >
                <template v-slot:operation="{row}">
                    <span style="cursor: pointer;color: #4063DF" @click="deleteItem(row)">删除</span>
                </template>
            </customized-table>
        </div>
        <!-- 表格区 -->

        <!-- 添加标题弹窗 -->
        <customized-dialog
            title="添加标题"
            :width="560"
            :visible="visibleDialog"
            @close="closeDialog"
            :showFooter="true"
            @submit="submitTittle"
            @cancel="closeDialog"
        >
            <div class="dialog-box">
                <el-input type="textarea" maxlength="30" show-word-limit v-model="titleInfo.title"></el-input>
            </div>
        </customized-dialog>
        <!-- /添加标题弹窗 -->

        <!-- 添加素材弹窗 -->
        <customized-dialog
            title="素材库"
            custom-class="material"
            :visible="materialVisibleDialog"
            :width="1260"
            @close="closeDialog"
            :showFooter="true"
            :isReverse="true"
            @submit="submitData"
            @cancel="closeDialog"
        >
        <material-library ref="library" :is-video="isVideo" @checkChange="checkChange" :checked-list="checkedList"></material-library>
        </customized-dialog>
        <!-- /添加素材弹窗 -->
    </div>
</template>

<script>
import {header} from "@views/Popular/SmartCreate/Creative/Creative.js";
import MaterialLibrary from "@views/Popular/SmartCreate/Creative/MaterialLibrary/MaterialLibrary";
import MaterialContentCopy from "./components/MaterialContentCopy";

export default {
    name: "Creative",
    components: {MaterialLibrary,MaterialContentCopy},
    created() {
        this.header = header;
    },
    watch: {
        formData: {
            handler: function (val) {
                this.$emit('creativeListChange',val)
            },
            deep:true,
            immediate:true
        }
    },
    data() {
        let checkMaterial = (rule, value, callback) => {
            if (this.formData.videoList.length || this.formData.picList.length) {
                callback()
            }else{
                callback(new Error('请选择素材'))
            }
        };
        let checkTitle = (rule, value, callback) => {
            if (this.formData.tableData.length) {
                callback()
            }else{
                callback(new Error('请添加标题'))
            }
        };
        return {
            formData: {
                videoNumber:3,
                picNumber:3,
                videoList:[],
                picList:[],
                titleNumber:1,
                tableData: [],
                coverNumber:1
            },
            formRules: {
                videoList:{required: true, message: "请输入计划名称"},
                material:{required: true,validator:checkMaterial},
                tableData:{required: true,validator:checkTitle},
            },
            visibleDialog: false,
            materialVisibleDialog: false,
            isVideo:false,
            activeName:'first',
            checkedList:[],
            listFromDialog:[],
            titleInfo: {
                id:'',
                title:'',
            },
            checkSet:new Set()
        }
    },
    methods: {
        //添加标题
        addTitle() {
            this.visibleDialog = true;
        },

        //删除表格中的某一条data
        deleteItem(item) {
            let id = this.formData.tableData.findIndex(ite => ite.id===item.id);
            if(id !== -1){
                this.formData.tableData.splice(id,1)
            }
        },

        submitTittle() {
            this.titleInfo.id = this.formData.tableData.length;
            if(!this.titleInfo.title) {
                this.$message({
                    message: "请输入标题",
                    type: "warning"
                });
                return;
            }
            if(this.titleInfo.title.length < 5) {
                this.$message({
                    message: "标题长度为5-30个字",
                    type: "warning"
                });
                return;
            }
            if(this.formData.tableData.length === 10) {
                this.$message({
                    message: "标题最多添加10个",
                    type: "warning"
                });
            }else {
                this.formData.tableData.push(this.titleInfo);
            }
            this.closeDialog();
            this.handleValid();
        },

        handleClickTab(tab, event) {
            // console.log(tab, event);
        },

        checkChange(list,item) {
            this.listFromDialog=list;
        },

        videoChange(list) {
            this.formData.videoList = list
        },

        picChange(list) {
            this.formData.picList = list
        },

        openDialog(e) {
            this.isVideo = e;
            if(this.isVideo) {
                this.checkedList = this.formData.videoList
            }else {
                this.checkedList = this.formData.picList
            }
            this.$refs.videoCopy.clearCheck();
            this.$refs.picCopy.clearCheck();
            this.$nextTick(() => {
                this.$refs.library.getList();
            })
            this.materialVisibleDialog = true;
        },

        //关闭或取消弹窗
        closeDialog() {
            this.visibleDialog = false;
            this.materialVisibleDialog = false;
            this.titleInfo = {
                id:'',
                title:'',
            };
            this.$refs.library.cancelChecked();
            this.$refs.library.resetForm();
        },

        //弹窗确认
        submitData() {
            if(this.isVideo) {
                this.formData.videoList = this.listFromDialog;
            }else {
                this.formData.picList = this.listFromDialog;
            }
            this.closeDialog()
            this.handleValid()
        },

        //清空tableData
        clearTableData() {
            this.formData.tableData = []
        },

        reset() {
            this.formData.videoNumber = 3;
            this.formData.picNumber = 3;
            this.formData.titleNumber = 1;
            this.formData.videoList = [];
            this.formData.picList = [];
            if(this.$refs.formData) this.$refs.formData.resetFields();
        },

        handleValid() {
            if(this.$refs.formData) {
                return new Promise((resolve) => {
                    this.$refs.formData.validate((valid) => {
                        if(valid) {
                            resolve(valid)
                        }
                    })
                })
            }
        },

    }
}
</script>

<style scoped lang="scss">
@import "src/views/Popular/SmartCreate/CommonStyle";

.container {
    .dialog-box {
        /deep/ .el-textarea__inner {
            min-height: 130px !important;
        }
    }

    .material-box {
        margin-right: 120px;
        border: 1px solid #EBEBEB;
    }

    /deep/.el-tabs__nav-wrap {
        padding-left: 22px;
        border-bottom: 1px solid #EBEBEB;
    }

    /deep/.el-tabs__nav-wrap::after {
        height: 0;
    }

    /deep/.el-tabs__header {
        margin: 0;
    }

    /deep/.button-group-number {
        .el-input {
            width: 88px;
            display: inline-block;
            .el-input__inner {
                vertical-align: bottom;
                text-align: center;
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
            }
        }
        .el-button {
            font-weight: normal;
        }
    }

    .title-number {
        color: $font-color-auxiliary;
        margin-left: 8px;
    }

    .add-material {
        margin-left: 1px;
    }

}
</style>