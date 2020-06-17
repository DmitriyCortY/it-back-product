import Axios from 'axios'
import Vue from 'vue'
export default {
    state: {
        all_classes: []
    },
    mutations: {
        all_classes(state, payload) {
            state.all_classes = payload
        }
    },
    actions: {
        async all_classes({ commit }) {
            try {
                const response = await Axios.post("http://ivan-tactical.conf/classes/get_all.php")
                const resp_data = response.data
                Vue.notify({
                    group: 'foo',
                    text: resp_data.message,
                    type: resp_data.status
                })
                commit('all_classes', resp_data.data)
            } catch (error) {
                console.error(error)
            }
        }
    },
    getters: {
        all_classes(state) {
            return state.all_classes
        },
    }
}