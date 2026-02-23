import * as THREE from 'three';

export function pick(
  event: MouseEvent | Touch,
  camera: THREE.Camera,
  objects: THREE.Object3D[],
  raycaster: THREE.Raycaster,
  canvas: HTMLElement,
): THREE.Intersection | null {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
  const hits = raycaster.intersectObjects(objects, false);
  return hits[0] ?? null;
}
