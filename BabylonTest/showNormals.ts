// Displays the normal of a mesh
// usage example : showNormals(mesh, 6, BABYLON.Color3.Red(), scene);
//
// author : Jahow and Jerome
// tag : debug, demos

function showNormals(mesh, size, color, sc) {
    var normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
    var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    color = color || BABYLON.Color3.White();
    sc = sc || scene;
    size = size || 1;

    var lines: BABYLON.Vector3[][] = [];
    for (var i = 0; i < normals.length; i += 3) {
        var v1 = BABYLON.Vector3.FromArray(positions, i);
        var v2 = v1.add(BABYLON.Vector3.FromArray(normals, i).scaleInPlace(size));
        lines.push([v1, v2]);
    }
    var normalLines = BABYLON.MeshBuilder.CreateLineSystem("normalLines", { lines: lines, updatable:false }, sc);
    normalLines.color = color;
    return normalLines;
}
