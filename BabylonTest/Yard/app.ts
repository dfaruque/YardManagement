    const multiplicationFactor = 10;
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
            //scene.debugLayer.show();
            scene.collisionsEnabled = true;
            scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
            //scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
            core.camera.checkCollisions = true;
            //scene.disablePhysicsEngine();

            scene.clearColor = BABYLON.Color3.Black();

            var light = new BABYLON.DirectionalLight("New DirectionalLight", new BABYLON.Vector3(1, -1, -1), scene);
            light.position = new BABYLON.Vector3(10 * multiplicationFactor, 10 * multiplicationFactor, 10 * multiplicationFactor);

            var block = new YARD.YARDBlock(core, 1, 20, 6, 9, 2);

            core.shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
            editorMain.transformer.transformerType = BABYLON.EDITOR.TransformerType.POSITION;

            var yardLocations = block.yardLocations;

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

                    showWorldAxis(50, scene);
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
                        for (var i = 0; i < block.containers.length; i++) {
                            var nextPosition = yardLocations[i];
                            nextPosition.isEmpty = false;

                            block.containers[i].yardLocation = nextPosition ;
                        }
                    },
                    arrangeSelected: () => {
                        //setPositionInBlock(selectedContainer);


                    },
                    showGridLines: (event) => {

                        var par = scene.getMeshByName('gridParent');
                        if (par)
                            par.getChildMeshes().forEach(f => f.setEnabled(event.target.checked));

                    },

                    moveUp: () => {
                        //selectedContainer.position.y -= selectedContainer.getBoundingInfo().boundingBox.extendSize.y
                        //    * selectedContainer.scaling.y * 2;
                    },
                    moveDown: () => {
                        //selectedContainer.position.y += selectedContainer.getBoundingInfo().boundingBox.extendSize.y
                        //    * selectedContainer.scaling.y * 2;

                    },
                    moveLeft: () => {
                        //selectedContainer.position.z -= selectedContainer.getBoundingInfo().boundingBox.extendSize.z
                        //    * selectedContainer.scaling.z * 2;
                    },
                    moveRight: () => {
                        //selectedContainer.position.z += selectedContainer.getBoundingInfo().boundingBox.extendSize.z
                        //    * selectedContainer.scaling.z * 2;
                    },
                    moveForward: () => {
                        //selectedContainer.position.x -= selectedContainer.getBoundingInfo().boundingBox.extendSize.x
                        //    * selectedContainer.scaling.x * 2;

                    },
                    moveBackword: () => {
                        //selectedContainer.position.x += selectedContainer.getBoundingInfo().boundingBox.extendSize.x
                        //    * selectedContainer.scaling.x * 2;

                    },
                },
            });

            //var setPositionInBlock = function (yardContainer: BABYLON.AbstractMesh) {
            //    if (selectedContainer) {
            //        var nextPosition = yardLocations.filter(f => f.isEmpty == true)[0];
            //        if (nextPosition) {
            //            nextPosition.isEmpty = false;

            //            yardContainer.position.x = nextPosition.row_x * yardContainer.scaling.x - block._boundingInfo.maximum.x + nextPosition.row_x * multiplicationFactor / 4;
            //            yardContainer.position.y = (nextPosition.level_y - 1) * yardContainer.scaling.y + yardContainer.scaling.y / 2;
            //            yardContainer.position.z = nextPosition.column_z * yardContainer.scaling.z - block._boundingInfo.maximum.z + nextPosition.column_z * multiplicationFactor / 4;
            //        }
            //        else {
            //            alert('There is no room...');
            //        }
            //    } else {
            //        alert('No selected container.');
            //    }
            //};
        }
    }
}