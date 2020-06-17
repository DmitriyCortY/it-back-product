import Axios from 'axios'
import Vue from 'vue'
import Point from '../Helpers/_Point.js'
export default {
    state: {
        pc_points: []
    },
    mutations: {
        pc_clear_all_data(state) {
            state.pc_points = []
        },
        pc_load_points_by_id_and_related(state, payload) {
            state.pc_points = payload
        },
        pc_create_point(state, payload) {
            state.pc_points.push(payload)
        },
        pc_delete_point(state, id) {
            for (let i = 0; i < state.pc_points.length; i++) {
                if (parseInt(state.pc_points[i].id) === parseInt(id)) {
                    state.pc_points.splice(i, 1)
                }
            }
        },
        pc_update_point(state, payload) {
            for (let i = 0; i < state.pc_points.length; i++) {
                if (parseInt(state.pc_points[i].id) === parseInt(payload.id)) {
                    for (let key in payload) {
                        state.pc_points[i][key] = payload[key]
                    }
                }
            }
        }
    },
    actions: {
        pc_clear_all_data({ commit }) {
            try {
                commit('pc_clear_all_data')
            } catch (error) {
                console.error(error)
            }
        },
        async pc_load_points_by_id_and_related({ commit }, payload) {
            try {
                let form_data = new FormData();
                form_data.append('id', parseInt(payload.id))
                if (payload.related === 'skeleton') {
                    let response = await Axios.post(
                        "http://ivan-tactical.conf/skeletons_points/get.php",
                        form_data
                    )

                    let resp_data = response.data
                    Vue.notify({
                        group: 'foo',
                        text: resp_data.message,
                        type: resp_data.status
                    })
                    let list = []
                    for (let i = 0; i < resp_data.data.length; i++) {
                        list.push(new Point(resp_data.data[i]))
                    }
                    commit('pc_load_points_by_id_and_related', list)
                } else if (payload.related === 'part') {
                    let response = await Axios.post(
                        "http://ivan-tactical.conf/parts_points/get.php",
                        form_data
                    )

                    let resp_data = response.data
                    Vue.notify({
                        group: 'foo',
                        text: resp_data.message,
                        type: resp_data.status
                    })
                    let list = []
                    for (let i = 0; i < resp_data.data.length; i++) {
                        list.push(new Point(resp_data.data[i]))
                    }
                    commit('pc_load_points_by_id_and_related', list)
                } else if (payload.related === 'product') {
                    let response = await Axios.post(
                        "http://ivan-tactical.conf/products_points/get.php",
                        form_data
                    )

                    let resp_data = response.data
                    Vue.notify({
                        group: 'foo',
                        text: resp_data.message,
                        type: resp_data.status
                    })
                    let list = []
                    for (let i = 0; i < resp_data.data.length; i++) {
                        list.push(new Point(resp_data.data[i]))
                    }
                    commit('pc_load_points_by_id_and_related', list)
                } else {
                    console.error('Error found! Unexpected related name...')
                }


            } catch (error) {
                console.error(error)
            }
        },
        async pc_create_point({ commit }, payload) {
            console.log(payload.data)
            try {
                // создаем объект форм дата
                let form_data = new FormData();
                form_data.append('class', JSON.stringify(typeof payload.data.class === 'object' ? payload.data.class : Array.of(payload.data.class)))
                form_data.append('hint', payload.data.hint)
                form_data.append('name', payload.data.name)
                form_data.append('pos_x', parseInt(payload.data.pos.x))
                form_data.append('pos_y', parseInt(payload.data.pos.y))
                form_data.append('side', payload.data.side)
                form_data.append('type', payload.data.type)
                if (payload.data.relatedPoint != null) {
                    form_data.append('related_id', parseInt(payload.data.relatedPoint))
                }
                // создаем объект форм дата

                if (payload.related === 'skeleton') {
                    form_data.append('skeleton_id', parseInt(payload.data.skeletonId))
                    let response = await Axios.post(
                        "http://ivan-tactical.conf/skeletons_points/create.php",
                        form_data
                    )
                    let resp_data = response.data
                    Vue.notify({
                        group: 'foo',
                        text: resp_data.message,
                        type: resp_data.status
                    })
                    commit('pc_create_point', new Point(resp_data.data))
                } else if (payload.related === 'part') {
                    form_data.append('part_id', parseInt(payload.data.partId))
                    let response = await Axios.post(
                        "http://ivan-tactical.conf/parts_points/create.php",
                        form_data
                    )
                    let resp_data = response.data
                    Vue.notify({
                        group: 'foo',
                        text: resp_data.message,
                        type: resp_data.status
                    })
                    commit('pc_create_point', new Point(resp_data.data))
                } else if (payload.related === 'product') {
                    form_data.append('product_id', parseInt(payload.data.productId))
                    let response = await Axios.post(
                        "http://ivan-tactical.conf/products_points/create.php",
                        form_data
                    )
                    let resp_data = response.data
                    Vue.notify({
                        group: 'foo',
                        text: resp_data.message,
                        type: resp_data.status
                    })
                    commit('pc_create_point', new Point(resp_data.data))
                } else {
                    console.error('Error found! Unexpected related name...')
                }
            } catch (error) {
                console.error(error)
            }
        },
        async pc_delete_point({ commit }, payload) {
            try {
                let form_data = new FormData();
                form_data.append('id', parseInt(payload.id))

                if (payload.related === 'skeleton') {
                    let response = await Axios.post(
                        'http://ivan-tactical.conf/skeletons_points/delete.php',
                        form_data
                    )
                    let resp_data = response.data
                    Vue.notify({
                        group: 'foo',
                        text: resp_data.message,
                        type: resp_data.status
                    })

                    commit('pc_delete_point', parseInt(payload.id))
                } else if (payload.related === 'part') {
                    let response = await Axios.post(
                        'http://ivan-tactical.conf/parts_points/delete.php',
                        form_data
                    )
                    let resp_data = response.data
                    Vue.notify({
                        group: 'foo',
                        text: resp_data.message,
                        type: resp_data.status
                    })

                    commit('pc_delete_point', parseInt(payload.id))
                } else if (payload.related === 'product') {
                    let response = await Axios.post(
                        'http://ivan-tactical.conf/products_points/delete.php',
                        form_data
                    )
                    let resp_data = response.data
                    Vue.notify({
                        group: 'foo',
                        text: resp_data.message,
                        type: resp_data.status
                    })

                    commit('pc_delete_point', parseInt(payload.id))
                } else {
                    console.error('Error found! Unexpected related name...')
                }
            } catch (error) {
                console.error(error)
            }
        },
        async pc_update_point({ commit }, payload) {
            try {
                // создаем объект форм дата
                let form_data = new FormData();
                form_data.append('class', JSON.stringify(typeof payload.data.class === 'object' ? payload.data.class : Array.of(payload.data.class)))
                form_data.append('hint', payload.data.hint) //
                form_data.append('name', payload.data.name) //
                form_data.append('pos_x', parseInt(payload.data.pos.x)) //
                form_data.append('pos_y', parseInt(payload.data.pos.y)) //
                form_data.append('side', payload.data.side) //
                form_data.append('type', payload.data.type) //
                form_data.append('id', parseInt(payload.data.id))
                    // создаем объект форм дата

                if (payload.related === 'skeleton') {
                    form_data.append('skeleton_id', parseInt(payload.data.skeletonId))
                    let response = await Axios.post(
                        'http://ivan-tactical.conf/skeletons_points/update.php',
                        form_data
                    )
                    let resp_data = response.data
                    Vue.notify({
                        group: 'foo',
                        text: resp_data.message,
                        type: resp_data.status
                    })
                    commit('pc_update_point', payload.data)
                } else if (payload.related === 'part') {
                    form_data.append('part_id', parseInt(payload.data.partId))
                    let response = await Axios.post(
                        'http://ivan-tactical.conf/parts_points/update.php',
                        form_data
                    )
                    let resp_data = response.data
                    Vue.notify({
                        group: 'foo',
                        text: resp_data.message,
                        type: resp_data.status
                    })

                    commit('pc_update_point', payload.data)
                } else if (payload.related === 'product') {
                    form_data.append('product_id', parseInt(payload.data.productId))
                    let response = await Axios.post(
                        'http://ivan-tactical.conf/products_points/update.php',
                        form_data
                    )
                    let resp_data = response.data
                    Vue.notify({
                        group: 'foo',
                        text: resp_data.message,
                        type: resp_data.status
                    })

                    commit('pc_update_point', payload.data)
                } else {
                    console.error('Error found! Unexpected related name...')
                }

            } catch (error) {
                console.error(error)
            }
        }
    },
    getters: {
        pc_points(state) {
            return state.pc_points
        }
    }
}