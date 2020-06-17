import Axios from 'axios'
import Vue from 'vue'
export default {
    state: {
        akb_all_kits: [],
        akb_load_kit_by_id: {},
        akb_create_kit: [],
        akb_update_kit: [],
        akb_load_kit_relation: {},
        akb_load_kit_relation_all_loaded: false,
        akb_save_kit_products: false,
        akb_load_kit_products: [],
        akb_load_kit_products_loaded: false
    },
    mutations: {
        akb_load_all_kits(state, payload) {
            state.akb_all_kits = payload
        },
        akb_load_kit_by_id(state, payload) {
            state.akb_load_kit_by_id = payload[0]
        },
        akb_delete_kit_by_id(state, payload) {
            for (let i = 0; i < state.akb_all_kits.length; i++) {
                if (parseInt(state.akb_all_kits[i].id) === parseInt(payload)) {
                    state.akb_all_kits.splice(i, 1)
                }
            }
        },
        akb_create_kit(state, payload) {
            state.akb_create_kit = payload
        },
        akb_update_kit(state, payload) {
            state.akb_update_kit = payload
        },
        akb_drop_all_data(state) {
            state.akb_all_kits = []
            state.akb_load_kit_by_id = {}
            state.akb_create_kit = []
            state.akb_update_kit = []
            state.akb_load_kit_relation = {}
            state.akb_load_kit_relation_all_loaded = false
            state.akb_save_kit_products = false
            state.akb_load_kit_products = [],
                state.akb_load_kit_products_loaded = false
        },
        akb_load_kit_relation(state, payload) {
            state.akb_load_kit_relation = payload
        },
        akb_load_kit_relation_all_loaded(state) {
            state.akb_load_kit_relation_all_loaded = true
        },
        akb_save_kit_products(state, payload) {
            state.akb_save_kit_products = payload
        },
        akb_load_kit_products(state, payload) {
            state.akb_load_kit_products = payload
        },
        akb_load_kit_products_loaded(state) {
            state.akb_load_kit_products_loaded = true
        }
    },
    actions: {
        async akb_load_all_kits({ commit }) {
            try {
                let response = await Axios.post(
                    "http://ivan-tactical.conf/admin_kit_builder/get_all.php"
                )
                let resp_data = response.data

                Vue.notify({
                    group: 'foo',
                    text: resp_data.message,
                    type: resp_data.status
                })
                commit('akb_load_all_kits', resp_data.data)
            } catch (error) {
                console.error(error)
            }
        },
        async akb_load_kit_by_id({ commit }, id) {
            try {
                let form_data = new FormData()
                form_data.append('id', parseInt(id))
                let response = await Axios.post(
                    "http://ivan-tactical.conf/admin_kit_builder/get_by_id.php",
                    form_data
                )
                let resp_data = response.data

                Vue.notify({
                    group: 'foo',
                    text: resp_data.message,
                    type: resp_data.status
                })
                commit('akb_load_kit_by_id', resp_data.data)
            } catch (error) {
                console.log(error)
            }
        },
        async akb_delete_kit_by_id({ commit }, payload) { // payload (int) [kit_id]
            try {
                let form_data = new FormData()
                form_data.append('id', parseInt(payload))
                let response = await Axios.post(
                    "http://ivan-tactical.conf/admin_kit_builder/delete_by_id.php",
                    form_data
                )
                let resp_data = response.data
                Vue.notify({
                    group: 'foo',
                    text: resp_data.message,
                    type: resp_data.status
                })
                commit('akb_delete_kit_by_id', parseInt(payload))
            } catch (error) {
                console.error(error)
            }
        },
        async akb_create_kit({ commit }, payload) {
            try {
                let form_data = new FormData()
                form_data.append('skeleton_id', parseInt(payload.skeleton_id))
                form_data.append('category', parseInt(payload.category))
                form_data.append('name', payload.name)
                form_data.append('description', payload.description)
                let response = await Axios.post(
                    "http://ivan-tactical.conf/admin_kit_builder/create.php",
                    form_data
                )
                let resp_data = response.data
                Vue.notify({
                    group: 'foo',
                    text: resp_data.message,
                    type: resp_data.status
                })
                commit('akb_create_kit', resp_data.data)
            } catch (error) {
                console.error(error)
            }
        },
        async akb_update_kit({ commit }, payload) {
            try {
                let form_data = new FormData()
                form_data.append('id', parseInt(payload.id))
                form_data.append('skeleton_id', parseInt(payload.skeleton_id))
                form_data.append('category', parseInt(payload.category))
                form_data.append('name', payload.name)
                form_data.append('description', payload.description)
                let response = await Axios.post(
                    "http://ivan-tactical.conf/admin_kit_builder/update.php",
                    form_data
                )
                let resp_data = response.data
                Vue.notify({
                    group: 'foo',
                    text: resp_data.message,
                    type: resp_data.status
                })
                commit('akb_update_kit', resp_data.data)
            } catch (error) {
                console.error(error)
            }
        },
        akb_drop_all_data({ commit }) {
            commit('akb_drop_all_data')
        },
        async akb_load_kit_relation({ commit }, payload) { // payload (int) [skeleton_id]
            try {
                let data = {
                    skeleton_data: [],
                    skeleton_points_data: [],
                    products_data: [],
                    products_points_data: [],
                    classes_list: [],
                    skeleton_points_classes_list: [],
                    products_points_classes_list: [],
                    duplicate_list_classes_skeleton_and_products: [],
                    merge_classes_skeleton_and_products: []
                }

                // получаем данные скелетона по id
                let form_data_skeleton = new FormData()
                form_data_skeleton.append('id', parseInt(payload))
                let response_skeleton_by_id = await Axios.post(
                    "http://ivan-tactical.conf/skeleton/get_by_id.php",
                    form_data_skeleton
                )
                data.skeleton_data = response_skeleton_by_id.data.data[0]

                // получаем точки выбраного скелетона
                let form_data_skeleton_points = new FormData()
                form_data_skeleton_points.append('id', parseInt(payload))
                let response_skeleton_points_by_id = await Axios.post(
                    "http://ivan-tactical.conf/skeletons_points/get.php",
                    form_data_skeleton_points
                )
                data.skeleton_points_data = response_skeleton_points_by_id.data.data

                // получаем данные всех продуктов (обвесы первого типа)
                let response_all_products = await Axios.post(
                    "http://ivan-tactical.conf/product/get_all.php"
                );

                data.products_data = response_all_products.data.data

                // Полчучаем список id продуктов
                let list_products_id = []
                for (let i = 0; i < data.products_data.length; i++) {
                    list_products_id.push(parseInt(data.products_data[i].id))
                }
                // Получаем данные точек продуктов выше передавая список id продуктов
                let products_points_data_form_data = new FormData()
                products_points_data_form_data.append('ids', JSON.stringify(list_products_id))
                let products_points_data = await Axios.post(
                    'http://ivan-tactical.conf/products_points/get_by_list_ids.php',
                    products_points_data_form_data
                )
                data.products_points_data = products_points_data.data.data

                // получаем список классов
                const classes_list = await Axios.post("http://ivan-tactical.conf/classes/get_all.php")
                const resp_classes_list = classes_list.data.data
                data.classes_list = resp_classes_list

                // создаем список классов скелета
                let skeleton_points_classes_list = []
                for (let i = 0; i < data.skeleton_points_data.length; i++) {
                    for (let j = 0; j < data.classes_list.length; j++) {
                        if (
                            data.skeleton_points_data[i].class.includes(data.classes_list[j].id) &&
                            data.skeleton_points_data[i].type === 'Plus'
                        ) {
                            skeleton_points_classes_list.push(data.classes_list[j])
                        }
                    }
                }
                data.skeleton_points_classes_list = Array.from(new Set(skeleton_points_classes_list))

                //  создаем список классов продуктов
                let products_points_classes_list = []
                for (let i = 0; i < data.products_points_data.length; i++) {
                    for (let j = 0; j < data.classes_list.length; j++) {
                        if (
                            data.products_points_data[i].class.includes(data.classes_list[j].id) &&
                            data.products_points_data[i].type === 'Plus'
                        ) {
                            products_points_classes_list.push(data.classes_list[j])
                        }
                    }
                }
                data.products_points_classes_list = Array.from(new Set(products_points_classes_list))

                // создаем список дубликаций классов на скелете и продуктах
                let duplicate_list_classes_skeleton_and_products = []
                for (let i = 0; i < data.skeleton_points_classes_list.length; i++) {
                    for (let j = 0; j < data.products_points_classes_list.length; j++) {
                        if (parseInt(data.skeleton_points_classes_list[i].id) === parseInt(data.products_points_classes_list[j].id)) {
                            duplicate_list_classes_skeleton_and_products.push(data.skeleton_points_classes_list[i].id)
                        }
                    }
                }
                data.duplicate_list_classes_skeleton_and_products = Array.from(new Set(duplicate_list_classes_skeleton_and_products))

                // список класоов без повторов
                data.merge_classes_skeleton_and_products = Array.from(new Set(data.skeleton_points_classes_list.concat(data.products_points_classes_list)))


                console.log(payload, data)
                commit('akb_load_kit_relation', data)
                commit('akb_load_kit_relation_all_loaded')
            } catch (error) {
                console.error(error)
            }
        },
        async akb_load_kit_products({ commit }, payload) { // payload (int) [kit_id]
            try {
                let form_data = new FormData();
                form_data.append('id', parseInt(payload))
                let response = await Axios.post(
                    "http://ivan-tactical.conf/admin_kit_builder/get_attach_by_kit_id.php",
                    form_data
                )
                let resp_data = response.data
                Vue.notify({
                    group: 'foo',
                    text: resp_data.message,
                    type: resp_data.status
                })

                for (let i = 0; i < resp_data.data.length; i++) {
                    if (parseInt(resp_data.data[i].parent_product_point_id) === 0) {
                        delete resp_data.data[i].parent_product_point_id
                    }
                    if (parseInt(resp_data.data[i].parent_skeleton_point_id) === 0) {
                        delete resp_data.data[i].parent_skeleton_point_id
                    }
                }

                commit('akb_load_kit_products', resp_data.data)
                commit('akb_load_kit_products_loaded')
            } catch (e) {
                console.error(e)
            }
        },
        async akb_save_kit_products({ commit }, payload) {
            try {
                commit('akb_save_kit_products', false)
                let form_data = new FormData()
                form_data.append('attachments', JSON.stringify(payload))
                let response = await Axios.post(
                    "http://ivan-tactical.conf/admin_kit_builder/save_attach.php",
                    form_data
                )
                let resp_data = response.data
                Vue.notify({
                    group: 'foo',
                    text: resp_data.message,
                    type: resp_data.status
                })
                commit('akb_save_kit_products', true)
            } catch (e) {
                commit('akb_save_kit_products', false)
                console.error(e)
            }
        }
    },
    getters: {
        akb_all_kits(state) {
            return state.akb_all_kits
        },
        akb_load_kit_by_id(state) {
            return state.akb_load_kit_by_id
        },
        akb_create_kit(state) {
            return state.akb_create_kit
        },
        akb_load_kit_relation(state) {
            return state.akb_load_kit_relation
        },
        akb_load_kit_relation_all_loaded(state) {
            return state.akb_load_kit_relation_all_loaded
        },
        akb_load_kit_products(state) {
            return state.akb_load_kit_products
        },
        akb_load_kit_products_loaded(state) {
            return state.akb_load_kit_products_loaded
        }
    },
}