<template>
    <el-button-group class="button-group">
        <el-button  v-for="(item,idx) in buttonList" type="plain" :key="idx"  :class="buttonStyle == item.value ? 'button-active':''"  @click="handleButton(idx)">{{item.label}}</el-button>
    </el-button-group>
</template>

<script>
export default {
    name: "CustomizedButtonGroup",
    props:{
        buttonList: {
            type: Array,
        },

        buttonStyle: {
            type: [Number, String],
            default: function () {
                return 1
            }
        }
    },
    data() {
        return {

        }
    },
    methods: {
        handleButton(idx){
            this.$emit('handleButton',idx)
        },
    }
}
</script>

<style scoped lang="scss">
    .button-active {
        color: $theme-color;
        border-color: $theme-color;
        background-color: #eceffc;
        z-index: 1;
    }
</style>
