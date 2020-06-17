export default class Point {
    constructor(data) {
        this.class = data.class
        this.hint = data.hint
        this.id = parseInt(data.id)
        this.name = data.name
        this.pos = {
            x: parseInt(data.pos_x),
            y: parseInt(data.pos_y)
        }
        this.side = data.side
        this.type = data.type
        this.skeletonId = data.skeleton_id ? parseInt(data.skeleton_id) : undefined
        this.partId = data.part_id ? parseInt(data.part_id) : undefined
        this.productId = data.product_id ? parseInt(data.product_id) : undefined
    }
}