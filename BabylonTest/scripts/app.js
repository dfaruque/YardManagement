var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var multiplicationFactor = 10;
var containerWidth = 8;
var containerHeight = 8.6;
var YARD;
(function (YARD) {
    var main = (function () {
        function main() {
            var containerNo = 1;
            var inputLocation = { column_z: 1, row_x: 1, level_y: 1, yardContainer: null };
            var selectedContainer;
            //configuration
            var editorMain = new BABYLON.EDITOR.EditorMain("BABYLON-EDITOR-MAIN", true);
            editorMain.transformer.transformerType = BABYLON.EDITOR.TransformerType.POSITION;
            var core = editorMain.core;
            core.eventReceivers.push({
                onEvent: function (event) {
                    if (event.sceneEvent.eventType == BABYLON.EDITOR.SceneEventType.OBJECT_PICKED) {
                        if (event.sceneEvent.object.container)
                            selectedContainer = event.sceneEvent.object.container;
                    }
                    return false;
                }
            });
            var scene = core.scene;
            scene.clearColor = BABYLON.Color3.White();
            var moveContainer = function (container, row_x, column_z, level_y) {
                var yardLocations = container.block.yardLocations;
                if (container.yardLocation.level_y + level_y > container.block.capacity.level_y) {
                    var moveFromLocation = yardLocations.filter(function (f) {
                        return f.row_x == container.yardLocation.row_x
                            && f.column_z == container.yardLocation.column_z
                            && (f.level_y == container.block.capacity.level_y);
                    })[0];
                    moveFromLocation.yardContainer = null;
                    container.yardLocation = {
                        row_x: container.yardLocation.row_x + row_x,
                        column_z: container.yardLocation.column_z + column_z,
                        level_y: container.yardLocation.level_y + level_y,
                        yardContainer: container
                    };
                }
                else {
                    var moveToLocation = yardLocations.filter(function (f) {
                        return (f.yardContainer == null || f.yardContainer == container)
                            && f.row_x == container.yardLocation.row_x + row_x
                            && f.column_z == container.yardLocation.column_z + column_z
                            && f.level_y == container.yardLocation.level_y + level_y;
                    })[0];
                    if (moveToLocation) {
                        var moveFromLocation = yardLocations.filter(function (f) {
                            return f.row_x == container.yardLocation.row_x
                                && f.column_z == container.yardLocation.column_z
                                && f.level_y == container.yardLocation.level_y;
                        })[0];
                        if (moveFromLocation)
                            moveFromLocation.yardContainer = null;
                        container.yardLocation = moveToLocation;
                        moveToLocation.yardContainer = container;
                        //physics
                        if (container.yardLocation.level_y < container.block.capacity.level_y) {
                            var aboveLocation = yardLocations.filter(function (f) {
                                return f.yardContainer
                                    && f.row_x == moveFromLocation.row_x
                                    && f.column_z == moveFromLocation.column_z
                                    && f.level_y == moveFromLocation.level_y + 1;
                            })[0];
                            if (aboveLocation) {
                                var aboveContainer = aboveLocation.yardContainer;
                                aboveLocation.yardContainer = null;
                                moveContainer(aboveContainer, 0, 0, -1);
                            }
                        }
                    }
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
                ready: function () {
                    //populate bummy containers
                    for (var i = 0; i < block.yardLocations.length / 2; i++) {
                        new YARD.YARDContainer(core, containerNo++, block, 20, block.yardLocations[i], new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
                    }
                    new YARD.YARDContainer(core, containerNo++, block, 20, block.yardLocations[block.yardLocations.length / 2], new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
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
                            alert('a thing changed');
                        },
                        deep: false
                    }
                },
                computed: {},
                methods: {
                    addContainer: function () {
                        var yardLocation = block.yardLocations.filter(function (f) { return f.yardContainer == null && f.column_z == inputLocation.column_z && f.row_x == inputLocation.row_x && f.level_y == inputLocation.level_y; })[0];
                        if (yardLocation) {
                            var con = new YARD.YARDContainer(core, containerNo++, block, 20, yardLocation, new BABYLON.Color3(Math.random(), Math.random(), Math.random()));
                        }
                        else {
                            alert('This location is already booked');
                        }
                    },
                    arrangeAll: function () {
                        block.yardLocations.forEach(function (f) { return f.yardContainer = null; });
                        for (var i = 0; i < block.containers.length; i++) {
                            var nextPosition = block.yardLocations[i];
                            nextPosition.yardContainer = block.containers[i];
                            nextPosition.yardContainer.yardLocation = nextPosition;
                        }
                    },
                    arrangeSelected: function () {
                        //setPositionInBlock(selectedContainer);
                    },
                    resetCamera: function () {
                        editorMain.resetCamera();
                    },
                    showGridLines: function (event) {
                        block.showTiles = event.target.checked;
                    },
                    moveUp: function () {
                        moveContainer(selectedContainer, 0, 0, -1);
                    },
                    moveDown: function () {
                        moveContainer(selectedContainer, 0, 0, 1);
                    },
                    moveLeft: function () {
                        moveContainer(selectedContainer, 0, -1, 0);
                    },
                    moveRight: function () {
                        moveContainer(selectedContainer, 0, 1, 0);
                    },
                    moveForward: function () {
                        moveContainer(selectedContainer, -1, 0, 0);
                    },
                    moveBackword: function () {
                        moveContainer(selectedContainer, 1, 0, 0);
                    },
                },
            });
        }
        return main;
    }());
    YARD.main = main;
})(YARD || (YARD = {}));
var YARD;
(function (YARD) {
    var YARDBlock = (function () {
        function YARDBlock(core, id, containerLength, columns, rows, levels, position) {
            var scene = core.scene;
            this.freeSpace = 5;
            this.boundingGroundSize = 10;
            // Tiled Ground
            // Part 1 : Creation of Tiled Ground
            // Parameters
            this.xmin = -rows * (containerWidth + this.freeSpace) / 2; //8(width)/2=4
            this.xmax = rows * (containerWidth + this.freeSpace) / 2;
            this.zmin = -columns * (containerLength + this.freeSpace) / 2;
            this.zmax = columns * (containerLength + this.freeSpace) / 2;
            var precision = {
                w: 2,
                h: 2
            };
            var subdivisions = {
                h: columns,
                w: rows
            };
            // Create the Tiled Ground
            var tiledGround = BABYLON.Mesh.CreateTiledGround("Tiled Ground", this.xmin, this.zmin, this.xmax, this.zmax, subdivisions, precision, scene);
            tiledGround.position = position;
            // Part 2 : Create the multi material
            this.groundMaterial = new BABYLON.StandardMaterial("ground", core.scene);
            this.groundMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.5, 0.4);
            this.groundMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.7);
            this.groundMaterial.emissiveColor = BABYLON.Color3.Black();
            // Create differents materials
            var whiteMaterial = new BABYLON.StandardMaterial("White", scene);
            whiteMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
            var blackMaterial = this.groundMaterial;
            // Create Multi Material
            this.multimat = new BABYLON.MultiMaterial("multi", scene);
            this.multimat.subMaterials.push(whiteMaterial);
            this.multimat.subMaterials.push(blackMaterial);
            // Part 3 : Apply the multi material
            // Define multimat as material of the tiled ground
            tiledGround.material = this.groundMaterial;
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
            BABYLON.EDITOR.SceneManager.ConfigureObject(tiledGround, core);
            this.mesh = tiledGround;
            this.capacity = { column_z: columns, row_x: rows, level_y: levels, yardContainer: null };
            this.size = {
                length_z: this.zmax + (-this.zmin),
                width_x: this.xmax + (-this.xmin),
                height_y: 2
            };
            this.slotSize = {
                length_z: this.size.length_z / columns,
                width_x: this.size.width_x / rows,
                height_y: 8.6
            };
            this.containers = [];
            //yardlocations
            this.yardLocations = [];
            var linePoints = [];
            for (var r = 1; r <= rows; r++) {
                for (var c = 1; c <= columns; c++) {
                    for (var l = 1; l <= levels; l++) {
                        this.yardLocations.push({ column_z: c, row_x: r, level_y: l, yardContainer: null });
                    }
                }
            }
            this.createGridLines(rows, columns, scene);
            this.createBoundingGrounds(scene);
        }
        Object.defineProperty(YARDBlock.prototype, "showTiles", {
            set: function (val) {
                if (val == true)
                    this.mesh.material = this.multimat;
                else
                    this.mesh.material = this.groundMaterial;
            },
            enumerable: true,
            configurable: true
        });
        ;
        YARDBlock.prototype.createGridLines = function (rows, columns, scene) {
            //Draw grid 
            var spoint;
            var epoint;
            for (var r = 0; r <= rows; r++) {
                spoint = new BABYLON.Vector3(this.xmin + r * this.slotSize.width_x, 0.1, this.zmin);
                epoint = new BABYLON.Vector3(this.xmin + r * this.slotSize.width_x, 0.1, this.zmax);
                var lines = BABYLON.Mesh.CreateLines("girdLineMesh", [spoint, epoint], scene);
                lines.color = BABYLON.Color3.Gray();
            }
            for (var c = 0; c <= columns; c++) {
                spoint = new BABYLON.Vector3(this.xmin, 0.1, this.zmin + c * this.slotSize.length_z);
                epoint = new BABYLON.Vector3(this.xmax, 0.1, this.zmin + c * this.slotSize.length_z);
                var lines = BABYLON.Mesh.CreateLines("girdLineMesh", [spoint, epoint], scene);
                lines.color = BABYLON.Color3.Gray();
            }
        };
        YARDBlock.prototype.createBoundingGrounds = function (scene) {
            //rear
            var leftzplane = BABYLON.Mesh.CreateGround("lzp", this.size.length_z, this.boundingGroundSize, 1, scene);
            leftzplane.position = new BABYLON.Vector3(this.xmin - this.boundingGroundSize / 2, 0, 0);
            leftzplane.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
            leftzplane.material = this.groundMaterial;
            leftzplane.receiveShadows = true;
            this.createTextPlate('North', leftzplane.position.clone().add(new BABYLON.Vector3(-10, 10, 0)), scene);
            //front
            var rightzplane = BABYLON.Mesh.CreateGround("rzp", this.size.length_z, this.boundingGroundSize, 1, scene);
            rightzplane.position = new BABYLON.Vector3(this.xmax + this.boundingGroundSize / 2, 0, 0);
            rightzplane.rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
            rightzplane.material = this.groundMaterial;
            rightzplane.receiveShadows = true;
            this.createTextPlate('South', rightzplane.position.clone().add(new BABYLON.Vector3(10, 10, 0)), scene);
            //left
            var frontxplane = BABYLON.Mesh.CreateGround("fxp", this.size.width_x + this.boundingGroundSize * 2, this.boundingGroundSize, 1, scene);
            frontxplane.position = new BABYLON.Vector3(0, 0, this.zmin - this.boundingGroundSize / 2);
            frontxplane.rotation = new BABYLON.Vector3(0, 0, 0);
            frontxplane.material = this.groundMaterial;
            frontxplane.receiveShadows = true;
            this.createTextPlate('East', frontxplane.position.clone().add(new BABYLON.Vector3(0, 10, -10)), scene);
            //right
            var rearxplane = BABYLON.Mesh.CreateGround("rxp", this.size.width_x + this.boundingGroundSize * 2, this.boundingGroundSize, 1, scene);
            rearxplane.position = new BABYLON.Vector3(0, 0, this.zmax + this.boundingGroundSize / 2);
            rearxplane.rotation = new BABYLON.Vector3(0, 0, 0);
            rearxplane.material = this.groundMaterial;
            rearxplane.receiveShadows = true;
            this.createTextPlate('West', rearxplane.position.clone().add(new BABYLON.Vector3(0, 10, 10)), scene);
            //hight
            //var yplane = BABYLON.Mesh.CreateGround("yp", 5, this.size.height_y + 10, 1, scene);
            ////var ypmat = new BABYLON.StandardMaterial("ypmat", scene);
            //////tex1 = new BABYLON.Texture("textures/yStrip.jpg", scene);
            //////ypmat.diffuseTexture = tex1;
            ////ypmat.backFaceCulling = false;
            ////yplane.material = ypmat;
            //yplane.position = new BABYLON.Vector3(0, 2.3, -0.5);
            //yplane.rotation = new BABYLON.Vector3(-Math.PI / 2, 0, 0);
        };
        YARDBlock.prototype.createTextPlate = function (text, position, scene) {
            var textPlaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
            textPlaneTexture.drawText(text, null, 150, "bold 140px verdana", "gray", "transparent");
            textPlaneTexture.hasAlpha = true;
            var textPlane = BABYLON.Mesh.CreatePlane("textPlane", 10, scene, false);
            textPlane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
            var pmat = new BABYLON.StandardMaterial("textPlane", scene);
            pmat.diffuseTexture = textPlaneTexture;
            pmat.specularColor = new BABYLON.Color3(0, 0, 0);
            pmat.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
            pmat.backFaceCulling = false;
            textPlane.material = pmat;
            textPlane.position = position;
        };
        return YARDBlock;
    }());
    YARD.YARDBlock = YARDBlock;
})(YARD || (YARD = {}));
var YARD;
(function (YARD) {
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
            BABYLON.EDITOR.SceneManager.ConfigureObject(yContainer, core);
            //yardContainer.checkCollisions = true;
            //yContainer.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: multiplicationFactor, friction: 0.7, restitution: 0.5 });
            yContainer.scaling = new BABYLON.Vector3(8, 8.6, size);
            this.mesh = yContainer;
            this.mesh.container = this;
            this.block = block;
            block.containers.push(this);
            yardLocation.yardContainer = this;
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
                //var block = this.mesh.parent as BABYLON.Mesh;
                this.mesh.position = new BABYLON.Vector3(this.block.xmin + (theValue.row_x - 1 / 2) * this.block.slotSize.width_x, (theValue.level_y - 1) * this.mesh.scaling.y + this.mesh.scaling.y / 2, this.block.zmin + (theValue.column_z - 1 / 2) * this.block.slotSize.length_z);
            },
            enumerable: true,
            configurable: true
        });
        ;
        return YARDContainer;
    }());
    YARD.YARDContainer = YARDContainer;
})(YARD || (YARD = {}));
var YARD;
(function (YARD) {
    var YARDMain = (function () {
        function YARDMain() {
        }
        return YARDMain;
    }());
    YARD.YARDMain = YARDMain;
})(YARD || (YARD = {}));
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
        //export class GUIEvent extends BaseEvent {
        //    public caller: GUI.IGUIElement;
        //    public eventType: GUIEventType;
        //    /**
        //    * Constructor
        //    * @param caller: gui element calling the event
        //    * @param eventType: the gui event type
        //    */
        //    constructor(caller, eventType: number, data?: Object)
        //    {
        //        super(data);
        //        this.caller = caller;
        //        this.eventType = eventType;
        //    }
        //}
        /**
        * IEvent implementation
        */
        var Event = (function () {
            function Event() {
                this.eventType = EventType.UNKNOWN;
                this.sceneEvent = null;
            }
            //public guiEvent: GUIEvent = null;
            Event.sendSceneEvent = function (object, type, core) {
                var ev = new Event();
                ev.eventType = EventType.SCENE_EVENT;
                ev.sceneEvent = new SceneEvent(object, type);
                core.sendEvent(ev);
            };
            Event.sendGUIEvent = function (object, type, core) {
                var ev = new Event();
                ev.eventType = EventType.GUI_EVENT;
                //ev.guiEvent = new GUIEvent(object, type);
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
            Object.defineProperty(EditorMain.prototype, "MAINCANVASId", {
                get: function () {
                    return "BABYLON-EDITOR-MAIN-CANVAS";
                },
                enumerable: true,
                configurable: true
            });
            /**
            * Event receiver
            */
            EditorMain.prototype.onEvent = function (event) {
                //if (event.eventType === EventType.GUI_EVENT) {
                //    if (event.guiEvent.eventType === GUIEventType.LAYOUT_CHANGED) {
                //        this.core.engine.resize();
                //        return true;
                //    }
                //}
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
                };
            };
            /**
            * Creates the babylon engine
            */
            EditorMain.prototype._createBabylonEngine = function () {
                var _this = this;
                $("#" + this.MAINCANVASId).height(window.innerHeight);
                this.core.canvas = document.getElementById(this.MAINCANVASId);
                this.core.engine = new BABYLON.Engine(this.core.canvas, this.antialias, this.options);
                this.core.scene = new BABYLON.Scene(this.core.engine);
                this.core.scene.animations = [];
                this.core.scenes.push({ render: true, scene: this.core.scene });
                this._createBabylonCamera();
                window.addEventListener("resize", function (ev) {
                    if (_this.core.isPlaying) {
                        _this.core.isPlaying = false;
                    }
                    $("#" + _this.MAINCANVASId).height(window.innerHeight);
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
                var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, multiplicationFactor, BABYLON.Vector3.Zero(), this.core.scene);
                camera.lowerBetaLimit = 0.1;
                camera.upperBetaLimit = (Math.PI / 2) * 0.99;
                camera.lowerRadiusLimit = multiplicationFactor;
                //camera.setPosition(new BABYLON.Vector3(multiplicationFactor * 8, multiplicationFactor * 8 * 2, 0));
                this.core.camera = camera;
                this.resetCamera();
            };
            EditorMain.prototype.resetCamera = function () {
                this.core.camera.alpha = 0;
                this.core.camera.beta = 0;
                this.core.camera.target = BABYLON.Vector3.Zero();
                this.core.camera.setPosition(new BABYLON.Vector3(multiplicationFactor * 8, multiplicationFactor * 8 * 2, 0));
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
                var scene = core.scene;
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
//# sourceMappingURL=app.js.map