<template>
    <div class="flex-vertical container">
        <div class="operation-box" v-if="itemList.length">
            <el-checkbox v-model="checkAll" @change="handleCheckAll">{{''}}</el-checkbox>
            <el-button :disabled="isDisable" type="primary" plain @click="deleteMultiple">批量删除</el-button>
        </div>
        <el-row type="flex" :gutter="24" class="rank-list flex-1 content" v-loading="ListLoading">
            <el-col :lg="6" :xl="4" v-for="(item,idx) in itemList" :key="idx" class="rank-item">
                <div class="rank-item-wrapper pointer" :class="item.clicked?'has-border':''"  >
                    <el-row type="flex" justify="center" class="video-box position-relative" >
                        <el-row class="video-title">
                            <span class="delete pointer" @click="deleteSingle(item)"><svg-icon icon-name="icon-close"></svg-icon></span>
                        </el-row>
                        <video v-if="isVideo" height="170" :ref="'video'+idx"
                               @click="handleItem(item)"
                               :key="item.id" class="video-isPlay" :src="item.resource_url">
                            您的浏览器不支持 HTML5 video 标签。
                        </video>

                        <el-image v-else :src="item.resource_url" height="170" :ref="'pic'+idx" fit="fill"
                                  :key="item.id"
                                  @click="handleItem(item)"
                                   class="video-isPlay">
                        </el-image>
                        <el-row class="video-play" v-if="isVideo">
                            <el-col :span="24">
                                <div @click="$emit('itemClick', item, 'detailInfo')" class="pointer">
                                    <svg-icon icon-name="play"></svg-icon>
                                </div>
                            </el-col>
                        </el-row>
                    </el-row>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>

    export default {
        name: "MaterialContent",

        props: {
            List: {
                type: Array,
            },
            ListLoading: {
                type: Boolean,
                default: false
            },
            isVideo: {
                type: Boolean,
                default: true
            },
        },

        deactivated() {
            this.clearCheck();
        },

        data() {
            return {
                checkSet: new Set(),
                checkAll: false,
                selectList:[],
                isDisable:true,
                itemList:[]
            }
        },

        // 数据格式化
        computed: {
        },

        watch: {
            selectList: {
                handler(val) {
                    if(val.length) {
                        this.isDisable = false
                    }else {
                        this.isDisable = true
                    }
                    if(val.length && val.length === this.itemList.length) {
                        this.checkAll = true
                    }else {
                        this.checkAll = false
                    }
                }
            },
            List: {
                handler(val) {
                    this.itemList = val
                }
            },
            deep:true,
        },

        methods: {

            handleCheck(val, item) {
                const {id} = item;
                item.checkboxValue = val;
                if (val) {
                    this.checkSet.add(item);
                } else {
                    this.checkSet.delete(item);
                }
                const list = [];
                this.checkSet.forEach(val => {
                    list.push(val);
                });
                this.$emit("checkChange", list);
            },

            handleCheckAll(e) {
                this.List.forEach(item => item.clicked = e)
                this.selectList = e?this.List:[]
            },

            handleItem(item) {
                item.clicked = !item.clicked;
                if(item.clicked) {
                    this.checkSet.add(item)
                }else {
                    this.checkSet.delete(item)
                }
                const list = [];
                this.checkSet.forEach(val => {
                    list.push(val);
                });
                this.selectList = list
            },

            deleteMultiple() {
                if(this.checkAll)  {
                  this.itemList = []
                }else {
                      this.selectList.forEach((item,index) => {
                          this.itemList.forEach((it,idx) => {
                              if(item.id === it.id) {
                                  this.itemList.splice(idx,1);
                              }
                          })
                      })
                      // for(let i = 0;i < this.selectList.length;i++) {
                      //     for(let j = 0; j < this.itemList)
                      // }
                  }
                this.checkSet.clear();
                this.selectList = [];
                this.$emit('itemChange',this.itemList)

            },

            deleteSingle(item) {
                this.itemList.forEach((it,idx) => {
                    if(item.id === it.id) {
                        this.itemList.splice(idx,1);
                    }
                });
                this.selectList.forEach((ite,index) => {
                    if(item.id === ite.id) {
                        this.selectList.splice(index,1);
                    }
                })
                this.$emit('itemChange',this.itemList)
            },

            clearCheck() {
                this.itemList.forEach((item) => {
                    item.clicked = false;
                });
                this.checkSet.clear();
                this.selectList = [];
                this.checkAll = false;
                this.isDisable = true
            },
        },
    }
