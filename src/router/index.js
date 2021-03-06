import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'ProductBuilder',
        component: () =>
            import ('../views/ProductBuilder.vue'),
        children: [{
                name: 'ProductBuilderIndex',
                path: '/',
                component: () =>
                    import ('../components/ProductBuilder/Index.vue'),
            }, {
                name: 'ProductBuilderUpdate',
                path: 'update',
                component: () =>
                    import ('../components/ProductBuilder/Update.vue'),
            },
            {
                name: 'ProductBuilderCreate',
                path: 'create',
                component: () =>
                    import ('../components/ProductBuilder/Create.vue'),
            }
        ]

    },

]

const router = new VueRouter({
    routes
})


export default router