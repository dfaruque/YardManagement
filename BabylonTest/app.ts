/// <reference path="showworldaxis.ts" />
/// <reference path="scripts/typings/vue/vue.d.ts" />
/// <reference path="scripts/babylon.editor.transformer.ts" />
/// <reference path="scripts/babylon.editor.scenemanager.ts" />
/// <reference path="scripts/babylon.editor.scenefactory.ts" />
/// <reference path="yard.d.ts" />
/// <reference path="scripts/babylon.editor.main.ts" />

var containerNo = 1;
var inputLocation: yardContainerLocation = { column_z: 1, row_x: 1, level_y: 1 };

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
scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
scene.disablePhysicsEngine();

scene.clearColor = BABYLON.Color3.Black();
var light = BABYLON.EDITOR.SceneFactory.AddYardDirectionalLight(core);
var block = BABYLON.EDITOR.SceneFactory.AddYardBlockGroundMesh(core, 1, 6, 9);
core.shadowGenerator = new BABYLON.ShadowGenerator(256 * multiplicationFactor, light);
editorMain.transformer.transformerType = BABYLON.EDITOR.TransformerType.POSITION;


var vm = new Vue({
    el: '#divConsole',
    ready: () => {
        for (var i = 1; i <= 6; i++) {
            BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++, block,
                { column_z: i, row_x: 1, level_y: 1 },
                new BABYLON.Color3(Math.random(), Math.random(), Math.random()));

            BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++, block,
                { column_z: 1, row_x: i + 1, level_y: 1 },
                new BABYLON.Color3(Math.random(), Math.random(), Math.random()));


        }
        BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++, block,
            { column_z: 1, row_x: 7, level_y: 1 },
            new BABYLON.Color3(Math.random(), Math.random(), Math.random()));

        editorMain.createRenderLoop();

        //var sih = new ManipulationHelpers.SimpleInteractionHelper(scene);
        //showWorldAxis(50);

    },
    data: {
        scene: scene,
        inputLocation: inputLocation
    },

    computed: {

    },


    methods: {
        addContainer: () => {
            var con = BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++, block,
                { column_z: inputLocation.column_z, row_x: inputLocation.row_x, level_y: inputLocation.level_y },
                new BABYLON.Color3(Math.random(), Math.random(), Math.random()));

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

