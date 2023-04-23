import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// 太陽光
const sunLight = new THREE.DirectionalLight(0xffffff, 1)
sunLight.position.set(0, 1, 0)
scene.add(sunLight)

const light = new THREE.SpotLight(0xFFFFFF, 2, 100, Math.PI / 4, 1);
// ライトに影を有効にする
light.castShadow = true;
scene.add(light);


/**
 * Textures
 */
const bakedTexture = textureLoader.load('house-bake8.jpg')

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({color: 0x6699FF});
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Model
 */

gltfLoader.load(
    'school_outside3.glb',
    (gltf) =>
    {
        gltf.scene.position.set(0, -17, 0)
        // gltf.scene.scale.set(1000, 1000, 1000)
        gltf.scene.traverse((child) =>
        {
            child.material = bakedMaterial
        })

        scene.add(gltf.scene)
    }
)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
