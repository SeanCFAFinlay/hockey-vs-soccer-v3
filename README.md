# Hockey vs Soccer - Tower Defense Game

This is a tower defense game where hockey and soccer themes battle across multiple maps. Version 3 introduces improved graphics, stands and fans around the rink or field, semi-transparent paths, and unique projectiles for each tower.

## Structure

This project uses a modular architecture to separate engine, rendering, game logic, entities, UI, and content. The repository includes the following top-level directories:

- `engine/` – core game engine code (game loop, physics, event handling).
- `render/` – rendering code for 3D graphics, materials, lighting, and effects.
- `game/` – game-specific logic such as waves, resource management, and tower placements.
- `entities/` – code for towers, enemies, projectiles, and other in-game entities.
- `ui/` – user interface components (HUD, automation toggles, tower picker).
- `content/themes/` – theme definitions (e.g. hockey, soccer) including colours, models, and paths.
- `content/maps/` – map definitions for each theme; version 3 includes ten maps per theme.
- `HOCKEYVSOCCERV3.html` – entry point that bundles all modules and starts the game.

## Running the game

After GitHub Pages is enabled on this repository, you can play the game directly in your browser. The URL will follow this pattern:

```
https://<your-github-username>.github.io/hockey-vs-soccer-v3/HOCKEYVSOCCERV3.html
```

For example, with the current repository the link will be:

```
https://SeanCFAFinlay.github.io/hockey-vs-soccer-v3/HOCKEYVSOCCERV3.html
```

Just open this URL in your browser to play.

## Contributing

The modular structure allows adding new features, themes, towers or maps by creating new files in the appropriate directories. Pull requests are welcome for improvements or additional versions of the game.
