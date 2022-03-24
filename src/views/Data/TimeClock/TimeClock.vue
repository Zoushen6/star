<template>
    <span>{{clockVal}}</span>
</template>

<script>

    export default {
        name: "TimeClock",
        data() {
            return {
                clockVal: "",
                timerId: 0
            }
        },
        mounted() {
            this.handleTimeChange();
            this.timerId = setInterval(this.handleTimeChange, 10000);
        },
        destroyed() {
            clearTimeout(this.timerId);
        },
        methods: {
            handleTimeChange() {
                this.clockVal = this.$common.formatDate(new Date().getTime()/1000,"yyyy年MM月dd日 hh:mm")
            }
        }
    }
</script>

<style scoped>

</style>
