module port {
    export class yard {
        canvas: HTMLCanvasElement;
        engine: BABYLON.Engine;

        scene: BABYLON.Scene;
        camera: BABYLON.ArcRotateCamera;

        ground: BABYLON.Mesh;

        startingPoint;
        currentMesh: BABYLON.AbstractMesh;

        constructor() {
            this.canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
            this.engine = new BABYLON.Engine(this.canvas, true);

            this.scene = new BABYLON.Scene(this.engine);
            this.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);

            this.camera.setPosition(new BABYLON.Vector3(20, 200, 400));

            this.camera.lowerBetaLimit = 0.1;
            this.camera.upperBetaLimit = (Math.PI / 2) * 0.99;
            this.camera.lowerRadiusLimit = 150;

            this.scene.clearColor = BABYLON.Color3.White();

            // Light
            var light = new BABYLON.PointLight("omni", new BABYLON.Vector3(0, 100, 0), this.scene);

            // Ground
            this.ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, this.scene, false);
            var groundMaterial = new BABYLON.StandardMaterial("ground", this.scene);
            groundMaterial.specularColor = BABYLON.Color3.Black();
            this.ground.material = groundMaterial;

            // Meshes

            var greenBox = BABYLON.Mesh.CreateBox("green", 20, this.scene);
            var greenMat = new BABYLON.StandardMaterial("ground", this.scene);
            greenMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            greenMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            greenMat.emissiveColor = BABYLON.Color3.Green();
            greenBox.material = greenMat;
            greenBox.position.z -= 100;
            greenBox.position.y = 10;

            var blueBox = BABYLON.Mesh.CreateBox("blue", 20, this.scene);
            var blueMat = new BABYLON.StandardMaterial("ground", this.scene);
            blueMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            blueMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            blueMat.emissiveColor = BABYLON.Color3.Blue();
            blueBox.material = blueMat;
            blueBox.position.x += 100;
            blueBox.position.y = 10;

            // Events

            var onPointerUp = function () {
                if (this.startingPoint) {
                    this.camera.attachControl(this.canvas, true);
                    this.startingPoint = null;
                    return;
                }
            }

            var onPointerMove = function (evt) {
                if (!this.startingPoint) {
                    return;
                }

                var current = this.getGroundPosition(evt);

                if (!current) {
                    return;
                }

                var diff = current.subtract(this.startingPoint);
                this.currentMesh.position.addInPlace(diff);

                this.startingPoint = current;

            }

            this.canvas.addEventListener("pointerdown", this.onPointerDown, false);
            this.canvas.addEventListener("pointerup", onPointerUp, false);
            this.canvas.addEventListener("pointermove", onPointerMove, false);

            this.scene.onDispose = function () {
                this.canvas.removeEventListener("pointerdown", this.onPointerDown);
                this.canvas.removeEventListener("pointerup", onPointerUp);
                this.canvas.removeEventListener("pointermove", onPointerMove);
            }

            this.engine.runRenderLoop(() => { this.render() });

            // Resize
            window.addEventListener("resize", () => {
                this.engine.resize();
            });
        }

        render() {
            this.scene.render();
        }

        getGroundPosition(e): BABYLON.Vector3 {
            // Use a predicate to get position on the ground
            var pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, function (mesh) { return mesh == this.ground; });
            if (pickinfo.hit) {
                return pickinfo.pickedPoint;
            }

            return null;
        }

        onPointerDown(evt) {
            if (evt.button !== 0) {
                return;
            }

            // check if we are under a mesh
            var pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, function (mesh) { return mesh !== this.ground; });
            if (pickInfo.hit) {
                this.currentMesh = pickInfo.pickedMesh;
                this.startingPoint = this.getGroundPosition(evt);

                if (this.startingPoint) { // we need to disconnect camera from canvas
                    setTimeout(function () {
                        this.camera.detachControl(this.canvas);
                    }, 0);
                }
            }
        }
    }

}