/**
 * Core Engine Module
 * Handles Three.js initialization and setup
 */

import * as THREE from 'three';

class Engine {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.hemiLight = null;
    this.dirLight = null;
    this.rimLight = null;
    this.appliedSettings = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // Bind resize handler to preserve 'this' context
    this.onResize = this.onResize.bind(this);
    
    this.init();
  }

  init() {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 150);
    this.camera.position.set(0, 20, 25);
    this.camera.lookAt(0, 0, 0);
    
    // Create renderer with mobile optimizations
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    
    // Clamp pixel ratio to 2 max for mobile performance
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    
    // Append to container
    this.container.appendChild(this.renderer.domElement);
    
    // Setup lighting
    this.setupLights();
    
    // Handle window resize
    window.addEventListener('resize', this.onResize);
  }

  setupLights() {
    // Hemisphere light for ambient outdoor feel
    this.hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x222222, 0.6);
    this.scene.add(this.hemiLight);
    
    // Main directional light with optimized shadows
    this.dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    this.dirLight.position.set(10, 20, 10);
    this.dirLight.castShadow = true;
    
    // Shadow camera setup
    this.dirLight.shadow.camera.left = -25;
    this.dirLight.shadow.camera.right = 25;
    this.dirLight.shadow.camera.top = 25;
    this.dirLight.shadow.camera.bottom = -25;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 50;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.bias = -0.0001;
    
    this.scene.add(this.dirLight);
    
    // Rim light for depth
    this.rimLight = new THREE.DirectionalLight(0x4488ff, 0.3);
    this.rimLight.position.set(-10, 5, -10);
    this.scene.add(this.rimLight);
  }

  applyQualitySettings(settings) {
    if (!settings) return;
    
    const pixelRatio = Math.min(window.devicePixelRatio * settings.resolutionScale, settings.pixelRatio);
    let resized = false;
    
    if (!this.appliedSettings || this.appliedSettings.pixelRatio !== pixelRatio) {
      this.renderer.setPixelRatio(pixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      resized = true;
    }
    
    if (!this.appliedSettings || this.appliedSettings.toneMappingExposure !== settings.toneMappingExposure) {
      this.renderer.toneMappingExposure = settings.toneMappingExposure;
    }
    
    if (this.dirLight) {
      if (!this.appliedSettings || this.appliedSettings.shadowMapSize !== settings.shadowMapSize) {
        this.dirLight.shadow.mapSize.set(settings.shadowMapSize, settings.shadowMapSize);
        this.dirLight.shadow.needsUpdate = true;
      }
      
      if (!this.appliedSettings || this.appliedSettings.shadowSoftness !== settings.shadowSoftness) {
        this.dirLight.shadow.radius = settings.shadowSoftness;
      }
    }

    if (!this.appliedSettings || this.appliedSettings.textureAnisotropy !== settings.textureAnisotropy) {
      this.applyTextureQuality(settings.textureAnisotropy);
    }
    
    this.appliedSettings = {
      pixelRatio,
      shadowMapSize: settings.shadowMapSize,
      shadowSoftness: settings.shadowSoftness,
      toneMappingExposure: settings.toneMappingExposure,
      textureAnisotropy: settings.textureAnisotropy
    };
    
    return resized;
  }

  applyTextureQuality(anisotropy) {
    if (!this.renderer) return;
    
    const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
    const target = Math.min(anisotropy, maxAnisotropy);
    
    this.scene.traverse(object => {
      if (!object.material) return;
      
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach(material => {
        if (material.map) {
          material.map.anisotropy = target;
          material.map.needsUpdate = true;
        }
      });
    });
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}

export default Engine;
