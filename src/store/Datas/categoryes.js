import Axios from 'axios'
import Vue from 'vue'
export default {
    state: {
        all_categoryes: []
    },
    mutations: {
        load_all_categoryes(state, paylaod) {
            state.all_categoryes = paylaod
        }
    },
    actions: {
        async load_all_categoryes({ commit }) {
            try {
                const response = await Axios.post("http://ivan-tactical.conf/categoryes/get.php")
                const resp_data = response.data
                Vue.notify({
                    group: 'foo',
                    text: resp_data.message,
                    type: resp_data.status
                })
                commit('load_all_categoryes', resp_data.data)
            } catch (error) {
                console.log(error)
            }
        }
    },
    getters: {
        all_categoryes(state) {
            return state.all_categoryes
        }
    }
}