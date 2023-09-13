import * as THREE from "three";
import { Pane } from "tweakpane";
import HiddenThreeUtils from "./HiddenThreeUtils";

/*===============================================
WebGL
===============================================*/
const video = document.getElementById("video");
const texture = new THREE.VideoTexture(video);

const PARAMS = {
   pause: false,
   lookAt: false,
   x: 0,
   y: 0,
   z: 500,
};
const PARAMS2 = {
   x: 1000,
   y: 1000,
   z: 1000,
};

export default class WebGL extends HiddenThreeUtils {
   constructor(el, opt) {
      super(el, opt);
      this.material;
      this.rAFID = 0;
      this.material = null;
   }
   /*===============================================
	メッシュの生成
	===============================================*/
   createMesh() {
     let geometry = new THREE.PlaneGeometry(innerWidth / 2, innerHeight * 0.7);
     this.material = new THREE.MeshBasicMaterial({
       map: texture,
     });
     let axes = new THREE.AxesHelper(505);
     const plane = new THREE.Mesh(geometry, this.material);
     this.scene.add(plane, axes);
   }
   /*===============================================
	initial
	===============================================*/
   init() {
      this.createMesh();
      this.setGUI();
      this.play();
      video.loop = true;
      video.load();
      video.play();
   }
   /*===============================================
	pause & play
	===============================================*/
   pause() {
      cancelAnimationFrame(this.rAFID);
   }
   play() {
      const rendering = () => {
         this.render();
         this.update();
         this.rAFID = requestAnimationFrame(rendering);
      };
      this.rAFID = requestAnimationFrame(rendering);
   }
   /*===============================================
	update timer
	===============================================*/
   update() {
      this.camera.position.x = PARAMS.x;
      this.camera.position.y = PARAMS.y;
      this.camera.position.z = PARAMS.z;
      if(PARAMS.lookAt == false){
         this.camera.rotation.x = (PARAMS2.x * Math.PI) / 180;
         this.camera.rotation.y = (PARAMS2.y * Math.PI) / 180;
         this.camera.rotation.z = (PARAMS2.z * Math.PI) / 180;
      }else{
         this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      }
   }
   /*===============================================
	GUI
	===============================================*/
   setGUI() {
      const pane = new Pane({
         container: document.getElementById("gui"),
      });
      const f1 = pane.addFolder({
        title: "position",
      });
      f1.addInput(PARAMS, "x", { min: 0, max: 1000 });
      f1.addInput(PARAMS, "y", { min: 0, max: 1000 });
      f1.addInput(PARAMS, "z", { min: 0, max: 1000 });

      pane.addInput(PARAMS, "lookAt");
      const f2 = pane.addFolder({
        title: "rotaion　（lookAt:off）",
      });
      f2.addInput(PARAMS2, "x", { min: 0, max: 360 });
      f2.addInput(PARAMS2, "y", { min: 0, max: 360 });
      f2.addInput(PARAMS2, "z", { min: 0, max: 360 });

      pane.addInput(PARAMS, "pause").on("change", (v) => {
         if (v.value === true) {
            this.pause();
         } else {
            this.play();
         }
      });
   }
}
