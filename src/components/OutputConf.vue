<template>
    <v-content>
        <v-card>
            <div class="b-image-container">
                <div class="b-image-container__inner">
                    <div class="b-image-container__content" :style="{width: canvas_width,minWidth: canvas_width,maxWidth: canvas_width}">
                        <img :src="(side === 'front') ? skeleton_data.image_front : (side === 'back') ? skeleton_data.image_back : 'error'" :width="canvas_width + 'px'">
                        
                        <img 
                            v-for="(item, index) in list_product[side]" 
                            :key="'image' + index" 
                            :src="item.image[side]" 
                            :title="item.hint"
                            class="b-image-container__image"
                            :style="{top: item.pos.y, left: item.pos.x, width: item.width, zIndex: item.z_index}"
                        >
                        <!-- <div v-if="side === 'front'">
                            <img 
                                v-for="(item, index) in attachments['front']" 
                                :key="'front' + index" 
                                :src="get_part_data(item, 'front').image[side]" 
                                :title="get_part_data(item, 'front').hint"
                                class="b-image-container__image"
                                :style="{top: get_part_data(item, 'front').pos.y, left: get_part_data(item, 'front').pos.x, width: get_part_data(item, 'front').width, zIndex: get_part_data(item, 'front').z_index}"
                            >
                        </div>
                        <div v-if="side === 'back'">
                            <img 
                                v-for="(item, index) in attachments['back']" 
                                :key="'back' + index" 
                                :src="get_part_data(item, 'back').image[side]" 
                                :title="get_part_data(item, 'back').hint"
                                class="b-image-container__image"
                                :style="{top: get_part_data(item, 'back').pos.y, left: get_part_data(item, 'back').pos.x, width: get_part_data(item, 'back').width, zIndex: get_part_data(item, 'back').z_index}"
                            >
                        </div> -->
                    </div>
                </div>
            </div>
        </v-card>
    </v-content>
</template>

