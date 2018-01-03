function init() {
	var scene = new THREE.Scene();
	var stats = new Stats();
	

	var theatre;
	var proscenium;
	var chair;
	var person;
	var video;
	var film = getFilm();
	scene.add(film);
	
	

	document.body.appendChild(stats.dom);

	// Lights
	var ambientLight = new THREE.AmbientLight('rgb(255,255,255)', 0.3);
	ambientLight.name = 'ambientLight';
	var spotLight = getSpotLight(0.7);
	spotLight.position.x = 0;
	spotLight.position.y = -30;
	spotLight.position.z = 0;
	spotLight.name = 'spotLight';

	scene.add(ambientLight);
	scene.add(spotLight);
	

	// camera
	var camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 0;
	camera.position.x = 0;
	camera.position.y = 55;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	// load external geometry
	
	getTheatre();
	getProscenium();
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

function getTheatre(){
	var textureLoader = new THREE.TextureLoader();
	var loader = new THREE.OBJLoader();
	loader.load('assets/models/theatreRoom.obj', function(object){
		var colorMap = textureLoader.load('assets/textures/theatreRoomDiffuseColor.png');
		var faceMaterial = new THREE.MeshStandardMaterial('rgb(255,255,255)');
		//faceMaterial.side = THREE.DoubleSide;
		faceMaterial.map = colorMap;
		faceMaterial.bumpMap = colorMap;
		faceMaterial.metalness = 0;
		faceMaterial.bumpScale = 1;
		object.traverse(function(child) {
			if ( child instanceof THREE.Mesh ) {
				child.material = faceMaterial;
			}
	});
	window.theatre = object;
	window.theatre.name = "theatre";
	scene.add(window.theatre);
	})
};

function getProscenium(){
	var textureLoader = new THREE.TextureLoader();
	var loader = new THREE.OBJLoader();
	loader.load('assets/models/theatreProscenium.obj', function(object){
		var colorMap = textureLoader.load('assets/textures/prosceniumDiffuseColor.png');
		var faceMaterial = new THREE.MeshStandardMaterial('rgb(255,255,255)');
		faceMaterial.side = THREE.DoubleSide;
		faceMaterial.map = colorMap;
		faceMaterial.bumpMap = colorMap;
		faceMaterial.metalness = 0;
		faceMaterial.bumpScale = 1;
		object.traverse(function(child) {
			if ( child instanceof THREE.Mesh ) {
				child.material = faceMaterial;
			}
	});
	window.proscenium = object;
	window.proscenium.name = "proscenium";
	window.proscenium.rotation.x = Math.PI;
	window.proscenium.position.z = 29;
	window.proscenium.position.y = -17;
	window.proscenium.scale.x = 0.95;
	window.proscenium.scale.y = 0.95;
	window.proscenium.scale.z = 0.98;
	
	scene.add(window.proscenium);
	})
};

function getPerson(){
}

function getChair(){
	var textureLoader = new THREE.TextureLoader();
	var loader = new THREE.OBJLoader();
	loader.load('assets/models/theatreChair.obj', function(object){
		var colorMap = textureLoader.load('assets/textures/chairDiffuseColor.png');
		var bumpMap = textureLoader.load('assets/textures/chairBumpTexture.png');
		var faceMaterial = new THREE.MeshStandardMaterial('rgb(255,255,255)');
		faceMaterial.map = colorMap;
		faceMaterial.bumpMap = bumpMap;
		faceMaterial.bumpScale = 0.01;
		object.traverse(function(child) {
			if ( child instanceof THREE.Mesh ) {
				child.material = faceMaterial;
			}
	});
	window.chair = object;
	window.chair.name = "chair";
	scene.add(window.chair);
	getChairGrid(8, 1.1);
	})
};

function getChairGrid(amount, seperationMultiplier){
	var chair = window.chair;
	var group = new THREE.Group();
	group.name = "chairGroup";

    for (var i=0; i<amount; i++) {
		var obj = chair.clone();
        obj.position.x = i * seperationMultiplier;
		obj.position.y = obj.height/2;
		obj.name = 'chair_' + i + '_0';
        group.add(obj);
        for (var j = 1; j<amount; j++){
            var obj = chair.clone();
            obj.position.x = i * seperationMultiplier;
            obj.position.y = obj.height/2;
			obj.position.z = j * seperationMultiplier;
			obj.name = 'chair_' + i + '_'+j;
            group.add(obj);

		}
		
    }

    group.position.x = 0;
    group.position.z = 0;

    scene.add(group);
}
//video

	
function getFilm(){
	var video = document.createElement('video');
	document.body.appendChild(video);
	video.src = 'assets/train-video.mp4';
	video.load();
	video.play();
	var texture = new THREE.VideoTexture(video);
	var geometry = new THREE.PlaneGeometry(50,40,1,1);
	var material = new THREE.MeshBasicMaterial({color: 'rgb(120,120,120)',side: THREE.DoubleSide});
	material.map = texture;
	var plane = new THREE.Mesh(geometry, material);
	plane.position.y = -73;
	plane.position.z = 7;
	plane.rotation.x = -(Math.PI/2);
	return plane;
}

	


var scene = init();