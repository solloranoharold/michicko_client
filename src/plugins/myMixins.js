import {
    mapState,
    mapMutations
} from 'vuex'

const myPlugins = {
    install(Vue) {
        Vue.mixin({
            data: () => ({
                windowWidth: window.innerWidth,
                isMobile:false , 
            }),
            computed: {
                ...mapState([
                    'userInfo','navigationDrawer','masterDrawer','groupModules','posDraftTransactions'
                ]),
            },
            methods: {
                ...mapMutations([
                    'STORE_USERINFO',
                    'STORE_NAVBAR',
                    'MASTER_NAVBAR',
                    'GROUP_MODULES',
                    'DRAFT_TRANSACTIONS'
                ]),
                  handleResize() {
                    this.windowWidth = window.innerWidth;
                    console.log(this.windowWidth, 'windowWidth')
                    if (this.windowWidth <= 959) this.isMobile = true
                    else this.isMobile = false
                },
            },
            mounted() {
                window.addEventListener('load', this.handleResize);
                window.addEventListener('resize', this.handleResize);
            },
        })
    }
}

export default myPlugins
