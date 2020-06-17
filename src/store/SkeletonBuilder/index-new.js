import Axios from 'axios'
import Vue from 'vue'

export default {
    state: {
        sb_all_skeletons_data: [],
        sb_skeleton_data_by_id: [],
        sb_create_skeleton: [],
        sb_delete_skeleton: [],
        sb_update_skeleton: []
    },
    mutations: {
        sb_clear_all_data(state) {
            state.sb_all_skeletons_data = []
            state.sb_skeleton_data_by_id = []
            state.sb_create_skeleton = []
            state.sb_delete_skeleton = []
            state.sb_update_skeleton = []
        },
        sb_load_all_skeletons(state, payload) {
            state.sb_all_skeletons_data = payload;
        },
        sb_load_skeleton_data_by_id(state, payload) {
            state.sb_skeleton_data_by_id = payload;
        },
        sb_create_skeleton(state, payload) {
            state.sb_create_skeleton = payload;
        },
        sb_delete_skeleton(state, payload) {
            state.sb_delete_skeleton = payload.data;

            for (let i = 0; i < state.sb_all_skeletons_data.data.length; i++) {
                if (parseInt(state.sb_all_skeletons_data.data[i].id) === parseInt(payload.id)) {
                    state.sb_all_skeletons_data.data.splice(i, 1)
                }
            }
        },
        sb_update_skeleton(state, payload) {
            state.sb_update_skeleton = payload;
        }
    },
    actions: {
        sb_clear_all_data({ commit }) {
            try {
                commit('sb_clear_all_data')
            } catch (error) {
                console.error(error)
            }
        },
        // Получаем все скелеты
        async sb_load_all_skeletons({ commit }) {
            try {
                let response = await Axios.post(
                    "http://ivan-tactical.conf/skeleton/get_all.php"
                );
                let all_skeletons_data = response.data

                Vue.notify({
                    group: 'foo',
                    text: all_skeletons_data.message,
                    type: all_skeletons_data.status
                })

                commit('sb_load_all_skeletons', all_skeletons_data)
            } catch (error) {
                console.error(error)
            }
        },
        // Получаем скелеты по параметру id
        async sb_load_skeleton_data_by_id({ commit }, id) {
            try {
                let form_data = new FormData();
                form_data.append("id", parseInt(id));

                let response = await Axios.post(
                    "http://ivan-tactical.conf/skeleton/get_by_id.php",
                    form_data
                );
                let skeleton_by_id_data = response.data
                Vue.notify({
                    group: 'foo',
                    text: skeleton_by_id_data.message,
                    type: skeleton_by_id_data.status
                })

                commit('sb_load_skeleton_data_by_id', skeleton_by_id_data)
            } catch (error) {
                console.error(error)
            }
        },
        // Создаем скелет
        async sb_create_skeleton({ commit }, payload) {
            try {
                let form_data = new FormData();
                form_data.append("name", payload.name);
                form_data.append("weight", parseInt(payload.weight));
                form_data.append("image_front", payload.image_front);
                form_data.append("image_back", payload.image_back);

                let response = await Axios.post(
                    "http://ivan-tactical.conf/skeleton/create.php",
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

                commit('sb_create_skeleton', response.data.data)
            } catch (error) {
                console.error(error)
            }
        },
        // Удаляем скелет по параметру id
        async sb_delete_skeleton({ commit }, id) {
            try {
                let form_data = new FormData();
                form_data.append("id", parseInt(id));

                let response = await Axios.post(
                    "http://ivan-tactical.conf/skeleton/delete.php",
                    form_data
                )

                Vue.notify({
                    group: 'foo',
                    text: response.data.message,
                    type: response.data.status
                })

                commit('sb_delete_skeleton', { data: response.data, id: parseInt(id) })
            } catch (error) {
                console.error(error)
            }
        },
        // Обновляем данные скелета
        async sb_update_skeleton({ commit }, payload) {
            try {
                let form_data = new FormData();
                form_data.append("id", parseInt(payload.id));
                form_data.append("name", payload.name);
                form_data.append("weight", parseInt(payload.weight));

                let response = await Axios.post(
                    "http://ivan-tactical.conf/skeleton/update.php",
                    form_data
                )

                Vue.notify({
                    group: 'foo',
                    text: response.data.message,
                    type: response.data.status
                })

                commit('sb_update_skeleton', payload)
            } catch (error) {
                console.error(error)
            }
        }
    },
    getters: {
        sb_all_skeletons_data(state) {
            return state.sb_all_skeletons_data;
        },
        sb_skeleton_data_by_id(state) {
            return state.sb_skeleton_data_by_id;
        },
        sb_create_skeleton(state) {
            return state.sb_create_skeleton;
        },
        sb_delete_skeleton(state) {
            return state.sb_delete_skeleton;
        },
        sb_update_skeleton(state) {
            return state.sb_update_skeleton;
        }
    }
}