namespace YARD {
    export class YARDBlock {
        mesh: BABYLON.Mesh;
        containers: YARD.YARDContainer[];

        capacity: YARDLocationVector;

        size: YARDSizeVector;
        slots: YARDLocationVector[];

        slotSize: YARDSizeVector;

        set showTiles(val: boolean) {
            if (val == true)
                this.mesh.material = this.multimat;
            else
                this.mesh.material = this.groundMaterial;
        };

        xmin: number;
        xmax: number;
        zmin: number;
        zmax: number;
        freeSpace: number;
        boundingGroundSize: number;

        private groundMaterial: BABYLON.StandardMaterial;
        private multimat: BABYLON.MultiMaterial;
        constructor(core: BABYLON.EDITOR.EditorCore, id, containerLength, columns, rows, levels, position: BABYLON.Vector3) {
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
                length_z: this.zmax + (- this.zmin),
                width_x: this.xmax + (- this.xmin),
                height_y: 2
            };
            this.slotSize = {
                length_z: this.size.length_z / columns,
                width_x: this.size.width_x / rows,
                height_y: 8.6
            };

            this.containers = [];

            //yardlocations
            this.slots = [];

            var linePoints: BABYLON.Vector3[] = [];

            for (var r = 1; r <= rows; r++) {
                for (var c = 1; c <= columns; c++) {
                    for (var l = 1; l <= levels; l++) {
                        var ss: YARDLocationVector = { column_z: c, row_x: r, level_y: l, yardContainer: null };

                        ss.position = new BABYLON.Vector3(this.xmin + (r - 1 / 2) * this.slotSize.width_x,
                            (l - 1) * this.mesh.scaling.y + this.mesh.scaling.y / 2,
                            this.zmin + (c - 1 / 2) * this.slotSize.length_z);

                        this.slots.push(ss);

                    }
                    ////slots
                    //var containerSlot = Mesh.CreateBox("containerSlot" + id, 1, core.currentScene, false);
                    //containerSlot.parent = tiledGround;
                    //containerSlot.scaling = new Vector3(8, 8.6, containerSize);

                    //containerSlot.position = new Vector3(
                    //    (r - 1 / 2) * containerSlot.scaling.x + xmin,
                    //    containerSlot.scaling.y / 2,
                    //    (c - 1 / 2) * containerSlot.scaling.z + zmin);

                    //var containerMaterial = new StandardMaterial("containerMaterial", core.currentScene);
                    //containerMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
                    //containerMaterial.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
                    //containerMaterial.emissiveColor = new BABYLON.Color3(1, 0.4, 0.4);

                    //var outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
                    //outputplaneTexture.hasAlpha = true;
                    //containerMaterial.diffuseTexture = outputplaneTexture;
                    //containerMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                    //containerMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

                    //containerSlot.material = containerMaterial;

                    //containerSlot.showBoundingBox = true;

                }

            }


            this.createGridLines(rows, columns, scene);


            this.createBoundingGrounds(scene);

        }

        createGridLines(rows, columns, scene: BABYLON.Scene) {
            //Draw grid 
            var spoint: BABYLON.Vector3;
            var epoint: BABYLON.Vector3;

            for (var r = 0; r <= rows; r++) {

                spoint = new BABYLON.Vector3(this.xmin + r * this.slotSize.width_x, 0.1, this.zmin);
                epoint = new BABYLON.Vector3(this.xmin + r * this.slotSize.width_x, 0.1, this.zmax);

                var lines = BABYLON.Mesh.CreateLines("girdLineMesh", [spoint, epoint], scene);
                lines.color = BABYLON.Color3.Gray();

                if (r == rows) {
                    //this.createTextPlate('Row', new BABYLON.Vector3(this.xmin - this.slotSize.width_x / 2, 5, this.zmin - this.slotSize.length_z / 2), scene);
                } else
                    this.createTextPlate((r + 1).toString(), spoint.clone().add(new BABYLON.Vector3(this.slotSize.width_x / 2, 5, -this.freeSpace * 2)), scene);


            }
            for (var c = 0; c <= columns; c++) {

                spoint = new BABYLON.Vector3(this.xmin, 0.1, this.zmin + c * this.slotSize.length_z);
                epoint = new BABYLON.Vector3(this.xmax, 0.1, this.zmin + c * this.slotSize.length_z);

                var lines = BABYLON.Mesh.CreateLines("girdLineMesh", [spoint, epoint], scene);
                lines.color = BABYLON.Color3.Gray();

                if (c == columns) {
                    //this.createTextPlate('Column', new BABYLON.Vector3(this.xmin - this.slotSize.width_x / 2, 5, this.zmin + this.slotSize.length_z / 2), scene);
                } else
                    this.createTextPlate((c + 1).toString(), spoint.clone().add(new BABYLON.Vector3(-this.freeSpace * 2, 5, this.slotSize.length_z / 2)), scene);
            }
        }

        createBoundingGrounds(scene: BABYLON.Scene) {
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
        }

        createTextPlate(text: string, position: BABYLON.Vector3, scene: BABYLON.Scene) {

            var textPlaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
            textPlaneTexture.drawText(text, null, 150, "bold 140px verdana", "gray", "transparent");
            textPlaneTexture.hasAlpha = true;

            var textPlane = BABYLON.Mesh.CreatePlane("textPlane", 10, scene, false);
            textPlane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
            var pmat = new BABYLON.StandardMaterial("textPlane", scene);
            pmat.diffuseTexture = textPlaneTexture;
            pmat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
            pmat.emissiveColor = new BABYLON.Color3(1, 1, 1);
            pmat.backFaceCulling = false;
            textPlane.material = pmat
            textPlane.position = position;
        }

    }
}