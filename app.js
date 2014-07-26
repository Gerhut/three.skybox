var camera, scene, renderer;

var currentX = null;
var currentY = null;

var theta = 0;
var phi = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mouseup', onDocumentMouseUp, false);

init();

function init() {

  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100 );

  scene = new THREE.Scene();

  var urls = [
    'you.jpg', 'zuo.jpg',
    'shang.jpg', 'xia.jpg',
    'qian.jpg', 'hou.jpg'
  ];

  var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
  reflectionCube.format = THREE.RGBFormat;

  var shader = THREE.ShaderLib[ "cube" ];
  shader.uniforms[ "tCube" ].value = reflectionCube;

  var material = new THREE.ShaderMaterial( {

    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide

  } );

  var mesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), material );
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.autoClear = false;
  document.body.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );

  renderer.render( scene, camera );

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseDown(event) {

  currentX = event.clientX;
  currentY = event.clientY;

}

function onDocumentMouseMove(event) {

  var r = 1

  if (currentX != null && currentY != null) {

    var deltaX = event.clientX - currentX;
    var deltaY = event.clientY - currentY;

    theta = (theta + deltaX) % 360
    phi = (phi + deltaY) % 180

    currentX = event.clientX;
    currentY = event.clientY;

    camera.position.x = r * Math.sin( theta * Math.PI / 360 )
                            * Math.cos( phi * Math.PI / 360 );
    camera.position.y = r * Math.sin( phi * Math.PI / 360 );
    camera.position.z = r * Math.cos( theta * Math.PI / 360 )
                        * Math.cos( phi * Math.PI / 360 );
    camera.lookAt( scene.position );
    camera.updateMatrix();

    renderer.render( scene, camera );

  }

}

function onDocumentMouseUp(event) {

  currentX = currentY = null;

}
