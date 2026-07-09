document.documentElement.classList.remove('no-js');
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  const canvas = document.getElementById('bg');
  const blackout = document.getElementById('blackout');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.05, 50);
  camera.position.set(1.2, 0.5, 6);

  scene.add(new THREE.AmbientLight(0x404060, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 0.8);
  key.position.set(2, 3, 4);
  scene.add(key);
  const rim = new THREE.PointLight(0x8a4dff, 3.5, 15);
  rim.position.set(-2, 1, -2);
  scene.add(rim);

  let hoodie = null;
  // Punto objetivo dentro de la capucha — AJUSTA estos valores mirando tu modelo real
  const hoodMouth = new THREE.Vector3(0.1, 0.4, 0.15);

  const loader = new THREE.GLTFLoader();
 loader.load(
  'models/hoodie-optimizado.glb',
  (gltf) => {
    hoodie = gltf.scene;
    hoodie.position.set(0, -0.3, 0);
    scene.add(hoodie);
    console.log('Modelo cargado correctamente ✅');
  },
  undefined,
  (error) => {
    console.error('❌ Error cargando el modelo:', error);
  }
);

  let scrollProgress = 0;
  let smoothProgress = 0;

  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      scrollProgress = self.progress;
      const bar = document.getElementById('progressBar');
      if (bar) bar.style.width = (self.progress * 100) + '%';
    },
  });

  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none reverse' },
    });
  });

  function lerp(a, b, n) { return a + (b - a) * n; }

  function animate() {
    requestAnimationFrame(animate);
    smoothProgress = lerp(smoothProgress, scrollProgress, 0.06);

    const startPos = new THREE.Vector3(1.2, 0.5, 6);
    const endPos = new THREE.Vector3(hoodMouth.x, hoodMouth.y, hoodMouth.z - 0.05);
    camera.position.lerpVectors(startPos, endPos, Math.min(smoothProgress * 1.4, 1));
    camera.lookAt(hoodMouth);

    if (hoodie) hoodie.rotation.y = 0.1 + smoothProgress * 0.4;
    rim.intensity = 3.5 - smoothProgress * 2.5;

    const blackAmount = Math.max(0, Math.min(1, (smoothProgress - 0.7) / 0.3));
    blackout.style.opacity = blackAmount;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();