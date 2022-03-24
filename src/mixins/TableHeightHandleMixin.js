import ThrottleMixin from "@mixins/ThrottleMixin";
export default {
    mixins:[ThrottleMixin],
    data() {
        return {
            offset: 100,
            bottom: 0,
            handler: null
        }
    },
    computed:{
        tableStyle(){
            return {
                height: `calc(100% - ${this.offset + this.bottom}px)`
            }
        }
    },
    mounted(){
        this.handler = this.throttleHandler(this.getOffset);
        this.getOffset();
        this.addEventListener();
    },
    activated(){
        this.getOffset();
    },
    destroyed(){
        this.clearEventListener();
    },
    methods: {
        getOffset() {
            if (!this.$refs.customizedTable) return;
            const el = this.$refs.customizedTable.$el;
            this.offset = el.offsetTop - el.parentElement.offsetTop;
        },
        throttleHandler(method) {
            return this.throttle.bind(this, method, this ,200);
        },
        addEventListener() {
            window.addEventListener('resize', this.handler);
        },
        clearEventListener() {
            window.removeEventListener('resize', this.handler);
        }
    }
}
