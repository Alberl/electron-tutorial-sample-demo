import * as THREE from "./thirdparty/three/three.module.js";

export { three3dCube };
var three3dCube = {
  init: function () {
    init();
  },
  animate: function (bShow) {
    animate(bShow);
  },
};

var container;
var camera, scene, renderer;
var mesh;

var widthContainer = window.innerWidth;
var heigthContainer = window.innerHeight;
widthContainer = 500;
heigthContainer = 500;

function init() {
  container = document.getElementById("three3dCube");
  camera = new THREE.PerspectiveCamera(27, widthContainer / heigthContainer, 1, 3500);
  camera.position.z = 2750;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x050505, 2000, 3500);
  scene.add(new THREE.AmbientLight(0x444444));

  var light1 = new THREE.DirectionalLight(0xffffff, 0.5);
  light1.position.set(1, 1, 1);
  scene.add(light1);

  var light2 = new THREE.DirectionalLight(0xffffff, 1.5);
  light2.position.set(0, -1, 0);
  scene.add(light2);

  var triangles = 160000;
  var geometry = new THREE.BufferGeometry();
  var indices = new Uint32Array(triangles * 3);

  for (var i = 0; i < indices.length; i++) {
    indices[i] = i;
  }

  var positions = new Float32Array(triangles * 3 * 3);
  var normals = new Float32Array(triangles * 3 * 3);
  var colors = new Float32Array(triangles * 3 * 3);
  var color = new THREE.Color();
  var n = 800,
    n2 = n / 2; // triangles spread in the cube
  var d = 12,
    d2 = d / 2; // individual triangle size

  var pA = new THREE.Vector3();
  var pB = new THREE.Vector3();
  var pC = new THREE.Vector3();

  var cb = new THREE.Vector3();
  var ab = new THREE.Vector3();

  for (var i = 0; i < positions.length; i += 9) {
    // positions
    var x = Math.random() * n - n2;
    var y = Math.random() * n - n2;
    var z = Math.random() * n - n2;

    var ax = x + Math.random() * d - d2;
    var ay = y + Math.random() * d - d2;
    var az = z + Math.random() * d - d2;

    var bx = x + Math.random() * d - d2;
    var by = y + Math.random() * d - d2;
    var bz = z + Math.random() * d - d2;

    var cx = x + Math.random() * d - d2;
    var cy = y + Math.random() * d - d2;
    var cz = z + Math.random() * d - d2;

    positions[i] = ax;
    positions[i + 1] = ay;
    positions[i + 2] = az;

    positions[i + 3] = bx;
    positions[i + 4] = by;
    positions[i + 5] = bz;

    positions[i + 6] = cx;
    positions[i + 7] = cy;
    positions[i + 8] = cz;

    // flat face normals
    pA.set(ax, ay, az);
    pB.set(bx, by, bz);
    pC.set(cx, cy, cz);

    cb.subVectors(pC, pB);
    ab.subVectors(pA, pB);
    cb.cross(ab);

    cb.normalize();

    var nx = cb.x;
    var ny = cb.y;
    var nz = cb.z;

    normals[i] = nx;
    normals[i + 1] = ny;
    normals[i + 2] = nz;

    normals[i + 3] = nx;
    normals[i + 4] = ny;
    normals[i + 5] = nz;

    normals[i + 6] = nx;
    normals[i + 7] = ny;
    normals[i + 8] = nz;

    // colors
    var vx = x / n + 0.5;
    var vy = y / n + 0.5;
    var vz = z / n + 0.5;

    color.setRGB(vx, vy, vz);

    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;

    colors[i + 3] = color.r;
    colors[i + 4] = color.g;
    colors[i + 5] = color.b;

    colors[i + 6] = color.r;
    colors[i + 7] = color.g;
    colors[i + 8] = color.b;
  }

  // 老版本
  // geometry.addAttribute("index", new THREE.BufferAttribute(indices, 1));
  // geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
  // geometry.addAttribute("normal", new THREE.BufferAttribute(normals, 3));
  // geometry.addAttribute("color", new THREE.BufferAttribute(colors, 3));

  // 新版本
  geometry.setAttribute("index", new THREE.BufferAttribute(indices, 1));
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  geometry.computeBoundingSphere();

  var material = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    specular: 0xffffff,
    shininess: 250,
    side: THREE.DoubleSide,
    // vertexColors: THREE.VertexColors, // 老版本
    vertexColors: true, // 新版本
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setClearColor(0x000000, 0);
  // renderer.setClearColor( scene.fog.color );
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(widthContainer, heigthContainer);

  // renderer.gammaInput = true;
  // renderer.gammaOutput = true;

  container.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = widthContainer / heigthContainer;
  camera.updateProjectionMatrix();

  renderer.setSize(widthContainer, heigthContainer);
}

var idAnimate;
function animate(bShow) {
  if (bShow) {
    idAnimate = requestAnimationFrame(animate);
    render();
  } else {
    cancelAnimationFrame(idAnimate);
  }
}

function render() {
  var time = Date.now() * 0.001;

  mesh.rotation.x = time * 0.25;
  mesh.rotation.y = time * 0.5;

  renderer.render(scene, camera);
}
