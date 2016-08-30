namespace BABYLON.EDITOR {
    export class EditorMain implements IDisposable, IEventReceiver {
        // public members
        public core: EditorCore;

        public transformer: Transformer;

        public container: string;
        public mainContainer: string;
        public antialias: boolean;
        public options: any;

        public filesInput: FilesInput = null;

        public renderMainScene: boolean = true;
        public renderHelpers: boolean = true;

        // private members

        // Statics
        public static get DummyNodeID(): string {
            return "BABYLON-EDITOR-DUMMY-NODE";
        }

        /**
        * Constructor
        */
        constructor(containerID: string, antialias: boolean = false, options: any = null) {
            // Initialize
            this.core = new EditorCore();
            this.core.editor = this;

            this.container = containerID;
            this.mainContainer = containerID + "MAIN";
            this.antialias = antialias;
            this.options = options;

            // Create Main UI
            this._createUI();
            this._createBabylonEngine();

            // Register this
            this.core.eventReceivers.push(this);

            // Transformer
            this.transformer = new Transformer(this.core);

        }

        /**
        * Event receiver
        */
        public onEvent(event: Event): boolean {
            if (event.eventType === EventType.GUI_EVENT) {
                if (event.guiEvent.eventType === GUIEventType.LAYOUT_CHANGED) {
                    this.core.engine.resize();
                    return true;
                }
            }

            return false;
        }

        /**
        * Creates the UI
        */
        private _createUI() {
            
        }

        /**
        * Handles just opened scenes
        */
        private _handleSceneLoaded(): (file: File, scene: Scene) => void {
            return (file: File, scene: Scene) => {
                // Set active scene
                this.core.removeScene(this.core.scene);
                this.core.scenes.push({ scene: scene, render: true });
                this.core.scene = scene;

                // Set active camera
                var camera: any = scene.activeCamera;
                this._createBabylonCamera();

                if (camera) {
                    if (camera.speed) {
                        (<any>this.core.camera).speed = camera.speed;
                    }
                }

                this.core.scene.activeCamera = this.core.camera;
                this.core.playCamera = camera;

                // Create render loop
                this.core.engine.stopRenderLoop();
                this.createRenderLoop();

                // Create parent node
                var parent = null;

                // Configure meshes
                for (var i = 0; i < scene.meshes.length; i++) {
                    SceneManager.ConfigureObject(scene.meshes[i], this.core, parent);
                }

                

                SceneFactory.NodesToStart = [];
                
            };
        }

        /**
        * Creates the babylon engine
        */
        private _createBabylonEngine(): void {
            this.core.canvas = <HTMLCanvasElement>document.getElementById("BABYLON-EDITOR-MAIN-CANVAS");

            this.core.engine = new Engine(this.core.canvas, this.antialias, this.options);
            this.core.scene = new Scene(this.core.engine);
            (<any>this.core.scene).animations = [];
            this.core.scenes.push({ render: true, scene: this.core.scene });

            this._createBabylonCamera();

            window.addEventListener("resize", (ev: UIEvent) => {
                if (this.core.isPlaying) {
                    this.core.isPlaying = false;
                }

                this.core.engine.resize();
            });
        }

        /**
        * Creates the editor camera
        */
        private _createBabylonCamera(): void {
            //var camera = new ArcRotateCamera("EditorCamera", 0, 0, 10, Vector3.Zero(), this.core.currentScene);
            //camera.panningSensibility = 50;
            //camera.attachControl(this.core.canvas, false, false);

            var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, multiplicationFactor, new BABYLON.Vector3(0, 0, 0), this.core.scene);

            camera.lowerBetaLimit = 0.1;
            camera.upperBetaLimit = (Math.PI / 2) * 0.99;
            camera.lowerRadiusLimit = multiplicationFactor;

            camera.setPosition(new BABYLON.Vector3(multiplicationFactor * multiplicationFactor, multiplicationFactor * multiplicationFactor*2, 0));
            this.core.camera = camera;
        }

        /**
        * Creates the render loop
        */
        public createRenderLoop(): void {
            this.core.engine.runRenderLoop(() => {
                this.update();
            });
        }

        /**
        * Simply update the scenes and updates
        */
        public update(): void {
            // Pre update
            this.core.onPreUpdate();

            // Scenes
            if (this.renderMainScene) {
                for (var i = 0; i < this.core.scenes.length; i++) {
                    if (this.core.scenes[i].render) {
                        this.core.scenes[i].scene.render();
                    }
                }
            }

            // Render transformer
            this.transformer.getScene().render();

            // Post update
            this.core.onPostUpdate();
        }

        // Disposes the editor
        public dispose(): void {

        }
    }
}