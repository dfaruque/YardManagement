var blockGrid = function (block) {
    var i, strip, stripx, stripz, rsm, sm, parent, parmat;
    var gridwidth = block.size.width_z - multiplicationFactor; // must be increments of 10
    var griddepth = block.size.length_x - multiplicationFactor;
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
//# sourceMappingURL=showBlockGrid.js.map