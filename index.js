import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    PerspectiveCamera,
    WebGLRenderer,
    Vector2,
    MOUSE,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils,
    Clock,
    MeshLambertMaterial,
    DirectionalLight,
    MeshToonMaterial,
    Color,
    MeshPhongMaterial,
    TextureLoader,
    LoadingManager,
    AmbientLight,
    HemisphereLight
} from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import CameraControls from 'camera-controls';

const subsetOfTHREE = {
    MOUSE,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils: {
      DEG2RAD: MathUtils.DEG2RAD,
      clamp: MathUtils.clamp
    }
  };


// 1 scene
const scene = new Scene();
const canvas = document.getElementById('three-canvas');
const loader = new TextureLoader();

// 2 The object
const loadingManager = new LoadingManager();
const loadingElem = document.querySelector('#loading');
const progressBar = loadingElem.querySelector('.progressbar');

loadingManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
	const progress = itemsLoaded / itemsTotal;
	progressBar.style.transform = `scaleX(${progress})`;
};


const geometry = new BoxGeometry(0.5, 0.5, 0.5);
//const orangeMaterial = new MeshBasicMaterial({color: 'orange'});
const orangeMaterial = new MeshToonMaterial({color: 'orange' });
//const orangeMaterial = new MeshToonMaterial({color: 0xff0000 });
const blueMaterial = new MeshLambertMaterial({color: 'blue'});
//const blueMaterial = new MeshLambertMaterial({color: new Color(0.04, 0.43, 0.6)});
const fancyMaterial = new MeshPhongMaterial({
    color: 0xff0000 ,
    specular: 0xffffff,
    shininess: 50,
    flatShading: true
});

const picMaterial = new MeshLambertMaterial({
    color: 'white',
    map: loader.load('./sample.jpg')
});

const images = [];
for (let i = 0; i < 6; i++) {
	images.push(`https://picsum.photos/200/300?random=${i}`);
}

const textureLoader = new TextureLoader(loadingManager);
const materials = [
	new MeshBasicMaterial({ map: textureLoader.load(images[0]) }),
	new MeshBasicMaterial({ map: textureLoader.load(images[1]) }),
	new MeshBasicMaterial({ map: textureLoader.load(images[2]) }),
	new MeshBasicMaterial({ map: textureLoader.load(images[3]) }),
	new MeshBasicMaterial({ map: textureLoader.load(images[4]) }),
	new MeshBasicMaterial({ map: textureLoader.load(images[5]) }),
];

loadingManager.onLoad = () => {
	loadingElem.style.display = 'none';
	const cube = new Mesh(geometry, materials);
    cube.position.y += 2;
	scene.add(cube);

    const orangeCube = new Mesh(geometry, orangeMaterial);
    scene.add(orangeCube);

    const bigBlueCube = new Mesh(geometry, blueMaterial);
    bigBlueCube.position.x += 2;
    bigBlueCube.scale.set(2, 2, 2);
    scene.add(bigBlueCube); 

    const fancyCube = new Mesh(geometry, fancyMaterial);
    fancyCube.position.x -= 2;
    fancyCube.scale.set(-2, -2, -2);
    scene.add(fancyCube); 


    const revitCube = new Mesh(geometry, picMaterial);
    revitCube.position.x -= 5;
    revitCube.scale.set(-3, -3, -3);
    scene.add(revitCube); 
}



// 3 The camera

const sizes = {
    width: 800,
    height: 600
}

const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight);
camera.position.z = 3;
scene.add(camera);

//window.addEventListener('mousemove', (event) => {
//    const position = getMousePosition(event);
//    camera.position.x = Math.sin(position.x * Math.PI * 2) * 2;
//    camera.position.z = Math.cos(position.x * Math.PI * 2) * 2;
//    camera.position.y = position.y * 3;
//    camera.lookAt(cubeMesh.position);
//})

// 4 The Renderer
const renderer = new WebGLRenderer({canvas: canvas});
const pixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(pixelRatio);
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false); //false =  (do not ) update the style of element


// 5 Lights

const light1 = new DirectionalLight();
light1.position.set(0.2, 2, 1).normalize();
scene.add(light1);

//const light2 = new DirectionalLight();
//light2.position.set(-0.2, -2, -1).normalize();
//scene.add(light2);


const ambientLight = new AmbientLight( 'white', 0.2);
scene.add(ambientLight);


const skyColor= 0xb1e1ff;
const groundColor= 0xb97a20;
const intensity = 1;
const light = new HemisphereLight(skyColor, groundColor, intensity);
scene.add(light);

const color = 0xFFFFFF;
const spotLight = new SpotLight(color, intensity, 3, 10 );
scene.add(spotLight);
scene.add(spotLight.target)


// 6 Responsitivity 
window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
})


// 7 Controls

//const controls = new OrbitControls(camera, canvas);
//controls.enableDamping = true;



CameraControls.install({THREE: subsetOfTHREE});
const clock = new Clock;
const cameraControls = new CameraControls(camera, canvas);
cameraControls.dollyToCursor = true;


// 8 Animation

function animate() {
    //orangeCube.rotation.x += 0.01;
    //orangeCube.rotation.z += 0.01;

    //bigBlueCube.rotation.x -= 0.02;
    //bigBlueCube.rotation.z -= 0.02;

    //controls.update();

    const delta = clock.getDelta();
    cameraControls.update(delta);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// 9 position of the camera

function getMousePosition(event){
  const position = new Vector2();
  const bounds = canvas.getBoundingClientRect();
  position.x =((event.clientX - bounds.left) / (bounds.right - bounds.left)) * 2 - 1;
  position.y = -((event.clientY - bounds.top) / (bounds.bottom - bounds.top)) * 2 + 1;

  return position;
}