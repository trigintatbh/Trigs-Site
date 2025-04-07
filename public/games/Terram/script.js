// Wrap in an Immediately Invoked Function Expression (IIFE) to avoid global scope pollution
(() => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    // Crucial for pixel art if using nearest-neighbor scaling for block images
    ctx.imageSmoothingEnabled = false;

    // --- Game Settings ---
    const TILE_SIZE = 32;
    const HOTBAR_SLOTS = 9;
    const PLAYER_REACH = 5 * TILE_SIZE; // Max distance player can dig/place
    const MAX_STACK_SIZE = 99;

    const WORLD_WIDTH_TILES = 1000; // Example: Increased from 200
    const WORLD_HEIGHT_TILES = 500; // Example: Increased from 200
    let SURFACE_LEVEL = 150; // Adjust base surface level for deeper world (e.g., from 60)

    // --- DOM Elements ---
    const moneyEl = document.getElementById('money');
    const playerCoordsXEl = document.getElementById('player-coords-x');
    const playerCoordsYEl = document.getElementById('player-coords-y');
    const sellButton = document.getElementById('sell-button');
    const sellValueEl = document.getElementById('sell-value');
    const upgradeToolButton = document.getElementById('upgrade-tool-button'); // Needs rethinking with NPC later
    const upgradeInventoryButton = document.getElementById('upgrade-inventory-button'); // Needs rethinking with NPC later
    const toolCostEl = document.getElementById('tool-cost'); // For NPC later
    const inventoryCostEl = document.getElementById('inventory-cost'); // For NPC later
    const hotbarEl = document.getElementById('hotbar');
    const inventoryScreen = document.getElementById('inventory-screen');
    const inventoryGridEl = document.getElementById('inventory-grid');
    const closeInventoryButton = document.getElementById('close-inventory-button');
    const messageLogEl = document.getElementById('message-log');
    const fpsEl = document.getElementById('fps');

    // --- Game State ---
    let player = {
        x: (WORLD_WIDTH_TILES / 2) * TILE_SIZE,
        y: (SURFACE_LEVEL - 1) * TILE_SIZE,
        width: TILE_SIZE * 0.8,
        height: TILE_SIZE * 0.9,
        vx: 0, vy: 0, onGround: false,
        inventory: new Array(5).fill(null), // Start with 5 slots
        inventorySize: 5, // Number of slots
        selectedHotbarSlot: 0,
        money: 0,
        health: 100,
        maxHealth: 100,
        pickupCooldown: 0,
    };

    let camera = {
        x: player.x - canvas.width / 2,
        y: player.y - canvas.height / 2,
    };

    let world = []; // 2D array of block IDs
    let keys = {};
    let mouse = { x: 0, y: 0, worldX: 0, worldY: 0, tileX: 0, tileY: 0, down: false };
    let toolUpgradeCost = 50; // Placeholder costs, move to NPC interaction later
    let inventoryUpgradeCost = 25;
    let isDigging = false;
    let currentDigTarget = null;
    let inventoryOpen = false;

    // Entity System
    let entities = []; // Holds Mobs, DroppedItems, NPCs

// --- NEW: NPC Definition (can add more types later) ---
const npcDefinitions = {
    'guide': {
        name: 'Guide',
        health: 100,
        color: 'cyan', // Placeholder color
        width: TILE_SIZE * 0.8,
        height: TILE_SIZE * 1.8, // Taller than player?
        speed: 50, // pixels per second
    }
};

// --- Add near other game state variables ---
let guideNPC = null; // Holds the guide entity reference

// --- NEW: Function to Spawn NPC ---
// --- NEW: Function to Spawn NPC ---
function spawnGuideNPC() {
    // Calculate spawn position (adjust as needed)
    const spawnTileX = Math.floor(WORLD_WIDTH_TILES / 2) + 5;
    const spawnSurfaceY = findSurfaceY(spawnTileX); // Use your existing helper
     // Place feet slightly above the surface tile
    const spawnY = spawnSurfaceY * TILE_SIZE - (npcDefinitions['guide'].height || TILE_SIZE * 1.8) - 1;
    const spawnX = spawnTileX * TILE_SIZE;


    const definition = npcDefinitions['guide'];
    if (!definition) { console.error("Guide definition missing!"); return; }

    // Create the NPC entity object
    guideNPC = {
        type: 'npc',
        subtype: 'guide',
        x: spawnX, y: spawnY,
        vx: 0, vy: 0, onGround: false,
        width: definition.width, height: definition.height,
        health: definition.health, maxHealth: definition.health,
        color: definition.color,
        aiState: 'idle', // 'idle', 'wandering'
        aiTimer: 2 + Math.random() * 3, // Start idle for a bit
        wanderDirection: 1, // 1 for right, -1 for left
    };
    entities.push(guideNPC); // Add the guide to the main entity list
    logMessage("A Guide has arrived!");
}

// --- NEW: Function to Update NPCs (called in updateEntities) ---
// --- Improved NPC Update Function ---
// --- NPC Update Function (Handles AI & Physics) ---
function updateNPC(npc, deltaTime) {
    const definition = npcDefinitions[npc.subtype];
    if (!definition) return;

    // Constants for NPC physics
    const gravity = 1200;
    const maxFallSpeed = 700;
    const npcGroundFriction = 0.85;
    const epsilon = 0.1;

    // --- Apply Gravity ---
    if (!npc.onGround) {
        npc.vy += gravity * deltaTime;
        npc.vy = Math.min(npc.vy, maxFallSpeed);
    }

    // --- Simple Wander AI ---
    npc.aiTimer -= deltaTime;
    if (npc.aiTimer <= 0) {
        const choice = Math.random();
        if (npc.aiState === 'idle') { // If Idle -> Decide to Wander or Stay Idle
            if (choice < 0.6) { // Wander
                npc.aiState = 'wandering';
                npc.aiTimer = 2.5 + Math.random() * 3; // Wander time
                npc.wanderDirection = (Math.random() < 0.5) ? 1 : -1;
                npc.vx = npc.wanderDirection * definition.speed;
            } else { // Stay Idle
                npc.aiState = 'idle';
                npc.aiTimer = 1.5 + Math.random() * 2; // Idle time
                npc.vx = 0;
            }
        } else { // Was wandering -> Decide to Stop or Continue
             if (choice < 0.2) { // Keep wandering
                 npc.aiState = 'wandering';
                 npc.aiTimer = 2 + Math.random() * 3;
                 // Optional: Small chance to turn around randomly
                 npc.wanderDirection = (Math.random() < 0.1) ? -npc.wanderDirection : npc.wanderDirection;
                 npc.vx = npc.wanderDirection * definition.speed;
            } else { // Go idle
                npc.aiState = 'idle';
                npc.aiTimer = 1 + Math.random() * 2;
                npc.vx = 0; // Stop moving
            }
        }
    }

    // Apply ground friction if AI state is idle (trying to stop)
     if (npc.onGround && npc.aiState === 'idle' && npc.vx !== 0) {
         npc.vx *= npcGroundFriction;
         if (Math.abs(npc.vx) < epsilon) npc.vx = 0;
     }


    // --- Movement & Collision ---
    let newX = npc.x + npc.vx * deltaTime;
    let newY = npc.y + npc.vy * deltaTime;

    // Horizontal Collision (Check ahead at feet and mid-height)
    const checkXForward = npc.vx > 0 ? newX + npc.width : newX;
    const checkYMid = newY + npc.height * 0.5;
    const checkYFeetH = newY + npc.height - epsilon; // Check near feet horizontally

    const blockAheadMid = getBlock(checkXForward, checkYMid);
    const blockAheadFeet = getBlock(checkXForward, checkYFeetH);

    // Check if hitting a solid, non-transparent block
    if ((blockAheadMid && blockAheadMid.id !== 0 && !blockAheadMid.transparent) ||
        (blockAheadFeet && blockAheadFeet.id !== 0 && !blockAheadFeet.transparent) )
    {
        // Hit a wall
        newX = npc.x; // Stop horizontal move by reverting X
        npc.vx = 0; // Stop velocity
        // Force AI change
        npc.wanderDirection *= -1; // Reverse intended direction for next wander
        npc.aiState = 'idle';
        npc.aiTimer = 0.3 + Math.random() * 0.5; // Short idle after hitting wall
    }
    npc.x = newX; // Apply horizontal position


    // Vertical Collision (Check below feet at multiple points)
    const checkYBelow = newY + npc.height + epsilon;
    const checkXMidFeetV = npc.x + npc.width / 2; // Use current X for vertical check
    const checkXLeftFeetV = npc.x + npc.width * 0.1;
    const checkXRightFeetV = npc.x + npc.width * 0.9;

    const blockBelowMid = getBlock(checkXMidFeetV, checkYBelow);
    const blockBelowLeft = getBlock(checkXLeftFeetV, checkYBelow);
    const blockBelowRight = getBlock(checkXRightFeetV, checkYBelow);

    const isGroundBelow = (blockBelowMid && blockBelowMid.id !== 0 && !blockBelowMid.transparent) ||
                          (blockBelowLeft && blockBelowLeft.id !== 0 && !blockBelowLeft.transparent) ||
                          (blockBelowRight && blockBelowRight.id !== 0 && !blockBelowRight.transparent);

    if (isGroundBelow && npc.vy >= 0) { // Landed on ground (or sliding down onto it)
        // Adjust Y position to be exactly on top of the ground tile
        npc.y = Math.floor(checkYBelow / TILE_SIZE) * TILE_SIZE - npc.height - epsilon;
        npc.vy = 0; // Stop vertical velocity
        npc.onGround = true;
    } else { // In the air or moving upwards
        npc.y = newY; // Apply vertical movement
        npc.onGround = false;
    }

    // Keep within world bounds horizontally
    npc.x = Math.max(0, Math.min(npc.x, WORLD_WIDTH_TILES * TILE_SIZE - npc.width));
    // Optional: Prevent falling out of world?
     if (npc.y > WORLD_HEIGHT_TILES * TILE_SIZE + TILE_SIZE*2) { // Give some leeway before respawn
          // Respawn near center surface?
          const respawnTileX = Math.floor(WORLD_WIDTH_TILES / 2);
          const respawnSurfaceY = findSurfaceY(respawnTileX);
          npc.y = respawnSurfaceY * TILE_SIZE - npc.height - 1;
          npc.x = respawnTileX * TILE_SIZE;
          npc.vy = 0; npc.vx = 0; npc.onGround = true;
          logMessage(`${npc.subtype || 'NPC'} fell out of the world and respawned!`);
      }
}

// --- Modify updateEntities to call updateNPC ---
function updateEntities(deltaTime) {
    entities = entities.filter(entity => {
        if (entity.toBeRemoved) return false;
        switch (entity.type) {
            case 'dropped_item': updateDroppedItem(entity, deltaTime); break;
            case 'npc': updateNPC(entity, deltaTime); break; // <<< ENSURE THIS LINE IS PRESENT
            // case 'mob': updateMobAI(entity, deltaTime); break;
        }
        return true;
    });
}

// --- NEW: Function to Open Guide Shop (Placeholder) ---
function openGuideShop(npc) {
    logMessage(`Interacted with ${npcDefinitions[npc.subtype]?.name || 'NPC'}!`);
    // TODO: Implement actual Shop UI panel here
    // This panel would show options:
    // - Sell (maybe opens inventory with sell prices?)
    // - Upgrade Tool (show requirements for selected hotbar tool, button calls upgradeTool())
    // - Upgrade Inventory (show cost, button calls upgradeInventorySlots())

    // For now, maybe just trigger the temporary upgrade buttons as a test?
    // upgradeTool(); // Temporarily call the function directly
}

// --- Modify mousedown listener to check for NPC click ---
canvas.addEventListener('mousedown', (e) => {
    if (inventoryOpen) return;
    mouse.down = true;

    // Check for NPC interaction first
    let clickedOnNPC = null;
    if (guideNPC) { // Check if guide exists
         const npcRect = { x: guideNPC.x, y: guideNPC.y, width: guideNPC.width, height: guideNPC.height };
         const mouseRect = { x: mouse.worldX, y: mouse.worldY, width: 1, height: 1 }; // Treat mouse as 1x1 pixel
        if (rectCollision(npcRect, mouseRect)) {
            clickedOnNPC = guideNPC;
        }
    }

    if (clickedOnNPC) {
        // Interact with NPC instead of digging/placing/attacking
        openGuideShop(clickedOnNPC);
    }
    else if (e.button === 0) { // Left Click (Dig/Attack)
        cancelDigging();
        let clickedOnMob = false; // TODO: Check entity collision for attack
        if (!clickedOnMob) { startDigging(mouse.tileX, mouse.tileY); }
        // else { handleAttack(mouse.worldX, mouse.worldY); }
    } else if (e.button === 2) { // Right Click (Place)
         placeBlock(mouse.tileX, mouse.tileY);
    }
});

    // Time System
    let gameTime = 0;
    const DAY_DURATION = 60 * 10; // 10 minutes
    const NIGHT_DURATION = 60 * 5; // 5 minutes
    const FULL_CYCLE = DAY_DURATION + NIGHT_DURATION;
    let timeOfDay = 'day';
    let skyColor = 'lightblue';

    // FPS calculation
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let fps = 0;

    // Asset Loading
    let images = {};
    let assetsLoaded = false;

    // --- Fist Stats ---
    const FIST_STATS = { toolPower: 1, damage: 3, speedModifier: 1.2 };

    // --- Item & Block Definitions ---
    const itemDefinitions = {
        // Existing block/item definitions...
        'grass': { type: 'block', stackSize: MAX_STACK_SIZE, hardness: 0.3, toolRequired: 'any', drop: 'dirt', placeable: 1, color: '#34A853' },
        'dirt': { type: 'block', stackSize: MAX_STACK_SIZE, hardness: 0.3, toolRequired: 'any', drop: 'dirt', placeable: 2, color: '#8B4513' },
        'stone': { type: 'block', stackSize: MAX_STACK_SIZE, hardness: 4.5, toolRequired: 'pickaxe', drop: 'stone', placeable: 3, color: '#808080' },
        'coal_ore': { type: 'block', stackSize: MAX_STACK_SIZE, hardness: 8, toolRequired: 'pickaxe', drop: 'coal', placeable: 4, color: '#505050' },
        'iron_ore': { type: 'block', stackSize: MAX_STACK_SIZE, hardness: 15, toolRequired: 'pickaxe', drop: 'iron_ore', placeable: 5, color: '#A19D94' },
        'gold_ore': { type: 'block', stackSize: MAX_STACK_SIZE, hardness: 20, toolRequired: 'pickaxe', drop: 'gold_ore', placeable: 6, color: '#FFD700' },
        'diamond_ore': { type: 'block', stackSize: MAX_STACK_SIZE, hardness: 40, toolRequired: 'pickaxe', drop: 'diamond_ore', placeable: 7, color: '#B9F2FF' },
        'bedrock': { type: 'block', stackSize: MAX_STACK_SIZE, hardness: Infinity, toolRequired: 'none', drop: null, placeable: 8, color: '#202020' },
        'wood': { type: 'block', stackSize: MAX_STACK_SIZE, hardness: 3, toolRequired: 'axe', drop: 'wood', placeable: 9, color: '#A0522D' },
        'leaves': { type: 'block', stackSize: MAX_STACK_SIZE, hardness: 0.05, toolRequired: 'any', drop: 'sapling', placeable: 10, transparent: true, color: '#228B22' },
    
        // New Ores
        'copper_ore': { type: 'block', stackSize: MAX_STACK_SIZE, hardness: 6, toolRequired: 'pickaxe', drop: 'copper_ore', placeable: 11, color: '#B87333' },
        'tin_ore': { type: 'block', stackSize: MAX_STACK_SIZE, hardness: 6, toolRequired: 'pickaxe', drop: 'tin_ore', placeable: 12, color: '#D3D3D3' },
        'bronze_ore': { type: 'block', stackSize: MAX_STACK_SIZE, hardness: 7, toolRequired: 'pickaxe', drop: 'bronze_ore', placeable: 13, color: '#CD7F32' },
        'silver_ore': { type: 'block', stackSize: MAX_STACK_SIZE, hardness: 8, toolRequired: 'pickaxe', drop: 'silver_ore', placeable: 14, color: '#C0C0C0' },
    
        // Items (non-placeable) and Tools
        'coal': { type: 'item', stackSize: MAX_STACK_SIZE, value: 5, color: '#363636' },
        'iron_ingot': { type: 'item', stackSize: MAX_STACK_SIZE, value: 15, color: '#A0A0A0' },
        'gold_ingot': { type: 'item', stackSize: MAX_STACK_SIZE, value: 30, color: '#EAC117' },
        'diamond': { type: 'item', stackSize: MAX_STACK_SIZE, value: 100, color: '#ADD8E6' },
        'sapling': { type: 'item', stackSize: MAX_STACK_SIZE, value: 1, color: '#90EE90' },
    
        // Basic copper tools
        'copper_pickaxe': { type: 'item', stackSize: 1, toolType: 'pickaxe', toolPower: 4, speedModifier: 0.9, value: 0, color: '#B87333' },
        'copper_axe': { type: 'item', stackSize: 1, toolType: 'axe', toolPower: 3, speedModifier: 0.9, value: 0, color: '#B87333' },
        'copper_sword': { type: 'item', stackSize: 1, toolType: 'sword', damage: 10, speedModifier: 1.0, value: 0, color: '#B87333' },
    
        // Upgraded pickaxes (full definitions)
        'tin_pickaxe': { type: 'item', stackSize: 1, toolType: 'pickaxe', toolPower: 6, speedModifier: 0.85, value: 0, color: '#D3D3D3' },
        'bronze_pickaxe': { type: 'item', stackSize: 1, toolType: 'pickaxe', toolPower: 8, speedModifier: 0.8, value: 0, color: '#CD7F32' },
        'silver_pickaxe': { type: 'item', stackSize: 1, toolType: 'pickaxe', toolPower: 10, speedModifier: 0.75, value: 0, color: '#C0C0C0' },
        'gold_pickaxe': { type: 'item', stackSize: 1, toolType: 'pickaxe', toolPower: 12, speedModifier: 0.7, value: 0, color: '#FFD700' },
        'iron_pickaxe': { type: 'item', stackSize: 1, toolType: 'pickaxe', toolPower: 14, speedModifier: 0.65, value: 0, color: '#A19D94' },
        'diamond_pickaxe': { type: 'item', stackSize: 1, toolType: 'pickaxe', toolPower: 16, speedModifier: 0.6, value: 0, color: '#B9F2FF' }
    };
    
    // --- Tool Upgrade Mapping ---
    // Defines the upgrade path for pickaxes. (You can extend this mapping to other tools later.)
    const toolUpgradeMapping = {
        'copper_pickaxe': { next: 'tin_pickaxe', requiredOre: 'tin_ore', oreCount: 5, cost: 50 },
        'tin_pickaxe':    { next: 'bronze_pickaxe', requiredOre: 'bronze_ore', oreCount: 5, cost: 75 },
        'bronze_pickaxe': { next: 'silver_pickaxe', requiredOre: 'silver_ore', oreCount: 4, cost: 100 },
        'silver_pickaxe': { next: 'gold_pickaxe', requiredOre: 'gold_ore', oreCount: 3, cost: 150 },
        'gold_pickaxe':   { next: 'iron_pickaxe', requiredOre: 'iron_ore', oreCount: 3, cost: 200 }, // Assumes you add iron_ore item for dropping
        'iron_pickaxe':   { next: 'diamond_pickaxe', requiredOre: 'diamond', oreCount: 2, cost: 300 }, // Assumes you add diamond item for dropping
        'diamond_pickaxe': null // Max tier reached
        // TODO: Add similar mappings for 'copper_axe' -> 'tin_axe' etc.
        // TODO: Add similar mappings for 'copper_sword' -> 'tin_sword' etc.
    };

    // --- Utility Functions ---

    // Simple distance calculation
     function distance(x1, y1, x2, y2) {
         const dx = x1 - x2;
         const dy = y1 - y2;
         return Math.sqrt(dx * dx + dy * dy);
     }

     // Simple Rectangle Collision check
      function rectCollision(rect1, rect2) {
         return (
             rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y
         );
     }

    function getBlockId(tileX, tileY) {
         if (tileX >= 0 && tileX < WORLD_WIDTH_TILES && tileY >= 0 && tileY < WORLD_HEIGHT_TILES) {
             return world[tileY]?.[tileX] ?? 0; // Return 0 if row or cell is undefined
         }
         return 0; // Out of bounds is effectively air
     }

    // Find item definition by numerical ID (used by getBlock)
    function findDefinitionById(blockId) {
        for(const name in itemDefinitions) {
            if(itemDefinitions[name].type === 'block' && itemDefinitions[name].placeable === blockId) {
                // Return a copy including the name and the original definition
                return { ...itemDefinitions[name], name: name, id: blockId };
            }
        }
        // Special case for Air (ID 0)
        if (blockId === 0) {
            return { name: 'air', id: 0, type: 'block', hardness: 0, transparent: true };
        }
        return null;
    }

    function getBlock(worldX, worldY) {
        const tileX = Math.floor(worldX / TILE_SIZE);
        const tileY = Math.floor(worldY / TILE_SIZE);
        const blockId = getBlockId(tileX, tileY);
        const definition = findDefinitionById(blockId);

        return definition ? { ...definition, x: tileX, y: tileY } : null;
    }

    function setBlock(tileX, tileY, blockId) {
        if (tileX >= 0 && tileX < WORLD_WIDTH_TILES && tileY >= 0 && tileY < WORLD_HEIGHT_TILES) {
            if (world[tileY]) {
                world[tileY][tileX] = blockId;
            }
        }
    }

    // Simple message logging
    let messageTimer = null;
    function logMessage(msg) {
        console.log(msg);
        const p = document.createElement('p');
        p.textContent = msg;
        messageLogEl.appendChild(p);
        while (messageLogEl.childElementCount > 5) {
            messageLogEl.removeChild(messageLogEl.firstChild);
        }
        messageLogEl.classList.add('active');
        clearTimeout(messageTimer);
        messageTimer = setTimeout(() => {
             messageLogEl.classList.remove('active');
        }, 4000);
    }

    // --- Asset Loading ---
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (err) => {
                console.warn("Failed to load image:", src); // Warn instead of reject all
                resolve(null); // Resolve with null if image fails
            };
            img.src = src;
        });
    }

    async function preloadAssets() {
        logMessage("Loading assets...");
        images = {}; // Reset images object

        const promises = [];
        for (const itemName in itemDefinitions) {
            const definition = itemDefinitions[itemName];
            let pathType = definition.type === 'block' ? 'blocks' : 'items';
            const src = `media/images/${pathType}/${itemName}.png`;

            definition.imagePath = src; // Store the path

            promises.push(
                loadImage(src).then(img => {
                    if (img) { // Only store if image loaded successfully
                       images[itemName] = img;
                    } else {
                        images[itemName] = null; // Mark as failed to load
                    }
                })// No catch needed here as loadImage resolves null on error
            );
        }
        // Don't use Promise.all's reject behavior, let all attempts finish
        await Promise.all(promises);
        assetsLoaded = true;
        logMessage(`Assets loaded (${Object.values(images).filter(img => img !== null).length} successful)!`);

    }

    // --- World Generation ---
     // --- Improved World Generation ---
     function generateWorld() {
        logMessage("Generating world...");
        world = [];
        for (let y = 0; y < WORLD_HEIGHT_TILES; y++) {
            world.push(new Array(WORLD_WIDTH_TILES).fill(0)); // Fill with air (ID 0)
        }
    
        // --- Noise Generation Functions ---
        // Simple pseudo-random generator based on coordinates (for reproducibility if needed)
        const seededRandom = (x, y, seed) => {
            let h = seed + x * 374761393 + y * 668265263; // Combine seeds and coords
            h = (h ^ (h >> 13)) * 1274126177;
            return ((h ^ (h >> 16)) >>> 0) / 4294967296; // Normalize to 0-1
        };
    
        // Basic 1D noise combining sine waves
        const simpleNoise1D = (x, scale, seed = 1) => {
            const s = x / scale;
            return (Math.sin(s * 1.0 + seed * 10.1) * 0.5 +
                    Math.sin(s * 2.1 + seed * 20.2) * 0.25 +
                    Math.sin(s * 5.3 + seed * 30.3) * 0.15 +
                    Math.sin(s * 11.7+ seed * 40.4) * 0.1 ) / (0.5 + 0.25 + 0.15 + 0.1); // Normalize roughly
        };
    
         // Basic 2D noise simulation using the seeded random function
         // Smoother noise usually requires Perlin/Simplex noise libraries
        const simpleNoise2D = (x, y, scale, seed = 1) => {
             const gridX = Math.floor(x / scale);
             const gridY = Math.floor(y / scale);
             const localX = (x / scale) - gridX; // Fractional part 0-1
             const localY = (y / scale) - gridY;
    
             // Get random values at the four corners of the grid cell
             const r00 = seededRandom(gridX, gridY, seed);
             const r10 = seededRandom(gridX + 1, gridY, seed);
             const r01 = seededRandom(gridX, gridY + 1, seed);
             const r11 = seededRandom(gridX + 1, gridY + 1, seed);
    
             // Simple bilinear interpolation
             const sx = localX * localX * (3 - 2 * localX); // Smoothstep curve
             const sy = localY * localY * (3 - 2 * localY);
    
             const nx0 = r00 + sx * (r10 - r00);
             const nx1 = r01 + sx * (r11 - r01);
             return nx0 + sy * (nx1 - nx0); // Interpolate vertically
        };
    
    
        // --- Terrain Parameters ---
        SURFACE_LEVEL = Math.max(40, Math.min(WORLD_HEIGHT_TILES - 60, Math.floor(WORLD_HEIGHT_TILES * 0.3))); // Adjust base surface
        const baseNoiseScale = 150; // Wider features
        const baseAmplitude = 40;   // Larger height variation
        const detailNoiseScale = 45;
        const detailAmplitude = 15;
        const fineNoiseScale = 20;
        const fineAmplitude = 5;
    
        // --- Generate Height Map ---
        let surfaceYMap = [];
        for (let x = 0; x < WORLD_WIDTH_TILES; x++) {
            const baseHeight = simpleNoise1D(x, baseNoiseScale, 1) * baseAmplitude;
            const detailHeight = simpleNoise1D(x, detailNoiseScale, 2) * detailAmplitude;
            const fineHeight = simpleNoise1D(x, fineNoiseScale, 3) * fineAmplitude;
            let totalHeightVariation = baseHeight + detailHeight + fineHeight;
    
            // // Optional large feature modifier (uncomment and adjust if desired)
            // const mountainScale = 400;
            // const mountainAmplitude = 60;
            // const mountainMod = simpleNoise1D(x, mountainScale, 4);
            // if (mountainMod > 0.4) { totalHeightVariation += (mountainMod - 0.4) * mountainAmplitude * 1.5;}
            // else if (mountainMod < -0.6) { totalHeightVariation += (mountainMod + 0.6) * mountainAmplitude * 1.2;}
    
            surfaceYMap[x] = Math.round(SURFACE_LEVEL + totalHeightVariation);
            surfaceYMap[x] = Math.max(15, Math.min(WORLD_HEIGHT_TILES - 20, surfaceYMap[x])); // Clamp height
        }
    
        // --- Fill Blocks & Generate Caves ---
        const caveNoiseScale = 35;
        const caveThreshold = 0.62; // Adjust this value: lower = more caves, higher = fewer caves
    
        for (let x = 0; x < WORLD_WIDTH_TILES; x++) {
            const surfaceY = surfaceYMap[x];
            const dirtDepth = 5 + Math.floor(seededRandom(x, 0, 10) * 5); // Vary dirt depth slightly
    
            // Fill from surface down to bottom first
            for (let y = surfaceY; y < WORLD_HEIGHT_TILES; y++) {
                let blockId = 3; // Default to Stone
    
                // Determine block type based on depth below local surface
                if (y === surfaceY) {
                    // Place Grass (ID 1) or Dirt (ID 2) at surfaceY
                    blockId = (world[y - 1]?.[x] === 0) ? 1 : 2; // Grass if air above, else dirt
                } else if (y < surfaceY + dirtDepth) {
                    blockId = 2; // Dirt
                } else {
                    // It's Stone or Ore below the dirt layer
                    blockId = 3; // Stone
                    const depthFactor = Math.min(1, (y - surfaceY) / (WORLD_HEIGHT_TILES * 0.7));
                    const oreNoiseScale = 9;
                    const oreNoise = simpleNoise1D(x * 1.5 + y * 0.5, oreNoiseScale, 5);
    
                    // Ore generation logic (adjust thresholds as needed)
                    if (oreNoise > 0.75 && y > surfaceY + 5) { blockId = 11; }       // Copper Ore
                    else if (oreNoise > 0.80 && y > surfaceY + 8) { blockId = 12; }      // Tin Ore
                    else if (oreNoise > 0.85 && y > surfaceY + 12) { blockId = 13; }      // Bronze Ore
                    else if (oreNoise > 0.90 && y > surfaceY + 20) { blockId = 14; }      // Silver Ore
                    else if (oreNoise > 0.92 && y > surfaceY + 30) { blockId = 5; }       // Iron Ore
                    else if (oreNoise > 0.95 && y > surfaceY + 45) { blockId = 6; }       // Gold Ore
                    else if (oreNoise > 0.97 && y > surfaceY + 60) { blockId = 7; }       // Diamond Ore
                    else if (oreNoise < -0.55 && y > surfaceY + 10){ blockId = 4;}      // Coal
                }
    
                 // --- Cave Generation Pass (Overwrites solid blocks with air) ---
                 const caveNoiseValue = simpleNoise2D(x, y, caveNoiseScale, 20);
                 if (y > surfaceY + 3 && caveNoiseValue > caveThreshold) { // Don't carve caves right at surface
                      // Make caves wider near the middle threshold? Optional.
                      // const caveWidenFactor = 1.0 - Math.abs(caveNoiseValue - caveThreshold) * 3; // Widen near threshold
                      // if (Math.random() < caveWidenFactor) blockId = 0;
                      blockId = 0; // Set to Air
                 }
    
    
                // --- Bedrock Layer --- (Ensures bottom is solid)
                if (y >= WORLD_HEIGHT_TILES - 5) {
                    if (seededRandom(x, y, 30) > (WORLD_HEIGHT_TILES - y - 1) * 0.2) blockId = 8;
                }
                if (y >= WORLD_HEIGHT_TILES - 1) blockId = 8;
    
                world[y][x] = blockId;
            }
        }
    
        // --- Place Trees (After terrain and caves are set) ---
         for (let x = 0; x < WORLD_WIDTH_TILES; x++) {
             const surfaceY = surfaceYMap[x];
             if (world[surfaceY]?.[x] === 1 && seededRandom(x, 0, 40) < 0.07 && (x % 4 > 0)) { // Use seeded random, add spacing
                 const treeHeight = 4 + Math.floor(seededRandom(x, 1, 41) * 4);
                 const leafRadius = 2;
                 let canPlaceTrunk = true;
                 for(let trunkY = surfaceY - treeHeight; trunkY < surfaceY; trunkY++) {
                     if(getBlockId(x, trunkY) !== 0) { canPlaceTrunk = false; break; }
                 }
                 if(canPlaceTrunk){
                      for (let th = 0; th < treeHeight; th++) { setBlock(x, surfaceY - 1 - th, 9); } // Wood
                      const leafCenterY = surfaceY - treeHeight;
                      for (let ly = leafCenterY - leafRadius; ly <= leafCenterY + 1; ly++) {
                          for (let lx = x - leafRadius; lx <= x + leafRadius; lx++) {
                              const distSq = (lx - x) * (lx - x) + (ly - leafCenterY) * (ly - leafCenterY);
                              if (distSq <= leafRadius * leafRadius + leafRadius*0.5 && getBlockId(lx, ly) === 0) {
                                  setBlock(lx, ly, 10); // Leaves
                              }
                          }
                      }
                 }
             }
         }
        logMessage("World generation complete.");
    }

     // Helper to find surface for player start
     function findSurfaceY(tileX) {
          for (let y = 0; y < WORLD_HEIGHT_TILES; y++) {
              const blockId = getBlockId(tileX, y);
              const definition = findDefinitionById(blockId);
              if (definition && blockId !== 0 && !definition.transparent) {
                  return y; // Return the Y index of the first solid block
              }
          }
          return SURFACE_LEVEL; // Fallback
     }

    // --- Drawing ---
    function draw() {
        if (!assetsLoaded) return; // Don't draw until assets are ready

        // Calculate visible tile range
        const camLeft = camera.x;
        const camTop = camera.y;
        const camRight = camera.x + canvas.width;
        const camBottom = camera.y + canvas.height;

        const startTileX = Math.max(0, Math.floor(camLeft / TILE_SIZE));
        const startTileY = Math.max(0, Math.floor(camTop / TILE_SIZE));
        const endTileX = Math.min(WORLD_WIDTH_TILES, Math.ceil(camRight / TILE_SIZE));
        const endTileY = Math.min(WORLD_HEIGHT_TILES, Math.ceil(camBottom / TILE_SIZE));

        // Draw Sky / Background
        ctx.fillStyle = skyColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.imageSmoothingEnabled = false;

        // Draw World Tiles
        for (let y = startTileY; y < endTileY; y++) {
            for (let x = startTileX; x < endTileX; x++) {
                const blockId = getBlockId(x, y);
                if (blockId === 0) continue; // Skip air

                const definition = findDefinitionById(blockId);
                if (!definition) continue;

                const screenX = Math.floor(x * TILE_SIZE - camera.x);
                const screenY = Math.floor(y * TILE_SIZE - camera.y);
                const imageToDraw = images[definition.name];

                if (imageToDraw) {
                    ctx.drawImage(imageToDraw, screenX, screenY, TILE_SIZE, TILE_SIZE);
                } else {
                    ctx.fillStyle = definition.color || 'magenta'; // Fallback color
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                }
            }
        }

         // Draw Entities
         entities.forEach(entity => {
             const screenX = Math.floor(entity.x - camera.x);
             const screenY = Math.floor(entity.y - camera.y);
             const entityWidth = entity.width || TILE_SIZE;
             const entityHeight = entity.height || TILE_SIZE;

             if (screenX + entityWidth < 0 || screenX > canvas.width ||
                 screenY + entityHeight < 0 || screenY > canvas.height) {
                 return; // Cull off-screen entities
             }

             switch (entity.type) {
                 case 'dropped_item':
                     const img = images[entity.itemName];
                     const itemWidth = TILE_SIZE * 0.5; // Draw items smaller
                     const itemHeight = TILE_SIZE * 0.5;
                     if (img) {
                         ctx.drawImage(img, screenX, screenY, itemWidth, itemHeight);
                     } else {
                         ctx.fillStyle = itemDefinitions[entity.itemName]?.color || 'purple';
                         ctx.fillRect(screenX, screenY, itemWidth, itemHeight);
                     }
                     break;
                 case 'npc': // <<< ENSURE THIS CASE IS PRESENT
                 const npcDef = npcDefinitions[entity.subtype];
                 ctx.fillStyle = entity.color || npcDef?.color || 'fuchsia'; // Use entity color or definition color or bright fallback
                 ctx.fillRect(screenX, screenY, entityWidth, entityHeight);
                 // TODO: Draw NPC sprite later using ctx.drawImage()
                 break;
             }
         });

         // Draw Entities
     entities.forEach(entity => {
        const screenX = Math.floor(entity.x - camera.x);
        const screenY = Math.floor(entity.y - camera.y);
        const entityWidth = entity.width || TILE_SIZE;
        const entityHeight = entity.height || TILE_SIZE;
        // ... (culling check) ...

        switch (entity.type) {
            case 'dropped_item':
               // ... (existing item drawing logic) ...
                break;
            case 'npc': // <<< ADD NPC DRAWING
                const npcDef = npcDefinitions[entity.subtype];
                ctx.fillStyle = entity.color || npcDef?.color || 'magenta'; // Use entity color or definition color
                ctx.fillRect(screenX, screenY, entityWidth, entityHeight);
                // TODO: Draw NPC sprite later
                break;
            // case 'mob': ...
        }
    });

        // Draw Player
        const playerScreenX = Math.floor(player.x - camera.x);
        const playerScreenY = Math.floor(player.y - camera.y);
        ctx.fillStyle = 'red'; // Placeholder player color
        ctx.fillRect(playerScreenX, playerScreenY, player.width, player.height);
        // TODO: Draw player sprite later

        // Draw Digging Progress/Highlight
        if (currentDigTarget) {
             const block = getBlock(currentDigTarget.x * TILE_SIZE, currentDigTarget.y * TILE_SIZE);
             if(block) {
                 const screenX = Math.floor(block.x * TILE_SIZE - camera.x);
                 const screenY = Math.floor(block.y * TILE_SIZE - camera.y);
                 ctx.strokeStyle = 'yellow';
                 ctx.lineWidth = 2;
                 ctx.strokeRect(screenX + 1, screenY + 1, TILE_SIZE - 2, TILE_SIZE - 2);
                 ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
                 const progressHeight = TILE_SIZE * currentDigTarget.progress;
                 ctx.fillRect(screenX, screenY + TILE_SIZE - progressHeight, TILE_SIZE, progressHeight);
                 ctx.lineWidth = 1;
             }
         } else { // Draw placement preview / hover highlight
             if (!inventoryOpen && !isDigging && mouse.tileX >= 0 && mouse.tileY >= 0 && distance(player.x + player.width/2, player.y + player.height/2, mouse.worldX, mouse.worldY) <= PLAYER_REACH ) {
                 const screenX = Math.floor(mouse.tileX * TILE_SIZE - camera.x);
                 const screenY = Math.floor(mouse.tileY * TILE_SIZE - camera.y);
                 ctx.strokeStyle = 'white';
                 ctx.lineWidth = 1;
                 ctx.strokeRect(screenX + 0.5, screenY + 0.5, TILE_SIZE-1, TILE_SIZE-1);
             }
         }

        // UI is handled by HTML/CSS overlays, but update data here
        updateUI();

        // Draw FPS
        const now = performance.now();
        const delta = now - lastFrameTime;
        frameCount++;

        // Update FPS display every 100ms (1/10th of a second) instead of every 1000ms
        if (delta >= 100) { // Check if 100ms have passed
            fps = Math.round((frameCount * 1000) / delta); // Calculate FPS over the measured interval
            frameCount = 0;
            lastFrameTime = now;
            fpsEl.textContent = fps;
        }
    }

     // --- Player Movement & Physics ---
     function checkCollision(playerX, playerY) {
        const pointsToCheck = [
            { x: playerX, y: playerY },
            { x: playerX + player.width, y: playerY },
            { x: playerX, y: playerY + player.height },
            { x: playerX + player.width, y: playerY + player.height },
        ];
        for (const point of pointsToCheck) {
            const block = getBlock(point.x, point.y);
            if (block && block.id !== 0 && !block.transparent) {
                return true;
            }
        }
        return false;
    }

    function handleMovement(deltaTime) {
        const moveSpeed = 250; const jumpForce = 450; const gravity = 1200;
        const maxFallSpeed = 700; const groundFriction = 0.85; const airFriction = 0.98;
        const acceleration = 3000; const epsilon = 0.1;

        const friction = player.onGround ? groundFriction : airFriction;
        let targetVx = 0;
        if (keys['a'] || keys['ArrowLeft']) targetVx -= moveSpeed;
        if (keys['d'] || keys['ArrowRight']) targetVx += moveSpeed;

        if (targetVx > player.vx) { player.vx += acceleration * deltaTime; if (player.vx > targetVx) player.vx = targetVx; }
        else if (targetVx < player.vx) { player.vx -= acceleration * deltaTime; if (player.vx < targetVx) player.vx = targetVx; }
        if (targetVx === 0) { player.vx *= friction; if (Math.abs(player.vx) < epsilon) player.vx = 0; }

        let newX = player.x + player.vx * deltaTime;
        if (checkCollision(newX, player.y)) {
            if(player.vx > 0) newX = Math.floor((newX + player.width) / TILE_SIZE) * TILE_SIZE - player.width - epsilon;
            else if(player.vx < 0) newX = Math.ceil(newX / TILE_SIZE) * TILE_SIZE + epsilon;
            player.vx = 0;
        }
        player.x = newX;

        if (!player.onGround) { player.vy += gravity * deltaTime; player.vy = Math.min(player.vy, maxFallSpeed); }
        if ((keys['w'] || keys['ArrowUp'] || keys[' ']) && player.onGround) { player.vy = -jumpForce; player.onGround = false; }

        let newY = player.y + player.vy * deltaTime;
        let collidedVertically = checkCollision(player.x, newY);
        const groundCheckY = player.y + player.height + epsilon;
        const groundCheckX1 = player.x + player.width * 0.2;
        const groundCheckX2 = player.x + player.width * 0.8;
        const blockBelow1 = getBlock(groundCheckX1, groundCheckY);
        const blockBelow2 = getBlock(groundCheckX2, groundCheckY);
        let wasOnGround = player.onGround;
        player.onGround = (collidedVertically && player.vy >= 0) ||
                         (!wasOnGround && player.vy >=0 && ((blockBelow1 && blockBelow1.id !== 0 && !blockBelow1.transparent) || (blockBelow2 && blockBelow2.id !== 0 && !blockBelow2.transparent)) );

        if (collidedVertically) {
            if (player.vy >= 0) { player.y = Math.floor((newY + player.height) / TILE_SIZE) * TILE_SIZE - player.height - epsilon; player.onGround = true; }
            else if (player.vy < 0) { player.y = Math.ceil(newY / TILE_SIZE) * TILE_SIZE + epsilon; }
            player.vy = 0;
        } else { player.y = newY; }

        player.x = Math.max(0, Math.min(player.x, WORLD_WIDTH_TILES * TILE_SIZE - player.width));
        if (player.y > WORLD_HEIGHT_TILES * TILE_SIZE) { player.y = (SURFACE_LEVEL - 5) * TILE_SIZE; logMessage("Fell out of world!"); }
    }

     // --- Tool/Item Usage ---
    function getSelectedItemStats() {
        const selectedSlotIndex = player.selectedHotbarSlot;
        // Ensure index is valid for current inventory size
         if (selectedSlotIndex < 0 || selectedSlotIndex >= player.inventory.length) {
             return { name: 'fist', toolType: 'none', toolPower: FIST_STATS.toolPower, damage: FIST_STATS.damage, speedModifier: FIST_STATS.speedModifier, placeableBlockId: null };
         }

        const selectedSlot = player.inventory[selectedSlotIndex];
        if (selectedSlot) {
            const definition = itemDefinitions[selectedSlot.itemName];
            if (definition) {
                return {
                    name: selectedSlot.itemName,
                    toolType: definition.toolType || 'none',
                    toolPower: definition.toolPower || FIST_STATS.toolPower,
                    damage: definition.damage || FIST_STATS.damage,
                    speedModifier: definition.speedModifier || FIST_STATS.speedModifier,
                    placeableBlockId: definition.type === 'block' ? definition.placeable : null
                };
            }
        }
        return { name: 'fist', toolType: 'none', toolPower: FIST_STATS.toolPower, damage: FIST_STATS.damage, speedModifier: FIST_STATS.speedModifier, placeableBlockId: null };
    }


     // --- Digging Logic ---
     function startDigging(targetTileX, targetTileY) {
        if (isDigging || inventoryOpen) return;
    
        const block = getBlock(targetTileX * TILE_SIZE, targetTileY * TILE_SIZE);
        if (!block || block.id === 0 || block.hardness === Infinity) return; // Can't dig air or bedrock
    
        // Check reach
        if (distance(player.x + player.width/2, player.y + player.height/2, targetTileX * TILE_SIZE + TILE_SIZE/2, targetTileY * TILE_SIZE + TILE_SIZE/2) > PLAYER_REACH) {
            logMessage("Too far away."); return;
        }
    
        const selectedItem = getSelectedItemStats();
        const blockDefinition = itemDefinitions[block.name];
        if (!blockDefinition) { console.error(`Missing definition for block name: ${block.name}`); return;}
    
        let canDig = false;
        let toolIsCorrectType = false; // Renamed for clarity
        const requiredTool = blockDefinition.toolRequired;
    
        // --- Tool Requirement Check ---
        if (!requiredTool || requiredTool === 'none' || requiredTool === 'any') {
            // No specific tool required, anything can dig it.
            canDig = true;
            toolIsCorrectType = false; // No specific type is "correct" when 'any' is allowed
        } else {
            // Specific tool is required (e.g., 'pickaxe', 'axe', 'shovel')
            if (selectedItem.toolType === requiredTool) {
                // Correct tool type selected
                canDig = true;
                toolIsCorrectType = true; // The correct type IS being used
            } else if (selectedItem.name === 'fist') {
                // Fist can break *anything* that's not infinitely hard
                canDig = true;
                toolIsCorrectType = false; // Fist is not the 'correct' type
            } else {
                // Incorrect tool type selected (e.g., axe on stone) - Cannot dig.
                canDig = false;
                logMessage(`Need a ${requiredTool} for ${block.name}.`);
            }
        }
    
        if (!canDig) return; // Exit if the required tool check failed
    
        // --- Power Check ---
        // Check if the held item's power is sufficient for the block's hardness
        if (blockDefinition.hardness > selectedItem.toolPower) {
            logMessage(`Need more power for ${block.name} (Hardness ${blockDefinition.hardness}, Power ${selectedItem.toolPower.toFixed(1)}).`);
            return; // Block digging if power is insufficient
        }
    
        // --- Calculate Dig Time with Correct Tool Bonus ---
        isDigging = true;
        const baseDigTime = 7000; // Base time in ms for hardness 1, power 1 (Increased slightly for better feel)
        const correctToolSpeedMultiplier = 0.4; // Apply this multiplier (faster) if correct tool type is used (e.g., 0.4 = 2.5x faster)
        const powerFactor = Math.max(0.1, selectedItem.toolPower); // Prevent division by zero
    
        // Calculate base time based on hardness and the held item's power/speed modifier
        let digTime = (baseDigTime * blockDefinition.hardness * selectedItem.speedModifier) / powerFactor;
    
        // Apply bonus speed multiplier *only* if the correct tool type is equipped
        if (toolIsCorrectType) {
            digTime *= correctToolSpeedMultiplier;
            logMessage(`Digging ${block.name} efficiently with ${selectedItem.name}...`);
        } else {
             logMessage(`Digging ${block.name} with ${selectedItem.name}...`);
        }
    
        digTime = Math.max(50, digTime); // Ensure minimum dig time
    
        console.log(`Calculated Dig Time: ${(digTime / 1000).toFixed(2)}s (Correct Tool: ${toolIsCorrectType})`); // Debug log
    
        // --- Set Dig Timer ---
        currentDigTarget = {
            x: targetTileX, y: targetTileY, startTime: performance.now(),
            duration: digTime, progress: 0,
            timer: setTimeout(() => finishDigging(targetTileX, targetTileY, block.id), digTime) // Pass block ID being dug
        };
    }

     function updateDiggingProgress() {
          if(currentDigTarget) {
             const elapsed = performance.now() - currentDigTarget.startTime;
             currentDigTarget.progress = Math.min(1, elapsed / currentDigTarget.duration);
              if (distance(player.x + player.width/2, player.y + player.height/2, currentDigTarget.x * TILE_SIZE + TILE_SIZE/2, currentDigTarget.y * TILE_SIZE + TILE_SIZE/2) > PLAYER_REACH * 1.1) {
                  cancelDigging(); logMessage("Moved too far, cancelled digging.");
              }
          }
     }

     function finishDigging(targetTileX, targetTileY, blockIdBeingDug) {
          if (!currentDigTarget || currentDigTarget.x !== targetTileX || currentDigTarget.y !== targetTileY) {
              isDigging = false; currentDigTarget = null; return;
          }
          const finalBlockId = getBlockId(targetTileX, targetTileY);
          if(finalBlockId !== blockIdBeingDug) { logMessage("Block changed while digging."); cancelDigging(); return; }

          const blockDefinition = findDefinitionById(blockIdBeingDug); // Use original ID's def
          if(!blockDefinition) { logMessage("Error finding block definition."); cancelDigging(); return; }

          const droppedItemName = blockDefinition.drop || blockDefinition.name;

          if (droppedItemName) {
              const worldX = targetTileX * TILE_SIZE + TILE_SIZE / 2;
              const worldY = targetTileY * TILE_SIZE + TILE_SIZE / 2;
              spawnDroppedItem(worldX, worldY, droppedItemName, 1);
              logMessage(`Dug ${blockDefinition.name}, dropped ${droppedItemName}`);
          } else { logMessage(`Dug ${blockDefinition.name}, but it dropped nothing.`); }

          setBlock(targetTileX, targetTileY, 0); // Set to air (ID 0)

          isDigging = false; currentDigTarget = null;
     }

     function cancelDigging() {
          if(currentDigTarget && currentDigTarget.timer) { clearTimeout(currentDigTarget.timer); }
          isDigging = false; currentDigTarget = null;
          // logMessage("Digging cancelled."); // Can be noisy
     }

    // --- Placing Logic ---
    function placeBlock(targetTileX, targetTileY) {
        if (isDigging || inventoryOpen) return;

        const selectedItem = getSelectedItemStats();
        const inventorySlotIndex = player.selectedHotbarSlot;

        // Check validity of slot index before accessing inventory
        if (inventorySlotIndex < 0 || inventorySlotIndex >= player.inventory.length) return;
        const itemInSlot = player.inventory[inventorySlotIndex];

        if (!selectedItem.placeableBlockId || !itemInSlot) return;
        const blockIdToPlace = selectedItem.placeableBlockId;

        const targetBlock = getBlock(targetTileX * TILE_SIZE, targetTileY * TILE_SIZE);
        if (!targetBlock || targetBlock.id !== 0) return;

        if (distance(player.x + player.width/2, player.y + player.height/2, targetTileX * TILE_SIZE + TILE_SIZE/2, targetTileY * TILE_SIZE + TILE_SIZE/2) > PLAYER_REACH) {
            logMessage("Too far away to place."); return;
        }
        const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };
        const placedBlockRect = { x: targetTileX * TILE_SIZE, y: targetTileY * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE };
        if (rectCollision(playerRect, placedBlockRect)) {
            logMessage("Cannot place block inside yourself!"); return;
        }

        setBlock(targetTileX, targetTileY, blockIdToPlace);
        logMessage(`Placed ${itemInSlot.itemName}.`);

        itemInSlot.count--;
        if (itemInSlot.count <= 0) { player.inventory[inventorySlotIndex] = null; }

        updateHotbarDisplay(); updateInventoryScreen(); updateUI();
    }

    // --- Attack Logic (Placeholder) ---
    function handleAttack(targetX, targetY) {
         if (inventoryOpen || isDigging) return;
         const selectedItem = getSelectedItemStats();
         logMessage(`Attacked towards (${targetX.toFixed(0)}, ${targetY.toFixed(0)}) with ${selectedItem.name} (Dmg: ${selectedItem.damage})`);
         // TODO: Find target mob, apply damage, animation, cooldown
    }

    // --- Inventory Management ---
     function giveStartingItems() {
        addToInventory('copper_pickaxe', 1);
        addToInventory('copper_axe', 1);
        addToInventory('copper_sword', 1);
    }

    function addToInventory(itemName, count) {
        const definition = itemDefinitions[itemName];
        if (!definition) { console.error(`addToInventory: Unknown item name "${itemName}"`); return false; }
        const stackSize = definition.stackSize || 1;
        let remainingCount = count;

        for (let i = 0; i < player.inventorySize; i++) {
            const slot = player.inventory[i];
            if (slot && slot.itemName === itemName && slot.count < stackSize) {
                const canAdd = stackSize - slot.count;
                const amountToAdd = Math.min(remainingCount, canAdd);
                slot.count += amountToAdd;
                remainingCount -= amountToAdd;
                if (remainingCount <= 0) break;
            }
        }
        if (remainingCount > 0) {
            for (let i = 0; i < player.inventorySize; i++) {
                if (player.inventory[i] === null) {
                    const amountToAdd = Math.min(remainingCount, stackSize);
                    player.inventory[i] = { itemName: itemName, count: amountToAdd };
                    remainingCount -= amountToAdd;
                    if (remainingCount <= 0) break;
                }
            }
        }
        updateHotbarDisplay(); updateInventoryScreen(); updateUI();
        if (remainingCount > 0) { logMessage(`Inventory full! Could not pick up ${remainingCount} ${itemName}.`); return false; }
        return true;
    }

    function getUsedInventorySlots() {
         return player.inventory.filter(slot => slot !== null).length;
     }

     function toggleInventoryScreen() {
        inventoryOpen = !inventoryOpen;
        inventoryScreen.style.display = inventoryOpen ? 'flex' : 'none';
        if (inventoryOpen) { populateInventoryScreen(); cancelDigging(); }
    }

    function populateInventoryScreen() {
        inventoryGridEl.innerHTML = '';
        for(let i = 0; i < player.inventorySize; i++) {
            const itemSlot = player.inventory[i];
            const slotDiv = document.createElement('div');
            slotDiv.classList.add('inventory-slot');
            slotDiv.dataset.slotIndex = i;

            if (itemSlot) {
                const definition = itemDefinitions[itemSlot.itemName];
                const img = images[itemSlot.itemName];
                if (img) {
                    slotDiv.style.backgroundImage = `url('${img.src}')`;
                    slotDiv.style.backgroundSize = 'contain';
                    slotDiv.style.backgroundRepeat = 'no-repeat';
                    slotDiv.style.backgroundPosition = 'center';
                    slotDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                } else { slotDiv.style.backgroundColor = definition?.color || 'magenta'; }
                slotDiv.title = `${itemSlot.itemName} (Count: ${itemSlot.count})`;
                if (itemSlot.count > 1) {
                    const countSpan = document.createElement('span');
                    countSpan.classList.add('item-count');
                    countSpan.textContent = itemSlot.count;
                    slotDiv.appendChild(countSpan);
                }
            } else { slotDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'; }
            inventoryGridEl.appendChild(slotDiv);
        }
    }
    // Wrapper needed because populate is called internally too
    function updateInventoryScreen() { if (inventoryOpen) { populateInventoryScreen(); } }


    // --- Item Drops & Pickup ---
     function spawnDroppedItem(worldX, worldY, itemName, count) {
        const definition = itemDefinitions[itemName];
        if (!definition) return;
        const popVx = (Math.random() - 0.5) * 80;
        const popVy = -100 - Math.random() * 50;
        const newItemEntity = {
            type: 'dropped_item', x: worldX, y: worldY, vx: popVx, vy: popVy,
            itemName: itemName, count: count, pickupDelayTimer: 1000,
            width: TILE_SIZE * 0.5, height: TILE_SIZE * 0.5, onGround: false,
        };
        entities.push(newItemEntity);
    }

    function updateDroppedItem(item, deltaTime) {
        const gravity = 800; const friction = 0.90; const maxFallSpeed = 600;
        if (item.pickupDelayTimer > 0) { item.pickupDelayTimer -= deltaTime * 1000; }

        if (!item.onGround) { item.vy += gravity * deltaTime; item.vy = Math.min(item.vy, maxFallSpeed); }
        item.vx *= friction; if (Math.abs(item.vx) < 0.1) item.vx = 0;

        let newX = item.x + item.vx * deltaTime;
        let newY = item.y + item.vy * deltaTime;
        const checkY = newY + item.height;
        const blockBelow = getBlock(newX + item.width / 2, checkY);

        if (blockBelow && blockBelow.id !== 0 && !blockBelow.transparent) {
            item.y = Math.floor(checkY / TILE_SIZE) * TILE_SIZE - item.height - 0.1;
            item.vy = 0; item.onGround = true;
        } else { item.y = newY; item.onGround = false; }
        item.x = newX;
        item.x = Math.max(0, Math.min(item.x, WORLD_WIDTH_TILES * TILE_SIZE - item.width));

        if (item.pickupDelayTimer <= 0) {
            const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };
            const itemRect = { x: item.x, y: item.y, width: item.width, height: item.height };
            if (rectCollision(playerRect, itemRect)) {
                if (addToInventory(item.itemName, item.count)) {
                    item.toBeRemoved = true; logMessage(`Picked up ${item.count} ${item.itemName}`);
                } else { item.pickupDelayTimer = 250; }
            }
        }
    }


    // --- Entity Update Loop ---
     function updateEntities(deltaTime) {
         entities = entities.filter(entity => {
             if (entity.toBeRemoved) return false;
             switch (entity.type) {
                 case 'dropped_item': updateDroppedItem(entity, deltaTime); break;
                 // case 'mob': updateMobAI(entity, deltaTime); break;
                 // case 'npc': updateNPC(entity, deltaTime); break;
             }
             return true;
         });
    }

    // --- Time & Day/Night Cycle ---
     function updateTime(deltaTime) {
        gameTime += deltaTime;
        const timeInCycle = gameTime % FULL_CYCLE;
        let lightLevel = 1.0; // Not visually used yet, just state

        if (timeInCycle < DAY_DURATION * 0.05) { timeOfDay = 'sunrise'; const p = timeInCycle / (DAY_DURATION * 0.05); skyColor = lerpColor('#000030', '#87CEEB', p); lightLevel = lerp(0.3, 1.0, p); }
        else if (timeInCycle < DAY_DURATION * 0.95) { timeOfDay = 'day'; skyColor = '#87CEEB'; lightLevel = 1.0; }
        else if (timeInCycle < DAY_DURATION) { timeOfDay = 'sunset'; const p = (timeInCycle - DAY_DURATION * 0.95) / (DAY_DURATION * 0.05); skyColor = lerpColor('#87CEEB', '#4682B4', p); lightLevel = lerp(1.0, 0.5, p); } // Smoother sunset blue
        else if (timeInCycle < DAY_DURATION + NIGHT_DURATION * 0.1) { timeOfDay = 'dusk'; const p = (timeInCycle - DAY_DURATION) / (NIGHT_DURATION * 0.1); skyColor = lerpColor('#4682B4', '#000030', p); lightLevel = lerp(0.5, 0.3, p); }
        else { timeOfDay = 'night'; skyColor = '#000030'; lightLevel = 0.3; }
    }

    function hexToRgb(hex) { const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null; }
    function lerpColor(c1, c2, f) { f = Math.max(0, Math.min(1, f)); const r1=hexToRgb(c1), r2=hexToRgb(c2); if(!r1||!r2) return c1; const r=Math.round(r1.r+(r2.r-r1.r)*f), g=Math.round(r1.g+(r2.g-r1.g)*f), b=Math.round(r1.b+(r2.b-r1.b)*f); return `rgb(${r},${g},${b})`; }
    function lerp(a, b, f) { return a + (b - a) * Math.max(0, Math.min(1, f)); }

    // --- Spawning Placeholder ---
    function handleSpawning() { /* TODO: Implement mob spawning */ }

    // --- UI Update Functions ---
    function updateHotbarDisplay() {
        hotbarEl.innerHTML = '';
        const inventorySlotsToDisplay = Math.min(HOTBAR_SLOTS, player.inventorySize);

        for (let i = 0; i < inventorySlotsToDisplay; i++) {
            const slotDiv = document.createElement('div');
            slotDiv.classList.add('hotbar-slot');
            slotDiv.dataset.slotIndex = i;
            const itemSlot = player.inventory[i];

            if (itemSlot) {
                const definition = itemDefinitions[itemSlot.itemName];
                const img = images[itemSlot.itemName];
                if (img) {
                     slotDiv.style.backgroundImage = `url('${img.src}')`;
                     slotDiv.style.backgroundSize = 'contain';
                     slotDiv.style.backgroundRepeat = 'no-repeat';
                     slotDiv.style.backgroundPosition = 'center';
                     slotDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                } else { slotDiv.style.backgroundColor = definition?.color || 'magenta'; }
                slotDiv.title = itemSlot.itemName;
                if (itemSlot.count > 1) {
                    const countSpan = document.createElement('span');
                    countSpan.classList.add('item-count');
                    countSpan.textContent = itemSlot.count;
                    slotDiv.appendChild(countSpan);
                }
            } else { slotDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; slotDiv.title = `Empty Slot ${i + 1}`; }
            if (i === player.selectedHotbarSlot) { slotDiv.classList.add('selected'); }
            slotDiv.addEventListener('click', () => { player.selectedHotbarSlot = i; updateHotbarDisplay(); });
            hotbarEl.appendChild(slotDiv);
        }
        for (let i = inventorySlotsToDisplay; i < HOTBAR_SLOTS; i++){
             const slotDiv = document.createElement('div');
             slotDiv.classList.add('hotbar-slot', 'disabled'); slotDiv.title = 'Locked Slot';
             hotbarEl.appendChild(slotDiv);
        }
    }

     function updateUI() {
         moneyEl.textContent = player.money;
         const selectedStats = getSelectedItemStats(); 
         playerCoordsXEl.textContent = Math.floor(player.x / TILE_SIZE);
         playerCoordsYEl.textContent = Math.floor(player.y / TILE_SIZE);

         const currentInvCount = getUsedInventorySlots();

         // Sell button value (simple version for now)
         let potentialSellValue = 0;
         player.inventory.forEach(slot => {
              if(slot && itemDefinitions[slot.itemName]?.value){
                 potentialSellValue += slot.count * itemDefinitions[slot.itemName].value;
              }
         });
         sellValueEl.textContent = potentialSellValue;
         sellButton.disabled = potentialSellValue === 0;

         // Disable placeholder upgrade buttons for now
         toolCostEl.textContent = 'N/A';
         inventoryCostEl.textContent = inventoryUpgradeCost; // Keep inv cost display maybe?
         upgradeToolButton.disabled = true;
         // Enable inv upgrade if we add basic button logic back temporarily
         upgradeInventoryButton.disabled = player.money < inventoryUpgradeCost;
         // upgradeInventoryButton.disabled = true; // Disable until NPC
     }

    // --- Shop/Upgrade Functions (Placeholders/Basic) ---
    function sellInventory() { // Basic sell all, move to NPC later
        if(inventoryOpen) return;
        let totalValue = 0; let itemsSoldCount = 0;
        let newInventory = new Array(player.inventorySize).fill(null); // Keep tools

        player.inventory.forEach((slot, index) => {
            if(slot){
                const definition = itemDefinitions[slot.itemName];
                if(definition && definition.value && definition.stackSize > 1){ // Don't sell tools (stacksize 1)
                     totalValue += slot.count * definition.value;
                     itemsSoldCount += slot.count;
                     // Don't put back into newInventory
                } else {
                    newInventory[index] = slot; // Keep non-sellable item
                }
            }
        });

        if (totalValue > 0) {
            player.money += totalValue;
            player.inventory = newInventory; // Replace inventory
            logMessage(`Sold ${itemsSoldCount} items for $${totalValue}.`);
            updateUI(); updateHotbarDisplay(); updateInventoryScreen();
        } else { logMessage("Nothing valuable to sell."); }
    }

    // Basic inventory upgrade via button (remove when NPC added)
    function upgradeInventory() {
         if(inventoryOpen) return;
         if (player.money >= inventoryUpgradeCost) {
            player.money -= inventoryUpgradeCost;
            player.inventorySize += 1; // Upgrade by 1 slot for now
             // Extend the actual inventory array
             player.inventory.push(null);
            inventoryUpgradeCost = Math.floor(inventoryUpgradeCost * 1.2 + 15); // Increase cost
            logMessage(`Inventory size upgraded to ${player.inventorySize} slots!`);
            updateUI(); updateHotbarDisplay(); updateInventoryScreen(); // Redraw UI needed
        } else { logMessage("Not enough money for inventory upgrade."); }
    }


    // --- Event Listeners ---
    // --- Full Event Listeners Setup ---
