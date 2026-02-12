gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

const navTl = gsap.timeline({
  scrollTrigger: {
    trigger: document.body,
    start: "top top",
    end: "+=120",
    scrub: true
  }
});



navTl
  .to(".nav-wrap", {
    width: "100%",
    padding: "0",
    borderRadius: "0px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
    ease: "none"
  })
  .to(
    ".nav-inner",
    {
      paddingLeft: "1.4rem",
      paddingRight: "1.4rem",
      ease: "none"
    },
    "<"
  );

gsap.set([".logo"], { opacity: 0 });

gsap.timeline()
  .fromTo(
    ".logo",
    { y: 12},
    {
      y: 0,
      opacity: 1,
      duration: 2.5,
      ease: "power5.out"
    }
  )



  


const nav = document.querySelector(".nav-wrap");
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");


// Toggle mobile menu
toggle.addEventListener("click", () => {
  links.classList.toggle("open");
});

const magneticLinks = document.querySelectorAll(".nav-links a");

magneticLinks.forEach(link => {
  const strength = 0.4; // lower = subtler

  link.addEventListener("mousemove", e => {
    const rect = link.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    link.style.transform = `
      translate(${x * strength}px, ${y * strength}px)
      scale(1.05)
    `;
  });

  link.addEventListener("mouseleave", () => {
    link.style.transform = `
      translate(0px, 0px)
      scale(1)
    `;
  });
});



const turbulence = document.getElementById("liquid-turbulence");

let lastScrollY = window.scrollY;
let currentIntensity = 0;

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const delta = Math.abs(scrollY - lastScrollY);

  // Increase intensity based on scroll speed
  currentIntensity += delta * 0.00008;
  currentIntensity = Math.min(currentIntensity, 0.02);

  lastScrollY = scrollY;
});

// Smooth decay (liquid settling)
function animateLiquid() {
  currentIntensity *= 0.65;

  const baseX = 0.012 + currentIntensity;
  const baseY = 0.02 + currentIntensity * 0.8;

  turbulence.setAttribute(
    "baseFrequency",
    `${baseX.toFixed(4)} ${baseY.toFixed(4)}`
  );

  requestAnimationFrame(animateLiquid);
}

animateLiquid();



// === Hero canvas & scene ===
const canvas = document.getElementById("hero-canvas");
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 4;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lights
const pointLight = new THREE.PointLight(0xff6f3c, 1.5);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.2));

// === Particle Geometry ===
const count = 1200;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 8; // x
  positions[i * 3 + 1] = (Math.random() - 0.5) * 6; // y
  positions[i * 3 + 2] = (Math.random() - 0.5) * 6; // z

  // Color gradient: red -> orange -> yellow
  const t = Math.random();
  colors[i * 3] = 1; // red
  colors[i * 3 + 1] = t * 0.5 + 0.2; // green
  colors[i * 3 + 2] = 0; // blue
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// === Particle material ===
const material = new THREE.PointsMaterial({
  vertexColors: true,
  size: 0.02, // constant size
  transparent: true,
  opacity: 0.4,
  map: new THREE.CanvasTexture(createCircleTexture()),
  alphaTest: 0.01,
  depthWrite: false
});

// Helper: create small circle texture
function createCircleTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(size/3, size/3, size/3, 0, Math.PI*2);
  ctx.fill();
  return canvas;
}

const points = new THREE.Points(geometry, material);
scene.add(points);

// === Mouse Interaction ===
let mouseX = 0, mouseY = 0;
document.addEventListener("mousemove", e => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});




// === Animate ===
function animate() {
  requestAnimationFrame(animate);

  const positions = geometry.attributes.position.array;

  for (let i = 0; i < count; i++) {
    const ix = i*3, iy = i*3+1, iz = i*3+2;

    // subtle floating wave motion
    positions[iy] += Math.sin(Date.now()*0.001 + ix)*0.0003;
    positions[ix] += Math.cos(Date.now()*0.001 + iy)*0.0003;

    // parallax with mouse
    positions[ix] += mouseX * 0.001;
    positions[iy] += mouseY * 0.001;
  }

  geometry.attributes.position.needsUpdate = true;

  // slow rotation for 3D feel
  points.rotation.y += 0.001 + mouseX*0.009;
  points.rotation.x += 0.0005 + mouseY*0.006;

  renderer.render(scene, camera);
}





animate();

// === Responsive ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

















const heroName = document.querySelector(".hero-name");
const heroLeft = document.querySelector(".hero-left");
const heroRight = document.querySelector(".hero-right");


// FADE AWAY on scroll

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top 70%",
  }
});

tl.from(".hero-name", {
  y: 80,
  opacity: 1,
  scale: 0.95,
  duration: 6.2,
  ease: "power4.out"
});

gsap.to(".hero-name", {
  scale: 2,
  opacity: -.5,
  letterSpacing: "0.2em",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 0.8
  }
});




// LEFT block — slides in from left
gsap.from('.hero-left', {
  x: -120,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.hero-row',
    start: 'top 75%',
    toggleActions: 'play reverse play reverse'
  }
});


// SCRAMBLE TEXT
gsap.from(".scramble-olsan, .scramble-years", {
  duration: 1.1,
  scrambleText: {
    chars: "Olsan013#",
    speed: 0.4,
    revealDelay: 0.2
  },
  stagger: 0.25,
  ease: "power2.out",
  delay: 0.6 // lets hero-name settle first
});


