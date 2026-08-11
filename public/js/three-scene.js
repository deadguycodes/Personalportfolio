/**
 * THREE-SCENE.JS
 * Manages all Three.js 3D scenes:
 *  1. Hero canvas — animated particle galaxy + floating icosahedron
 *  2. About canvas — rotating DNA / code helix
 *  3. Skills canvas — 3D rotating tag sphere
 *  4. Contact canvas — floating particle nebula
 */

// ─── Global Scene Registry ────────────────────────────────
const Portfolio3D = (() => {
  const scenes = {};
  let animationFrameId = null;

  // ── Colour helpers ──────────────────────────────────────
  const COLORS = {
    purple:  0x8b5cf6,
    cyan:    0x06b6d4,
    blue:    0x3b82f6,
    pink:    0xec4899,
    white:   0xffffff,
  };

  // ── Utility: create renderer ────────────────────────────
  function makeRenderer(canvas, alpha = true) {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    return renderer;
  }

  // ── Utility: create perspective camera ─────────────────
  function makeCamera(fov = 75, near = 0.1, far = 1000, z = 5) {
    const cam = new THREE.PerspectiveCamera(fov, 1, near, far);
    cam.position.z = z;
    return cam;
  }

  // ─────────────────────────────────────────────────────────
  //  1. HERO SCENE — Particle galaxy + wireframe sphere
  // ─────────────────────────────────────────────────────────
  function initHero() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const renderer = makeRenderer(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 8;

    // ── Star particles ──────────────────────────────────────
    const starCount = 3000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color(0x8b5cf6),
      new THREE.Color(0x06b6d4),
      new THREE.Color(0x3b82f6),
      new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < starCount; i++) {
      const r = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3]     = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Floating icosahedron (wireframe) ────────────────────
    const sphereGeo = new THREE.IcosahedronGeometry(2.2, 3);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // ── Inner glowing sphere ────────────────────────────────
    const innerGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    // ── Orbit ring ──────────────────────────────────────────
    const ringGeo = new THREE.TorusGeometry(3, 0.015, 8, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    const ring2Geo = new THREE.TorusGeometry(3.8, 0.01, 8, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.2 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.5;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });

    scenes.hero = { renderer, scene, camera, sphere, innerSphere, ring, ring2, stars, mouseX: () => mouseX, mouseY: () => mouseY };
  }

  function animateHero(t) {
    const s = scenes.hero;
    if (!s) return;
    const time = t * 0.001;
    s.sphere.rotation.x = time * 0.15 + s.mouseY() * 0.5;
    s.sphere.rotation.y = time * 0.2  + s.mouseX() * 0.5;
    s.innerSphere.rotation.x = -time * 0.2;
    s.innerSphere.rotation.y = time * 0.3;
    s.ring.rotation.z  = time * 0.1;
    s.ring2.rotation.z = -time * 0.15;
    s.stars.rotation.y = time * 0.02;
    s.camera.position.x += (s.mouseX() * 2 - s.camera.position.x) * 0.05;
    s.camera.position.y += (-s.mouseY() * 2 - s.camera.position.y) * 0.05;
    s.camera.lookAt(s.scene.position);
    s.renderer.render(s.scene, s.camera);
  }

  // ─────────────────────────────────────────────────────────
  //  2. ABOUT SCENE — Rotating double helix / torus knot
  // ─────────────────────────────────────────────────────────
  function initAbout() {
    const canvas = document.getElementById('about-canvas');
    if (!canvas) return;

    const renderer = makeRenderer(canvas);
    const scene = new THREE.Scene();
    const w = canvas.clientWidth, h = canvas.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = 5;

    // Torus knot — looks like a DNA / code structure
    const knotGeo = new THREE.TorusKnotGeometry(1.4, 0.4, 200, 16, 3, 5);
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    scene.add(knot);

    // Outer halo ring
    const haloGeo = new THREE.TorusGeometry(2.4, 0.02, 8, 80);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.5 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    scene.add(halo);

    // Floating particles around knot
    const pCount = 300;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random()-0.5)*8;
      pPos[i*3+1] = (Math.random()-0.5)*8;
      pPos[i*3+2] = (Math.random()-0.5)*8;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.06, color: 0x06b6d4, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    scenes.about = { renderer, scene, camera, knot, halo, particles };
  }

  function animateAbout(t) {
    const s = scenes.about;
    if (!s) return;
    const time = t * 0.001;
    s.knot.rotation.x = time * 0.4;
    s.knot.rotation.y = time * 0.6;
    s.halo.rotation.z = time * 0.2;
    s.particles.rotation.y = time * 0.05;
    s.renderer.render(s.scene, s.camera);
  }

  // ─────────────────────────────────────────────────────────
  //  3. SKILLS SCENE — 3D rotating text/dot tag sphere
  // ─────────────────────────────────────────────────────────
  function initSkills() {
    const canvas = document.getElementById('skills-canvas');
    if (!canvas) return;

    const size = Math.min(canvas.clientWidth, 500);
    const renderer = makeRenderer(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 6;

    const skills = [
      'Java','JavaScript','HTML5','CSS3','Node.js','Express.js',
      'MongoDB','MySQL','REST API','Spring Boot','Git','Postman',
      'React','Docker','Linux','JSON','Mongoose','MVC',
    ];

    const skillObjects = [];
    const radius = 2.8;

    skills.forEach((skill, i) => {
      // Fibonacci sphere distribution for even spacing
      const phi = Math.acos(1 - 2 * (i + 0.5) / skills.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      // Create a dot at each skill position
      const dotGeo = new THREE.SphereGeometry(0.1, 8, 8);
      const hue = (i / skills.length) * 360;
      const colors = [0x8b5cf6, 0x06b6d4, 0x3b82f6, 0xec4899];
      const color = colors[i % colors.length];

      const dotMat = new THREE.MeshBasicMaterial({ color });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(x, y, z);
      scene.add(dot);

      // Connection line from center to dot
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, z),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.15,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);

      skillObjects.push({ dot, line, skill, x, y, z });
    });

    // Core glowing sphere
    const coreGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.8 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Outer wireframe cage
    const cageGeo = new THREE.IcosahedronGeometry(radius * 1.05, 2);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const cage = new THREE.Mesh(cageGeo, cageMat);
    scene.add(cage);

    // Mouse drag
    let isDragging = false, prevMouseX = 0, prevMouseY = 0;
    let velX = 0, velY = 0;

    canvas.addEventListener('mousedown', (e) => { isDragging = true; prevMouseX = e.clientX; prevMouseY = e.clientY; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    canvas.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      velX = (e.clientX - prevMouseX) * 0.01;
      velY = (e.clientY - prevMouseY) * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    scenes.skills = { renderer, scene, camera, skillObjects, core, cage, velX: () => velX, velY: () => velY,
      setVel: (vx, vy) => { velX = vx; velY = vy; }, isDragging: () => isDragging };
  }

  function animateSkills(t) {
    const s = scenes.skills;
    if (!s) return;
    const time = t * 0.0005;

    if (!s.isDragging()) {
      s.scene.rotation.y += 0.004;
      s.scene.rotation.x += 0.001;
    } else {
      const vx = s.velX(), vy = s.velY();
      s.scene.rotation.y += vx;
      s.scene.rotation.x += vy;
      s.setVel(vx * 0.95, vy * 0.95);
    }

    // Pulse dots
    s.skillObjects.forEach((obj, i) => {
      const scale = 1 + 0.25 * Math.sin(time * 5 + i);
      obj.dot.scale.setScalar(scale);
    });

    s.core.scale.setScalar(1 + 0.15 * Math.sin(time * 4));
    s.renderer.render(s.scene, s.camera);
  }

  // ─────────────────────────────────────────────────────────
  //  4. CONTACT SCENE — floating nebula particles
  // ─────────────────────────────────────────────────────────
  function initContact() {
    const canvas = document.getElementById('contact-canvas');
    if (!canvas) return;

    const renderer = makeRenderer(canvas);
    renderer.setSize(canvas.parentElement.clientWidth || window.innerWidth,
                     canvas.parentElement.clientHeight || 600);
    const scene = new THREE.Scene();
    const w = renderer.domElement.width, h = renderer.domElement.height;
    const camera = new THREE.PerspectiveCamera(60, w/h, 0.1, 100);
    camera.position.z = 10;

    const count = 2000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color(0x8b5cf6),
      new THREE.Color(0x06b6d4),
      new THREE.Color(0x3b82f6),
    ];

    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-0.5)*40;
      pos[i*3+1] = (Math.random()-0.5)*20;
      pos[i*3+2] = (Math.random()-0.5)*20;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i*3]   = c.r;
      colors[i*3+1] = c.g;
      colors[i*3+2] = c.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    scenes.contact = { renderer, scene, camera, particles };
  }

  function animateContact(t) {
    const s = scenes.contact;
    if (!s) return;
    s.particles.rotation.y = t * 0.00005;
    s.particles.rotation.x = Math.sin(t * 0.0001) * 0.2;
    s.renderer.render(s.scene, s.camera);
  }

  // ─────────────────────────────────────────────────────────
  //  Master Animation Loop
  // ─────────────────────────────────────────────────────────
  function animate(t) {
    animationFrameId = requestAnimationFrame(animate);
    animateHero(t);
    animateAbout(t);
    animateSkills(t);
    animateContact(t);
  }

  // ─────────────────────────────────────────────────────────
  //  Resize Handler
  // ─────────────────────────────────────────────────────────
  function handleResize() {
    // Hero
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas && scenes.hero) {
      scenes.hero.renderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
      scenes.hero.camera.aspect = heroCanvas.clientWidth / heroCanvas.clientHeight;
      scenes.hero.camera.updateProjectionMatrix();
    }
    // About
    const aboutCanvas = document.getElementById('about-canvas');
    if (aboutCanvas && scenes.about) {
      scenes.about.renderer.setSize(aboutCanvas.clientWidth, aboutCanvas.clientHeight);
      scenes.about.camera.aspect = aboutCanvas.clientWidth / (aboutCanvas.clientHeight || 400);
      scenes.about.camera.updateProjectionMatrix();
    }
    // Contact
    const contactCanvas = document.getElementById('contact-canvas');
    if (contactCanvas && scenes.contact) {
      const w = contactCanvas.parentElement.clientWidth || window.innerWidth;
      const h = contactCanvas.parentElement.clientHeight || 600;
      scenes.contact.renderer.setSize(w, h);
      scenes.contact.camera.aspect = w / h;
      scenes.contact.camera.updateProjectionMatrix();
    }
  }

  // ─────────────────────────────────────────────────────────
  //  Public Init
  // ─────────────────────────────────────────────────────────
  function init() {
    initHero();
    initAbout();
    initSkills();
    initContact();
    animate(0);
    window.addEventListener('resize', handleResize);
  }

  return { init, scenes };
})();
