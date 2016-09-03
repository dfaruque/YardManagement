namespace YARD {

    export class YARDContainer {
        name: string;
        mesh: BABYLON.MyMesh;

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
            //var block = this.mesh.parent as BABYLON.Mesh;

            this.mesh.position.x = this.block.xmin + theValue.row_x * this.block.slotSize.width_x - this.block.slotSize.width_x / 2;
            this.mesh.position.z = this.block.zmin + theValue.column_z * this.block.slotSize.length_z - this.block.slotSize.length_z / 2;
            this.mesh.position.y = theValue.level_y * this.mesh.scaling.y - this.mesh.scaling.y / 2;
        };

        public get nearestSlot(): YARDLocationVector {
            var r: YARDLocationVector = {
                row_x: Math.round((this.mesh.position.x + this.block.slotSize.width_x / 2 - this.block.xmin) / this.block.slotSize.width_x),
                column_z: Math.round((this.mesh.position.z + this.block.slotSize.length_z / 2 - this.block.zmin) / this.block.slotSize.length_z),
                level_y: Math.round((this.mesh.position.y + this.mesh.scaling.y / 2) / this.mesh.scaling.y),
                yardContainer: this
            };
            r.row_x = r.row_x > this.block.capacity.row_x ? this.block.capacity.row_x : r.row_x;
            r.column_z = r.column_z > this.block.capacity.column_z ? this.block.capacity.column_z : r.column_z;
            r.level_y = r.level_y > this.block.capacity.level_y ? this.block.capacity.level_y : r.level_y;

            return r;
        }

        constructor(core: BABYLON.EDITOR.EditorCore, id, block: YARD.YARDBlock, size: number, yardLocation: YARDLocationVector, color: BABYLON.Color3) {
            this.name = "yardContainer" + id;
            var yContainer = BABYLON.Mesh.CreateBox(this.name, 1, core.scene, false);
            yContainer.id = this.name;

            var containerMaterial = new BABYLON.StandardMaterial("containerMaterial", core.scene);
            containerMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            containerMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            containerMaterial.emissiveColor = color;

            yContainer.material = containerMaterial;

            core.shadowGenerator.getShadowMap().renderList.push(yContainer);
            yContainer.receiveShadows = true;

            BABYLON.EDITOR.SceneManager.ConfigureObject(yContainer, core);

            //yardContainer.checkCollisions = true;
            //yContainer.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: multiplicationFactor, friction: 0.7, restitution: 0.5 });

            yContainer.scaling = new BABYLON.Vector3(8, 8.6, size);


            this.mesh = yContainer as BABYLON.MyMesh;
            this.mesh.container = this;

            this.block = block;
            block.containers.push(this);

            yardLocation.yardContainer = this;

            this.yardLocation = yardLocation;
        }

    }

}

declare module BABYLON {
    class MyMesh extends Mesh {
        container: YARD.YARDContainer;
    }
}