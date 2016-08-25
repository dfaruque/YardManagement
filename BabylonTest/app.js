/// <reference path="showworldaxis.ts" />
/// <reference path="scripts/typings/vue/vue.d.ts" />
/// <reference path="scripts/babylon.editor.transformer.ts" />
/// <reference path="scripts/babylon.editor.scenemanager.ts" />
/// <reference path="scripts/babylon.editor.scenefactory.ts" />
/// <reference path="yard.d.ts" />
/// <reference path="scripts/babylon.editor.main.ts" />
var containerNo = 1;
var inputLocation = { column: 1, row: 1, level: 1 };
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
var multiplicationFactor = 10;
var currentMesh = null;
var editorMain = new BABYLON.EDITOR.EditorMain("BABYLON-EDITOR-MAIN", true);
var core = editorMain.core;
var scene = core.currentScene;
scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
scene.disablePhysicsEngine();
scene.clearColor = BABYLON.Color3.Black();
var light = BABYLON.EDITOR.SceneFactory.AddYardDirectionalLight(core);
var block = BABYLON.EDITOR.SceneFactory.AddYardBlockGroundMesh(core, '1', 9, 6);
core.shadowGenerator = new BABYLON.ShadowGenerator(100, light);
editorMain.transformer.transformerType = BABYLON.EDITOR.TransformerType.POSITION;
showWorldAxis(20);
//BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++,
//    { column: 2, row: 2, level: 1 },
//    new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
//BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++,
//    { column: 2, row: 2, level: 3 },
//    new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
//BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++,
//    { column: 4, row: 2, level: 1 },
//    new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
//BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++,
//    { column: 4, row: 2, level: 3 },
//    new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
//BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++,
//    { column: 6, row: 2, level: 1 },
//    new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
//BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++,
//    { column: 6, row: 2, level: 3 },
//    new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
var vm = new Vue({
    el: '#divConsole',
    ready: function () {
        editorMain.createRenderLoop();
    },
    data: {
        scene: scene,
        //startingPoint: startingPoint,
        //selectedContainer: currentMesh,
        inputLocation: inputLocation
    },
    computed: {
        selectedContainerLocationColumn: {
            get: function () { return (currentMesh.position.x / multiplicationFactor).toFixed(); },
            set: function (newValue) { currentMesh.position.x = newValue * multiplicationFactor; }
        },
        selectedContainerLocationRow: {
            get: function () { return (currentMesh.position.z / multiplicationFactor).toFixed(); },
            set: function (newValue) { currentMesh.position.z = newValue * multiplicationFactor; }
        },
        selectedContainerLocationLevel: {
            get: function () { return (currentMesh.position.y / multiplicationFactor).toFixed(); },
            set: function (newValue) { currentMesh.position.y = newValue * multiplicationFactor; }
        },
    },
    methods: {
        addContainer: function () {
            var con = BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++, { column: inputLocation.column, row: inputLocation.row, level: inputLocation.level }, new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
        },
        moveUp: function () {
            currentMesh.position.y += currentMesh.getBoundingInfo().boundingBox.extendSize.y
                * currentMesh.scaling.y * 3;
        },
        moveDown: function () {
            currentMesh.position.y -= currentMesh.getBoundingInfo().boundingBox.extendSize.y
                * currentMesh.scaling.y * 2;
        },
        moveLeft: function () {
            currentMesh.position.x += currentMesh.getBoundingInfo().boundingBox.extendSize.x
                * currentMesh.scaling.x * 2;
        },
        moveRight: function () {
            currentMesh.position.x -= currentMesh.getBoundingInfo().boundingBox.extendSize.x
                * currentMesh.scaling.x * 2;
        },
        moveForward: function () {
            currentMesh.position.z += currentMesh.getBoundingInfo().boundingBox.extendSize.z
                * currentMesh.scaling.z * 2;
        },
        moveBackword: function () {
            currentMesh.position.z -= currentMesh.getBoundingInfo().boundingBox.extendSize.z
                * currentMesh.scaling.z * 2;
        },
    },
});
//# sourceMappingURL=app.js.map