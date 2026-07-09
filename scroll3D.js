document.documentElement.classList.remove('no-js');
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  const canvas = document.getElementById('bg');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 6;

  // --- Construir dos formas: esfera compacta (inicio) y dispersión tipo "onda expansiva" (fin) ---
  const COUNT = 4096;
  const compactPositions = new Float32Array(COUNT * 3);
  const explodedPositions = new Float32Array(COUNT * 3);
  const currentPositions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);

  const colorA = new THREE.Color('#ffb627'); // ambar floodlight
  const colorB = new THREE.Color('#00c2cb'); // cian pista

  for (let i = 0; i < COUNT; i++) {
    // Fibonacci sphere para distribución uniforme (la "pelota")
    const t = i / COUNT;
    const phi = Math.acos(1 - 2 * t);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = 1.6;

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    compactPositions[i * 3] = x;
    compactPositions[i * 3 + 1] = y;
    compactPositions[i * 3 + 2] = z;

    // Dispersión: cada partícula sale disparada a lo largo de su propio vector normal,
    // con algo de ruido para que no se vea perfectamente radial
    const spread = 6 + Math.random() * 10;
    const jitter = () => (Math.random() - 0.5) * 3;

    explodedPositions[i * 3] = x * spread + jitter();
    explodedPositions[i * 3 + 1] = y * spread + jitter();
    explodedPositions[i * 3 + 2] = z * spread + jitter() - 4;

    currentPositions[i * 3] = x;
    currentPositions[i * 3 + 1] = y;
    currentPositions[i * 3 + 2] = z;

    const mixed = colorA.clone().lerp(colorB, t);
    colors[i * 3] = mixed.r;
    colors[i * 3 + 1] = mixed.g;
    colors[i * 3 + 2] = mixed.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Líneas tenues tipo "campo/pista" de fondo para dar profundidad
  const gridGeo = new THREE.BufferGeometry();
  const gridPts = [];
  for (let i = -10; i <= 10; i++) {
    gridPts.push(-10, i, -8, 10, i, -8);
  }
  gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridPts, 3));
  const gridMat = new THREE.LineBasicMaterial({ color: 0x1a2233, transparent: true, opacity: 0.2 });
  const grid = new THREE.LineSegments(gridGeo, gridMat);
  scene.add(grid);
  // --- Reveal de contenido al hacer scroll ---
  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',   // cuando el elemento entra al 85% de la pantalla
        toggleActions: 'play none none reverse', // reaparece si subes y vuelves a bajar
      },
    });
  });

  // --- Estado de scroll ---
  let scrollProgress = 0;   // objetivo, 0 a 1
  let smoothProgress = 0;   // suavizado con lerp
  const progressBar = document.getElementById('progressBar');

  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      scrollProgress = self.progress;
      progressBar.style.width = (self.progress * 100) + '%';
    },
  });

  function lerp(a, b, n) { return a + (b - a) * n; }

  function animate() {
    requestAnimationFrame(animate);

    smoothProgress = lerp(smoothProgress, scrollProgress, 0.06);

    const posAttr = geometry.attributes.position;
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      posAttr.array[ix] = lerp(compactPositions[ix], explodedPositions[ix], smoothProgress);
      posAttr.array[ix + 1] = lerp(compactPositions[ix + 1], explodedPositions[ix + 1], smoothProgress);
      posAttr.array[ix + 2] = lerp(compactPositions[ix + 2], explodedPositions[ix + 2], smoothProgress);
    }
    posAttr.needsUpdate = true;

    points.rotation.y = smoothProgress * Math.PI * 1.2 + 0.15;
    points.rotation.x = smoothProgress * 0.4;

    camera.position.z = lerp(6, 3.5, smoothProgress);
    grid.material.opacity = 0.2 * (1 - smoothProgress * 0.6);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
