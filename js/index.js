
var demo;
(function (demo) {
    var BasicView = (function () {
        function BasicView() {
            var _this = this;
            this.containerElement = document.createElement('div');
       //      this.containerElement = document.getElementsById('main-slider');
           
            this.containerElement.id="codepen";
            
            //extra
            document.getElementById('main-slider').appendChild(this.containerElement);
            
            
            
            //extra
           // document.body.appendChild(this.containerElement);
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 1, 200000);
            this.camera.position.z = -1000;
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setClearColor(0x006666);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.containerElement.appendChild(this.renderer.domElement);
            window.addEventListener('resize', function (e) {
                _this.handleResize(e);
            }, false);
        }
        BasicView.prototype.handleResize = function (event) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };
        BasicView.prototype.startRendering = function () {
            this.update();
        };
        BasicView.prototype.update = function () {
            requestAnimationFrame(this.update.bind(this));
            this.onTick();
            this.render();
        };
        BasicView.prototype.render = function () {
            this.renderer.render(this.scene, this.camera);
        };
        BasicView.prototype.onTick = function () {
        };
        return BasicView;
    })();
    demo.BasicView = BasicView;
})(demo || (demo = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var demo;
(function (demo) {
    var DemoCubesWorld = (function (_super) {
        __extends(DemoCubesWorld, _super);
        function DemoCubesWorld() {
            var _this = this;
            _super.call(this);
            this.rot = 0; 
         
            this.edgesPool = [];
          
            this.STEP = 100;
            this.scene.fog = new THREE.Fog(0xFFFFFF, 100, 15500);
            this.cameraPositionTarget = new THREE.Vector3();
            this.cameraLookAtTarget = new THREE.Vector3();
            var timeline = new TimelineMax();
            timeline.repeat(-1);
     
            timeline.set(this, { rot: 135 }, 0);
            timeline.to(this, 7, { rot: 0, ease: Cubic.easeInOut }, 0);
            timeline.set(this.cameraPositionTarget, { y: 0 }, 0);
            timeline.to(this.cameraPositionTarget, 6, { y: 400, ease: Cubic.easeInOut }, 0);
            timeline.set(this.cameraLookAtTarget, { y: 500 }, 0);
            timeline.to(this.cameraLookAtTarget, 6, { y: 0, ease: Cubic.easeInOut }, 0);
            var geometryBox = new THREE.BoxGeometry(this.STEP, this.STEP, this.STEP, 1, 1, 1);
            var materialBox = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
            for (var i = 0; i < DemoCubesWorld.OBJ_NUM; i++) {
                var mesh = new THREE.Mesh(geometryBox, materialBox);
               
                var egh = new THREE.EdgesHelper(mesh,0x99FFFF);
                egh.material.linewidth = 1;
                
                egh.position.x = this.STEP * Math.round(20000 * (Math.random() - 0.5) / this.STEP) + this.STEP / 2;
                egh.position.z = this.STEP * Math.round(20000 * (Math.random() - 0.5) / this.STEP) + this.STEP / 2;
                egh.updateMatrix();
                this.scene.add(egh);
                this.edgesPool.push(egh);
                
                var sec = 2 * Math.random() + 3;
              
                timeline.set(egh.position, { y: 8000 }, 0);
                timeline.to(egh.position, sec, { y: this.STEP / 2 + 1, ease: Bounce.easeOut }, 0);
            }
            this.createTimescale(timeline);
            timeline.addCallback(function () {
                _this.createTimescale(timeline);
            }, timeline.duration());
           
            var grid = new THREE.GridHelper(10000, this.STEP);
            grid.setColors(0xFFFFFF,0xFFFFFF);
            this.scene.add(grid);
            this.startRendering();
        }
     
        DemoCubesWorld.prototype.createTimescale = function (timeline) {
            var totalTimeline = new TimelineMax();
            totalTimeline.set(timeline, { timeScale: 1.5 }).to(timeline, 1.5, { timeScale: 0.01, ease: Expo.easeInOut }, "+=0.8").to(timeline, 1.5, { timeScale: 1.5, ease: Expo.easeInOut }, "+=5");
        };
       
        DemoCubesWorld.prototype.onTick = function () {
            this.camera.position.x = 1000 * Math.cos(this.rot * Math.PI / 180);
            this.camera.position.z = 1000 * Math.sin(this.rot * Math.PI / 180);
            this.camera.position.y = this.cameraPositionTarget.y;
            this.camera.lookAt(this.cameraLookAtTarget);
            for (var i = 0; i < this.edgesPool.length; i++) {
                this.edgesPool[i].updateMatrix();
            }
        };
    
        DemoCubesWorld.OBJ_NUM = 1500;
        return DemoCubesWorld;
    })(demo.BasicView);
    demo.DemoCubesWorld = DemoCubesWorld;
})(demo || (demo = {}));
window.addEventListener("load", function () {
    new demo.DemoCubesWorld();
});