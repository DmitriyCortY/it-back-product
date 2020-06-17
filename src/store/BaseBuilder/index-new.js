import Axios from "axios"
import Vue from 'vue'

// import Axios from 'axios'
export default {
    state: {
        bb_all_bases: [],
        bb_base_by_id: [],
        bb_update_base: [],
        bb_base_relations: [],
        bb_all_attached: [],
        bb_load_base_relations_status: false,
        bb_get_all_base_builder_attach_by_base_id: []
    },
    mutations: {
        bb_clear_all_data(state) {
            state.bb_all_bases = []
            state.bb_base_by_id = []
            state.bb_update_base = []
            state.bb_base_relations = []
            state.bb_all_attached = []
            state.bb_load_base_relations_status = false
            state.bb_get_all_base_builder_attach_by_base_id = []
        },
        bb_load_all_bases(state, payload) {
            state.bb_all_bases = payload
        },
        bb_load_base_by_id(state, payload) {
            state.bb_base_by_id = payload
        },
        bb_create_base(state, payload) {
            state.bb_base_by_id = payload
        },
        bb_update_base(state, payload) {
            state.bb_update_base = payload
        },
        bb_delete_base(state, payload) {
            for (let i = 0; i < state.bb_all_bases.length; i++) {
                if (parseInt(state.bb_all_bases[i].id) === parseInt(payload)) {
                    state.bb_all_bases.splice(i, 1)
                }
            }
        },
        bb_load_base_relations(state, payload) {
            state.bb_base_relations = payload
        },
        bb_save_base_builder_attach(state, payload) {
            state.bb_all_attached = payload
        },
        bb_load_base_relations_status(state, payload) {
            state.bb_load_base_relations_status = payload
        },
        bb_get_all_base_builder_attach_by_base_id(state, payload) {
            state.bb_get_all_base_builder_attach_by_base_id = payload
        }
    },
    actions: {
        bb_clear_all_data({ commit }) {
            try {
                commit('bb_clear_all_data')
            } catch (error) {
                console.error(error)
            }
        },
        async bb_load_all_bases({ commit }) {
            try {
                let response = await Axios.post(
                    "http://ivan-tactical.conf/base/get_all.php"
                )
                let resp_data = response.data

                Vue.notify({
                    group: 'foo',
                    text: resp_data.message,
                    type: resp_data.status
                })
                commit('bb_load_all_bases', resp_data.data)
            } catch (error) {
                console.error(error)
            }
        },
        async bb_load_base_by_id({ commit }, id) {
            try {
                let form_data = new FormData()
                form_data.append('id', parseInt(id))
                let response = await Axios.post(
                    "http://ivan-tactical.conf/base/get_by_id.php",
                    form_data
                )
                let resp_data = response.data
                Vue.notify({
                    group: 'foo',
                    text: resp_data.message,
                    type: resp_data.status
                })
                commit('bb_load_base_by_id', resp_data.data)
            } catch (error) {
                console.error(error)
            }
        },
        async bb_create_base({ commit }, payload) {
            try {
                let form_data = new FormData();
                form_data.append('name', payload.name)
                form_data.append('skeleton_id', parseInt(payload.skeleton_id))
                form_data.append('category', payload.category)
                form_data.append('description', payload.description)

                let response = await Axios.post(
                    "http://ivan-tactical.conf/base/create.php",
                    form_data
                )
                let resp_data = response.data
                Vue.notify({
                    group: 'foo',
                    text: resp_data.message,
                    type: resp_data.status
                })
                commit('bb_create_base', resp_data.data)
            } catch (error) {
                console.error(error)
            }
        },
        async bb_update_base({ commit }, payload) {
            try {
                let form_data = new FormData();
                form_data.append('name', payload.data.name)
                form_data.append('skeleton_id', parseInt(payload.data.skeleton_id))
                form_data.append('category', payload.data.category)
                form_data.append('description', payload.data.description)
                form_data.append('id', parseInt(payload.id))

                let response = await Axios.post(
                    "http://ivan-tactical.conf/base/update.php",
                    form_data
                )
                let resp_data = response.data

                Vue.notify({
                    group: 'foo',
                    text: resp_data.message,
                    type: resp_data.status
                })

                commit('bb_update_base', resp_data.data)
            } catch (error) {
                console.error(error)
            }
        },
        async bb_delete_base({ commit }, payload) {
            try {
                let form_data = new FormData()
                form_data.append('id', parseInt(payload))
                let response = await Axios.post(
                    'http://ivan-tactical.conf/base/delete.php',
                    form_data
                )
                let resp_data = response.data

                Vue.notify({
                    group: 'foo',
                    text: resp_data.message,
                    type: resp_data.status
                })

                commit('bb_delete_base', parseInt(payload))
            } catch (error) {
                console.error(error)
            }
        },
        async bb_load_base_relations({ commit }, payload) { //payload (int) [skeleton_id]
            try {
                // создаем коннечный массив данных
                let data_list = {
                    skeleton_data: [],
                    skeletons_points: [],
                    list_skeleton_point_id_and_their_classes_ids: [],
                    classes_list: [],
                    list_of_classes_ids_used_for_skeleton: [],
                    list_data_of_used_classes_for_skeleton: [],
                    all_parts_data: [],
                    list_parts_points: [],
                    list_parent_part_point_id_and_their_classes_ids: [],
                    list_data_of_used_classes_for_part: []
                }

                // получаем данные скелетона по id
                let form_data_skeleton = new FormData()
                form_data_skeleton.append('id', parseInt(payload))
                let response_skeleton_by_id = await Axios.post(
                    "http://ivan-tactical.conf/skeleton/get_by_id.php",
                    form_data_skeleton
                )
                
                data_list.skeleton_data = response_skeleton_by_id.data.data[0]

                // получаем точки выбраного скелетона
                let form_data_skeleton_points = new FormData()
                form_data_skeleton_points.append('id', parseInt(payload))
                let response_skeleton_points_by_id = await Axios.post(
                    "http://ivan-tactical.conf/skeletons_points/get.php",
                    form_data_skeleton_points
                )
                data_list.skeletons_points = response_skeleton_points_by_id.data.data

                // получаем данные всех партов (обвесы второго типа)
                let response_all_parts = await Axios.post(
                    "http://ivan-tactical.conf/part/get_all.php"
                );
                data_list.all_parts_data = response_all_parts.data.data

                // Полчучаем список id партов
                let lsit_parts_id = []
                for (let i = 0; i < data_list.all_parts_data.length; i++) {
                    lsit_parts_id.push(parseInt(data_list.all_parts_data[i].id))
                }

                // Получаем данные точек партов выше передавая список id партов
                let list_parts_points_form_data = new FormData()
                list_parts_points_form_data.append('ids', JSON.stringify(lsit_parts_id))
                let list_parts_points = await Axios.post(
                    'http://ivan-tactical.conf/parts_points/get_by_list_ids.php',
                    list_parts_points_form_data
                )
                data_list.list_parts_points = list_parts_points.data.data
                    // console.log(data_list.all_parts_data, data_list.list_parts_points)

                // собираем список id точек и id классов этих точек (скелетов)
                let list_skeleton_point_id_and_their_classes_ids = [];
                for (let i = 0; i < data_list.skeletons_points.length; i++) {
                    for (let j = 0; j < data_list.skeletons_points[i].class.length; j++) {
                        if (data_list.skeletons_points[i].type === 'Plus') {
                            list_skeleton_point_id_and_their_classes_ids.push({
                                point_id: parseInt(data_list.skeletons_points[i].id),
                                class_id: data_list.skeletons_points[i].class[j]
                            })
                        }
                    }
                }
                data_list.list_skeleton_point_id_and_their_classes_ids = list_skeleton_point_id_and_their_classes_ids


                // получаем список классов
                const classes_list = await Axios.post("http://ivan-tactical.conf/classes/get_all.php")
                const resp_classes_list = classes_list.data.data
                data_list.classes_list = resp_classes_list

                //  списоке id классов которые используються на скелете
                let list_of_classes_ids_used_for_skeleton = []
                for (let i = 0; i < list_skeleton_point_id_and_their_classes_ids.length; i++) {
                    if (!list_of_classes_ids_used_for_skeleton.includes(list_skeleton_point_id_and_their_classes_ids[i].class_id)) {
                        list_of_classes_ids_used_for_skeleton.push(list_skeleton_point_id_and_their_classes_ids[i].class_id)
                    }
                }
                data_list.list_of_classes_ids_used_for_skeleton = list_of_classes_ids_used_for_skeleton

                // список данных классов которые используються на скелете
                let list_data_of_used_classes_for_skeleton = []
                for (let i = 0; i < list_of_classes_ids_used_for_skeleton.length; i++) {
                    for (let j = 0; j < resp_classes_list.length; j++) {
                        if (list_of_classes_ids_used_for_skeleton[i] === resp_classes_list[j].id) {
                            list_data_of_used_classes_for_skeleton.push(resp_classes_list[j])
                        }
                    }
                }
                data_list.list_data_of_used_classes_for_skeleton = list_data_of_used_classes_for_skeleton

                // собираем список id точек и id классов этих точек (обвесов)
                let list_parent_part_point_id_and_their_classes_ids = []
                for (let i = 0; i < data_list.list_parts_points.length; i++) {
                    for (let j = 0; j < data_list.list_parts_points[i].class.length; j++) {
                        if (data_list.list_parts_points[i].type === 'Plus') {
                            list_parent_part_point_id_and_their_classes_ids.push({
                                point_id: parseInt(data_list.list_parts_points[i].id),
                                class_id: data_list.list_parts_points[i].class[j]
                            })
                        }
                    }
                }
                data_list.list_parent_part_point_id_and_their_classes_ids = list_parent_part_point_id_and_their_classes_ids

                //  списоке id классов которые используються на обвесах
                let list_of_classes_ids_used_for_part = []
                for (let i = 0; i < list_parent_part_point_id_and_their_classes_ids.length; i++) {
                    if (!list_of_classes_ids_used_for_part.includes(list_parent_part_point_id_and_their_classes_ids[i].class_id)) {
                        list_of_classes_ids_used_for_part.push(list_parent_part_point_id_and_their_classes_ids[i].class_id)
                    }
                }
                data_list.list_of_classes_ids_used_for_part = list_of_classes_ids_used_for_part

                // список данных классов которые используються на обвесах скелета
                let list_data_of_used_classes_for_part = []
                for (let i = 0; i < list_of_classes_ids_used_for_part.length; i++) {
                    for (let j = 0; j < resp_classes_list.length; j++) {
                        if (list_of_classes_ids_used_for_part[i] === resp_classes_list[j].id) {
                            list_data_of_used_classes_for_part.push(resp_classes_list[j])
                        }
                    }
                }
                data_list.list_data_of_used_classes_for_part = list_data_of_used_classes_for_part

                console.log(data_list)
                commit('bb_load_base_relations', data_list)
                commit('bb_load_base_relations_status', true)
            } catch (error) {
                console.error(error)
            }
        },
        async bb_save_base_builder_attach({ commit }, payload) {
            try {
                let form_data = new FormData()
                form_data.append('attachments', JSON.stringify(payload))
                let response = await Axios.post(
                    "http://ivan-tactical.conf/base/attach.php",
                    form_data
                )
                let resp_data = response.data

                Vue.notify({
                    group: 'foo',
                    text: resp_data.message,
                    type: resp_data.status
                })



                commit('bb_save_base_builder_attach', resp_data.data)
            } catch (error) {
                console.error(error)
            }
        },
        async bb_get_all_base_builder_attach_by_base_id({ commit }, payload) { // payload (int) [base_id]
            try {
                let form_data = new FormData()
                form_data.append('id', parseInt(payload))
                let response = await Axios.post(
                    "http://ivan-tactical.conf/base/attach_get.php",
                    form_data
                )
                let resp_data = response.data
                Vue.notify({
                    group: 'foo',
                    text: resp_data.message,
                    type: resp_data.status
                })
                let list = []
                for (let i in resp_data.data) {
                    if (resp_data.data[i].skeleton_point_id === 0) {
                        list.push({
                            part_id: parseInt(resp_data.data[i].part_id),
                            part_point_id: parseInt(resp_data.data[i].part_point_id),
                            parent_part_point_id: parseInt(resp_data.data[i].parent_part_point_id)
                        })
                    } else if (resp_data.data[i].parent_part_point_id === 0) {
                        list.push({
                            part_id: parseInt(resp_data.data[i].part_id),
                            part_point_id: parseInt(resp_data.data[i].part_point_id),
                            skeleton_point_id: parseInt(resp_data.data[i].skeleton_point_id)
                        })
                    }
                }
                commit('bb_get_all_base_builder_attach_by_base_id', list)
            } catch (error) {
                console.err(error)
            }
        }
    },
    getters: {
        bb_all_bases(state) {
            return state.bb_all_bases
        },
        bb_base_by_id(state) {
            return state.bb_base_by_id
        },
        bb_base_relations(state) {
            return state.bb_base_relations
        },
        bb_load_base_relations_status(state) {
            return state.bb_load_base_relations_status
        },
        bb_get_all_base_builder_attach_by_base_id(state) {
            return state.bb_get_all_base_builder_attach_by_base_id
        }
    }
}