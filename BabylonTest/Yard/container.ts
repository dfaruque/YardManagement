namespace YARD {

    export class YARDContainer {
        name: string;
        mesh: BABYLON.Mesh;

        _block: YARD.YARDBlock;
        get block(): YARD.YARDBlock {
            return this._block;
        }
        set block(val: YARD.YARDBlock) {
            this._block = val;
            this.mesh.parent = val.mesh;
        }

        private _yardLocation: YARDLocationVector;

        public get yardLocation(): YARDLocationVector {
            return this._yardLocation;
        }
        public set yardLocation(theValue: YARDLocationVector) {
            this._yardLocation = theValue;

            var block = this.mesh.parent as BABYLON.Mesh;

            this.mesh.position = new BABYLON.Vector3(
                (theValue.row_x - 1 / 2) * this.mesh.scaling.x + block._boundingInfo.minimum.x,
                (theValue.level_y - 1) * this.mesh.scaling.y + this.mesh.scaling.y / 2,
                (theValue.column_z - 1 / 2) * this.mesh.scaling.z + block._boundingInfo.minimum.z);
        };

        constructor(core: BABYLON.EDITOR.EditorCore, id, block: YARD.YARDBlock, size: number, yardLocation: YARDLocationVector, color: BABYLON.Color3) {
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
            this.block = block;
            block.containers.push(this);
            yardLocation.isEmpty = false;
            this.yardLocation = yardLocation;
        }

    }

}