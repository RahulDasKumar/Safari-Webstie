import * as THREE from 'three';


import { MapControls } from 'three/addons/controls/MapControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
let camera, controls, scene, renderer;
let objLoader, mtlLoader;
const minPan = new THREE.Vector3(- .5, - 5, - .5);
const maxPan = new THREE.Vector3(.5, .5, .5);


init();
animate();

function init() {

    scene = new THREE.Scene();
    const axesHelper = new THREE.AxesHelper(20);
    scene.background = new THREE.Color(0x26aed4);
    const canvas = document.querySelector('canvas')
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, .001, 50);
    camera.position.set(0, .3, 1.3472564494043415);
    // controls

    controls = new MapControls(camera, renderer.domElement);
    // this code allows for camera movement and cutsomizeabilty, remove when the website is done
    controls.enableDamping = true;
    controls.dampingFactor = .05;
    controls.enableZoom = false
    controls.enableRotateZ = false
    // keeps the panning level and creates a immersive pan - dont change
    controls.screenSpacePanning = false;


    // makes sure the camera will never look blow ground level
    controls.maxPolarAngle = Math.PI / 2;



    const skylight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
    dirLight1.position.set(1, 1, 1);

    const dirLight2 = new THREE.DirectionalLight(0xFFFFFF, 3);
    dirLight2.position.set(- 1, - 1, - 1);
    scene.add(dirLight1)
    scene.add(skylight);

    const ambientLight = new THREE.AmbientLight(0xd4cbcb);
    scene.add(ambientLight);



    window.addEventListener('resize', onWindowResize);

    objLoader = new OBJLoader();
    mtlLoader = new MTLLoader();

    mtlLoader.load(
        'Nature/materials.mtl',
        function (materials) {
            materials.preload();
            objLoader.setMaterials(materials);
            objLoader.load(
                'Nature/model.obj',
                function (object) {
                    scene.add(object);
                },
                function (xhr) {
                    console.log('loading wokrded');
                },
                function (error) {
                    console.error('did not work!', error);
                }
            );
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error happened', error);
        }
    );


}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
    let x = camera.position.x
    let y = camera.position.y
    let z = camera.position.z
    // setting boundaries on the camera panning
    if (Math.round(x) === 2) {
        let newZ = z
        controls.enable = false
        while (camera.position.x > 2) {
            controls.enablePan = false
            camera.position.x -= .03
            camera.position.y = .3
            camera.position.z = newZ

        }
        controls.enablePan = true
    }
    if (Math.round(x) === -2) {
        let newZ = z
        let newy = y
        controls.enablePan = false
        while (camera.position.x < -2.0) {
            camera.position.x += .03
            camera.position.y = newy
            camera.position.z = newZ
            controls.enable = false
        }
        controls.enablePan = true

    }


}

function render() {

    renderer.render(scene, camera);

}

