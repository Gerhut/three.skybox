var camera, scene, renderer;

var currentX = null;
var currentY = null;

var theta = 0;
var phi = 0;

document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mouseup', onDocumentMouseUp, false);

init();

function init() {

  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100 );

  scene = new THREE.Scene();

  var urls = [
    'qian.jpg', 'zuo.jpg',
    'shang.jpg', 'xia.jpg',
    'hou.jpg', 'you.jpg'
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
  renderer.autoClear = false;
  document.body.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );

  render();

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  render();

}

function onDocumentMouseDown(event) {

  currentX = event.clientX;
  currentY = event.clientY;

}

function onDocumentMouseMove(event) {

  if (currentX != null && currentY != null) {

    var deltaX = event.clientX - currentX;
    var deltaY = event.clientY - currentY;

    theta = (theta + deltaX)
    phi = (phi + deltaY)

    currentX = event.clientX;
    currentY = event.clientY;

    render();

  }

}

function onDocumentMouseUp(event) {

  currentX = currentY = null;

}

function render() {

  camera.position.x = Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
  camera.position.y = Math.sin( phi * Math.PI / 360 );
  camera.position.z = Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
  camera.lookAt( scene.position );
  camera.updateMatrix();

  renderer.render( scene, camera );

}