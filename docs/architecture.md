# Gravity Wells TD Architecture Overview

Gravity Wells TD is a TypeScript-powered tower defense prototype rendered on an HTML5 canvas. The
project emphasises modular systems so that core mechanics—gravitational towers, geodesic creeps and
global mass management—can evolve independently while sharing a lightweight engine layer.

## High-level layout

```
src/
├── engine/         # Rendering surface + frame loop
├── game/
│   ├── world/      # Potential field sampling and visualisation
│   ├── towers/     # Gravity-well tower hierarchy
│   ├── creeps/     # Entities steered by the field gradient
│   ├── systems/    # Shared managers (mass budget, thermostat, etc.)
│   └── ui/         # Canvas overlays and HUD widgets
├── config/         # Gameplay tuning data (YAML/JSON)
└── main.ts         # Entry point bootstrapping the game
```

## Simulation flow

1. **Bootstrap** – `main.ts` mounts the game into the `#app` container.
2. **Engine** – `CanvasManager` handles device-pixel aware resizing; `GameLoop` triggers update +
   render callbacks.
3. **Field synthesis** – `PotentialField` combines tower potentials with a baseline thermostat to
   produce a scalar potential grid every frame. Gradients are approximated numerically.
4. **Creep steering** – `Creep` instances move according to a default path direction perturbed by the
   negative gradient of φ, causing them to arc around wells.
5. **Mass budget + HUD** – `MassManager` tracks the total tower mass; `HudOverlay` displays current
   values and thermostat state.
6. **Rendering** – The potential grid is drawn as a heat map underneath stylised tower rings and
   creeps.

## Next steps

- Expand the tower roster (frame draggers, rails) with bespoke subclasses.
- Introduce enemy variety (boss counter-warps, fragmenting drones) driven by config data.
- Externalise balance data into YAML within `src/config/` and load it asynchronously.
- Implement interactive placement/removal plus real thermostat controls via UI.
- Add automated tests (Vitest) covering potential field maths and tower interactions.
