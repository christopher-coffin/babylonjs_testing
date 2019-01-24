var canvas = document.getElementById("renderCanvas");

var colors = {
    seaFoam: BABYLON.Color3.FromHexString("#16a085"),
    green: BABYLON.Color3.FromHexString("#27ae60"),
    blue: BABYLON.Color3.FromHexString("#2980b9"),
    purple: BABYLON.Color3.FromHexString("#8e44ad"),
    navy: BABYLON.Color3.FromHexString("#2c3e50"),
    yellow: BABYLON.Color3.FromHexString("#f39c12"),
    orange: BABYLON.Color3.FromHexString("#d35400"),
    red: BABYLON.Color3.FromHexString("#c0392b"),
    white: BABYLON.Color3.FromHexString("#bdc3c7"),
    gray: BABYLON.Color3.FromHexString("#7f8c8d")
}

var shaderMatList = [];

let addVRSupport = function() {
    let VRHelper = scene.createDefaultVRExperience();
    VRHelper.enableTeleportation({floorMeshName: "ground"});
    VRHelper.onBeforeCameraTeleport.add((targetPosition) => {
        //Raised before camera is teleported
        console.log("before camera teleports");
    });
    VRHelper.onAfterCameraTeleport.add((targetPosition) => {
        //Raised after teleportation animation finishes
        console.log("after camera teleports");
    });
}

let addWalkingCamera = function(scene) {
    var camera = new BABYLON.FreeCamera('camera1', 
                                        new BABYLON.Vector3(0, 1.8,-5), 
                                        scene);
    camera.setTarget(new BABYLON.Vector3(0, 1.8, 0));
    camera.keysUp.push(87);    //W
    camera.keysDown.push(83)   //D
    camera.keysLeft.push(65);  //A
    camera.keysRight.push(68); //S
    camera.attachControl(canvas,true);
}

let addArcRotateCamera = function(scene) {
    //let camera = new BABYLON.Camera("camera1", BABYLON.Vector3.Zero(), scene);
    var camera = new BABYLON.ArcRotateCamera("camera", 
                                            -Math.PI / 2, Math.PI / 4, 3, 
                                            new BABYLON.Vector3(0, 3, 0), 
                                            scene);
}

/* // texture load example
    // Create material from image with alpha
    var mat = new BABYLON.StandardMaterial("dog", scene);
    //let srcTex = new BABYLON.Texture("https://upload.wikimedia.org/wikipedia/commons/8/87/Alaskan_Malamute%2BBlank.png", scene);
    let srcTex = new BABYLON.Texture("/textures/townhall_R/townhall_R_nx.JPG", scene,
                                    undefined, undefined, undefined, 
                                    () => {//onLoad
        //srcTex.readPixels(0, 0, buffer);
        let buffer = new Uint8Array(4*512*512);
        b2 = srcTex.readPixels();
        console.log('got it', b2);
        let dstTex = new BABYLON.RawTexture(buffer, 512, 512, BABYLON.Engine.TEXTUREFORMAT_RGBA, 
            scene, false, false, BABYLON.Texture.NEAREST_SAMPLINGMODE,
            BABYLON.Texture.UNSIGNED_BYTE);
        //dstTex.update(buffer);
        dstTex.update(b2);
        mat.diffuseTexture = dstTex;
        mat.diffuseTexture.hasAlpha = true;
        mat.backFaceCulling = false;

        shaderMaterial.setTexture("textureSampler", dstTex);
        shaderMaterial.setFloat("exposure", 0.8);
        shaderMaterial.backFaceCulling = false;

        for (let i = 0; i < 10; i++) {
            var plane = BABYLON.Mesh.CreatePlane("plane", 0.5, scene);
            plane.position = new BABYLON.Vector3(2.0, 1, i*0.05);
            plane.material = shaderMaterial;
        }
    });
*/

let addTexturedPlanes = function(scene, shaderMaterial) {

    for (let i = 0; i < 100; i++) {
        var plane = BABYLON.Mesh.CreatePlane("plane", 0.5, scene);
        plane.position = new BABYLON.Vector3(2.0, 1, i*0.05);
        let srcTex = new BABYLON.Texture("./sample1/"+String(i).padStart(8, "0")+".png", scene);
        let mc = shaderMaterial.clone();
        plane.material = mc;
        shaderMatList.push(mc);
        plane.material.backFaceCulling = false;
        plane.material.setTexture("textureSampler", srcTex);
        plane.material.setFloat("exposure", 1.0);
		plane.hasVertexAlpha = true;
    }
    //mat.diffuseTexture.update(buffer);

    // Apply material to a box
    //var box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
    //box.material = mat;
}

