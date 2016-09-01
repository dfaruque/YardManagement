const multiplicationFactor = 10;
const containerWidth = 8;
const containerHeight = 8.6;

namespace YARD {
    export class main {

        constructor() {
            var containerNo = 1;
            var inputLocation: YARDLocationVector = { column_z: 1, row_x: 1, level_y: 1, isEmpty: null };
            var isShowGrid = true;

            var yard = {
                name: 'yard1',
                blocks: [{
                    name: 'block1',
                    size: {
                        width: 100, heigth: 40,
                        length: 200
                    },
                    containerSize: 20,
                    position: { x: 0, y: 0, z: 0 },
                    slots: []
                }]
            };

            var selectedContainer: YARD.YARDContainer;

            var editorMain = new BABYLON.EDITOR.EditorMain("BABYLON-EDITOR-MAIN", true);

            var core = editorMain.core;
            var scene = core.scene;
            core.eventReceivers.push({
                onEvent: (event: BABYLON.EDITOR.IEvent): boolean => {
                    if (event.sceneEvent.eventType == BABYLON.EDITOR.SceneEventType.OBJECT_PICKED) {
                        if (event.sceneEvent.object.container)
                            selectedContainer = event.sceneEvent.object.container;
                    }
                    return false;
                }
            });

            //scene.debugLayer.show();
            scene.collisionsEnabled = true;
            scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
            //scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
            core.camera.checkCollisions = true;
            //scene.disablePhysicsEngine();

            scene.clearColor = BABYLON.Color3.White();

            var light = new BABYLON.DirectionalLight("New DirectionalLight", new BABYLON.Vector3(1, -1, -1), scene);
            light.position = new BABYLON.Vector3(10 * multiplicationFactor, 10 * multiplicationFactor, 10 * multiplicationFactor);
            core.shadowGenerator = new BABYLON.ShadowGenerator(2048, light);

            var block = new YARD.YARDBlock(core, 1, 20, 6, 9, 2, new BABYLON.Vector3(0, 0, 0));
            //var block2 = new YARD.YARDBlock(core, 2, 20, 6, 9, 2, new BABYLON.Vector3(0, 0, -block.size.length_z - block.boundingGroundSize));
            //var block3 = new YARD.YARDBlock(core, 3, 20, 6, 9, 2, new BABYLON.Vector3(0, 0, block.size.length_z + block.boundingGroundSize));

            editorMain.transformer.transformerType = BABYLON.EDITOR.TransformerType.POSITION;

            var yardLocations = block.yardLocations;

            var moveContainer = (row_x, column_z, level_y) => {
                var yardLocation = yardLocations.filter(f => f.isEmpty == true
                    && f.row_x == selectedContainer.yardLocation.row_x + row_x
                    && f.column_z == selectedContainer.yardLocation.column_z + column_z
                    && f.level_y == selectedContainer.yardLocation.level_y + level_y)[0];

                if (yardLocation) {

                    var currentYardLocation = yardLocations.filter(f =>
                        f.row_x == selectedContainer.yardLocation.row_x
                        && f.column_z == selectedContainer.yardLocation.column_z
                        && f.level_y == selectedContainer.yardLocation.level_y)[0];
                    currentYardLocation.isEmpty = true;

                    selectedContainer.yardLocation = yardLocation;

                    //physic
                    if (selectedContainer.yardLocation.level_y < block.capacity.level_y) {

                    }

                }
                //else
                //    alert('Invalid move.');
            };

            var vm = new Vue({
                el: '#divConsole',
                ready: () => {

                    //populate bummy containers
                    for (var i = 1; i < 9; i++) {
                        if (i <= 6) {
                            new YARD.YARDContainer(core, containerNo++, block, 20,
                                yardLocations[i],
                                new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
                        }
                    }

                    editorMain.createRenderLoop();
                    //var sih = new ManipulationHelpers.SimpleInteractionHelper(scene);
                    //showWorldAxis(50, scene);
                },
                data: {
                    scene: scene,
                    selectedContainer: selectedContainer,
                    inputLocation: inputLocation
                },
                watch: {
                    currentMesh: {
                        handler: function (val, oldVal) {
                            alert('a thing changed')
                        },
                        deep: false
                    }
                },
                computed: {

                },


                methods: {
                    addContainer: () => {
                        var yardLocation = yardLocations.filter(f => f.isEmpty == true && f.column_z == inputLocation.column_z && f.row_x == inputLocation.row_x && f.level_y == inputLocation.level_y)[0];

                        if (yardLocation) {
                            var con = new YARD.YARDContainer(core, containerNo++, block, 20,
                                yardLocation,
                                new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
                        }
                        else {
                            alert('This location is already booked');
                        }
                    },
                    arrangeAll: () => {
                        yardLocations.forEach(f => f.isEmpty = true);

                        for (var i = 0; i < block.containers.length; i++) {
                            var nextPosition = yardLocations[i];
                            nextPosition.isEmpty = false;

                            block.containers[i].yardLocation = nextPosition;
                        }
                    },
                    arrangeSelected: () => {
                        //setPositionInBlock(selectedContainer);


                    },
                    resetCamera: () => {

                        editorMain.resetCamera();


                    },
                    showGridLines: (event) => {

                        block.showTiles = event.target.checked;

                    },

                    moveUp: () => {
                        moveContainer(0, 0, -1);
                    },
                    moveDown: () => {
                        moveContainer(0, 0, 1);

                    },
                    moveLeft: () => {
                        moveContainer(0, -1, 0);
                    },
                    moveRight: () => {
                        moveContainer(0, 1, 0);
                    },
                    moveForward: () => {
                        moveContainer(-1, 0, 0);

                    },
                    moveBackword: () => {
                        moveContainer(1, 0, 0);

                    },
                },
            });

        }
    }
}