<template>
    <div class="h-100">
        <top-bar></top-bar>
        <div class="content flex-vertical">
            <router-view/>
        </div>
    </div>
</template>

<script>
    import topBar from '@/components/Topbar.vue';

    export default {
        components: {topBar}
    }
</script>

<style lang="scss" scoped>

    .content {
        min-width: 400px;
        margin-top: 48px;
        height: calc(100% - 48px);
        overflow: hidden;
        box-sizing: border-box;
    }
</style>