// SCRAMBLE TEXT ON HOVER
document.querySelectorAll(".scramble-olsan, .scramble-years")
  .forEach(el => {
    const originalText = el.textContent;

    el.addEventListener("mouseenter", () => {
      gsap.to(el, {
        duration: 0.8,
        scrambleText: {
          text: originalText,
          chars: "XO01#@!",
          speed: 0.5
        },
        ease: "power1.out"
      });
    });

    el.addEventListener("mouseleave", () => {
      gsap.to(el, {
        duration: 0.6,
        scrambleText: {
          text: originalText,
          chars: " ",
          speed: 0.3
        },
        ease: "power2.out"
      });
    });
});


// RIGHT block — slides in from right
gsap.from('.hero-right', {
  x: 120,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.hero-row',
    start: 'top 75%',
    toggleActions: 'play reverse play reverse'
  }
});


gsap.to(".hero-content", {
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  },
  scale: 0.92,
  y: -60,
  ease: "none"
});




const typingText = document.getElementById("typing-text");

const lines = [
  "Short for Oluwasanmi.",
  "A name shaped by intention.",
  "To me, it means excellence."
];

let lineIndex = 0;
let charIndex = 0;

function typeLine() {
  if (charIndex < lines[lineIndex].length) {
    typingText.textContent += lines[lineIndex][charIndex];
    charIndex++;
    setTimeout(typeLine, 45);
  } else {
    setTimeout(eraseLine, 1800);
  }
}

function eraseLine() {
  if (charIndex > 0) {
    typingText.textContent = lines[lineIndex].slice(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseLine, 25);
  } else {
    lineIndex = (lineIndex + 1) % lines.length;
    setTimeout(typeLine, 400);
  }
}

// start after hero animation settles
setTimeout(typeLine, 1200);



gsap.to(".hero-divider", {
  scaleX: 2.3,
  opacity: 1,
  duration: 2.5,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1
});

gsap.to(".hero-divider", {
  scrollTrigger: {
    trigger: ".hero",
    start: "bottom bottom",
    end: "bottom center",
    scrub: true
  },
  opacity: 0,
  scaleX: 0.6
});





class WorksBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);

    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.clock = new THREE.Clock();

    this.init();
    this.resize();
    this.animate();

    window.addEventListener("resize", () => this.resize());
  }

  init() {
    const geometry = new THREE.PlaneGeometry(2, 2);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_resolution: {
          value: new THREE.Vector2(
            this.canvas.offsetWidth,
            this.canvas.offsetHeight
          )
        }
      },

      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,

      fragmentShader: `
        uniform float u_time;
        uniform vec2 u_resolution;

        float noise(vec2 p) {
          return sin(p.x) * sin(p.y);
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          uv -= 0.5;

          float t = u_time * 0.3;

          float wave = sin((uv.x + t) * 9.0) * 0.15;
          float vertical = smoothstep(-0.3, 0.3, uv.y + wave);

          vec3 dark = vec3(0.04, 0.0, 0.02);
          vec3 red = vec3(0.15, 0.03, 0.05);

          vec3 color = mix(dark, red, vertical);

          // subtle depth vignette
          float dist = length(uv);
          color *= 1.0 - dist * 0.8;

          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(mesh);
  }

  resize() {
    const width = this.canvas.offsetWidth;
    const height = this.canvas.offsetHeight;

    this.renderer.setSize(width, height, false);

    this.material.uniforms.u_resolution.value.set(width, height);
  }

  animate() {
    this.material.uniforms.u_time.value = this.clock.getElapsedTime();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => this.animate());
  }
}

new WorksBackground("works-bg-canvas");










// fade out hero particles slightly for transition
gsap.to(points.material, {
  scrollTrigger: {
    trigger: ".works",
    start: "top bottom",
    end: "top top",
    scrub: true
  },
  opacity: 0.05
});


const glow = document.querySelector(".cursor-glow");
const works = document.querySelector(".works");

works.addEventListener("mousemove", (e) => {
  const rect = works.getBoundingClientRect();
  gsap.to(glow, {
    x: e.clientX - rect.left - 200,
    y: e.clientY - rect.top - 200,
    duration: 0.4,
    ease: "power2.out"
  });
});


// LEFT TEXT
gsap.from(".works-left", {
  y: 60,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".works-left",
    start: "top 85%",
  }
});

// RIGHT HEADING
gsap.from(".works-heading", {
  x: 80,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".works-heading",
    start: "top 85%",
  }
});

// DIVIDER
gsap.to(".works-divider", {
  "--scale": 1,
  duration: 1.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".works-divider",
    start: "top 80%",
  }
});

// CARDS
gsap.from(".work-card", {
  y: 80,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".works-grid",
    start: "top 80%",
  }
});

/*
VANTA.FOG({
  el: "#works",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  highlightColor: 0xa11a1a,
  midtoneColor: 0x111111,
  lowlightColor: 0x000000,
  baseColor: 0x7EACB5,
  blurFactor: 0.6,
  speed: 1.2,
  zoom: 1.1
}); */

VANTA.WAVES({
  el: "#labBox",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  color: 0x1a1a1a,
  shininess: 60,
  waveHeight: 18,
  waveSpeed: 1.7,
  zoom: 1.1
});

gsap.to("#labBox", {
  scale: 1.02,
  duration: 3,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});


gsap.to(".works-heading", {
  backgroundPosition: "200% center",
  duration: 9,
  ease: "none",
  repeat: -1
});

const heading = document.querySelector(".works-heading");

document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 50;

  gsap.to(heading, {
    rotationY: x,
    rotationX: -y,
    transformPerspective: 800,
    duration: 0.6
  });
});








