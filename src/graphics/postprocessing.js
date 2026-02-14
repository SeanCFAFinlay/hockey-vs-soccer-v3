/**
 * Postprocessing Module
 * Handles visual effects pipeline
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';

class PostProcessing {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.composer = null;
    this.bloomPass = null;
    this.smaaPass = null;
    this.enabled = true;
    
    this.init();
  }

  init() {
    // Create composer
    this.composer = new EffectComposer(this.renderer);
    
    // Render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    // SMAA anti-aliasing pass
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.smaaPass = new SMAAPass(width, height);
    this.composer.addPass(this.smaaPass);
    
    // Bloom pass (subtle)
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.5,  // strength
      0.4,  // radius
      0.85  // threshold
    );
    this.composer.addPass(this.bloomPass);
  }

  setQuality(settings) {
    if (!settings.postprocessing) {
      this.enabled = false;
      return;
    }
    
    this.enabled = true;
    
    // Adjust bloom based on quality
    if (this.bloomPass) {
      this.bloomPass.strength = settings.bloomStrength;
      this.bloomPass.radius = settings.bloomRadius;
      this.bloomPass.threshold = settings.bloomThreshold;
    }

    if (this.smaaPass) {
      this.smaaPass.enabled = true;
    }
  }

  render() {
    if (this.enabled && this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (this.composer) {
      this.composer.setSize(width, height);
    }

    if (this.smaaPass) {
      this.smaaPass.setSize(width, height);
    }
  }

  dispose() {
    if (this.composer) {
      this.composer.dispose();
    }
  }
}

export default PostProcessing;
