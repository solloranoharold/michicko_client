import {
    mapState,
    mapMutations
} from 'vuex'

const myPlugins = {
    install(Vue) {
        Vue.mixin({
            data: () => ({
                
            }),
            computed: {
                ...mapState([
                    'userInfo','navigationDrawer','masterDrawer','groupModules'
                ]),
            },
            methods: {
                ...mapMutations([
                    'STORE_USERINFO',
                    'STORE_NAVBAR',
                    'MASTER_NAVBAR',
                    'GROUP_MODULES'
                ]),
            }
        })
    }
}

export default myPlugins
