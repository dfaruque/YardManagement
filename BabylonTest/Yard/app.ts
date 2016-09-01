﻿const multiplicationFactor = 10;
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
                    return false;
                }
            });

            var scene = core.scene;
            scene.clearColor = BABYLON.Color3.White();


            var moveContainer = (container: YARDContainer, row_x, column_z, level_y) => {
                var yardLocations = container.block.yardLocations;

                if (container.yardLocation.level_y + level_y > container.block.capacity.level_y) {
                    var moveFromLocation = yardLocations.filter(f =>
                        f.row_x == container.yardLocation.row_x
                        && f.column_z == container.yardLocation.column_z
                        && (f.level_y == container.block.capacity.level_y))[0];

                    moveFromLocation.yardContainer = null;

                    container.yardLocation = {
                        row_x: container.yardLocation.row_x + row_x,
                        column_z: container.yardLocation.column_z + column_z,
                        level_y: container.yardLocation.level_y + level_y,
                        yardContainer: container
                    };
                }
                else {
                    var moveToLocation = yardLocations.filter(f =>
                        (f.yardContainer == null || f.yardContainer == container)
                        && f.row_x == container.yardLocation.row_x + row_x
                        && f.column_z == container.yardLocation.column_z + column_z
                        && f.level_y == container.yardLocation.level_y + level_y)[0];

                    if (moveToLocation) {
                        var moveFromLocation = yardLocations.filter(f =>
                            f.row_x == container.yardLocation.row_x
                            && f.column_z == container.yardLocation.column_z
                            && f.level_y == container.yardLocation.level_y)[0];

                        if (moveFromLocation)
                            moveFromLocation.yardContainer = null;

                        container.yardLocation = moveToLocation;
                        moveToLocation.yardContainer = container;
                        //physics

                        if (container.yardLocation.level_y < container.block.capacity.level_y) {
                            var aboveLocation = yardLocations.filter(f =>
                                f.yardContainer
                                && f.row_x == moveFromLocation.row_x
                                && f.column_z == moveFromLocation.column_z
                                && f.level_y == moveFromLocation.level_y + 1)[0];

                            if (aboveLocation) {
                                var aboveContainer = aboveLocation.yardContainer;
                                aboveLocation.yardContainer = null;
                                moveContainer(aboveContainer, 0, 0, -1)

                            }
                        }


                    }
                    //else
                    //    alert('Invalid move.');
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

            var light2 = new BABYLON.PointLight("New DirectionalLight", new BABYLON.Vector3(-100, 1000, 0), scene);
            light2.intensity = 0.2;
            light2.radius = block.size.length_z;
            //light2.position = new BABYLON.Vector3(10 * multiplicationFactor, 10 * multiplicationFactor, 10 * multiplicationFactor);
            //var light2Sphere = BABYLON.MeshBuilder.CreateSphere('light2Spere', { diameter: multiplicationFactor }, scene);
            //light2Sphere.position = light2.position;

            core.shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
            //core.shadowGenerator.useBlurVarianceShadowMap = true;
            //core.shadowGenerator = new BABYLON.ShadowGenerator(2048, light2);

            var camera = core.camera;
            //camera.checkCollisions = true;

            var vm = new Vue({
                el: '#divConsole',

                ready: () => {

                    //populate bummy containers
                    for (var i = 0; i < block.yardLocations.length / 2; i++) {
                        new YARD.YARDContainer(core, containerNo++, block, 20,
                            block.yardLocations[i],
                            new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
                    }
                    new YARD.YARDContainer(core, containerNo++, block, 20,
                        block.yardLocations[block.yardLocations.length / 2],
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
                        var yardLocation = block.yardLocations.filter(f => f.yardContainer == null && f.column_z == inputLocation.column_z && f.row_x == inputLocation.row_x && f.level_y == inputLocation.level_y)[0];

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
                        block.yardLocations.forEach(f => f.yardContainer = null);

                        for (var i = 0; i < block.containers.length; i++) {
                            var nextPosition = block.yardLocations[i];

                            nextPosition.yardContainer = block.containers[i];

                            nextPosition.yardContainer.yardLocation = nextPosition;
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
                        moveContainer(selectedContainer, 0, 0, -1);
                    },
                    moveDown: () => {
                        moveContainer(selectedContainer, 0, 0, 1);

                    },
                    moveLeft: () => {
                        moveContainer(selectedContainer, 0, -1, 0);
                    },
                    moveRight: () => {
                        moveContainer(selectedContainer, 0, 1, 0);
                    },
                    moveForward: () => {
                        moveContainer(selectedContainer, -1, 0, 0);

                    },
                    moveBackword: () => {
                        moveContainer(selectedContainer, 1, 0, 0);

                    },
                },
            });

        }
    }
}