function setupEventListeners() {
    // Window Resize
    window.addEventListener('resize', resizeCanvas);

    // Keyboard Input
    document.addEventListener('keydown', (e) => {
        // Allow 'e' or 'Escape' to function even if inventory is open
        if (inventoryOpen && e.key !== 'e' && e.key !== 'Escape') return;

        keys[e.key.toLowerCase()] = true;

        // Hotbar selection (numbers 1-9)
        const keyNum = parseInt(e.key);
        if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= HOTBAR_SLOTS) {
            // Ensure selection is within the bounds of available inventory slots
             if (keyNum -1 < player.inventorySize) {
                  player.selectedHotbarSlot = keyNum - 1;
                  updateHotbarDisplay();
             }
            e.preventDefault(); // Prevent browser default for numbers
        }

         // Toggle Inventory
         if (e.key.toLowerCase() === 'e') {
             toggleInventoryScreen();
         }
          // Close inventory with Escape
         if (inventoryOpen && e.key === 'Escape') {
              toggleInventoryScreen();
         }

         // Optional: Cancel digging on movement? (Distance check already handles it mostly)
         // if (isDigging && ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
         //    cancelDigging();
         // }
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });

    // Mouse Events on Canvas
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        // Calculate world coordinates based on camera
        mouse.worldX = mouse.x + camera.x;
        mouse.worldY = mouse.y + camera.y;
        // Calculate tile coordinates mouse is over
        mouse.tileX = Math.floor(mouse.worldX / TILE_SIZE);
        mouse.tileY = Math.floor(mouse.worldY / TILE_SIZE);
    });

