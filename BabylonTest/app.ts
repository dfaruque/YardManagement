﻿/// <reference path="showworldaxis.ts" />
/// <reference path="scripts/typings/vue/vue.d.ts" />
/// <reference path="scripts/babylon.editor.transformer.ts" />
/// <reference path="scripts/babylon.editor.scenemanager.ts" />
/// <reference path="scripts/babylon.editor.scenefactory.ts" />
/// <reference path="yard.d.ts" />
/// <reference path="scripts/babylon.editor.main.ts" />

var containerNo = 1;
var inputLocation: yardLocationVector = { column_z: 1, row_x: 1, level_y: 1, isEmpty: null };
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

const multiplicationFactor = 10;
var currentMesh = null;

var editorMain = new BABYLON.EDITOR.EditorMain("BABYLON-EDITOR-MAIN", true);

var core = editorMain.core;
var scene = core.currentScene;
//scene.debugLayer.show();
scene.collisionsEnabled = true;
scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
core.camera.checkCollisions = true;
//scene.disablePhysicsEngine();

scene.clearColor = BABYLON.Color3.Black();

var light = BABYLON.EDITOR.SceneFactory.AddYardDirectionalLight(core);

var block = BABYLON.EDITOR.SceneFactory.AddYardBlockGroundMesh(core, 1, 6, 9, 2);

core.shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
editorMain.transformer.transformerType = BABYLON.EDITOR.TransformerType.POSITION;

var yardLocations = block.yardLocations;

var vm = new Vue({
    el: '#divConsole',
    ready: () => {

        //populate bummy containers
        for (var i = 1; i < 9; i++) {
            if (i <= 6) {
                BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++, block,
                    yardLocations[i],
                    new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
            }
            //if (i <= 5) {
            //    BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++, block,
            //        { column_z: i, row_x: 2, level_y: 1 },
            //        new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
            //    BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++, block,
            //        { column_z: i, row_x: 1, level_y: 2 },
            //        new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
            //}

            //BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++, block,
            //    { column_z: 1, row_x: i + 1, level_y: 1 },
            //    new BABYLON.Color3(Math.random(), Math.random(), Math.random()));


        }

        editorMain.createRenderLoop();

        //var sih = new ManipulationHelpers.SimpleInteractionHelper(scene);
        //showWorldAxis(50);
        blockGrid(block);
    },
    data: {
        scene: scene,
        inputLocation: inputLocation
    },

    computed: {

    },


    methods: {
        addContainer: () => {
            var yardLocation = yardLocations.filter(f => f.isEmpty == true && f.column_z == inputLocation.column_z && f.row_x == inputLocation.row_x && f.level_y == inputLocation.level_y)[0];

            if (yardLocation) {
                var con = BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++, block,
                    yardLocation,
                    new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
            }
            else {
                alert('This location is already booked');
            }
        },
        arrangeAll: () => {
            var yardContainers = core.currentScene.meshes.filter(f => f.name.indexOf('yardContainer') >= 0);

            for (var i = 0; i < yardContainers.length; i++) {
                var yardContainer = yardContainers[i];
                var nextPosition = yardLocations[i];

                nextPosition.isEmpty = false;
                yardContainer.position.x = nextPosition.row_x * yardContainer.scaling.x - block._boundingInfo.maximum.x + nextPosition.row_x * multiplicationFactor / 4;
                yardContainer.position.y = (nextPosition.level_y - 1) * yardContainer.scaling.y + yardContainer.scaling.y / 2;
                yardContainer.position.z = nextPosition.column_z * yardContainer.scaling.z - block._boundingInfo.maximum.z + nextPosition.column_z * multiplicationFactor / 4;
            }
        },
        arrangeSelected: () => {
            setPositionInBlock(currentMesh);


        },
        showGridLines: (event) => {

            var par = scene.getMeshByName('gridParent');
            if (par)
                par.getChildMeshes().forEach(f => f.setEnabled(event.target.checked));

        },

        moveUp: () => {
            currentMesh.position.y -= currentMesh.getBoundingInfo().boundingBox.extendSize.y
                * currentMesh.scaling.y * 2;
        },
        moveDown: () => {
            currentMesh.position.y += currentMesh.getBoundingInfo().boundingBox.extendSize.y
                * currentMesh.scaling.y * 2;

        },
        moveLeft: () => {
            currentMesh.position.z -= currentMesh.getBoundingInfo().boundingBox.extendSize.z
                * currentMesh.scaling.z * 2;
        },
        moveRight: () => {
            currentMesh.position.z += currentMesh.getBoundingInfo().boundingBox.extendSize.z
                * currentMesh.scaling.z * 2;
        },
        moveForward: () => {
            currentMesh.position.x -= currentMesh.getBoundingInfo().boundingBox.extendSize.x
                * currentMesh.scaling.x * 2;

        },
        moveBackword: () => {
            currentMesh.position.x += currentMesh.getBoundingInfo().boundingBox.extendSize.x
                * currentMesh.scaling.x * 2;

        },
    },
});

var setPositionInBlock = function (yardContainer: BABYLON.AbstractMesh) {
    if (currentMesh) {
        var nextPosition = yardLocations.filter(f => f.isEmpty == true)[0];
        if (nextPosition) {
            nextPosition.isEmpty = false;

            yardContainer.position.x = nextPosition.row_x * yardContainer.scaling.x - block._boundingInfo.maximum.x + nextPosition.row_x * multiplicationFactor / 4;
            yardContainer.position.y = (nextPosition.level_y - 1) * yardContainer.scaling.y + yardContainer.scaling.y / 2;
            yardContainer.position.z = nextPosition.column_z * yardContainer.scaling.z - block._boundingInfo.maximum.z + nextPosition.column_z * multiplicationFactor / 4;
        }
        else {
            alert('There is no room...');
        }
    } else {
        alert('No selected container.');
    }
    };

