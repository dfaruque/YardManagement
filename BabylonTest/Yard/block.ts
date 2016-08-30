namespace YARD {
    export class YARDBlock {
        mesh: BABYLON.Mesh;
        containers: YARD.YARDContainer[];

        capacity: YARDLocationVector;

        size: YARDSizeVector;
        yardLocations: YARDLocationVector[];

        set showTiles(val: boolean) {
            if (val == true)
                this.mesh.material = this.multimat;
            else
                this.mesh.material = this.groundMaterial;
        };
        private groundMaterial: BABYLON.StandardMaterial;
        private multimat: BABYLON.MultiMaterial;
        constructor(core: BABYLON.EDITOR.EditorCore, id, containerSize, columns, rows, levels) {
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
            tiledGround.position.y = -1

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

            //yardlocations
            this.yardLocations = [];
            for (var r = 1; r <= rows; r++)
                for (var c = 1; c <= columns; c++) {
                    for (var l = 1; l <= levels; l++) {
                        this.yardLocations.push({ column_z: c, row_x: r, level_y: l, isEmpty: true });
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

            this.mesh = tiledGround;

            this.capacity = { column_z: columns, row_x: rows, level_y: levels, isEmpty: false };

            this.size = { length_z: zmax + (- zmin), width_x: xmax + (- xmin), height_y: 1 };

            this.containers = [];

        }

    }
}