import Axios from 'axios'
import Vue from 'vue'
import router from '@/router'

export default {
    state: {
        prb_all_products_data: [],
        prb_product_data_by_id: [],
        prb_create_product: [],
        prb_delete_product: [],
        prb_update_product: []
    },
    mutations: {
        prb_clear_all_data(state) {
            state.prb_all_products_data = []
            state.prb_product_data_by_id = []
            state.prb_create_product = []
            state.prb_delete_product = []
            state.prb_update_product = []
        },
        prb_load_all_products(state, payload) {
            state.prb_all_products_data = payload;
        },
        prb_load_product_data_by_id(state, payload) {
            state.prb_product_data_by_id = payload;
        },
        prb_create_product(state, payload) {
            state.prb_create_product = payload;
        },
        prb_delete_product(state, payload) {
            state.prb_delete_product = payload.data;

            for (let i = 0; i < state.prb_all_products_data.data.length; i++) {
                if (parseInt(state.prb_all_products_data.data[i].id) === parseInt(payload.id)) {
                    state.prb_all_products_data.data.splice(i, 1)
                }
            }
        },
        prb_update_product(state, payload) {
            state.prb_update_product = payload;
        }
    },
    actions: {
        prb_clear_all_data({ commit }) {
            try {
                commit('prb_clear_all_data')
            } catch (error) {
                console.error(error)
            }
        },
        // Получаем все скелеты
        async prb_load_all_products({ commit }) {
            try {
                let response = await Axios.post(
                    "http://ivan-tactical.conf/product/get_all.php"
                );
                let all_products_data = response.data

                Vue.notify({
                    group: 'foo',
                    text: all_products_data.message,
                    type: all_products_data.status
                })

                commit('prb_load_all_products', all_products_data.data)
            } catch (error) {
                console.error(error)
            }
        },
        // Получаем скелеты по параметру id
        async prb_load_product_data_by_id({ commit }, id) {
            try {
                let form_data = new FormData();
                form_data.append("id", parseInt(id));

                let response = await Axios.post(
                    "http://ivan-tactical.conf/product/get_by_id.php",
                    form_data
                );
                let product_by_id_data = response.data
                Vue.notify({
                    group: 'foo',
                    text: product_by_id_data.message,
                    type: product_by_id_data.status
                })
                if (Array.isArray(product_by_id_data.data) && product_by_id_data.data.length > 0) {
                    router.push(`/update/`)
                } else {
                    router.push(`/create/`)
                }
                commit('prb_load_product_data_by_id', product_by_id_data.data)
            } catch (error) {
                console.error(error)
            }
        },
        // Создаем скелет
        async prb_create_product({ commit }, payload) {
            try {
                let form_data = new FormData();
                form_data.append("name", payload.name);
                form_data.append("weight", parseInt(payload.weight));
                form_data.append("image_front", payload.image_front);
                form_data.append("image_back", payload.image_back);

                let response = await Axios.post(
                    "http://ivan-tactical.conf/product/create.php",
                    form_data, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );

                Vue.notify({
                    group: 'foo',
                    text: response.data.message,
                    type: response.data.status
                })

                commit('prb_create_product', response.data.data)
            } catch (error) {
                console.error(error)
            }
        },
        // Удаляем скелет по параметру id
        async prb_delete_product({ commit }, id) {
            try {
                let form_data = new FormData();
                form_data.append("id", parseInt(id));

                let response = await Axios.post(
                    "http://ivan-tactical.conf/product/delete.php",
                    form_data
                )

                Vue.notify({
                    group: 'foo',
                    text: response.data.message,
                    type: response.data.status
                })

                commit('prb_delete_product', { data: response.data.data, id: parseInt(id) })
            } catch (error) {
                console.error(error)
            }
        },
        // Обновляем данные скелета
        async prb_update_product({ commit }, payload) {
            try {
                let form_data = new FormData();
                form_data.append("id", parseInt(payload.id));
                form_data.append("name", payload.name);
                form_data.append("weight", parseInt(payload.weight));

                let response = await Axios.post(
                    "http://ivan-tactical.conf/product/update.php",
                    form_data
                )

                Vue.notify({
                    group: 'foo',
                    text: response.data.message,
                    type: response.data.status
                })

                commit('prb_update_product', payload)
            } catch (error) {
                console.error(error)
            }
        }
    },
    getters: {
        prb_all_products_data(state) {
            return state.prb_all_products_data;
        },
        prb_product_data_by_id(state) {
            return state.prb_product_data_by_id;
        },
        prb_create_product(state) {
            return state.prb_create_product;
        },
        prb_delete_product(state) {
            return state.prb_delete_product;
        },
        prb_update_product(state) {
            return state.prb_update_product;
        }
    }
}