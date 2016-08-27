/// <reference path="showworldaxis.ts" />
/// <reference path="scripts/typings/vue/vue.d.ts" />
/// <reference path="scripts/babylon.editor.transformer.ts" />
/// <reference path="scripts/babylon.editor.scenemanager.ts" />
/// <reference path="scripts/babylon.editor.scenefactory.ts" />
/// <reference path="yard.d.ts" />
/// <reference path="scripts/babylon.editor.main.ts" />
var containerNo = 1;
var inputLocation = { column_z: 1, row_x: 1, level_y: 1 };
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
//scene.debugLayer.show();
scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
//scene.disablePhysicsEngine();
//scene.collisionsEnabled = true;
scene.clearColor = BABYLON.Color3.Black();
var light = BABYLON.EDITOR.SceneFactory.AddYardDirectionalLight(core);
var block = BABYLON.EDITOR.SceneFactory.AddYardBlockGroundMesh(core, 1, 6, 9, 2);
core.shadowGenerator = new BABYLON.ShadowGenerator(256 * multiplicationFactor, light);
editorMain.transformer.transformerType = BABYLON.EDITOR.TransformerType.POSITION;
var vm = new Vue({
    el: '#divConsole',
    ready: function () {
        for (var i = 1; i < 9; i++) {
            if (i <= 6) {
                BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++, block, { column_z: i, row_x: 1, level_y: 1 }, new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
            }
            if (i <= 5) {
                BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++, block, { column_z: i, row_x: 2, level_y: 1 }, new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
                BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++, block, { column_z: i, row_x: 1, level_y: 2 }, new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
            }
            BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++, block, { column_z: 1, row_x: i + 1, level_y: 1 }, new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
        }
        editorMain.createRenderLoop();
        //var sih = new ManipulationHelpers.SimpleInteractionHelper(scene);
        //showWorldAxis(50);
    },
    data: {
        scene: scene,
        inputLocation: inputLocation
    },
    computed: {},
    methods: {
        addContainer: function () {
            var con = BABYLON.EDITOR.SceneFactory.AddYardContainer(core, containerNo++, block, { column_z: inputLocation.column_z, row_x: inputLocation.row_x, level_y: inputLocation.level_y }, new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
        },
        arrange: function () {
            var yardContainers = core.currentScene.meshes.filter(function (f) { return f.name.indexOf('yardContainer') >= 0; });
            var nextPosition = { column_z: 1, row_x: 1, level_y: 1 };
            for (var _i = 0, yardContainers_1 = yardContainers; _i < yardContainers_1.length; _i++) {
                var yardContainer = yardContainers_1[_i];
                yardContainer.position.x = nextPosition.row_x * yardContainer.scaling.x - block._boundingInfo.maximum.x + nextPosition.row_x * multiplicationFactor / 4;
                yardContainer.position.y = (nextPosition.level_y - 1) * yardContainer.scaling.y + yardContainer.scaling.y / 2;
                yardContainer.position.z = nextPosition.column_z * yardContainer.scaling.z - block._boundingInfo.maximum.z + nextPosition.column_z * multiplicationFactor / 4;
            }
        },
        moveUp: function () {
            currentMesh.position.y -= currentMesh.getBoundingInfo().boundingBox.extendSize.y
                * currentMesh.scaling.y * 2;
        },
        moveDown: function () {
            currentMesh.position.y += currentMesh.getBoundingInfo().boundingBox.extendSize.y
                * currentMesh.scaling.y * 2;
        },
        moveLeft: function () {
            currentMesh.position.z -= currentMesh.getBoundingInfo().boundingBox.extendSize.z
                * currentMesh.scaling.z * 2;
        },
        moveRight: function () {
            currentMesh.position.z += currentMesh.getBoundingInfo().boundingBox.extendSize.z
                * currentMesh.scaling.z * 2;
        },
        moveForward: function () {
            currentMesh.position.x -= currentMesh.getBoundingInfo().boundingBox.extendSize.x
                * currentMesh.scaling.x * 2;
        },
        moveBackword: function () {
            currentMesh.position.x += currentMesh.getBoundingInfo().boundingBox.extendSize.x
                * currentMesh.scaling.x * 2;
        },
    },
});
//# sourceMappingURL=app.js.map