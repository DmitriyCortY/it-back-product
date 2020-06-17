import Vue from 'vue'
import Vuex from 'vuex'
// 
import common from "./common";
import classesOfAncherpoint from "./Datas/classes";
import categoryes from "./Datas/categoryes";
import skeletonBuilder from "./SkeletonBuilder/index-new";
import baseBuilder from "./BaseBuilder/index-new";
import partBuilder from "./PartBuilder/index-new";
import productBuilder from "./ProductBuilder/index-new";
import point from "./PointConfigurator/index-new";
import adminKitBuilder from "./AdminKitBuilder/index";

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        common,
        skeletonBuilder,
        classesOfAncherpoint,
        categoryes,
        point,
        baseBuilder,
        partBuilder,
        productBuilder,
        adminKitBuilder,
    }
})