<template>
    <div>
        <el-button-group class="customized-group">
            <el-button  v-for="(item,idx) in List" :key="idx" :disabled="item.isDisabled"  :class="clickedButtonStyle == item.value ? 'button-active':''"  @click="handleButton(idx)">{{item.label}}</el-button>
        </el-button-group>
    </div>
</template>

<script>
export default {
    name: "CustomizedButtonGroup",
    props: {
        List:{
            type:Array
        },
        buttonStyle: {
            type:[String,Number]
        }
    },
    watch: {
        List: {
           handler(val) {
            this.buttonList = val
            },
            immediate:true
        },
        buttonStyle: {
            handler(val) {
                this.clickedButtonStyle = val
            },
            immediate:true
        }

    },
    data() {
        return {
            buttonList:[],
            clickedButtonStyle: Number
        }
    },
    methods: {
        handleButton(idx) {
            this.clickedButtonStyle = this.buttonList[idx].value;
            this.$emit('handleButton',this.buttonList[idx].value)
        }
    }
}
</script>

<style scoped lang="scss">
/deep/.customized-group {
    .el-button {
        position: static; //el-button-group默认会把button设置为相对定位  改成static回归文档流
    }
    .el-button.is-disabled, .el-button.is-disabled:hover, .el-button.is-disabled:focus {
        border-color: $font-color-disabled;
        color: $font-color-auxiliary;
    }

    .button-active {
        color: $theme-color;
        border: 1px solid $theme-color;
        background-color: #ffffff;
        position: relative;
    }
}
</style>