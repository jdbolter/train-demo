function init() {
	var scene = new THREE.Scene();
	var stats = new Stats();
	document.body.appendChild(stats.dom);

	// Lights
	var ambientLight = new THREE.AmbientLight('rgb(10,30,50)', 0.7);
	var spotLight = getSpotLight(1.25);
	spotLight.position.x = 50;
	spotLight.position.y = 14;
	spotLight.position.z = -6;

	scene.add(ambientLight);
	scene.add(spotLight);
	

	// camera
	var camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 0;
	camera.position.x = 0;
	camera.position.y = 1;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	// load external geometry
	getChair();

	// renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.setClearColor('rgb(255, 255, 255)');

	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	document.getElementById('webgl').appendChild(renderer.domElement);
	update(renderer, scene, camera, controls, stats);
	return scene;
}

function update(renderer, scene, camera, controls, stats) {
	renderer.render(scene, camera);
	controls.update();
	stats.update();

	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls, stats);
	});
}



function getSpotLight(intensity, color) {
	color = color === undefined ? 'rgb(255, 255, 255)' : color;
	var light = new THREE.SpotLight(color, intensity);
	light.castShadow = true;
	light.penumbra = 0.5;
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;
	light.shadow.bias = 0.001;

	return light;
}

function getChair(){
	var loader = new THREE.OBJLoader();
	var textureLoader = new THREE.TextureLoader();

	loader.load('assets/models/theatreChair.obj', function (object) {
	var colorMap = textureLoader.load('assets/textures/chairDiffuseColor.png');
	var bumpMap = textureLoader.load('assets/textures/chairBumpTextures.png');
	var faceMaterial = new THREE.MeshStandardMaterial('rgb(255,255,255)');

	object.traverse(function(child) {
		
			child.material = faceMaterial;
			faceMaterial.roughness = 1;
			faceMaterial.map = colorMap;
			faceMaterial.bumpMap = bumpMap;
			faceMaterial.roughnessMap = bumpMap;
			faceMaterial.metalness = 0;
			faceMaterial.bumpScale = 0.1;
	});
	scene.add(object);
});
}

function getChairGrid(amount, seperationMultiplier){
    var group = new THREE.Group();

    for (var i=0; i<amount; i++) {
        var obj = getChair();
        obj.position.x = i * seperationMultiplier;
        obj.position.y = obj.geometry.parameters.height/2;
        group.add(obj);
        for (var j = 1; j<amount; j++){
            var obj = getChair();
            obj.position.x = i * seperationMultiplier;
            obj.position.y = obj.geometry.parameters.height/2;
            obj.position.z = j * seperationMultiplier;
            group.add(obj);

        }
    }

    group.position.x = -(seperationMultiplier * (amount-1))/2;
    group.position.z = -(seperationMultiplier * (amount-1))/2;

    return group;
}



var scene = init();