const multiplicationFactor = 10;
const containerWidth = 8;
const containerHeight = 8.6;

namespace YARD {
    export class main {

        constructor() {
            var containerNo = 1;
            var inputLocation: YARDLocationVector = { column_z: 1, row_x: 1, level_y: 1, yardContainer: null };
            var selectedContainer: YARD.YARDContainer;

            //configuration
            var editorMain = new BABYLON.EDITOR.EditorMain("BABYLON-EDITOR-MAIN", true);
            editorMain.transformer.transformerType = BABYLON.EDITOR.TransformerType.POSITION;

            var core = editorMain.core;
            core.eventReceivers.push({
                onEvent: (event: BABYLON.EDITOR.IEvent): boolean => {
                    if (event.sceneEvent.eventType == BABYLON.EDITOR.SceneEventType.OBJECT_PICKED) {
                        if (event.sceneEvent.object.container)
                            selectedContainer = event.sceneEvent.object.container;
                    }
                    else if (event.sceneEvent.eventType == BABYLON.EDITOR.SceneEventType.OBJECT_CHANGED) {
                        if (event.sceneEvent.object.container === selectedContainer) {

                            var nearestSlot = selectedContainer.nearestSlot;

                            moveContainer(selectedContainer,
                                nearestSlot.row_x,
                                nearestSlot.column_z,
                                nearestSlot.level_y);

                        }
                    }
                    return false;
                }
            });

            var scene = core.scene;
            scene.clearColor = BABYLON.Color3.White();


            var moveContainer = (container: YARDContainer, row_x, column_z, level_y) => {
                if (container.yardLocation.row_x != row_x || container.yardLocation.column_z != column_z || container.yardLocation.level_y != level_y) {
                    var slots = container.block.slots;

                    var moveToLocation = slots.filter(f =>
                        f.row_x == row_x
                        && f.column_z == column_z
                        && f.level_y == level_y)[0];

                    if (moveToLocation) {
                        var moveFromLocation = slots.filter(f =>
                            f.row_x == container.yardLocation.row_x
                            && f.column_z == container.yardLocation.column_z
                            && (f.level_y == container.yardLocation.level_y))[0];

                        var isFree = (moveToLocation.yardContainer == null || moveToLocation.yardContainer == container);

                        if (isFree) {

                            if (moveFromLocation)
                                moveFromLocation.yardContainer = null;

                            var belowLocation = slots.filter(f =>
                                f.yardContainer == null
                                && f.row_x == row_x
                                && f.column_z == column_z
                                && f.level_y == level_y - 1)[0];

                            if (belowLocation) {
                                container.yardLocation = belowLocation;
                                belowLocation.yardContainer = container;
                            }
                            else {
                                container.yardLocation = moveToLocation;
                                moveToLocation.yardContainer = container;
                                //physics

                                if (container.yardLocation.level_y < container.block.capacity.level_y) {
                                    var aboveLocation = slots.filter(f =>
                                        f.yardContainer
                                        && f.row_x == moveFromLocation.row_x
                                        && f.column_z == moveFromLocation.column_z
                                        && f.level_y == moveFromLocation.level_y + 1)[0];

                                    if (aboveLocation) {
                                        var aboveContainer = aboveLocation.yardContainer;
                                        aboveLocation.yardContainer = null;

                                        moveContainer(aboveContainer,
                                            aboveContainer.yardLocation.row_x,
                                            aboveContainer.yardLocation.column_z,
                                            aboveContainer.yardLocation.level_y - 1)

                                    }
                                }
                            }

                        }
                        else {
                            var aboveLocation = slots.filter(f =>
                                f.yardContainer == null
                                && f.row_x == row_x
                                && f.column_z == column_z
                                && f.level_y == level_y + 1)[0];

                            if (aboveLocation) {
                                aboveLocation.yardContainer = null;

                                moveContainer(selectedContainer,
                                    row_x,
                                    column_z,
                                    level_y + 1)

                            } else {
                                selectedContainer.yardLocation = selectedContainer.yardLocation;
                            }
                        }
                    }
                } else {
                    container.yardLocation = container.yardLocation;
                }
            };

            //Implementation goes here............................

            var block = new YARD.YARDBlock(core, 1, 20, 6, 9, 2, new BABYLON.Vector3(0, 0, 0));
            //var block2 = new YARD.YARDBlock(core, 2, 20, 6, 9, 2, new BABYLON.Vector3(0, 0, -block.size.length_z - block.boundingGroundSize));
            //var block3 = new YARD.YARDBlock(core, 3, 20, 6, 9, 2, new BABYLON.Vector3(0, 0, block.size.length_z + block.boundingGroundSize));
            var light = new BABYLON.DirectionalLight("New DirectionalLight", new BABYLON.Vector3(10, -20, -10), scene);
            light.intensity = 0.7;
            //light.position = new BABYLON.Vector3(-10 * multiplicationFactor, 10 * multiplicationFactor, -10 * multiplicationFactor);
            //var lightSphere = BABYLON.MeshBuilder.CreateSphere('lightSpere', { diameter: multiplicationFactor}, scene);
            //lightSphere.position = light.position;
            var hemiLight = new BABYLON.HemisphericLight("light1m", new BABYLON.Vector3(0, 0, 0), scene);
            hemiLight.intensity = 0.3;

            //var light2 = new BABYLON.PointLight("New DirectionalLight", new BABYLON.Vector3(-100, 1000, 0), scene);
            //light2.intensity = 0.2;
            //light2.radius = block.size.length_z;
            //light2.position = new BABYLON.Vector3(10 * multiplicationFactor, 10 * multiplicationFactor, 10 * multiplicationFactor);
            //var light2Sphere = BABYLON.MeshBuilder.CreateSphere('light2Spere', { diameter: multiplicationFactor }, scene);
            //light2Sphere.position = light2.position;

            core.shadowGenerator = new BABYLON.ShadowGenerator(2048, light);

            core.shadowGenerator.usePoissonSampling = true;
            //core.shadowGenerator = new BABYLON.ShadowGenerator(2048, light2);

            var camera = core.camera;
            //camera.checkCollisions = true;

            var vm = new Vue({
                el: '#divConsole',

                ready: () => {

                    //populate bummy containers
                    for (var i = 0; i < block.slots.length / 2; i++) {
                        new YARD.YARDContainer(core, containerNo++, block, 20,
                            block.slots[i],
                            new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
                    }
                    new YARD.YARDContainer(core, containerNo++, block, 20,
                        block.slots[block.slots.length / 2],
                        new BABYLON.Color3(Math.random(), Math.random(), Math.random()));

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
                    addContainer: function () {
                        var yardLocation = block.slots.filter(f => f.yardContainer == null && f.column_z == inputLocation.column_z && f.row_x == inputLocation.row_x && f.level_y == inputLocation.level_y)[0];

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
                        block.slots.forEach(f => f.yardContainer = null);

                        for (var i = 0; i < block.containers.length; i++) {
                            var nextPosition = block.slots[i];

                            nextPosition.yardContainer = block.containers[i];

                            nextPosition.yardContainer.yardLocation = nextPosition;
                        }
                    },
                    arrangeSelected: () => {
                        if (selectedContainer) {
                            //var moveFromLocation = selectedContainer.block.slots.filter(f =>
                            //    f.row_x == selectedContainer.yardLocation.row_x
                            //    && f.column_z == selectedContainer.yardLocation.column_z
                            //    && (f.level_y == selectedContainer.block.capacity.level_y))[0];

                            //moveFromLocation.yardContainer = null;

                            var nearestSlot = selectedContainer.nearestSlot;

                            moveContainer(selectedContainer, nearestSlot.row_x, nearestSlot.column_z, nearestSlot.level_y);
                        }

                    },
                    resetCamera: () => {

                        editorMain.resetCamera();


                    },
                    showGridLines: (event) => {

                        block.showTiles = event.target.checked;

                    },

                    moveUp: () => {
                        moveContainer(selectedContainer,
                            selectedContainer.yardLocation.row_x,
                            selectedContainer.yardLocation.column_z,
                            selectedContainer.yardLocation.level_y - 1);
                    },
                    moveDown: () => {
                        moveContainer(selectedContainer,
                            selectedContainer.yardLocation.row_x,
                            selectedContainer.yardLocation.column_z,
                            selectedContainer.yardLocation.level_y + 1);

                    },
                    moveLeft: () => {
                        moveContainer(selectedContainer,
                            selectedContainer.yardLocation.row_x,
                            selectedContainer.yardLocation.column_z - 1,
                            selectedContainer.yardLocation.level_y);
                    },
                    moveRight: () => {
                        moveContainer(selectedContainer,
                            selectedContainer.yardLocation.row_x,
                            selectedContainer.yardLocation.column_z + 1,
                            selectedContainer.yardLocation.level_y);
                    },
                    moveForward: () => {
                        moveContainer(selectedContainer,
                            selectedContainer.yardLocation.row_x - 1,
                            selectedContainer.yardLocation.column_z,
                            selectedContainer.yardLocation.level_y);

                    },
                    moveBackword: () => {
                        moveContainer(selectedContainer,
                            selectedContainer.yardLocation.row_x + 1,
                            selectedContainer.yardLocation.column_z,
                            selectedContainer.yardLocation.level_y);

                    },
                },
            });

        }
    }
}