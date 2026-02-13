/**
 * Terrain Module
 * Handles grid and 3D terrain generation
 */

import * as THREE from 'three';
import { generatePath } from '../utils/gameUtils.js';

class Terrain {
  constructor(scene, theme, mapData) {
    this.scene = scene;
    this.theme = theme;
    this.mapData = mapData;
    this.grid = [];
    this.path = [];
    this.cells = []; // For raycasting
    this.cellSize = 1.5;
    
    this.generate();
  }

  generate() {
    const { cols, rows } = this.mapData;
    
    // Generate random path
    this.path = generatePath(cols, rows);
    
    // Initialize grid
    for (let y = 0; y < rows; y++) {
      this.grid[y] = [];
      for (let x = 0; x < cols; x++) {
        this.grid[y][x] = {
          type: 'ground',
          tower: null
        };
      }
    }
    
    // Mark path cells
    this.path.forEach(cell => {
      this.grid[cell.y][cell.x].type = 'path';
    });
    
    // Mark spawn and base
    this.grid[this.path[0].y][this.path[0].x].type = 'spawn';
    const lastCell = this.path[this.path.length - 1];
    this.grid[lastCell.y][lastCell.x].type = 'base';
    
    // Create 3D terrain
    this.create3DTerrain();
  }

  create3DTerrain() {
    const { cols, rows } = this.mapData;
    const _hw = (cols * this.cellSize) / 2; // Half-width (reserved for future use)
    const _hh = (rows * this.cellSize) / 2; // Half-height (reserved for future use)
    
    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(
      cols * this.cellSize,
      rows * this.cellSize
    );
    const groundMaterial = new THREE.MeshLambertMaterial({
      color: this.theme.groundColor
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    
    // Create grid cells for raycasting and path visualization
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cellGeometry = new THREE.PlaneGeometry(
          this.cellSize * 0.95,
          this.cellSize * 0.95
        );
        
        let cellMaterial;
        const cellType = this.grid[y][x].type;
        
        if (cellType === 'path') {
          cellMaterial = new THREE.MeshLambertMaterial({
            color: this.theme.pathColor,
            transparent: true,
            opacity: 0.6
          });
        } else if (cellType === 'spawn' || cellType === 'base') {
          cellMaterial = new THREE.MeshBasicMaterial({
            color: cellType === 'spawn' ? 0x00ff00 : 0xff0000,
            transparent: true,
            opacity: 0.3
          });
        } else {
          cellMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0
          });
        }
        
        const cell = new THREE.Mesh(cellGeometry, cellMaterial);
        const worldPos = this.gridToWorld(x, y);
        cell.position.set(worldPos.x, 0.01, worldPos.z);
        cell.rotation.x = -Math.PI / 2;
        cell.userData = { gridX: x, gridY: y };
        
        this.scene.add(cell);
        this.cells.push(cell);
      }
    }
    
    // Add fog
    this.scene.fog = new THREE.Fog(this.theme.environmentColor, 35, 70);
  }

  gridToWorld(gridX, gridY) {
    const { cols, rows } = this.mapData;
    const x = gridX * this.cellSize - (cols * this.cellSize) / 2 + this.cellSize / 2;
    const z = gridY * this.cellSize - (rows * this.cellSize) / 2 + this.cellSize / 2;
    return { x, z };
  }

  worldToGrid(worldX, worldZ) {
    const { cols, rows } = this.mapData;
    const gridX = Math.floor((worldX + (cols * this.cellSize) / 2) / this.cellSize);
    const gridY = Math.floor((worldZ + (rows * this.cellSize) / 2) / this.cellSize);
    
    if (gridX < 0 || gridX >= cols || gridY < 0 || gridY >= rows) {
      return null;
    }
    
    return { x: gridX, y: gridY };
  }

  canPlaceTower(gridX, gridY) {
    const { cols, rows } = this.mapData;
    if (gridX < 0 || gridX >= cols || gridY < 0 || gridY >= rows) {
      return false;
    }
    
    const cell = this.grid[gridY][gridX];
    return cell.type === 'ground' && cell.tower === null;
  }

  placeTower(gridX, gridY, tower) {
    this.grid[gridY][gridX].tower = tower;
  }

  removeTower(gridX, gridY) {
    this.grid[gridY][gridX].tower = null;
  }

  getSpawnPosition() {
    const spawn = this.path[0];
    return this.gridToWorld(spawn.x, spawn.y);
  }

  getPathLength() {
    return this.path.length;
  }

  getPathPosition(index) {
    if (index >= this.path.length) return null;
    return this.gridToWorld(this.path[index].x, this.path[index].y);
  }

  dispose() {
    this.cells.forEach(cell => {
      this.scene.remove(cell);
      cell.geometry.dispose();
      cell.material.dispose();
    });
    this.cells = [];
  }
}

export default Terrain;
