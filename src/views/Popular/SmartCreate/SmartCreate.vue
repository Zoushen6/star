<template>
    <div class="flex-vertical flex-1 m-l-r-16">
        <el-form class="customized-form padding-top background-white p-l-r-24 flex-1 m-b-20" :inline="false" :model="addForm" :rules="optionsRule" ref="addForm" >
            <div class="basic">
                <div>基础信息</div>
                <el-form-item prop="account" :required="false" class="search-content" label="投放账户">
                    <el-select v-model="addForm.account" placeholder="请选择投放账户" clearable>
                        <el-option v-for="(item,idx) in accountList" :key="item.company_id" :label="item.company_name"
                                   :value="item.company_id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="selectValue" :required="false" class="search-content">
                    <customized-button-group class="button-group" :button-list="buttonList" :button-style="buttonStyle" @handleButton="handleButton">
                    </customized-button-group>
                </el-form-item>
            </div>
        </el-form>

        <choose-ad-dialog ref="chooseAd" @dialogClose="reset"></choose-ad-dialog>
    </div>

</template>

<script>
import CustomizedButtonGroup from "@views/Popular/SmartCreate/CustomizedButtonGroup";
import CustomizedDialog from "@components/CustomizedDialog";
import ChooseAdDialog from "@views/Popular/SmartCreate/ChooseAdDialog";
export default {
    name: "SmartCreate",
    components:{CustomizedDialog, CustomizedButtonGroup,ChooseAdDialog},
    data() {
        return {
            addForm: {
                account: ''
            },
            accountList:[
                {
                    company_name:'aaaaaaaaaa',
                    company_id:'112'
                }
            ],
            buttonList: [
                {
                    label:"昨日排行",
                    value:1,
                },{
                    label:"7日排行",
                    value:7,
                },{
                    label:"30日排行",
                    value:30,
                },
            ],
            buttonStyle: '',
            optionsRule:{}
        }
    },
    methods: {
        handleButton(idx) {
            this.buttonStyle = this.buttonList[idx].value;
            console.log(idx,this.buttonStyle)
            this.openDialog('chooseAd')
        },

        openDialog(op) {
            if (this.$refs[op]) this.$refs[op].openDialog();
        },


        reset() {

        }
    }
}
</script>

<style scoped lang="scss">
.basic {
    /deep/.el-form-item__label {
        line-height: 32px;
    }
}
</style>