// Inside setupEventListeners -> canvas.addEventListener('mousedown', ...)
canvas.addEventListener('mousedown', (e) => {
    if (inventoryOpen) return;
    mouse.down = true;

    // Check for NPC interaction first
    let clickedOnNPC = null;
    for(const entity of entities) { // Check ALL entities
        if (entity.type === 'npc') { // Filter for NPCs
            const npcRect = { x: entity.x, y: entity.y, width: entity.width, height: entity.height };
            const mouseRect = { x: mouse.worldX, y: mouse.worldY, width: 1, height: 1 };
           if (rectCollision(npcRect, mouseRect)) {
               clickedOnNPC = entity;
               break; // Interact with the first NPC found
           }
        }
    }

   // --- Interaction Logic ---
   if (clickedOnNPC) {
       // If an NPC was clicked, open the shop instead of other actions
       openGuideShop(clickedOnNPC);
   } else if (e.button === 0) { // Left Click (Dig/Attack) - only if NPC wasn't clicked
       cancelDigging();
       let clickedOnMob = false; // TODO: Check entity collision for ATTACKING a mob
       if (!clickedOnMob) {
           startDigging(mouse.tileX, mouse.tileY); // Try digging
       }
   } else if (e.button === 2) { // Right Click (Place Block) - only if NPC wasn't clicked
        placeBlock(mouse.tileX, mouse.tileY);
   }
});

    canvas.addEventListener('mouseup', (e) => {
         mouse.down = false;
         // Stop digging if left mouse button is released
         if (e.button === 0 && isDigging) {
             cancelDigging();
         }
    });

    // Prevent browser context menu on right-click
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Scroll wheel for hotbar selection
    canvas.addEventListener('wheel', (e) => {
        if (inventoryOpen) return;
        e.preventDefault(); // Prevent page scrolling
        const delta = Math.sign(e.deltaY); // +1 for down, -1 for up
        // Calculate next slot index, wrapping around using modulo
        let nextSlot = (player.selectedHotbarSlot + delta) % player.inventorySize;
         if (nextSlot < 0) {
             nextSlot += player.inventorySize; // Ensure positive index after wrapping backwards
         }
         // Clamp selection to available hotbar slots shown visually
         player.selectedHotbarSlot = Math.min(nextSlot, HOTBAR_SLOTS - 1);

        updateHotbarDisplay();
    });

    // --- UI Button Listeners ---

    // Sell Button (If keeping it temporarily outside NPC)
    sellButton.addEventListener('click', sellInventory);

    // Disable direct Tool Upgrade Button (Handled by NPC interaction)
    upgradeToolButton.removeEventListener('click', upgradeTool); // Ensure no old listener
    upgradeToolButton.style.display = 'none'; // Hide the button visually
    if(toolCostEl) toolCostEl.parentElement.style.display = 'none'; // Hide cost display if needed


    // Inventory Upgrade Button (Using the refined function)
     upgradeInventoryButton.addEventListener('click', upgradeInventorySlots);
     // Optional: Hide this button too if only the Guide handles upgrades
     // upgradeInventoryButton.style.display = 'none';
     // if(inventoryCostEl) inventoryCostEl.parentElement.style.display = 'none';


    // Inventory Screen Close Button
    closeInventoryButton.addEventListener('click', toggleInventoryScreen);
}

    // --- Game Loop ---
    let lastTimestamp = 0;
    function gameLoop(timestamp) {
        if (!assetsLoaded) { requestAnimationFrame(gameLoop); return; } // Wait for assets

        const deltaTime = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
        lastTimestamp = timestamp;

        if (!inventoryOpen) {
             handleMovement(deltaTime);
             updateEntities(deltaTime); // Includes item physics/pickup
             updateCamera();
             updateTime(deltaTime);
             handleSpawning(); // Placeholder
             updateDiggingProgress();
         }

        draw();
        requestAnimationFrame(gameLoop);
    }

    // --- Camera Update ---
    function updateCamera() {
        const lerpFactor = 0.1;
        const targetCamX = player.x - canvas.width / 2 + player.width / 2;
        const targetCamY = player.y - canvas.height / 2 + player.height / 2;
        camera.x += (targetCamX - camera.x) * lerpFactor;
        camera.y += (targetCamY - camera.y) * lerpFactor;
        camera.x = Math.max(0, Math.min(camera.x, WORLD_WIDTH_TILES * TILE_SIZE - canvas.width));
        camera.y = Math.max(0, Math.min(camera.y, WORLD_HEIGHT_TILES * TILE_SIZE - canvas.height));
    }

    // --- Initialization ---
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        draw(); // Redraw immediately
    }

    async function init() {
        resizeCanvas();
        await preloadAssets();
        generateWorld();
    
        player.x = (WORLD_WIDTH_TILES / 2) * TILE_SIZE;
        const startSurfaceY = findSurfaceY(Math.floor(player.x / TILE_SIZE));
        player.y = (startSurfaceY - 1) * TILE_SIZE;
    
        giveStartingItems();
        spawnGuideNPC(); // <<< SPAWN THE GUIDE
    
        updateCamera();
        camera.x = player.x - canvas.width / 2 + player.width / 2;
        camera.y = player.y - canvas.height / 2 + player.height / 2;
        camera.x = Math.max(0, Math.min(camera.x, WORLD_WIDTH_TILES * TILE_SIZE - canvas.width));
        camera.y = Math.max(0, Math.min(camera.y, WORLD_HEIGHT_TILES * TILE_SIZE - canvas.height));
    
        updateUI();
        updateHotbarDisplay();
        setupEventListeners();
        lastTimestamp = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function upgradeTool() {
        // Assume the tool to upgrade is in the selected hotbar slot.
        const slotIndex = player.selectedHotbarSlot;
        // Validate slot index against actual inventory size
        if (slotIndex < 0 || slotIndex >= player.inventory.length) {
             logMessage("Invalid hotbar slot selected.");
             return;
         }
        const slot = player.inventory[slotIndex];
    
        if (!slot) {
            logMessage("No tool selected for upgrade.");
            return;
        }
    
        const currentToolName = slot.itemName;
        const upgradeInfo = toolUpgradeMapping[currentToolName];
    
        if (!upgradeInfo) {
            logMessage(`${currentToolName} is at maximum tier or cannot be upgraded via this path.`);
            return;
        }
    
        // Check if player has the required ore.
        let oreCountInInv = 0;
        for (let i = 0; i < player.inventory.length; i++) {
            const invSlot = player.inventory[i];
            if (invSlot && invSlot.itemName === upgradeInfo.requiredOre) {
                oreCountInInv += invSlot.count;
            }
        }
    
        if (oreCountInInv < upgradeInfo.oreCount) {
            logMessage(`You need ${upgradeInfo.oreCount} ${upgradeInfo.requiredOre} to upgrade ${currentToolName}. (Have: ${oreCountInInv})`);
            return;
        }
    
         // Check Money Cost (optional, based on mapping)
         if (upgradeInfo.cost && player.money < upgradeInfo.cost) {
             logMessage(`You need $${upgradeInfo.cost} to upgrade. (Have: $${player.money})`);
             return;
         }
    
    
        // Deduct the required ore from inventory.
        let remainingToDeduct = upgradeInfo.oreCount;
        for (let i = 0; i < player.inventory.length; i++) {
            if (remainingToDeduct <= 0) break; // Stop searching if done
            const invSlot = player.inventory[i];
            if (invSlot && invSlot.itemName === upgradeInfo.requiredOre) {
                const amountToTake = Math.min(remainingToDeduct, invSlot.count);
                invSlot.count -= amountToTake;
                remainingToDeduct -= amountToTake;
                if (invSlot.count <= 0) {
                    player.inventory[i] = null; // Remove item if count is zero
                }
            }
        }
    
         // Deduct cost if applicable
         if (upgradeInfo.cost) {
             player.money -= upgradeInfo.cost;
         }
    
        // Replace the tool with its upgraded version.
        slot.itemName = upgradeInfo.next;
        // NOTE: The tool's stats (power, speed) are inherent to its definition.
        // We just changed the *name* in the inventory slot. getSelectedItemStats() will now pull the new stats.
        logMessage(`Upgraded tool to ${upgradeInfo.next}!`);
        updateHotbarDisplay();
        updateInventoryScreen();
        updateUI();
    }

    // --- Refined Function: Upgrade Inventory Slots ---
function upgradeInventorySlots() {
    if (inventoryOpen) return; // Prevent upgrading while inventory open? Or allow?

    // Use the global inventoryUpgradeCost variable
    if (player.money >= inventoryUpgradeCost) {
        player.money -= inventoryUpgradeCost;
        player.inventorySize += 1; // Increase slot count by 1
        player.inventory.push(null); // Add a new empty slot to the array

        // Increase cost for the next upgrade (adjust formula as needed)
        inventoryUpgradeCost = Math.floor(inventoryUpgradeCost * 1.3 + 20);

        logMessage(`Inventory size upgraded to ${player.inventorySize} slots!`);
        updateUI();
        updateHotbarDisplay(); // Need to redraw hotbar in case locked slots change
        updateInventoryScreen(); // Need to redraw inventory screen if open
    } else {
        logMessage(`Need $${inventoryUpgradeCost} for next inventory slot.`);
    }
}
// Make sure the event listener uses this new function name if you keep the button:
// upgradeInventoryButton.addEventListener('click', upgradeInventorySlots);

    // --- Start the game ---
    init();

})(); // End of IIFE