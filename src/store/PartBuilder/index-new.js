import Axios from 'axios'
import Vue from 'vue'

export default {
    state: {
        pb_all_parts_data: [],
        pb_part_data_by_id: [],
        pb_create_part: [],
        pb_delete_part: [],
        pb_update_part: []
    },
    mutations: {
        pb_clear_all_data(state) {
            state.pb_all_parts_data = []
            state.pb_part_data_by_id = []
            state.pb_create_part = []
            state.pb_delete_part = []
            state.pb_update_part = []
        },
        pb_load_all_parts(state, payload) {
            state.pb_all_parts_data = payload;
        },
        pb_load_part_data_by_id(state, payload) {
            state.pb_part_data_by_id = payload;
        },
        pb_create_part(state, payload) {
            state.pb_create_part = payload;
        },
        pb_delete_part(state, payload) {
            state.pb_delete_part = payload.data;

            for (let i = 0; i < state.pb_all_parts_data.data.length; i++) {
                if (parseInt(state.pb_all_parts_data.data[i].id) === parseInt(payload.id)) {
                    state.pb_all_parts_data.data.splice(i, 1)
                }
            }
        },
        pb_update_part(state, payload) {
            state.pb_update_part = payload;
        }
    },
    actions: {
        pb_clear_all_data({ commit }) {
            try {
                commit('pb_clear_all_data')
            } catch (error) {
                console.error(error)
            }
        },
        // Получаем все скелеты
        async pb_load_all_parts({ commit }) {
            try {
                let response = await Axios.post(
                    "http://ivan-tactical.conf/part/get_all.php"
                );
                let all_parts_data = response.data

                Vue.notify({
                    group: 'foo',
                    text: all_parts_data.message,
                    type: all_parts_data.status
                })

                commit('pb_load_all_parts', all_parts_data)
            } catch (error) {
                console.error(error)
            }
        },
        // Получаем скелеты по параметру id
        async pb_load_part_data_by_id({ commit }, id) {
            try {
                let form_data = new FormData();
                form_data.append("id", parseInt(id));

                let response = await Axios.post(
                    "http://ivan-tactical.conf/part/get_by_id.php",
                    form_data
                );
                let part_by_id_data = response.data
                Vue.notify({
                    group: 'foo',
                    text: part_by_id_data.message,
                    type: part_by_id_data.status
                })

                commit('pb_load_part_data_by_id', part_by_id_data)
            } catch (error) {
                console.error(error)
            }
        },
        // Создаем скелет
        async pb_create_part({ commit }, payload) {
            try {
                let form_data = new FormData();
                form_data.append("name", payload.name);
                form_data.append("image_front", payload.image_front);
                form_data.append("image_back", payload.image_back);

                let response = await Axios.post(
                    "http://ivan-tactical.conf/part/create.php",
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

                commit('pb_create_part', response.data)
            } catch (error) {
                console.error(error)
            }
        },
        // Удаляем скелет по параметру id
        async pb_delete_part({ commit }, id) {
            try {
                let form_data = new FormData();
                form_data.append("id", parseInt(id));

                let response = await Axios.post(
                    "http://ivan-tactical.conf/part/delete.php",
                    form_data
                )

                Vue.notify({
                    group: 'foo',
                    text: response.data.message,
                    type: response.data.status
                })

                commit('pb_delete_part', { data: response.data, id: parseInt(id) })
            } catch (error) {
                console.error(error)
            }
        },
        // Обновляем данные скелета
        async pb_update_part({ commit }, payload) {
            try {
                let form_data = new FormData();
                form_data.append("id", parseInt(payload.id));
                form_data.append("name", payload.name);

                let response = await Axios.post(
                    "http://ivan-tactical.conf/part/update.php",
                    form_data
                )

                Vue.notify({
                    group: 'foo',
                    text: response.data.message,
                    type: response.data.status
                })

                commit('pb_update_part', payload)
            } catch (error) {
                console.error(error)
            }
        }
    },
    getters: {
        pb_all_parts_data(state) {
            return state.pb_all_parts_data;
        },
        pb_part_data_by_id(state) {
            return state.pb_part_data_by_id;
        },
        pb_create_part(state) {
            return state.pb_create_part;
        },
        pb_delete_part(state) {
            return state.pb_delete_part;
        },
        pb_update_part(state) {
            return state.pb_update_part;
        }
    }
}