</script>

<style scoped lang="scss">

    .container {
        max-height: 444px;
        background-color: $bg-color-grey;
        padding: 16px;
        padding-bottom: 0;
    }

    .rank-list {
        overflow: hidden auto;
        flex-wrap: wrap;
    }

    .content {
    }

    .rank-item {
        margin-bottom: 13px;
    }

    .rank-item-wrapper {
        border: 1px solid transparent;
        background-color: $font-color-white;
        padding: 8px;
    }

    .has-border {
        border: 1px solid $theme-color;
        box-sizing: border-box;
    }

    .rank-title {
        line-height: $line-height-large;
        height: $line-height-large;

        .uniform-title {
            width: auto;
            line-height: 43px;
            font-size: $font-size-base;
            font-weight: 500;
            margin-left: 12px;
            .icon-show {
                vertical-align: bottom;
                display: none;
            }
            .file-name:hover{
                .icon-show {
                    display: inline-block;
                }
            }
        }

        //复制按钮
        .el-col-offset-14 {
            margin-left: 49.33333%;
        }

        .el-col-2 {
            width: 15.33333%;
            font-size: 13px;
        }

        .copyLink {
            color: $theme-color;
        }
    }


    /deep/ .el-image__inner, /deep/ .el-image__placeholder, /deep/ .el-image__error {
        height: 18vh;
    }

    .video-box {
        background: #3E3E3E;
        border-radius: $border-radius-base $border-radius-base 0 0;

        .video-title, .video-operate {
            position: absolute;
            left: 0;
            color: $font-color-white;
            width: 100%;
        }

        .video-isPlay {
            width: 100%;
        }

        .video-play {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: $font-color-white;
            width: 100%;

            .icon {
                font-size: 30px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .video-title {
            top: -18px;
            left: 102%;
            height: 0px;

            .el-col-2 {
                line-height: 32px;
            }

            .delete{
                .icon {
                    margin-top:10px
                }
            }

            .titleName {
                float: left;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                padding: 8px 0 0px 10px;
                overflow: hidden;
            }
        }

        .el-col-12 {
            padding: 8px 0 14px 10px
        }
    }


    /deep/ .el-button {
        padding: 7px 29px;
    }


    /deep/ .el-checkbox__inner {
        width: 16px;
        height: 16px;
        border: 1px solid $font-color-disabled;
    }

    /deep/ .el-checkbox__inner::after {
        border-color: $theme-color;
        height: 7px;
        left: 4.5px;
        top: 1px;
        border-width: 2px;
    }

    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
        background: #fff;
    }


    //下拉框文字大小
    /deep/ .el-select-dropdown__item.hover, .el-select-dropdown__item {
        font-size: $font-size-addition !important;
    }

    /deep/ .el-range-editor .el-range-input {
        font-size: $font-size-addition;
    }

    /deep/ .customized-table.el-table th.el-table__cell {
        color: $font-color-base;
    }

    /deep/ .el-table td.el-table__cell div {
        color: $font-color-secondary;
    }

    //下拉框文字
    /deep/ input::-webkit-input-placeholder {
        color: #333333;
    }

    //下拉框禁用状态文字
    /deep/ input:disabled {
        //#999999半透明
        -webkit-text-fill-color: rgba(153, 153, 153, 0.5);
    }

    //禁用按钮样式
    /deep/.el-button.is-disabled.is-plain, .el-button.is-disabled.is-plain:hover, .el-button.is-disabled.is-plain:focus{
        background-color: $bg-color-white;
        color: #999999;
        border: 1px solid  #CCCCCC;
    }

    //朴素按钮样式
    /deep/.el-button.is-plain {
        background-color: $bg-color-white;
        color: $theme-color;
        border-color: $theme-color;
    }

    .noData {
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        span {
            color: #909399;
            font-size: 12px;
        }
    }

    .operation-box {
        margin-bottom: 13px;
    }

</style>
