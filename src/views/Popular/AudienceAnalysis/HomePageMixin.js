export default {
    data() {
        return {
            date:[],
            chart: null,
            loading:false,
        }
    },

    mounted() {
    },

    beforeDestroy(){
        window.removeEventListener('resize', this.resizeChartMethod)
    },

    methods: {
        resizeChart(){
            window.addEventListener('resize',this.resizeChartMethod)
        },

        resizeChartMethod() {
            this.chart.resize();
        }
    }
}