let addShaderMaterial = function (scene) {
    var shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, "./shaders/simple_shader",
    {
        attributes: ["position", "normal", "uv"],
        uniforms: ["world", "worldView", "worldViewProjection", "view" ]
    });    
    return shaderMaterial;
}

let addTextureShaderMaterial = function (scene) {
    var shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, "./shaders/exposure_shader",
    {
        attributes: ["position", "normal", "uv"],
        uniforms: ["world", "worldView", "worldViewProjection", "view", "textureSampler", "exposure" ]
    });
    // tie in slider for exposure change
    let slide = document.getElementById('myRange');
    slide.onchange = function() {
        for (let i = 0; i < shaderMatList.length; i++)
            shaderMatList[i].setFloat("exposure", this.value/50.0);
    };
    shaderMaterial.needsAlphaBlending = true;
    return shaderMaterial;
}

let createScene = function () {
        
    var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    // Playground needs to return at least an empty scene and default camera
    var scene = new BABYLON.Scene(engine);
    addWalkingCamera(scene);
    //addArcRotateCamera(scene);
    scene.clearColor = new BABYLON.Color3(0, 0, 0);
    scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

    // Create simple sphere
    var shaderSphere = BABYLON.Mesh.CreateIcoSphere("sphere", {radius:0.2, flat:true, subdivisions: 1}, this.scene);
    shaderSphere.position.y = 2;
    shaderSphere.material = addShaderMaterial(scene);

    var sphere = BABYLON.Mesh.CreateIcoSphere("sphere", {radius:0.2, flat:true, subdivisions: 1}, this.scene);
    sphere.position.y = 3;
    sphere.material = new BABYLON.StandardMaterial("sphere material",scene)

    // Lights and camera
    var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -0.5, 1.0), scene);
    light.position = new BABYLON.Vector3(0, 5, -2);
    scene.activeCamera.beta += 0.8;

    // Default Environment
    var environment = scene.createDefaultEnvironment({ enableGroundShadow: true, groundYBias: 1 });
    environment.setMainColor(BABYLON.Color3.FromHexString("#74b9ff"))
    
    // Shadows
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;
    shadowGenerator.addShadowCaster(sphere, true);

    // Runs every frame to rotate the sphere
    scene.onBeforeRenderObservable.add(()=>{
        sphere.rotation.y += 0.0001*scene.getEngine().getDeltaTime();
        sphere.rotation.x += 0.0001*scene.getEngine().getDeltaTime();
    })
    
    // GUI
    var plane = BABYLON.Mesh.CreatePlane("plane", 1);
    plane.position = new BABYLON.Vector3(0.4, 4, 0.4)
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
    var panel = new BABYLON.GUI.StackPanel();    
    advancedTexture.addControl(panel);  
    var header = new BABYLON.GUI.TextBlock();
    header.text = "Color GUI";
    header.height = "100px";
    header.color = "white";
    header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    header.fontSize = "120"
    panel.addControl(header); 
    var picker = new BABYLON.GUI.ColorPicker();
    picker.value = sphere.material.diffuseColor;
    picker.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    picker.height = "350px";
    picker.width = "350px";
    picker.onValueChangedObservable.add(function(value) {
        sphere.material.diffuseColor.copyFrom(value);
    });
    panel.addControl(picker);
    /*
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;     
    skybox.infiniteDistance = true;
    skyboxMaterial.disableLighting = true;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/townhall_R/townhall_R", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    */
    /*
    // Async call
    SceneLoader.Append("https://www.babylonjs.com/scenes/sponza/",
        "sponza.babylon", scene, function () {
            var VRHelper = scene.createDefaultVRExperience();
            VRHelper.enableTeleportation({floorMeshName: "Sponza Floor"});
        });
    */
    //let ground = BABYLON.Mesh.CreateGround("ground", 20, 20, 10, scene);

    /*
    var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
    var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

    myMaterial.diffuseTexture = new BABYLON.Texture("PATH TO IMAGE", scene);
    myMaterial.specularTexture = new BABYLON.Texture("PATH TO IMAGE", scene);
    myMaterial.emissiveTexture = new BABYLON.Texture("PATH TO IMAGE", scene);
    myMaterial.ambientTexture = new BABYLON.Texture("PATH TO IMAGE", scene);

    mesh.material = myMaterial;
*/

    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });
    
    // Resize
    window.addEventListener("resize", function () {
        engine.resize();
    });

    scene.executeWhenReady(() => {
        addTexturedPlanes(scene, addTextureShaderMaterial(scene));
    });
    
    return scene;
};

createScene();