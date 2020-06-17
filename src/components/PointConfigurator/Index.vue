<template>
  <v-content ref="container">
    <v-row>
      <v-col cols="12" v-if="currentSide === 'front'">
        <v-card>
          <div class="b-image-box">
            <div class="b-image-box__inner" :style="{maxWidth: width + 'px'}">
              <img
                @mousemove.prevent.stop="getPosMouseFront"
                :src="urlFrontImage"
                class="b-point-conf-image"
                @click.self="openDialogCreatePoint"
              />
              <div
                class="b-point"
                :title="item.hint"
                :ref="'point-'+item.id"
                v-for="(item, index) in listPointsFront"
                :key="index"
                :style="{position: 'absolute', top: (item.pos.y * radio.front) + 'px' , left: (item.pos.x * radio.front) + 'px'}"
              ></div>
            </div>
          </div>
        </v-card>
      </v-col>
      <!--  -->
      <v-col cols="12" v-if="currentSide === 'back'">
        <v-card>
          <div class="b-image-box">
            <div class="b-image-box__inner" :style="{maxWidth: width + 'px'}">
              <img
                :src="urlBackImage"
                @mousemove.prevent.stop="getPosMouseBack"
                class="b-point-conf-image"
                @click.self="openDialogCreatePoint"
              />
              <div
                class="b-point"
                :title="item.hint"
                :ref="'point-'+item.id"
                v-for="(item, index) in listPointsBack"
                :key="index"
                :style="{position: 'absolute', top: (item.pos.y * radio.back) + 'px', left: (item.pos.x * radio.back) + 'px'}"
              ></div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!--  -->
    <v-row justify="end" align="center">
      <v-col cols="3">
        <v-simple-table v-if="currentSide === 'front'">
          <tbody>
            <tr>
              <td align="center">
                <span>X : {{mousePos.front.x}}</span>
              </td>
              <td align="center">
                <span>Y : {{mousePos.front.y}}</span>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
        <!--  -->
        <v-simple-table v-if="currentSide === 'back'">
          <tbody>
            <tr>
              <td align="center">
                <span>X : {{mousePos.back.x}}</span>
              </td>
              <td align="center">
                <span>Y : {{mousePos.back.y}}</span>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
      <!--  -->
      <v-col cols="4">
        <v-btn color="primary" block @click="flipImage">Flip side</v-btn>
      </v-col>
    </v-row>
    <!-- table -->
    <div class="b-table-box">
      <v-simple-table v-if="currentSide === 'front'">
        <thead>
          <tr>
            <th>
              <span># Point</span>
            </th>
            <th>
              <span>Name</span>
            </th>
            <th>
              <span>Class</span>
            </th>
            <th>
              <span>Type</span>
            </th>
            <th>
              <span>Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in listPointsFront"
            :key="index"
            @mouseover="focusPoint(item.id)"
            @mouseleave="unFocusPoint(item.id)"
          >
            <td>{{index}}</td>
            <td>{{item.name}}</td>
            <td>{{class_name(item.class)}}</td>
            <td>{{item.type}}</td>
            <td>
              <v-btn text icon color="blue" @click="update_point(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn text icon color="pink" @click="delete_point(item.id)">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-simple-table v-if="currentSide === 'back'">
        <thead>
          <tr>
            <th># Point</th>
            <th>Class</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in listPointsBack"
            :key="index"
            @mouseover="focusPoint(item.id)"
            @mouseleave="unFocusPoint(item.id)"
          >
            <td>{{index}} | {{item.index}}</td>
            <td>{{class_name(item.class)}}</td>
            <td>{{item.type}}</td>
            <td>
              <v-btn text icon color="blue" @click="update_point(item.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn text icon color="pink" @click="delete_point(item.id)">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
    <!-- table END -->
    <PointConfiguratorCreateDialog
      :dialogNew="dialogNew"
      :dialogOpps="dialogOpps"
      :relatedFrontPoint="listPointsFront"
      :currentSide="currentSide"
      :currentMousePos="currentMousePos"
      :all_classes="all_classes"
      @cancelDialog="onCancelDialog"
      @saveNewDialog="onSaveNewDialog"
    ></PointConfiguratorCreateDialog>
    <PointConfiguratorUpdateDialog
      v-if="currentPoint"
      :dialogUpdate="dialogUpdate"
      :dialogValues="currentPoint"
      :dialogOpps="dialogOpps"
      :relatedFrontPoint="listPointsFront"
      :currentSide="currentSide"
      :all_classes="all_classes"
      @cancelDialog="onCancelDialog"
      @update_point="onupdate_point"
    ></PointConfiguratorUpdateDialog>
  </v-content>