<script>
export default {
    props: ['skeleton_data', 'attachments', 'config', 'side'],
    watch: {
        attachments: {
            immediate: true,
            handler(){
                this.get_part_data()
            },
            deep: true
        }
    },
    data(){
        return {
            canvas_width: 500,
            radio: {
                front: null,
                back: null
            },
            list_product: {
                front: [],
                back: []
            }
        }
    },
    created(){
        this.get_radio(this.skeleton_data.image_front, 'front')
        this.get_radio(this.skeleton_data.image_back, 'back')

        let interval = setInterval(()=>{
           this.get_part_data()
            
            if(this.attachments['front'].length > 0 || this.attachments['back'].length > 0){
                clearInterval(interval)
            }
        },100)
    },
    methods: {
        get_radio(url, side){
            let width = null
            let img = new Image();
            img.onload =  e =>{
                if(side === 'front'){
                    this.radio.front = this.canvas_width /  e.target.width
                }else if(side === 'back'){
                    this.radio.back = this.canvas_width /  e.target.width
                }
            }
            img.src = url
            return width
        },
        async get_part_data(){
            this.list_product[this.side] = []
            for(let i = 0; i < this.attachments[this.side].length; i++){
                let item =     this.attachments[this.side][i]
                let part_pos = {
                    x: this.config.list_parts_points.filter(elem => parseInt(elem.id) === parseInt(item.part_point_id))[0].pos_x,
                    y: this.config.list_parts_points.filter(elem => parseInt(elem.id) === parseInt(item.part_point_id))[0].pos_y
                }
                let answer = {
                        pos: {
                            x: null,
                            y: null
                        },
                        image: {
                            front: this.config.all_parts_data.filter(elem => parseInt(elem.id) === parseInt(item.part_id))[0].image_front,
                            back: this.config.all_parts_data.filter(elem => parseInt(elem.id) === parseInt(item.part_id))[0].image_back
                        },
                        width: await this.get_image_width(this.config.all_parts_data.filter(elem => parseInt(elem.id) === parseInt(item.part_id))[0].image_front) + 'px'   ,
                        hint: this.config.list_parts_points.filter(elem => parseInt(elem.id) === parseInt(item.part_point_id))[0].hint,
                        z_index: null
                }
                if(item.skeleton_point_id){
                    let skeleton_point_pos = {
                        x: this.config.skeletons_points.filter(elem => parseInt(elem.id) === parseInt(item.skeleton_point_id))[0].pos_x,
                        y: this.config.skeletons_points.filter(elem => parseInt(elem.id) === parseInt(item.skeleton_point_id))[0].pos_y
                    }

                        answer.pos.x = ((parseInt(skeleton_point_pos.x) - parseInt(part_pos.x)) * this.radio[this.side]) + 'px'
                        answer.pos.y = ((parseInt(skeleton_point_pos.y) - parseInt(part_pos.y)) * this.radio[this.side]) + 'px'
                        answer.z_index = 0
                }else if(item.parent_part_point_id){
                    let parent_part_point_id = parseInt(item.parent_part_point_id)
                    let parent_part_point_data = this.config.list_parts_points.filter(elem => parseInt(elem.id) === parent_part_point_id)[0]
                    let parent_part_id = parseInt(this.config.list_parts_points.filter(elem => parseInt(elem.id) === parent_part_point_id)[0].part_id)
                    let parent_part_point_plus_data = this.config.list_parts_points.filter(elem => (parseInt(elem.part_id) === parent_part_id && elem.type === 'Minus' && elem.side === this.side))[0]
                    let current_parent_part_data = this.attachments[this.side].filter(elem=> parseInt(elem.part_point_id) === parseInt(parent_part_point_plus_data.id))[0]

                    let skeleton_point_pos = {
                        x: this.config.skeletons_points.filter(elem => parseInt(elem.id) === parseInt(current_parent_part_data.skeleton_point_id))[0].pos_x,
                        y: this.config.skeletons_points.filter(elem => parseInt(elem.id) === parseInt(current_parent_part_data.skeleton_point_id))[0].pos_y
                    }
                    
                    answer.pos.x = ((parseInt(skeleton_point_pos.x) + parseInt(parent_part_point_data.pos_x) - parseInt(parent_part_point_plus_data.pos_x) - parseInt(part_pos.x)) * this.radio[this.side]) + 'px'
                    answer.pos.y = ((parseInt(skeleton_point_pos.y) + parseInt(parent_part_point_data.pos_y) - parseInt(parent_part_point_plus_data.pos_y) - parseInt(part_pos.y)) * this.radio[this.side]) + 'px'
                    answer.z_index = 1
                }
                
                this.list_product[this.side].push(answer)
            }
        },
        async get_image_width(src){
            let img = new Image();
            let width = ()=> (img.width * this.radio[this.side])
            img.onload = await width()
            img.src = src
            return width()
        }
        // get_radio(url, side){
        //     let width = null
        //     let img = new Image();
        //     img.onload =  e =>{
        //         if(side === 'front'){
        //             this.radio.front = this.canvas_width /  e.target.width
        //         }else if(side === 'back'){
        //             this.radio.back = this.canvas_width /  e.target.width
        //         }
        //     }
        //     img.src = url
        //     return width
        // },
        // get_part_data(item, current_side){
        //     let part_pos = {
        //         x: this.config.list_parts_points.filter(elem => parseInt(elem.id) === parseInt(item.part_point_id))[0].pos_x,
        //         y: this.config.list_parts_points.filter(elem => parseInt(elem.id) === parseInt(item.part_point_id))[0].pos_y
        //     }
        //     let answer = {
        //             pos: {
        //                 x: null,
        //                 y: null
        //             },
        //             image: {
        //                 front: this.config.all_parts_data.filter(elem => parseInt(elem.id) === parseInt(item.part_id))[0].image_front,
        //                 back: this.config.all_parts_data.filter(elem => parseInt(elem.id) === parseInt(item.part_id))[0].image_back
        //             },
        //             width: this.get_image_width(this.config.all_parts_data.filter(elem => parseInt(elem.id) === parseInt(item.part_id))[0].image_front) + 'px'   ,
        //             hint: this.config.list_parts_points.filter(elem => parseInt(elem.id) === parseInt(item.part_point_id))[0].hint,
        //             z_index: null
        //     }
        //     if(item.skeleton_point_id){
        //         let skeleton_point_pos = {
        //             x: this.config.skeletons_points.filter(elem => parseInt(elem.id) === parseInt(item.skeleton_point_id))[0].pos_x,
        //             y: this.config.skeletons_points.filter(elem => parseInt(elem.id) === parseInt(item.skeleton_point_id))[0].pos_y
        //         }

        //             answer.pos.x = ((parseInt(skeleton_point_pos.x) - parseInt(part_pos.x)) * this.radio[this.side]) + 'px'
        //             answer.pos.y = ((parseInt(skeleton_point_pos.y) - parseInt(part_pos.y)) * this.radio[this.side]) + 'px'
        //             answer.z_index = 0
        //     }else if(item.parent_part_point_id){
        //         let parent_part_point_id = parseInt(item.parent_part_point_id)
        //         let parent_part_point_data = this.config.list_parts_points.filter(elem => parseInt(elem.id) === parent_part_point_id)[0]
        //         let parent_part_id = parseInt(this.config.list_parts_points.filter(elem => parseInt(elem.id) === parent_part_point_id)[0].part_id)
        //         let parent_part_point_plus_data = this.config.list_parts_points.filter(elem => (parseInt(elem.part_id) === parent_part_id && elem.type === 'Minus' && elem.side === this.side))[0]
        //         let current_parent_part_data = this.attachments[current_side].filter(elem=> parseInt(elem.part_point_id) === parseInt(parent_part_point_plus_data.id))[0]

        //         let skeleton_point_pos = {
        //             x: this.config.skeletons_points.filter(elem => parseInt(elem.id) === parseInt(current_parent_part_data.skeleton_point_id))[0].pos_x,
        //             y: this.config.skeletons_points.filter(elem => parseInt(elem.id) === parseInt(current_parent_part_data.skeleton_point_id))[0].pos_y
        //         }
                
        //         answer.pos.x = ((parseInt(skeleton_point_pos.x) + parseInt(parent_part_point_data.pos_x) - parseInt(parent_part_point_plus_data.pos_x) - parseInt(part_pos.x)) * this.radio[this.side]) + 'px'
        //         answer.pos.y = ((parseInt(skeleton_point_pos.y) + parseInt(parent_part_point_data.pos_y) - parseInt(parent_part_point_plus_data.pos_y) - parseInt(part_pos.y)) * this.radio[this.side]) + 'px'
        //         answer.z_index = 1
        //     }
            
        //     return answer
        // },
        // get_image_width(src){
        //     let img = new Image();
        //     img.src = src
        //     return (img.width * this.radio[this.side])
        // },
        
    },
    computed: {
    }
}
</script>

<style lang="scss" scope>
    .b-image-container{
        overflow: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .b-image-container__inner{
        width: 1100px;
        min-width: 1100px;
        max-width: 1100px;
        padding: 150px 300px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .b-image-container__content{
        position: relative;
    }
    .b-image-container__image{
        position: absolute;
        display: block;
    }
</style>