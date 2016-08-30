﻿var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var multiplicationFactor = 10;
var YARD;
(function (YARD) {
    var main = (function () {
        function main() {
            var containerNo = 1;
            var inputLocation = { column_z: 1, row_x: 1, level_y: 1, isEmpty: null };
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
            var selectedContainer;
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
            var light = BABYLON.EDITOR.SceneFactory.AddYardDirectionalLight(core);
            var block = new YARD.YARDBlock(core, 1, 20, 6, 9, 2);
            core.shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
            editorMain.transformer.transformerType = BABYLON.EDITOR.TransformerType.POSITION;
            var yardLocations = block.yardLocations;
            var vm = new Vue({
                el: '#divConsole',
                ready: function () {
                    //populate bummy containers
                    for (var i = 1; i < 9; i++) {
                        if (i <= 6) {
                            new YARD.YARDContainer(core, containerNo++, block, 20, yardLocations[i], new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
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
                            alert('a thing changed');
                        },
                        deep: false
                    }
                },
                computed: {},
                methods: {
                    addContainer: function () {
                        var yardLocation = yardLocations.filter(function (f) { return f.isEmpty == true && f.column_z == inputLocation.column_z && f.row_x == inputLocation.row_x && f.level_y == inputLocation.level_y; })[0];
                        if (yardLocation) {
                            var con = new YARD.YARDContainer(core, containerNo++, block, 20, yardLocation, new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
                        }
                        else {
                            alert('This location is already booked');
                        }
                    },
                    arrangeAll: function () {
                        for (var i = 0; i < block.containers.length; i++) {
                            var nextPosition = yardLocations[i];
                            nextPosition.isEmpty = false;
                            block.containers[i].yardLocation = nextPosition;
                        }
                    },
                    arrangeSelected: function () {
                        //setPositionInBlock(selectedContainer);
                    },
                    showGridLines: function (event) {
                        var par = scene.getMeshByName('gridParent');
                        if (par)
                            par.getChildMeshes().forEach(function (f) { return f.setEnabled(event.target.checked); });
                    },
                    moveUp: function () {
                        //selectedContainer.position.y -= selectedContainer.getBoundingInfo().boundingBox.extendSize.y
                        //    * selectedContainer.scaling.y * 2;
                    },
                    moveDown: function () {
                        //selectedContainer.position.y += selectedContainer.getBoundingInfo().boundingBox.extendSize.y
                        //    * selectedContainer.scaling.y * 2;
                    },
                    moveLeft: function () {
                        //selectedContainer.position.z -= selectedContainer.getBoundingInfo().boundingBox.extendSize.z
                        //    * selectedContainer.scaling.z * 2;
                    },
                    moveRight: function () {
                        //selectedContainer.position.z += selectedContainer.getBoundingInfo().boundingBox.extendSize.z
                        //    * selectedContainer.scaling.z * 2;
                    },
                    moveForward: function () {
                        //selectedContainer.position.x -= selectedContainer.getBoundingInfo().boundingBox.extendSize.x
                        //    * selectedContainer.scaling.x * 2;
                    },
                    moveBackword: function () {
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
        return main;
    }());
    YARD.main = main;
})(YARD || (YARD = {}));
var YARD;
(function (YARD) {
    var YARDBlock = (function () {
        //private _yardContainerSize: yardSizeVector;
        //get yardContainerSize(): yardSizeVector {
        //    return {
        //        width_z: this.size.width_z / this.capacity.column_z,
        //        length_x: this.size.length_x / this.capacity.row_x,
        //        height_y: this.size.height_y / this.capacity.level_y
        //    };
        //}
        //set yardContainerSize(theValue: yardSizeVector) {
        //    this._yardContainerSize = theValue;
        //};
        //get yardContainers(): yardContainer[] {
        //    return {
        //        };
        //}
        function YARDBlock(core, id, containerSize, columns, rows, levels) {
            var scene = core.scene;
            // Tiled Ground Tutorial
            // Part 1 : Creation of Tiled Ground
            // Parameters
            var xmin = -rows * 4; //8(width)/2=4
            var xmax = rows * 4;
            var zmin = -columns * containerSize / 2;
            var zmax = columns * containerSize / 2;
            var precision = {
                w: 2,
                h: 2
            };
            var subdivisions = {
                h: columns,
                w: rows
            };
            // Create the Tiled Ground
            var tiledGround = BABYLON.Mesh.CreateTiledGround("Tiled Ground", xmin, zmin, xmax, zmax, subdivisions, precision, scene);
            tiledGround.position.y = -1;
            // Part 2 : Create the multi material
            var groundMaterial = new BABYLON.StandardMaterial("ground", core.scene);
            groundMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.5, 0.4);
            groundMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.7);
            groundMaterial.emissiveColor = BABYLON.Color3.Black();
            // Create differents materials
            var whiteMaterial = new BABYLON.StandardMaterial("White", scene);
            whiteMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
            var blackMaterial = groundMaterial;
            // Create Multi Material
            var multimat = new BABYLON.MultiMaterial("multi", scene);
            multimat.subMaterials.push(whiteMaterial);
            multimat.subMaterials.push(blackMaterial);
            // Part 3 : Apply the multi material
            // Define multimat as material of the tiled ground
            tiledGround.material = multimat;
            // Needed variables to set subMeshes
            var verticesCount = tiledGround.getTotalVertices();
            var tileIndicesLength = tiledGround.getIndices().length / (subdivisions.w * subdivisions.h);
            // Set subMeshes of the tiled ground
            tiledGround.subMeshes = [];
            var base = 0;
            for (var row = 0; row < subdivisions.h; row++) {
                for (var col = 0; col < subdivisions.w; col++) {
                    tiledGround.subMeshes.push(new BABYLON.SubMesh(row % 2 ^ col % 2, 0, verticesCount, base, tileIndicesLength, tiledGround));
                    base += tileIndicesLength;
                }
            }
            tiledGround.receiveShadows = true;
            BABYLON.EDITOR.SceneFactory.ConfigureObject(tiledGround, core);
            //yardlocations
            this.yardLocations = [];
            for (var r = 1; r <= rows; r++)
                for (var c = 1; c <= columns; c++) {
                    for (var l = 1; l <= levels; l++) {
                        this.yardLocations.push({ column_z: c, row_x: r, level_y: l, isEmpty: true });
                    }
                }
            this.mesh = tiledGround;
            this.capacity = { column_z: columns, row_x: rows, level_y: levels, isEmpty: false };
            this.size = { length_z: zmax + (-zmin), width_x: xmax + (-xmin), height_y: 1 };
            this.containers = [];
        }
        return YARDBlock;
    }());
    YARD.YARDBlock = YARDBlock;
    var YARDContainer = (function () {
        function YARDContainer(core, id, block, size, yardLocation, color) {
            this.name = "yardContainer" + id;
            var yContainer = BABYLON.Mesh.CreateBox(this.name, 1, core.scene, false);
            yContainer.id = this.name;
            var containerMaterial = new BABYLON.StandardMaterial("containerMaterial", core.scene);
            containerMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            containerMaterial.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            containerMaterial.emissiveColor = color;
            yContainer.material = containerMaterial;
            core.shadowGenerator.getShadowMap().renderList.push(yContainer);
            BABYLON.EDITOR.SceneFactory.ConfigureObject(yContainer, core);
            //yardContainer.checkCollisions = true;
            //yContainer.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: multiplicationFactor, friction: 0.7, restitution: 0.5 });
            yContainer.scaling = new BABYLON.Vector3(8, 8.6, size);
            this.mesh = yContainer;
            this.block = block;
            block.containers.push(this);
            yardLocation.isEmpty = false;
            this.yardLocation = yardLocation;
        }
        Object.defineProperty(YARDContainer.prototype, "block", {
            get: function () {
                return this._block;
            },
            set: function (val) {
                this._block = val;
                this.mesh.parent = val.mesh;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(YARDContainer.prototype, "yardLocation", {
            get: function () {
                return this._yardLocation;
            },
            set: function (theValue) {
                this._yardLocation = theValue;
                var block = this.mesh.parent;
                this.mesh.position = new BABYLON.Vector3((theValue.row_x - 1 / 2) * this.mesh.scaling.x + block._boundingInfo.minimum.x, (theValue.level_y - 1) * this.mesh.scaling.y + this.mesh.scaling.y / 2, (theValue.column_z - 1 / 2) * this.mesh.scaling.z + block._boundingInfo.minimum.z);
            },
            enumerable: true,
            configurable: true
        });
        ;
        return YARDContainer;
    }());
    YARD.YARDContainer = YARDContainer;
})(YARD || (YARD = {}));
var blockGrid = function (block) {
    var scene = block.mesh.getScene();
    var i, strip, stripx, stripz, rsm, sm, parent, parmat;
    var gridwidth = block.size.length_z - multiplicationFactor; // must be increments of 10
    var griddepth = block.size.width_x - multiplicationFactor;
    var step_z = block.capacity.column_z * 2;
    var step_x = block.capacity.row_x * 2;
    var linewidth = 0.3;
    var ypos = 1;
    // make the red center square
    parent = BABYLON.Mesh.CreateGround("gridParent", 1, 1, 1, scene, true);
    parmat = new BABYLON.StandardMaterial("par_mat", scene);
    parmat.diffuseColor = new BABYLON.Color3(1, 0, 0);
    parmat.specularColor = new BABYLON.Color3(0, 0, 0);
    parmat.backFaceCulling = false;
    parent.material = parmat;
    parent.position.y = ypos;
    sm = new BABYLON.StandardMaterial("sm", scene);
    sm.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    // sm.diffuseColor = newcol();
    // sm.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    sm.specularColor = new BABYLON.Color3(0, 0, 0);
    sm.backFaceCulling = false;
    rsm = new BABYLON.StandardMaterial("rsm", scene);
    rsm.diffuseColor = new BABYLON.Color3(1, 0, 0);
    // rsm.diffuseColor = newcol();
    // rsm.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    rsm.specularColor = new BABYLON.Color3(0, 0, 0);
    rsm.backFaceCulling = false;
    // create a bunch of z lines.
    for (i = 0; i < gridwidth / step_z; i++) {
        strip = BABYLON.Mesh.CreateGround("sx", linewidth, griddepth, 1, scene);
        strip.parent = parent;
        // strip.position.y = ypos;
        strip.position.x = -(gridwidth / 2) + i * step_z;
        strip.material = sm;
    }
    // make and install the final red positive-z gridline
    strip = BABYLON.Mesh.CreateGround("sx", linewidth, griddepth, 1, scene);
    strip.parent = parent;
    // strip.position.y = ypos;
    strip.position.x = -(gridwidth / 2) + i * step_z;
    strip.material = rsm;
    // create a bunch of x lines.
    for (i = 0; i < griddepth / step_x; i++) {
        strip = BABYLON.Mesh.CreateGround("sz", gridwidth, linewidth, 1, scene);
        strip.parent = parent;
        // strip.position.y = ypos;
        strip.position.z = -(griddepth / 2) + i * step_x;
        strip.material = sm;
    }
    // make and install the final red positive-x gridline
    strip = BABYLON.Mesh.CreateGround("sz", gridwidth, linewidth, 1, scene);
    strip.parent = parent;
    // strip.position.y = ypos;
    strip.position.z = -(griddepth / 2) + i * step_x;
    strip.material = rsm;
    parent.getChildMeshes().forEach(function (f) { return f.setEnabled(false); });
    return parent;
};
// Displays the normal of a mesh
// usage example : showNormals(mesh, 6, BABYLON.Color3.Red(), scene);
//
// author : Jahow and Jerome
// tag : debug, demos
function showNormals(mesh, size, color, sc) {
    var normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
    var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    color = color || BABYLON.Color3.White();
    //sc = sc || scene;
    size = size || 1;
    var lines = [];
    for (var i = 0; i < normals.length; i += 3) {
        var v1 = BABYLON.Vector3.FromArray(positions, i);
        var v2 = v1.add(BABYLON.Vector3.FromArray(normals, i).scaleInPlace(size));
        lines.push([v1, v2]);
    }
    var normalLines = BABYLON.MeshBuilder.CreateLineSystem("normalLines", { lines: lines, updatable: false }, sc);
    normalLines.color = color;
    return normalLines;
}
/// <reference path="app.ts" />
/// <reference path="scripts/babylon.d.ts" />
// Displays World axis with red, green, blue arrows and X, Y, Z letters.
// usage example : showWorldAxis(20);
//
// author : jerome
// tag : debug, plotting, demos
function showWorldAxis(size, scene) {
    var makeTextPlane = function (text, color, size) {
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
        var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
        var pmat = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        pmat.backFaceCulling = false;
        pmat.specularColor = new BABYLON.Color3(1, 1, 1);
        pmat.diffuseTexture = dynamicTexture;
        pmat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        pmat.diffuseColor = color;
        plane.material = pmat;
        return plane;
    };
    var axisX = BABYLON.Mesh.CreateLines("axisX", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, 0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
    ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
    ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
}
;
var BABYLON;
(function (BABYLON) {
    var EDITOR;
    (function (EDITOR) {
        var EditorCore = (function () {
            /**
            * Constructor
            */
            function EditorCore() {
                // Public members
                this.engine = null;
                this.canvas = null;
                this.camera = null;
                this.playCamera = null;
                this.isPlaying = false;
                this.scenes = new Array();
                this.updates = new Array();
                this.eventReceivers = new Array();
                this.editor = null;
                this.shadowGenerator = null;
            }
            /**
            * Removes a scene
            */
            EditorCore.prototype.removeScene = function (scene) {
                for (var i = 0; i < this.scenes.length; i++) {
                    if (this.scenes[i].scene === scene) {
                        this.scenes.splice(i, 1);
                        return true;
                    }
                }
                return false;
            };
            /**
            * Removes an event receiver
            */
            EditorCore.prototype.removeEventReceiver = function (receiver) {
                for (var i = 0; i < this.eventReceivers.length; i++) {
                    if (this.eventReceivers[i] === receiver) {
                        this.eventReceivers.splice(i, 1);
                        return true;
                    }
                }
                return false;
            };
            /**
            * On pre update
            */
            EditorCore.prototype.onPreUpdate = function () {
                for (var i = 0; i < this.updates.length; i++) {
                    this.updates[i].onPreUpdate();
                }
            };
            /**
            * On post update
            */
            EditorCore.prototype.onPostUpdate = function () {
                for (var i = 0; i < this.updates.length; i++) {
                    this.updates[i].onPostUpdate();
                }
            };
            /**
            * Send an event to the event receivers
            */
            EditorCore.prototype.sendEvent = function (event) {
                for (var i = 0; i < this.eventReceivers.length; i++)
                    this.eventReceivers[i].onEvent(event);
            };
            /**
            * IDisposable
            */
            EditorCore.prototype.dispose = function () {
            };
            return EditorCore;
        }());
        EDITOR.EditorCore = EditorCore;
    })(EDITOR = BABYLON.EDITOR || (BABYLON.EDITOR = {}));
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    var EDITOR;
    (function (EDITOR) {
        var EditorMain = (function () {
            /**
            * Constructor
            */
            function EditorMain(containerID, antialias, options) {
                if (antialias === void 0) { antialias = false; }
                if (options === void 0) { options = null; }
                this.filesInput = null;
                this.renderMainScene = true;
                this.renderHelpers = true;
                // Initialize
                this.core = new EDITOR.EditorCore();
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
                this.transformer = new EDITOR.Transformer(this.core);
            }
            Object.defineProperty(EditorMain, "DummyNodeID", {
                // private members
                // Statics
                get: function () {
                    return "BABYLON-EDITOR-DUMMY-NODE";
                },
                enumerable: true,
                configurable: true
            });
            /**
            * Event receiver
            */
            EditorMain.prototype.onEvent = function (event) {
                if (event.eventType === EDITOR.EventType.GUI_EVENT) {
                    if (event.guiEvent.eventType === EDITOR.GUIEventType.LAYOUT_CHANGED) {
                        this.core.engine.resize();
                        return true;
                    }
                }
                return false;
            };
            /**
            * Creates the UI
            */
            EditorMain.prototype._createUI = function () {
            };
            /**
            * Handles just opened scenes
            */
            EditorMain.prototype._handleSceneLoaded = function () {
                var _this = this;
                return function (file, scene) {
                    // Set active scene
                    _this.core.removeScene(_this.core.scene);
                    _this.core.scenes.push({ scene: scene, render: true });
                    _this.core.scene = scene;
                    // Set active camera
                    var camera = scene.activeCamera;
                    _this._createBabylonCamera();
                    if (camera) {
                        if (camera.speed) {
                            _this.core.camera.speed = camera.speed;
                        }
                    }
                    _this.core.scene.activeCamera = _this.core.camera;
                    _this.core.playCamera = camera;
                    // Create render loop
                    _this.core.engine.stopRenderLoop();
                    _this.createRenderLoop();
                    // Create parent node
                    var parent = null;
                    // Configure meshes
                    for (var i = 0; i < scene.meshes.length; i++) {
                        EDITOR.SceneManager.ConfigureObject(scene.meshes[i], _this.core, parent);
                    }
                    EDITOR.SceneFactory.NodesToStart = [];
                };
            };
            /**
            * Creates the babylon engine
            */
            EditorMain.prototype._createBabylonEngine = function () {
                var _this = this;
                this.core.canvas = document.getElementById("BABYLON-EDITOR-MAIN-CANVAS");
                this.core.engine = new BABYLON.Engine(this.core.canvas, this.antialias, this.options);
                this.core.scene = new BABYLON.Scene(this.core.engine);
                this.core.scene.animations = [];
                this.core.scenes.push({ render: true, scene: this.core.scene });
                this._createBabylonCamera();
                window.addEventListener("resize", function (ev) {
                    if (_this.core.isPlaying) {
                        _this.core.isPlaying = false;
                    }
                    _this.core.engine.resize();
                });
            };
            /**
            * Creates the editor camera
            */
            EditorMain.prototype._createBabylonCamera = function () {
                //var camera = new ArcRotateCamera("EditorCamera", 0, 0, 10, Vector3.Zero(), this.core.currentScene);
                //camera.panningSensibility = 50;
                //camera.attachControl(this.core.canvas, false, false);
                var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, multiplicationFactor, new BABYLON.Vector3(0, 0, 0), this.core.scene);
                camera.lowerBetaLimit = 0.1;
                camera.upperBetaLimit = (Math.PI / 2) * 0.99;
                camera.lowerRadiusLimit = multiplicationFactor;
                camera.setPosition(new BABYLON.Vector3(multiplicationFactor * multiplicationFactor, multiplicationFactor * multiplicationFactor * 2, 0));
                this.core.camera = camera;
            };
            /**
            * Creates the render loop
            */
            EditorMain.prototype.createRenderLoop = function () {
                var _this = this;
                this.core.engine.runRenderLoop(function () {
                    _this.update();
                });
            };
            /**
            * Simply update the scenes and updates
            */
            EditorMain.prototype.update = function () {
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
            };
            // Disposes the editor
            EditorMain.prototype.dispose = function () {
            };
            return EditorMain;
        }());
        EDITOR.EditorMain = EditorMain;
    })(EDITOR = BABYLON.EDITOR || (BABYLON.EDITOR = {}));
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    var EDITOR;
    (function (EDITOR) {
        var SceneFactory = (function () {
            function SceneFactory() {
            }
            // Public members
            SceneFactory.GenerateUUID = function () {
                var s4 = function () {
                    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                };
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            };
            // Private members
            SceneFactory.ConfigureObject = function (object, core) {
                if (object instanceof BABYLON.AbstractMesh || object instanceof BABYLON.Scene)
                    EDITOR.SceneManager.ConfigureObject(object, core);
                BABYLON.Tags.EnableFor(object);
                BABYLON.Tags.AddTagsTo(object, "added");
                EDITOR.Event.sendSceneEvent(object, EDITOR.SceneEventType.OBJECT_ADDED, core);
            };
            /**
            * Post-Processes
            */
            // Creates HDR pipeline
            ////static CreateHDRPipeline(core: EditorCore, serializationObject: any = { }): HDRRenderingPipeline {
            ////    if (this.HDRPipeline) {
            ////        this.HDRPipeline.dispose();
            ////        this.HDRPipeline = null;
            ////    }
            ////    var cameras: Camera[] = core.currentScene.cameras;
            ////    var ratio: any = {
            ////        finalRatio: 1.0,
            ////        blurRatio: 0.25
            ////    };
            ////    var lensTexture: Texture;
            ////    if (serializationObject.lensTexture && serializationObject.lensTexture.name) {
            ////        lensTexture = <Texture>Texture.Parse(serializationObject.lensTexture, core.currentScene, "./");
            ////    }
            ////    else {
            ////        var b64LensTexutre = "data:image/jpeg;base64,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";
            ////        if (serializationObject.lensTexture && serializationObject.lensTexture.base64Name)
            ////            b64LensTexutre = serializationObject.lensTexture.base64Buffer;
            ////        lensTexture = BABYLON.Texture.CreateFromBase64String(b64LensTexutre, "lensdirt.jpg", core.currentScene);
            ////    }
            ////    lensTexture.name = lensTexture.name.replace("data:", "");
            ////    var hdr = new BABYLON.HDRRenderingPipeline("hdr", core.currentScene, ratio, null, cameras, lensTexture);
            ////    hdr.brightThreshold = serializationObject.brightThreshold || 1.0;
            ////    hdr.gaussCoeff = serializationObject.gaussCoeff || 0.4;
            ////    hdr.gaussMean = serializationObject.gaussMean || 0.0;
            ////    hdr.gaussStandDev = serializationObject.gaussStandDev || 9.0;
            ////    hdr.minimumLuminance = serializationObject.minimumLuminance || 0.5;
            ////    hdr.luminanceDecreaseRate = serializationObject.luminanceDecreaseRate || 0.5;
            ////    hdr.luminanceIncreaserate = serializationObject.luminanceIncreaserate || 0.5;
            ////    hdr.exposure = serializationObject.exposure || 1;
            ////    hdr.gaussMultiplier = serializationObject.gaussMultiplier || 4;
            ////    hdr.exposureAdjustment = serializationObject.exposureAdjustment || hdr.exposureAdjustment;
            ////    this.HDRPipeline = hdr;
            ////    return hdr;
            ////}
            // Creates SSAO pipeline
            SceneFactory.CreateSSAOPipeline = function (core, serializationObject) {
                if (serializationObject === void 0) { serializationObject = {}; }
                if (this.SSAOPipeline) {
                    this.SSAOPipeline.dispose();
                    this.SSAOPipeline = null;
                }
                var cameras = core.scene.cameras;
                var ssao = new BABYLON.SSAORenderingPipeline("ssao", core.scene, { ssaoRatio: 0.5, combineRatio: 1.0 }, cameras);
                ssao.fallOff = serializationObject.fallOff || ssao.fallOff;
                ssao.area = serializationObject.area || ssao.area;
                ssao.radius = serializationObject.radius || ssao.radius;
                ssao.totalStrength = serializationObject.totalStrength || ssao.totalStrength;
                ssao.base = serializationObject.base || ssao.base;
                this.SSAOPipeline = ssao;
                return ssao;
            };
            // Creates a Volumetric Light Scattering post-process
            SceneFactory.CreateVLSPostProcess = function (core, mesh, serializationObject) {
                if (mesh === void 0) { mesh = null; }
                if (serializationObject === void 0) { serializationObject = {}; }
                var vls = new BABYLON.VolumetricLightScatteringPostProcess("vls", { passRatio: 0.5, postProcessRatio: 1.0 }, core.camera, mesh, 100);
                if (mesh === null)
                    this.ConfigureObject(vls.mesh, core);
                for (var i = 0; i < core.scene.cameras.length; i++) {
                    if (core.scene.cameras[i] !== core.camera)
                        core.scene.cameras[i].attachPostProcess(vls);
                }
                return vls;
            };
            /**
            * Nodes
            */
            // Adds a point light
            SceneFactory.AddPointLight = function (core) {
                var light = new BABYLON.PointLight("New PointLight", new BABYLON.Vector3(10, 10, 10), core.scene);
                light.id = this.GenerateUUID();
                this.ConfigureObject(light, core);
                return light;
            };
            // Adds a directional light
            SceneFactory.AddDirectionalLight = function (core) {
                var light = new BABYLON.DirectionalLight("New DirectionalLight", new BABYLON.Vector3(-1, -2, -1), core.scene);
                light.position = new BABYLON.Vector3(10, 10, 10);
                light.id = this.GenerateUUID();
                this.ConfigureObject(light, core);
                return light;
            };
            // Adds a spot light
            SceneFactory.AddSpotLight = function (core) {
                var light = new BABYLON.SpotLight("New SpotLight", new BABYLON.Vector3(10, 10, 10), new BABYLON.Vector3(-1, -2, -1), 0.8, 2, core.scene);
                light.id = this.GenerateUUID();
                this.ConfigureObject(light, core);
                return light;
            };
            // Adds a hemispheric light
            SceneFactory.AddHemisphericLight = function (core) {
                var light = new BABYLON.HemisphericLight("New HemisphericLight", new BABYLON.Vector3(-1, -2, -1), core.scene);
                light.id = this.GenerateUUID();
                this.ConfigureObject(light, core);
                return light;
            };
            // Adds a box
            SceneFactory.AddBoxMesh = function (core) {
                var box = BABYLON.Mesh.CreateBox("New Box", 1.0, core.scene, false);
                box.id = this.GenerateUUID();
                this.ConfigureObject(box, core);
                return box;
            };
            // Adds a sphere
            SceneFactory.AddSphereMesh = function (core) {
                var sphere = BABYLON.Mesh.CreateSphere("New Sphere", 32, 1, core.scene, false);
                sphere.id = this.GenerateUUID();
                this.ConfigureObject(sphere, core);
                return sphere;
            };
            // Adds a plane
            SceneFactory.AddPlaneMesh = function (core) {
                var plane = BABYLON.Mesh.CreatePlane("New Plane", 1, core.scene, false);
                plane.id = this.GenerateUUID();
                this.ConfigureObject(plane, core);
                return plane;
            };
            // Adds a ground
            SceneFactory.AddGroundMesh = function (core) {
                var ground = BABYLON.Mesh.CreateGround("New Ground", 10, 10, 32, core.scene, false);
                ground.id = this.GenerateUUID();
                this.ConfigureObject(ground, core);
                return ground;
            };
            // Adds a height map
            SceneFactory.AddHeightMap = function (core) {
                var heightMap = BABYLON.Mesh.CreateGroundFromHeightMap("New Height Map", "", 10, 10, 32, 1, 1, core.scene, false);
                heightMap.id = this.GenerateUUID();
                this.ConfigureObject(heightMap, core);
                return heightMap;
            };
            // Adds a particle system
            ////static AddParticleSystem(core: EditorCore, chooseEmitter: boolean = true): void {
            ////    // Pick emitter
            ////    if (chooseEmitter) {
            ////        var picker = new ObjectPicker(core);
            ////        picker.objectLists.push(core.currentScene.meshes);
            ////        picker.objectLists.push(core.currentScene.lights);
            ////        picker.windowName = "Select an emitter ?";
            ////        picker.selectButtonName = "Add";
            ////        picker.closeButtonName = "Cancel";
            ////        picker.minSelectCount = 0;
            ////        picker.onObjectPicked = (names: string[]) => {
            ////            if (names.length > 1) {
            ////                var dialog = new GUI.GUIDialog("ParticleSystemDialog", core, "Warning",
            ////                    "A Particle System can be attached to only one mesh.\n" +
            ////                    "The first was considered as the mesh."
            ////                );
            ////                dialog.buildElement(null);
            ////            }
            ////            var ps = GUIParticleSystemEditor.CreateParticleSystem(core.currentScene, 1000);
            ////            core.currentScene.meshes.pop();
            ////            ps.emitter.id = this.GenerateUUID();
            ////            if (names.length > 0) {
            ////                var emitter = ps.emitter;
            ////                emitter.dispose(true);
            ////                ps.emitter = core.currentScene.getNodeByName(names[0]);
            ////                Event.sendSceneEvent(ps, SceneEventType.OBJECT_ADDED, core);
            ////            }
            ////            else {
            ////                core.currentScene.meshes.push(ps.emitter);
            ////                Event.sendSceneEvent(ps.emitter, SceneEventType.OBJECT_ADDED, core);
            ////                Event.sendSceneEvent(ps, SceneEventType.OBJECT_ADDED, core);
            ////            }
            ////            // To remove later, today particle systems can handle animations
            ////            ps.emitter.attachedParticleSystem = ps;
            ////        };
            ////        picker.onClosedPicker = () => {
            ////        };
            ////        picker.open();
            ////    }
            ////}
            // Adds a lens flare system
            ////static AddLensFlareSystem(core: EditorCore, chooseEmitter: boolean = true, emitter?: any): void {
            ////    // Pick emitter
            ////    if (chooseEmitter) {
            ////        var picker = new ObjectPicker(core);
            ////        picker.objectLists.push(core.currentScene.meshes);
            ////        picker.objectLists.push(core.currentScene.lights);
            ////        picker.minSelectCount = 1;
            ////        picker.windowName = "Select an emitter...";
            ////        picker.onObjectPicked = (names: string[]) => {
            ////            if (names.length > 1) {
            ////                var dialog = new GUI.GUIDialog("ReflectionProbeDialog", picker.core, "Warning",
            ////                    "A Lens Flare System can be attached to only one mesh.\n" +
            ////                    "The first was considered as the mesh."
            ////                );
            ////                dialog.buildElement(null);
            ////            }
            ////            var emitter = core.currentScene.getNodeByName(names[0]);
            ////            if (emitter) {
            ////                var system = new LensFlareSystem("New Lens Flare System", emitter, core.currentScene);
            ////                var flare0 = SceneFactory.AddLensFlare(core, system, 0.2, 0, new Color3(1, 1, 1));
            ////                var flare1 = SceneFactory.AddLensFlare(core, system, 0.5, 0.2, new Color3(0.5, 0.5, 1));
            ////                var flare2 = SceneFactory.AddLensFlare(core, system, 0.2, 1.0, new Color3(1, 1, 1));
            ////                var flare3 = SceneFactory.AddLensFlare(core, system, 0.4, 0.4, new Color3(1, 0.5, 1));
            ////                var flare4 = SceneFactory.AddLensFlare(core, system, 0.1, 0.6, new Color3(1, 1, 1));
            ////                var flare5 = SceneFactory.AddLensFlare(core, system, 0.3, 0.8, new Color3(1, 1, 1));
            ////            }
            ////            Event.sendSceneEvent(system, SceneEventType.OBJECT_ADDED, core);
            ////        };
            ////        picker.open();
            ////        return null;
            ////    }
            ////}
            // Adds a lens flare to the particle system
            SceneFactory.AddLensFlare = function (core, system, size, position, color) {
                var buffer = "data:image/png;base64,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";
                var texture = BABYLON.Texture.CreateFromBase64String(buffer, "lens.png", core.scene);
                texture.name = texture.name.replace("data:", "");
                var flare = new BABYLON.LensFlare(size, position, color, null, system);
                flare.texture = texture;
                return flare;
            };
            // Adds a reflection probe
            SceneFactory.AddReflectionProbe = function (core) {
                var rp = new BABYLON.ReflectionProbe("New Reflection Probe", 512, core.scene, true);
                this.ConfigureObject(rp, core);
                return rp;
            };
            // Adds a render target
            SceneFactory.AddRenderTargetTexture = function (core) {
                var rt = new BABYLON.RenderTargetTexture("New Render Target Texture", 512, core.scene, false);
                core.scene.customRenderTargets.push(rt);
                this.ConfigureObject(rt, core);
                return rt;
            };
            // Adds a skynode
            SceneFactory.AddSkyMesh = function (core) {
                var skyboxMaterial = new BABYLON.SkyMaterial("skyMaterial", core.scene);
                skyboxMaterial.backFaceCulling = false;
                var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, core.scene);
                skybox.id = this.GenerateUUID();
                skybox.material = skyboxMaterial;
                this.ConfigureObject(skybox, core);
                return skybox;
            };
            // Adds a water mesh (with water material)
            ////static AddWaterMesh(core: EditorCore): Mesh {
            ////    var waterMaterial = new WaterMaterial("waterMaterail", core.currentScene);
            ////    var water = WaterMaterial.CreateDefaultMesh("waterMesh", core.currentScene);
            ////    water.id = this.GenerateUUID();
            ////    water.material = waterMaterial;
            ////    this.ConfigureObject(water, core);
            ////    // Add meshes in reflection automatically
            ////    for (var i = 0; i < core.currentScene.meshes.length - 1; i++) {
            ////        waterMaterial.addToRenderList(core.currentScene.meshes[i]);
            ////    }
            ////    return water;
            ////}
            //static AddYardContainer(core: EditorCore, id, block: YARD.YARDBlock, size: number, yardLocation: YARDLocationVector, color: Color3): Mesh {
            //    var yContainer = Mesh.CreateBox("yardContainer" + id, 1, core.scene, false);
            //    yContainer.id = "yardContainer" + id;
            //    //yContainer.parent = block;
            //    yContainer.scaling = new Vector3(8, 8.6, size);
            //    //yContainer.set_yardLocation(yardLocation);
            //    //yardContainer.position = new Vector3(
            //    //    (location.row_x - 1 / 2) * yardContainer.scaling.x + yardContainer.parent._boundingInfo.minimum.x,
            //    //    yardContainer.scaling.y / 2,
            //    //    (location.column_z - 1 / 2) * yardContainer.scaling.z + block._boundingInfo.minimum.z);
            //    var containerMaterial = new StandardMaterial("containerMaterial", core.scene);
            //    containerMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            //    containerMaterial.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            //    containerMaterial.emissiveColor = color;
            //    yContainer.material = containerMaterial;
            //    core.shadowGenerator.getShadowMap().renderList.push(yContainer);
            //    this.ConfigureObject(yContainer, core);
            //    //yardContainer.checkCollisions = true;
            //    yContainer.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: multiplicationFactor, friction: 0.7, restitution: 0.5 });
            //    yardLocation.isEmpty = false;
            //    return yContainer;
            //}
            //static AddYardBlockGroundMesh(core: EditorCore, id, containerSize, columns, rows, levels): YARD.YARDBlock {
            //    var scene = core.scene;
            //    // Tiled Ground Tutorial
            //    // Part 1 : Creation of Tiled Ground
            //    // Parameters
            //    var xmin = -rows * 4; //8(width)/2=4
            //    var xmax = rows * 4;
            //    var zmin = -columns * containerSize / 2;
            //    var zmax = columns * containerSize / 2;
            //    var precision = {
            //        w: 2,
            //        h: 2
            //    };
            //    var subdivisions = {
            //        h: columns,
            //        w: rows
            //    };
            //    // Create the Tiled Ground
            //    var tiledGround = BABYLON.Mesh.CreateTiledGround("Tiled Ground", xmin, zmin, xmax, zmax, subdivisions, precision, scene);
            //    tiledGround.position.y = -1
            //    ///tiledGround.capacity = { column_z: columns, row_x: rows, level_y: levels, isEmpty: false };
            //    ///tiledGround.size = { length_z: zmax + (- zmin), width_x: xmax + (- xmin), height_y: 1 };
            //    // Part 2 : Create the multi material
            //    var groundMaterial = new BABYLON.StandardMaterial("ground", core.scene);
            //    groundMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.5, 0.4);
            //    groundMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.7);
            //    groundMaterial.emissiveColor = BABYLON.Color3.Black();
            //    // Create differents materials
            //    var whiteMaterial = new BABYLON.StandardMaterial("White", scene);
            //    whiteMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
            //    var blackMaterial = groundMaterial;
            //    // Create Multi Material
            //    var multimat = new BABYLON.MultiMaterial("multi", scene);
            //    multimat.subMaterials.push(whiteMaterial);
            //    multimat.subMaterials.push(blackMaterial);
            //    // Part 3 : Apply the multi material
            //    // Define multimat as material of the tiled ground
            //    tiledGround.material = multimat;
            //    // Needed variables to set subMeshes
            //    var verticesCount = tiledGround.getTotalVertices();
            //    var tileIndicesLength = tiledGround.getIndices().length / (subdivisions.w * subdivisions.h);
            //    // Set subMeshes of the tiled ground
            //    tiledGround.subMeshes = [];
            //    var base = 0;
            //    for (var row = 0; row < subdivisions.h; row++) {
            //        for (var col = 0; col < subdivisions.w; col++) {
            //            tiledGround.subMeshes.push(new BABYLON.SubMesh(row % 2 ^ col % 2, 0, verticesCount, base, tileIndicesLength, tiledGround));
            //            base += tileIndicesLength;
            //        }
            //    }
            //    tiledGround.receiveShadows = true;
            //    this.ConfigureObject(tiledGround, core);
            //    //////yardlocations
            //    ////tiledGround.yardLocations = [];
            //    ////for (var r = 1; r <= rows; r++)
            //    ////    for (var c = 1; c <= columns; c++) {
            //    ////        for (var l = 1; l <= levels; l++) {
            //    ////            tiledGround.yardLocations.push({ column_z: c, row_x: r, level_y: l, isEmpty: true });
            //    ////        }
            //    ////        ////slots
            //    ////        //var containerSlot = Mesh.CreateBox("containerSlot" + id, 1, core.currentScene, false);
            //    ////        //containerSlot.parent = tiledGround;
            //    ////        //containerSlot.scaling = new Vector3(8, 8.6, containerSize);
            //    ////        //containerSlot.position = new Vector3(
            //    ////        //    (r - 1 / 2) * containerSlot.scaling.x + xmin,
            //    ////        //    containerSlot.scaling.y / 2,
            //    ////        //    (c - 1 / 2) * containerSlot.scaling.z + zmin);
            //    ////        //var containerMaterial = new StandardMaterial("containerMaterial", core.currentScene);
            //    ////        //containerMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            //    ////        //containerMaterial.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            //    ////        //containerMaterial.emissiveColor = new BABYLON.Color3(1, 0.4, 0.4);
            //    ////        //var outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
            //    ////        //outputplaneTexture.hasAlpha = true;
            //    ////        //containerMaterial.diffuseTexture = outputplaneTexture;
            //    ////        //containerMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            //    ////        //containerMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
            //    ////        //containerSlot.material = containerMaterial;
            //    ////        //containerSlot.showBoundingBox = true;
            //    ////    }
            //    return tiledGround;
            //}
            SceneFactory.AddYardSkyMesh = function (core) {
                var skyboxMaterial = new BABYLON.SkyMaterial("skyMaterial", core.scene);
                skyboxMaterial.backFaceCulling = false;
                var skybox = BABYLON.Mesh.CreateSphere("skyBox", 3, 10 * multiplicationFactor, core.scene);
                skybox.id = this.GenerateUUID();
                skybox.material = skyboxMaterial;
                return skybox;
            };
            SceneFactory.AddYardDirectionalLight = function (core) {
                var light = new BABYLON.DirectionalLight("New DirectionalLight", new BABYLON.Vector3(1, -1, -1), core.scene);
                light.position = new BABYLON.Vector3(10 * multiplicationFactor, 10 * multiplicationFactor, 10 * multiplicationFactor);
                return light;
            };
            // Public members
            SceneFactory.HDRPipeline = null;
            SceneFactory.SSAOPipeline = null;
            SceneFactory.VLSPostProcess = null;
            SceneFactory.EnabledPostProcesses = {
                hdr: false,
                attachHDR: true,
                ssao: false,
                ssaoOnly: false,
                attachSSAO: true,
                vls: false
            };
            SceneFactory.NodesToStart = [];
            SceneFactory.AnimationSpeed = 1.0;
            return SceneFactory;
        }());
        EDITOR.SceneFactory = SceneFactory;
    })(EDITOR = BABYLON.EDITOR || (BABYLON.EDITOR = {}));
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    var EDITOR;
    (function (EDITOR) {
        var SceneManager = (function () {
            function SceneManager() {
            }
            // Reset configured objects
            SceneManager.ResetConfiguredObjects = function () {
                this._alreadyConfiguredObjectsIDs = {};
            };
            // Switch action manager (editor and scene itself)
            SceneManager.SwitchActionManager = function () {
                for (var thing in this._alreadyConfiguredObjectsIDs) {
                    var obj = this._alreadyConfiguredObjectsIDs[thing];
                    var actionManager = obj.mesh.actionManager;
                    obj.mesh.actionManager = obj.actionManager;
                    obj.actionManager = actionManager;
                }
            };
            // Configures and object
            SceneManager.ConfigureObject = function (object, core, parentNode) {
                var _this = this;
                if (object instanceof BABYLON.AbstractMesh) {
                    var mesh = object;
                    var scene = mesh.getScene();
                    /*
                    if (this._alreadyConfiguredObjectsIDs[mesh.id])
                        return;
                    */
                    if (mesh instanceof BABYLON.Mesh && !mesh.geometry)
                        return;
                    this._alreadyConfiguredObjectsIDs[mesh.id] = {
                        mesh: mesh,
                        actionManager: mesh.actionManager
                    };
                    // Configure mesh
                    mesh.actionManager = new BABYLON.ActionManager(scene);
                    mesh.isPickable = true;
                    // Pointer over / out
                    mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "showBoundingBox", true));
                    mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "showBoundingBox", false));
                    // Pointer click
                    var mouseX = scene.pointerX;
                    var mouseY = scene.pointerY;
                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (evt) {
                        mouseX = scene.pointerX;
                        mouseY = scene.pointerY;
                    }));
                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function (evt) {
                        if (scene.pointerX === mouseX && scene.pointerY === mouseY) {
                            EDITOR.Event.sendSceneEvent(mesh, EDITOR.SceneEventType.OBJECT_PICKED, core);
                            ///currentMesh = mesh;
                            _this.setFocusOnObject(mesh, core);
                        }
                    }));
                    if (parentNode && !mesh.parent) {
                        mesh.parent = parentNode;
                    }
                }
                // Send event configured
                ////var ev = new Event();
                ////ev.eventType = EventType.SCENE_EVENT;
                ////ev.sceneEvent = new SceneEvent(object, BABYLON.EDITOR.SceneEventType.OBJECT_PICKED);
                ////core.sendEvent(ev);
            };
            // Sets the focus of the camera
            SceneManager.setFocusOnObject = function (object, core) {
                if (!object || !object.position)
                    return;
                var scene = core.currentScene;
                var camera = core.camera;
                var position = object.position;
                if (object.getAbsolutePosition)
                    position = object.getAbsolutePosition();
                if (object.getBoundingInfo)
                    position = object.getBoundingInfo().boundingSphere.centerWorld;
                var keys = [
                    {
                        frame: 0,
                        value: camera.target
                    }, {
                        frame: 1,
                        value: position
                    }
                ];
                var animation = new BABYLON.Animation("FocusOnObjectAnimation", "target", 10, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                animation.setKeys(keys);
                scene.stopAnimation(camera);
                scene.beginDirectAnimation(camera, [animation], 0, 1, false, 1);
            };
            // Public members
            /**
            * Objects configuration
            */
            SceneManager._alreadyConfiguredObjectsIDs = {};
            return SceneManager;
        }());
        EDITOR.SceneManager = SceneManager;
    })(EDITOR = BABYLON.EDITOR || (BABYLON.EDITOR = {}));
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    var EDITOR;
    (function (EDITOR) {
        (function (TransformerType) {
            TransformerType[TransformerType["POSITION"] = 0] = "POSITION";
            TransformerType[TransformerType["ROTATION"] = 1] = "ROTATION";
            TransformerType[TransformerType["SCALING"] = 2] = "SCALING";
            TransformerType[TransformerType["NOTHING"] = 3] = "NOTHING";
        })(EDITOR.TransformerType || (EDITOR.TransformerType = {}));
        var TransformerType = EDITOR.TransformerType;
        var Transformer = (function () {
            /**
            * Constructor
            * @param core: the editor core instance
            */
            function Transformer(core) {
                var _this = this;
                // Public members
                this.core = null;
                // Private members
                this._scene = null;
                this._node = null;
                this._helperPlane = null;
                this._planeMaterial = null;
                this._subMesh = null;
                this._batch = null;
                this._cameraTexture = null;
                this._soundTexture = null;
                this._lightTexture = null;
                this._transformerType = TransformerType.POSITION;
                this._xTransformers = new Array();
                this._yTransformers = new Array();
                this._zTransformers = new Array();
                this._sharedScale = BABYLON.Vector3.Zero();
                this._pickingPlane = BABYLON.Plane.FromPositionAndNormal(BABYLON.Vector3.Zero(), BABYLON.Vector3.Up());
                this._mousePosition = BABYLON.Vector3.Zero();
                this._mouseDown = false;
                this._pickPosition = true;
                this._pickingInfo = null;
                this._vectorToModify = null;
                this._selectedTransform = "";
                this._distance = 0;
                this._multiplier = 20;
                this._ctrlIsDown = false;
                //Initialize
                this.core = core;
                core.eventReceivers.push(this);
                core.updates.push(this);
                // Create scene
                this._scene = new BABYLON.Scene(core.engine);
                this._scene.autoClear = false;
                this._scene.postProcessesEnabled = false;
                // Create events
                core.canvas.addEventListener("mousedown", function (ev) {
                    _this._mouseDown = true;
                });
                core.canvas.addEventListener("mouseup", function (ev) {
                    _this._mouseDown = false;
                    _this._pickPosition = true;
                    if (_this._pickingInfo) {
                        var material = _this._pickingInfo.pickedMesh.material;
                        material.emissiveColor = material.emissiveColor.multiply(new BABYLON.Color3(1.5, 1.5, 1.5));
                    }
                    _this._pickingInfo = null;
                    core.scene.activeCamera.attachControl(core.canvas);
                    if (_this._node)
                        EDITOR.Event.sendSceneEvent(_this._node, EDITOR.SceneEventType.OBJECT_CHANGED, core);
                });
                $(window).keydown(function (event) {
                    if (event.ctrlKey && _this._ctrlIsDown === false) {
                        _this._multiplier = 1;
                        _this._ctrlIsDown = true;
                        _this._pickPosition = true;
                    }
                });
                $(window).keyup(function (event) {
                    if (!event.ctrlKey && _this._ctrlIsDown === true) {
                        _this._multiplier = 10;
                        _this._ctrlIsDown = false;
                        _this._pickPosition = true;
                    }
                });
                // Create Transformers
                this._createTransformers();
                // Helper
                this.createHelpers(core);
            }
            // Create helpers
            Transformer.prototype.createHelpers = function (core) {
                this._planeMaterial = new BABYLON.StandardMaterial("HelperPlaneMaterial", this._scene);
                this._planeMaterial.emissiveColor = BABYLON.Color3.White();
                this._planeMaterial.useAlphaFromDiffuseTexture = true;
                this._planeMaterial.disableDepthWrite = false;
                this._scene.materials.pop();
                //this._cameraTexture = new Texture("../css/images/camera.png", this._scene);
                //this._cameraTexture.hasAlpha = true;
                //this._scene.textures.pop();
                //this._soundTexture = new Texture("../css/images/sound.png", this._scene);
                //this._soundTexture.hasAlpha = true;
                //this._scene.textures.pop();
                //this._lightTexture = new Texture("../css/images/light.png", this._scene);
                //this._lightTexture.hasAlpha = true;
                //this._scene.textures.pop();
                this._helperPlane = BABYLON.Mesh.CreatePlane("HelperPlane", 1, this._scene, false);
                this._helperPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
                this._scene.meshes.pop();
                this._helperPlane.material = this._planeMaterial;
            };
            // Event receiver
            Transformer.prototype.onEvent = function (event) {
                if (event.eventType === EDITOR.EventType.SCENE_EVENT) {
                    if (event.sceneEvent.eventType === EDITOR.SceneEventType.OBJECT_REMOVED) {
                        if (event.sceneEvent.data === this._node) {
                            this._node = null;
                            return false;
                        }
                    }
                    else if (event.sceneEvent.eventType === EDITOR.SceneEventType.OBJECT_PICKED) {
                        if (event.sceneEvent.object)
                            this._node = event.sceneEvent.object;
                        else
                            this._node = null;
                        return false;
                    }
                }
                return false;
            };
            // On pre update
            Transformer.prototype.onPreUpdate = function () {
                // Update camera
                this._scene.activeCamera = this.core.scene.activeCamera;
                // Compute node
                var node = this._node;
                if (!node)
                    return;
                // Set transformer scale
                var distance = 0;
                if (!this.core.isPlaying) {
                    distance = BABYLON.Vector3.Distance(this._scene.activeCamera.position, this._xTransformers[0].position) * 0.03;
                }
                var scale = new BABYLON.Vector3(distance, distance, distance).divide(new BABYLON.Vector3(3, 3, 3));
                this._sharedScale.x = scale.x;
                this._sharedScale.y = scale.y;
                this._sharedScale.z = scale.z;
                this._distance = distance;
                // Update transformer (position is particular)
                var position = this._getNodePosition();
                if (!position)
                    return;
                this._xTransformers[0].position.copyFrom(position);
                this._yTransformers[0].position.copyFrom(this._xTransformers[0].position);
                this._zTransformers[0].position.copyFrom(this._xTransformers[0].position);
                this._yTransformers[0].position.y += distance * 1.3;
                this._zTransformers[0].position.z += distance * 1.3;
                this._xTransformers[0].position.x += distance * 1.3;
                this._xTransformers[1].position.copyFrom(position);
                this._yTransformers[1].position.copyFrom(position);
                this._zTransformers[1].position.copyFrom(position);
                this._xTransformers[2].position.copyFrom(this._xTransformers[0].position);
                this._yTransformers[2].position.copyFrom(this._yTransformers[0].position);
                this._zTransformers[2].position.copyFrom(this._zTransformers[0].position);
                // Finish Transformer
                if (this._mouseDown)
                    this._updateTransform(distance);
            };
            // On post update
            Transformer.prototype.onPostUpdate = function () {
                //this._helperPlane.setEnabled(!this.core.isPlaying && this.core.editor.renderHelpers);
                var _this = this;
                if ((this.core.isPlaying && this.core.scene.activeCamera !== this.core.camera) || !this.core.editor.renderHelpers)
                    return;
                var engine = this._scene.getEngine();
                engine.setAlphaTesting(true);
                if (this._planeMaterial.isReady(this._helperPlane)) {
                    this._subMesh = this._helperPlane.subMeshes[0];
                    var effect = this._planeMaterial.getEffect();
                    this._batch = this._helperPlane._getInstancesRenderList(this._subMesh._id);
                    engine.enableEffect(effect);
                    this._helperPlane._bind(this._subMesh, effect, BABYLON.Material.TriangleFillMode);
                    // Cameras
                    this._planeMaterial.diffuseTexture = this._cameraTexture;
                    this._renderHelperPlane(this.core.scene.cameras, function (obj) {
                        if (obj === _this.core.scene.activeCamera)
                            return false;
                        _this._helperPlane.position.copyFrom(obj.position);
                        return true;
                    });
                    // Sounds
                    this._planeMaterial.diffuseTexture = this._soundTexture;
                    for (var i = 0; i < this.core.scene.soundTracks.length; i++) {
                        var soundTrack = this.core.scene.soundTracks[i];
                        this._renderHelperPlane(soundTrack.soundCollection, function (obj) {
                            if (!obj.spatialSound)
                                return false;
                            _this._helperPlane.position.copyFrom(obj._position);
                            return true;
                        });
                    }
                    // Lights
                    this._planeMaterial.diffuseTexture = this._lightTexture;
                    this._renderHelperPlane(this.core.scene.lights, function (obj) {
                        if (!obj.getAbsolutePosition)
                            return false;
                        _this._helperPlane.position.copyFrom(obj.getAbsolutePosition());
                        return true;
                    });
                }
            };
            Object.defineProperty(Transformer.prototype, "transformerType", {
                // Get transformer type (POSITION, ROTATION or SCALING)
                get: function () {
                    return this._transformerType;
                },
                // Set transformer type
                set: function (type) {
                    this._transformerType = type;
                    // Hide all
                    for (var i = 0; i < TransformerType.NOTHING; i++) {
                        this._xTransformers[i].setEnabled(false);
                        this._yTransformers[i].setEnabled(false);
                        this._zTransformers[i].setEnabled(false);
                    }
                    if (type !== TransformerType.NOTHING) {
                        this._xTransformers[type].setEnabled(true);
                        this._yTransformers[type].setEnabled(true);
                        this._zTransformers[type].setEnabled(true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Transformer.prototype, "node", {
                // Get the node to transform
                get: function () {
                    return this._node;
                },
                // Set node to transform
                set: function (node) {
                    this._node = node;
                },
                enumerable: true,
                configurable: true
            });
            // Returns the scene
            Transformer.prototype.getScene = function () {
                return this._scene;
            };
            // Returns the node position
            Transformer.prototype._getNodePosition = function () {
                var node = this._node;
                var position = null;
                //if (node.getBoundingInfo && node.geometry) {
                //    position = node.getBoundingInfo().boundingSphere.centerWorld;
                //}
                //else 
                if (node._position) {
                    position = node._position;
                }
                else if (node.position) {
                    position = node.position;
                }
                return position;
            };
            // Render planes
            Transformer.prototype._renderHelperPlane = function (array, onConfigure) {
                var effect = this._planeMaterial.getEffect();
                for (var i = 0; i < array.length; i++) {
                    var obj = array[i];
                    if (!onConfigure(obj))
                        continue;
                    var distance = BABYLON.Vector3.Distance(this.core.scene.activeCamera.position, this._helperPlane.position) * 0.03;
                    this._helperPlane.scaling = new BABYLON.Vector3(distance, distance, distance),
                        this._helperPlane.computeWorldMatrix(true);
                    this._scene._cachedMaterial = null;
                    this._planeMaterial.bind(this._helperPlane.getWorldMatrix(), this._helperPlane);
                    this._helperPlane._processRendering(this._subMesh, effect, BABYLON.Material.TriangleFillMode, this._batch, false, function (isInstance, world) {
                        effect.setMatrix("world", world);
                    });
                }
            };
            // Updates the transformer (picking + manage movements)
            Transformer.prototype._updateTransform = function (distance) {
                if (this._pickingInfo === null) {
                    // Pick
                    var pickInfo = this._scene.pick(this._scene.pointerX, this._scene.pointerY);
                    if (!pickInfo.hit && this._pickingInfo === null)
                        return;
                    if (pickInfo.hit && this._pickingInfo === null)
                        this._pickingInfo = pickInfo;
                }
                var mesh = this._pickingInfo.pickedMesh.parent || this._pickingInfo.pickedMesh;
                var node = this._node;
                var position = this._getNodePosition();
                if (this._pickPosition) {
                    ///currentMesh = mesh;
                    // Setup planes
                    if (this._xTransformers.indexOf(mesh) !== -1) {
                        this._pickingPlane = BABYLON.Plane.FromPositionAndNormal(position, new BABYLON.Vector3(0, 0, -1));
                        this._selectedTransform = "x";
                    }
                    else if (this._yTransformers.indexOf(mesh) !== -1) {
                        this._pickingPlane = BABYLON.Plane.FromPositionAndNormal(position, new BABYLON.Vector3(-1, 0, 0));
                        this._selectedTransform = "y";
                    }
                    else if (this._zTransformers.indexOf(mesh) !== -1) {
                        this._pickingPlane = BABYLON.Plane.FromPositionAndNormal(position, new BABYLON.Vector3(0, -1, 0));
                        this._selectedTransform = "z";
                    }
                    this.core.scene.activeCamera.detachControl(this.core.canvas);
                    if (this._findMousePositionInPlane(this._pickingInfo)) {
                        this._mousePosition.copyFrom(this._mousePositionInPlane);
                        if (this._transformerType === TransformerType.POSITION) {
                            this._mousePosition = this._mousePosition.subtract(position);
                            this._vectorToModify = this._getNodePosition();
                        }
                        else if (this._transformerType === TransformerType.SCALING && node.scaling) {
                            this._mousePosition = this._mousePosition.subtract(node.scaling);
                            this._vectorToModify = node.scaling;
                        }
                        else if (this._transformerType === TransformerType.ROTATION && (node.rotation || node.direction)) {
                            this._vectorToModify = node.direction || node.rotation;
                            this._mousePosition = this._mousePosition.subtract(this._vectorToModify);
                        }
                        else {
                            this._vectorToModify = null;
                        }
                        // TODO
                        // Change transformer color...
                        mesh.material.emissiveColor = mesh.material.emissiveColor.multiply(new BABYLON.Color3(0.5, 0.5, 0.5));
                        this._pickPosition = false;
                    }
                }
                // Now, time to update
                if (!this._vectorToModify)
                    return;
                if (this._findMousePositionInPlane(this._pickingInfo)) {
                    if (this._selectedTransform === "x") {
                        this._vectorToModify.x = (this._mousePositionInPlane.x - this._mousePosition.x);
                    }
                    else if (this._selectedTransform === "y") {
                        var ydiff = this._mousePositionInPlane.y - this._mousePosition.y;
                        this._vectorToModify.y = ydiff > multiplicationFactor / 2 ? ydiff : multiplicationFactor / 2;
                    }
                    else if (this._selectedTransform === "z") {
                        this._vectorToModify.z = (this._mousePositionInPlane.z - this._mousePosition.z);
                    }
                    if (this._node instanceof BABYLON.Sound) {
                        this._node.setPosition(this._vectorToModify);
                    }
                }
            };
            // Returns if the ray intersects the transformer plane
            Transformer.prototype._getIntersectionWithLine = function (linePoint, lineVect) {
                var t2 = BABYLON.Vector3.Dot(this._pickingPlane.normal, lineVect);
                if (t2 === 0)
                    return false;
                var t = -(BABYLON.Vector3.Dot(this._pickingPlane.normal, linePoint) + this._pickingPlane.d) / t2;
                this._mousePositionInPlane = linePoint.add(lineVect).multiplyByFloats(this._multiplier, this._multiplier, this._multiplier);
                return true;
            };
            // Fins the mouse position in plane
            Transformer.prototype._findMousePositionInPlane = function (pickingInfos) {
                var ray = this._scene.createPickingRay(this._scene.pointerX, this._scene.pointerY, BABYLON.Matrix.Identity(), this._scene.activeCamera);
                if (this._getIntersectionWithLine(ray.origin, ray.direction))
                    return true;
                return false;
            };
            // Create transformers
            Transformer.prototype._createTransformers = function () {
                var colors = [
                    new BABYLON.Color3(1, 0.5, 0.5),
                    new BABYLON.Color3(0.5, 1, 0.5),
                    new BABYLON.Color3(0.5, 0.5, 1)
                ];
                var x = null;
                var y = null;
                var z = null;
                // Position
                x = this._createPositionTransformer(colors[0], TransformerType.POSITION);
                y = this._createPositionTransformer(colors[1], TransformerType.POSITION);
                z = this._createPositionTransformer(colors[2], TransformerType.POSITION);
                z.rotation.x = (Math.PI / 2.0);
                x.rotation.z = -(Math.PI / 2.0);
                this._xTransformers.push(x);
                this._yTransformers.push(y);
                this._zTransformers.push(z);
                // Rotation
                x = this._createRotationTransformer(colors[0], TransformerType.ROTATION);
                y = this._createRotationTransformer(colors[1], TransformerType.ROTATION);
                z = this._createRotationTransformer(colors[2], TransformerType.ROTATION);
                z.rotation.x = (Math.PI / 2.0);
                x.rotation.z = -(Math.PI / 2.0);
                this._xTransformers.push(x);
                this._yTransformers.push(y);
                this._zTransformers.push(z);
                // Scaling
                x = this._createScalingTransformer(colors[0], TransformerType.SCALING);
                y = this._createScalingTransformer(colors[1], TransformerType.SCALING);
                z = this._createScalingTransformer(colors[2], TransformerType.SCALING);
                z.rotation.x = (Math.PI / 2.0);
                x.rotation.z = -(Math.PI / 2.0);
                this._xTransformers.push(x);
                this._yTransformers.push(y);
                this._zTransformers.push(z);
                // Finish
                for (var i = 0; i < TransformerType.NOTHING; i++) {
                    this._xTransformers[i].setEnabled(false);
                    this._yTransformers[i].setEnabled(false);
                    this._zTransformers[i].setEnabled(false);
                }
            };
            // Create position transformer
            Transformer.prototype._createPositionTransformer = function (color, id) {
                var mesh = BABYLON.Mesh.CreateCylinder("PositionTransformer" + id, 8, 0.4, 0.4, 8, 1, this._scene, true);
                mesh.scaling = this._sharedScale;
                mesh.isPickable = true;
                var mesh2 = BABYLON.Mesh.CreateCylinder("PositionTransformerCross" + id, 2, 0, 3, 8, 1, this._scene, true);
                mesh2.isPickable = true;
                mesh2.parent = mesh;
                mesh2.scaling = new BABYLON.Vector3(1.3, 1.3, 1.3);
                mesh2.position.y = 5;
                var material = new BABYLON.StandardMaterial("PositionTransformerMaterial" + id, this._scene);
                material.emissiveColor = color;
                mesh.material = material;
                mesh2.material = material;
                return mesh;
            };
            // Create rotation transformer
            Transformer.prototype._createRotationTransformer = function (color, id) {
                var mesh = BABYLON.Mesh.CreateTorus("RotationTransformer" + id, 20, 0.75, 35, this._scene, true);
                mesh.scaling = this._sharedScale;
                var material = new BABYLON.StandardMaterial("RotationTransformerMaterial" + id, this._scene);
                material.emissiveColor = color;
                mesh.material = material;
                return mesh;
            };
            // Create scale transformer
            Transformer.prototype._createScalingTransformer = function (color, id) {
                var mesh = BABYLON.Mesh.CreateCylinder("ScalingTransformer" + id, 8, 0.4, 0.4, 8, 1, this._scene, true);
                mesh.scaling = this._sharedScale;
                mesh.isPickable = true;
                var mesh2 = BABYLON.Mesh.CreateBox("ScalingTransformerBox" + id, 2, this._scene, true);
                mesh.isPickable = true;
                mesh2.parent = mesh;
                mesh2.position.y = 5;
                var material = new BABYLON.StandardMaterial("ScalingTransformerMaterial" + id, this._scene);
                material.emissiveColor = color;
                mesh.material = material;
                mesh2.material = material;
                return mesh;
            };
            return Transformer;
        }());
        EDITOR.Transformer = Transformer;
    })(EDITOR = BABYLON.EDITOR || (BABYLON.EDITOR = {}));
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    var EDITOR;
    (function (EDITOR) {
        /**
        * Event Type
        */
        (function (EventType) {
            EventType[EventType["SCENE_EVENT"] = 0] = "SCENE_EVENT";
            EventType[EventType["GUI_EVENT"] = 1] = "GUI_EVENT";
            EventType[EventType["UNKNOWN"] = 2] = "UNKNOWN";
        })(EDITOR.EventType || (EDITOR.EventType = {}));
        var EventType = EDITOR.EventType;
        (function (GUIEventType) {
            GUIEventType[GUIEventType["FORM_CHANGED"] = 0] = "FORM_CHANGED";
            GUIEventType[GUIEventType["FORM_TOOLBAR_CLICKED"] = 1] = "FORM_TOOLBAR_CLICKED";
            GUIEventType[GUIEventType["LAYOUT_CHANGED"] = 2] = "LAYOUT_CHANGED";
            GUIEventType[GUIEventType["PANEL_CHANGED"] = 3] = "PANEL_CHANGED";
            GUIEventType[GUIEventType["GRAPH_SELECTED"] = 4] = "GRAPH_SELECTED";
            GUIEventType[GUIEventType["GRAPH_DOUBLE_SELECTED"] = 5] = "GRAPH_DOUBLE_SELECTED";
            GUIEventType[GUIEventType["TAB_CHANGED"] = 6] = "TAB_CHANGED";
            GUIEventType[GUIEventType["TOOLBAR_MENU_SELECTED"] = 7] = "TOOLBAR_MENU_SELECTED";
            GUIEventType[GUIEventType["GRAPH_MENU_SELECTED"] = 8] = "GRAPH_MENU_SELECTED";
            GUIEventType[GUIEventType["GRID_SELECTED"] = 9] = "GRID_SELECTED";
            GUIEventType[GUIEventType["GRID_ROW_REMOVED"] = 10] = "GRID_ROW_REMOVED";
            GUIEventType[GUIEventType["GRID_ROW_ADDED"] = 11] = "GRID_ROW_ADDED";
            GUIEventType[GUIEventType["GRID_ROW_EDITED"] = 12] = "GRID_ROW_EDITED";
            GUIEventType[GUIEventType["GRID_ROW_CHANGED"] = 13] = "GRID_ROW_CHANGED";
            GUIEventType[GUIEventType["GRID_MENU_SELECTED"] = 14] = "GRID_MENU_SELECTED";
            GUIEventType[GUIEventType["GRID_RELOADED"] = 15] = "GRID_RELOADED";
            GUIEventType[GUIEventType["WINDOW_BUTTON_CLICKED"] = 16] = "WINDOW_BUTTON_CLICKED";
            GUIEventType[GUIEventType["OBJECT_PICKED"] = 17] = "OBJECT_PICKED";
            GUIEventType[GUIEventType["UNKNOWN"] = 18] = "UNKNOWN";
        })(EDITOR.GUIEventType || (EDITOR.GUIEventType = {}));
        var GUIEventType = EDITOR.GUIEventType;
        (function (SceneEventType) {
            SceneEventType[SceneEventType["OBJECT_PICKED"] = 0] = "OBJECT_PICKED";
            SceneEventType[SceneEventType["OBJECT_ADDED"] = 1] = "OBJECT_ADDED";
            SceneEventType[SceneEventType["OBJECT_REMOVED"] = 2] = "OBJECT_REMOVED";
            SceneEventType[SceneEventType["OBJECT_CHANGED"] = 3] = "OBJECT_CHANGED";
            SceneEventType[SceneEventType["UNKNOWN"] = 4] = "UNKNOWN";
        })(EDITOR.SceneEventType || (EDITOR.SceneEventType = {}));
        var SceneEventType = EDITOR.SceneEventType;
        /**
        * Base Event
        */
        var BaseEvent = (function () {
            function BaseEvent(data) {
                this.data = data;
            }
            return BaseEvent;
        }());
        EDITOR.BaseEvent = BaseEvent;
        /**
        * Scene Event
        */
        var SceneEvent = (function (_super) {
            __extends(SceneEvent, _super);
            /**
            * Constructor
            * @param object: the object generating the event
            */
            function SceneEvent(object, eventType, data) {
                _super.call(this, data);
                this.object = object;
                this.eventType = eventType;
            }
            return SceneEvent;
        }(BaseEvent));
        EDITOR.SceneEvent = SceneEvent;
        /**
        * GUI Event
        */
        var GUIEvent = (function (_super) {
            __extends(GUIEvent, _super);
            /**
            * Constructor
            * @param caller: gui element calling the event
            * @param eventType: the gui event type
            */
            function GUIEvent(caller, eventType, data) {
                _super.call(this, data);
                this.caller = caller;
                this.eventType = eventType;
            }
            return GUIEvent;
        }(BaseEvent));
        EDITOR.GUIEvent = GUIEvent;
        /**
        * IEvent implementation
        */
        var Event = (function () {
            function Event() {
                this.eventType = EventType.UNKNOWN;
                this.sceneEvent = null;
                this.guiEvent = null;
            }
            Event.sendSceneEvent = function (object, type, core) {
                var ev = new Event();
                ev.eventType = EventType.SCENE_EVENT;
                ev.sceneEvent = new SceneEvent(object, type);
                core.sendEvent(ev);
            };
            Event.sendGUIEvent = function (object, type, core) {
                var ev = new Event();
                ev.eventType = EventType.GUI_EVENT;
                ev.guiEvent = new GUIEvent(object, type);
                core.sendEvent(ev);
            };
            return Event;
        }());
        EDITOR.Event = Event;
        /**
        * Statics
        */
        /**
        * Sends a scene event
        */
        var sendSceneEvent = function (object, type, core) {
            var ev = new Event();
            ev.eventType = EventType.SCENE_EVENT;
            ev.sceneEvent = new SceneEvent(object, type);
            core.sendEvent(ev);
        };
    })(EDITOR = BABYLON.EDITOR || (BABYLON.EDITOR = {}));
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    var EDITOR;
    (function (EDITOR) {
        var Tools = (function () {
            function Tools() {
            }
            /**
            * Returns a vector3 string from a vector3
            */
            Tools.GetStringFromVector3 = function (vector) {
                return "" + vector.x + ", " + vector.y + ", " + vector.z;
            };
            /**
            * Returns a vector3 from a vector3 string
            */
            Tools.GetVector3FromString = function (vector) {
                var values = vector.split(",");
                return BABYLON.Vector3.FromArray([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
            };
            /**
            * Converts a base64 string to array buffer
            * Largely used to convert images, converted into base64 string
            */
            Tools.ConvertBase64StringToArrayBuffer = function (base64String) {
                var binString = window.atob(base64String.split(",")[1]);
                var len = binString.length;
                var array = new Uint8Array(len);
                for (var i = 0; i < len; i++)
                    array[i] = binString.charCodeAt(i);
                return array;
            };
            /**
            * Opens a window popup
            */
            Tools.OpenWindowPopup = function (url, width, height) {
                var features = [
                    "width=" + width,
                    "height=" + height,
                    "top=" + window.screenY + Math.max(window.outerHeight - height, 0) / 2,
                    "left=" + window.screenX + Math.max(window.outerWidth - width, 0) / 2,
                    "status=no",
                    "resizable=yes",
                    "toolbar=no",
                    "menubar=no",
                    "scrollbars=yes"];
                var popup = window.open(url, "Dumped Frame Buffer", features.join(","));
                popup.focus();
                return popup;
            };
            /**
            * Returns the base URL of the window
            */
            Tools.getBaseURL = function () {
                var url = window.location.href;
                url = url.replace(BABYLON.Tools.GetFilename(url), "");
                return url;
            };
            /**
            * Creates an input element
            */
            Tools.CreateFileInpuElement = function (id) {
                var input = $("#" + id);
                //if (!input[0])
                //    $("#BABYLON-EDITOR-UTILS").append(GUI.GUIElement.CreateElement("input type=\"file\"", id, "display: none;"));
                return input;
            };
            /**
            * Beautify a variable name (escapeds + upper case)
            */
            Tools.BeautifyName = function (name) {
                var result = name[0].toUpperCase();
                for (var i = 1; i < name.length; i++) {
                    var char = name[i];
                    if (char === char.toUpperCase())
                        result += " ";
                    result += name[i];
                }
                return result;
            };
            /**
            * Cleans an editor project
            */
            Tools.CleanProject = function (project) {
                project.renderTargets = project.renderTargets || [];
            };
            /**
            * Returns the constructor name of an object
            */
            Tools.GetConstructorName = function (obj) {
                var ctrName = (obj && obj.constructor) ? obj.constructor.name : "";
                if (ctrName === "") {
                    ctrName = typeof obj;
                }
                return ctrName;
            };
            /**
            * Converts a boolean to integer
            */
            Tools.BooleanToInt = function (value) {
                return (value === true) ? 1.0 : 0.0;
            };
            /**
            * Converts a number to boolean
            */
            Tools.IntToBoolean = function (value) {
                return !(value === 0.0);
            };
            /**
            * Returns a particle system by its name
            */
            Tools.GetParticleSystemByName = function (scene, name) {
                for (var i = 0; i < scene.particleSystems.length; i++) {
                    if (scene.particleSystems[i].name === name)
                        return scene.particleSystems[i];
                }
                return null;
            };
            return Tools;
        }());
        EDITOR.Tools = Tools;
    })(EDITOR = BABYLON.EDITOR || (BABYLON.EDITOR = {}));
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=app.js.map