</template>

<script>
import PointConfiguratorCreateDialog from "@/components/PointConfigurator/CreateDialog.vue";
import PointConfiguratorUpdateDialog from "@/components/PointConfigurator/UpdateDialog.vue";
export default {
  props: [
    "urlFrontImage" /* string */,
    "urlBackImage" /* string */,
    "id" /* int */,
    "width" /* int */,
    "dropPoints" /* bool */,
    "related" /* string (skeleton, part, product)*/
  ],
  components: {
    PointConfiguratorCreateDialog,
    PointConfiguratorUpdateDialog
  },
  data() {
    return {
      currentSide: "front",
      mousePos: {
        front: {
          x: 0,
          y: 0
        },
        back: {
          x: 0,
          y: 0
        }
      },
      currentMousePos: {
        x: null,
        y: null
      },
      dialogOpps: {
        types: ["Plus", "Minus"]
      },
      dialogNew: false,
      dialogUpdate: false,
      currentPoint: null,
      //
      radio: {
        front: null,
        back: null
      },
      imageWidth: {
        front: null,
        back: null
      }
    };
  },
  updated() {},
  destroyed() {
    this.$store.dispatch("pc_clear_all_data");
  },
  created() {
    const img = new Image();
    img.onload = e => {
      this.radio.front = this.width / e.path[0].width;
      this.imageWidth.front = e.path[0].width;
    };
    img.src = this.urlFrontImage;
    //
    const img2 = new Image();
    img2.onload = e => {
      this.radio.back = this.width / e.path[0].width;
      this.imageWidth.back = e.path[0].width;
    };
    img2.src = this.urlBackImage;
    if (this.id != undefined) {
      this.$store.dispatch("pc_load_points_by_id_and_related", {related: this.related, id: this.id});
    }
    this.$store.dispatch("all_classes");
    //
  },
  beforeUpdate() {
    const img = new Image();
    img.onload = e => {
      this.radio.front = this.width / e.path[0].width;
      this.imageWidth.front = e.path[0].width;
    };
    img.src = this.urlFrontImage;
    //
    const img2 = new Image();
    img2.onload = e => {
      this.radio.back = this.width / e.path[0].width;
      this.imageWidth.back = e.path[0].width;
    };
    img2.src = this.urlBackImage;
  },
  methods: {
    // переворачивает стороны
    flipImage() {
      if (this.currentSide === "front") {
        this.currentSide = "back";
      } else if (this.currentSide === "back") {
        this.currentSide = "front";
      }
    },
    // узнаем позиции мыши на передней стороне
    getPosMouseFront(e) {
      let rect = e.currentTarget.getBoundingClientRect();
      this.mousePos.front.x = parseInt(e.clientX - rect.left + 0.5);
      this.mousePos.front.y = parseInt(e.clientY - rect.top);
    },
    // узнаем позиции мыши на задней стороне
    getPosMouseBack(e) {
      let rect = e.currentTarget.getBoundingClientRect();
      this.mousePos.back.x = parseInt(e.clientX - rect.left + 0.5);
      this.mousePos.back.y = parseInt(e.clientY - rect.top);
    },
    // создаем точку, открывает диалоговое окно для создания новой точки, и устанавливает выбраные координаты мыши
    openDialogCreatePoint() {
      this.dialogNew = true;
      if (this.currentSide === "front") {
        this.currentMousePos = {
          x: this.mousePos.front.x,
          y: this.mousePos.front.y
        };
      } else if (this.currentSide === "back") {
        this.currentMousePos = {
          x: this.mousePos.back.x,
          y: this.mousePos.back.y
        };
      }
    },
    // Закрвывает диалоги
    onCancelDialog() {
      this.dialogUpdate = false;
      this.dialogNew = false;
      this.currentPoint = null;
    },
    // сохроаняет точку из конфига диалога
    onSaveNewDialog(data) {
      const point = {
        pos: {
          x: null,
          y: null
        },
        side: this.currentSide,
        ...data
      };
      if (this.currentSide === "front") {
        point.pos = {
          x: this.currentMousePos.x / this.radio.front,
          y: this.currentMousePos.y / this.radio.front
        };
      } else if (this.currentSide === "back") {
        point.pos = {
          x: this.currentMousePos.x / this.radio.back,
          y: this.currentMousePos.y / this.radio.back
        };
      }
      //
      if (this.related === "skeleton") {
        point.skeletonId = this.id;
      } else if (this.related === "part") {
        point.partId = this.id;
      } else if (this.related === "product") {
        point.productId = this.id;
      }
      this.$store.dispatch("pc_create_point", {related: this.related, data: point});
    },
    // // Обновляет данные точки
    onupdate_point({ point }) {
      let data = {
        id: this.currentPoint.id,
        pos: this.currentPoint.pos,
        side: this.currentPoint.side,
        ...point
      }
      if (this.related === "skeleton") {
        data.skeletonId = this.id;
      } else if (this.related === "part") {
        data.partId = this.id;
      } else if (this.related === "product") {
        data.productId = this.id;
      }
     this.$store.dispatch("pc_update_point", {related: this.related, data: data});
    },
    // запис данных выбраной точки и открытие диалога
    update_point(index) {
      this.dialogUpdate = true;
      this.currentPoint = this.pointsList.filter(
        item => item.id === index
      )[0];
      // //
    },
    //  Удаляет точку
    delete_point(index) {
      this.$store.dispatch("pc_delete_point", {related: this.related, id: index});
    },
    // делаем эффект програчности на выбраной точке
    focusPoint(id) {
      this.$refs["point-" + id][0].style.opacity = "1";
      this.$refs["point-" + id][0].style.backgroundColor = "red";
    },
    // убираем эффект програчности на выбраной точке
    unFocusPoint(id) {
      this.$refs["point-" + id][0].style.opacity = "";
      this.$refs["point-" + id][0].style.backgroundColor = "tomato";
    },
    class_name(ids){
      let list = []
      for(let i = 0; i < this.all_classes.length; i++){
        for(let j = 0; j < ids.length; j++){
          if(parseInt(this.all_classes[i].id) === (ids)[j]){
            list.push(this.all_classes[i].name)
          }
        }
      }
      return list.join(', ')
    }
  },
  computed: {
    pointsList() {
      return this.$store.getters.pc_points;
    },
    // получаем все точки передней части
    listPointsFront() {
      return this.pointsList.filter(item => item.side === "front");
    },
    // получаем все точки задней части
    listPointsBack() {
      return this.pointsList.filter(item => item.side === "back");
    },
    // получаем список классов анкерпоинта
    all_classes() {
      return this.$store.getters.all_classes;
    }
  }
};
</script>
  
  <style lang="scss" scope>
.b-point-conf-image {
  display: block;
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}
.b-image-box {
  display: block;
  width: 100%;
  padding: 50px;
  overflow: auto;
}
.b-image-box__inner {
  position: relative;
  display: block;
  margin: auto;
  width: 100%;
}
.b-point {
  width: 11px;
  height: 11px;
  background-color: #b71c1c;
  transition: opacity 0.4s ease-in-out;
  border-radius: 50%;
  border: none;
  opacity: 0.6;
  outline: none;
  cursor: pointer;
  transform: translate3d(-50%, -50%, 0);
}
.error--text {
  & input {
    border-bottom: 2px solid red;
    color: red;
  }
  & label {
    color: red;
  }

  & span {
    opacity: 1;
  }
}
.b-table-box {
  max-height: 360px;
  overflow: auto;
}
</style>