import * as THREE from 'three';
import { WEDGES } from './wheel-data.js';

const TWO_PI = Math.PI * 2;
const RADIUS = 5;
const WEDGE_ANGLE = TWO_PI / WEDGES.length;
const SPIN_DURATION = 5000; // milliseconds
const GOLD = '#d4a017';

// Angle of wedge i's center on the wheel face. Wedge 0 is at the top (90 degrees)
// and the rest go clockwise from there.
function wedgeCenterAngle(i) {
  return Math.PI / 2 - i * WEDGE_ANGLE;
}

// Wheel rotation that puts wedge `index` under the pointer, a few full clockwise
// turns past the current rotation.
function stopRotationFor(index, currentRotation) {
  // Land somewhere inside the wedge instead of always dead center.
  const offset = (Math.random() - 0.5) * WEDGE_ANGLE * 0.5;
  const rotation = index * WEDGE_ANGLE + offset;
  const extraTurns = 4 + Math.floor(Math.random() * 3);
  const fullTurns = Math.floor((currentRotation - rotation) / TWO_PI) - extraTurns;
  return rotation + fullTurns * TWO_PI;
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 4);
}

// Paints the wedges and their labels onto a canvas used as the wheel's texture.
function drawWheelFace() {
  const size = 1024;
  const center = size / 2;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  WEDGES.forEach((wedge, i) => {
    // Canvas angles run clockwise, so flip the sign of the math angle.
    const angle = -wedgeCenterAngle(i);

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, center, angle - WEDGE_ANGLE / 2, angle + WEDGE_ANGLE / 2);
    ctx.closePath();
    ctx.fillStyle = wedge.color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Letters are stacked from the rim toward the hub, upright when the wedge is at the top.
    const fontSize = wedge.label.length > 5 ? 32 : 46;
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(angle + Math.PI / 2);
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#ffffff';
    let distance = center - 55;
    for (const letter of wedge.label) {
      if (letter === ' ') {
        distance -= fontSize * 0.5;
        continue;
      }
      ctx.strokeText(letter, 0, -distance);
      ctx.fillText(letter, 0, -distance);
      distance -= fontSize * 0.95;
    }
    ctx.restore();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function createSpinner() {
  const spinner = new THREE.Group();

  const face = new THREE.Mesh(
    new THREE.CircleGeometry(RADIUS, 128),
    new THREE.MeshBasicMaterial({ map: drawWheelFace() })
  );
  spinner.add(face);

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(RADIUS, RADIUS, 0.6, 128),
    new THREE.MeshStandardMaterial({ color: '#3b2a1a' })
  );
  body.rotation.x = Math.PI / 2;
  body.position.z = -0.31;
  spinner.add(body);

  const goldMaterial = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.6, roughness: 0.3 });

  const rim = new THREE.Mesh(new THREE.TorusGeometry(RADIUS, 0.12, 16, 128), goldMaterial);
  spinner.add(rim);

  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.3, 64), goldMaterial);
  hub.rotation.x = Math.PI / 2;
  hub.position.z = 0.15;
  spinner.add(hub);

  // A peg on every line between two wedges.
  const pegGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.35, 16);
  for (let i = 0; i < WEDGES.length; i++) {
    const angle = wedgeCenterAngle(i) + WEDGE_ANGLE / 2;
    const peg = new THREE.Mesh(pegGeometry, goldMaterial);
    peg.rotation.x = Math.PI / 2;
    peg.position.set(Math.cos(angle) * (RADIUS - 0.2), Math.sin(angle) * (RADIUS - 0.2), 0.17);
    spinner.add(peg);
  }

  return spinner;
}

// Triangle at the top of the wheel pointing down at the winning wedge.
function createPointer() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(-0.35, 0.9);
  shape.lineTo(0.35, 0.9);
  shape.closePath();

  const pointer = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, { depth: 0.15, bevelEnabled: false }),
    new THREE.MeshStandardMaterial({ color: '#c62828', metalness: 0.2, roughness: 0.5 })
  );
  pointer.position.set(0, RADIUS - 0.45, 0.4);
  return pointer;
}

export function createWheel(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, -1.2, 15.5);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight('#ffffff', 1.2));
  const light = new THREE.DirectionalLight('#ffffff', 2);
  light.position.set(3, 5, 10);
  scene.add(light);

  // The stand is tilted back a little for a 2.5D look. The spinner turns inside it
  // while the pointer stays put.
  const stand = new THREE.Group();
  stand.rotation.x = -0.45;
  scene.add(stand);

  const spinner = createSpinner();
  stand.add(spinner);
  stand.add(createPointer());

  function resize() {
    const { clientWidth, clientHeight } = container;
    renderer.setSize(clientWidth, clientHeight);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  renderer.setAnimationLoop(() => renderer.render(scene, camera));

  // Spins the wheel and resolves once wedge `index` has stopped under the pointer.
  function spinTo(index) {
    const start = spinner.rotation.z;
    const end = stopRotationFor(index, start);
    const startTime = performance.now();

    return new Promise((resolve) => {
      function step(now) {
        const t = Math.min((now - startTime) / SPIN_DURATION, 1);
        spinner.rotation.z = start + (end - start) * easeOut(t);
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          spinner.rotation.z = end % TWO_PI;
          resolve();
        }
      }
      requestAnimationFrame(step);
    });
  }

  return { spinTo };
}
