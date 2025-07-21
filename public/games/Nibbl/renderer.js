let credits = 0;

const devLogoScreen = document.getElementById('devLogoScreen');
const titleScreen = document.getElementById('titleScreen');
const settingsScreen = document.getElementById('settingsScreen');
const gameScreen = document.getElementById('gameScreen');

const playBtn = document.getElementById('playBtn');
const goToSettingsBtn = document.getElementById('goToSettingsBtn');
const backToTitleFromSettingsBtn = document.getElementById('backToTitleFromSettingsBtn');
const titleSplash = document.getElementById('title-splash');

const settingsSidebar = document.getElementById('settingsSidebar');
const settingsCollapseBtn = document.getElementById('settingsCollapseBtn');
const settingsTabTitle = document.getElementById('settingsTabTitle');

const settingsTabs = {
    audio: document.getElementById('audioSettingsContainer'),
    gameplay: document.getElementById('gameplaySettingsContainer')
};
const settingsTabButtons = {
    audio: document.getElementById('audioSettingsTab'),
    gameplay: document.getElementById('gameplaySettingsTab')
};

const titleScreenCanvas = document.getElementById('titleScreenCanvas');
const titleScreenCtx = titleScreenCanvas ? titleScreenCanvas.getContext('2d') : null;

const titleMusic = document.getElementById('titleMusic');
const gameMusic = document.getElementById('gameMusic');
const tickSound = document.getElementById('tickSound');
const selectSound = document.getElementById('selectSound');
const tapSound = new Audio('media/audio/ui/tap.mp3');

const masterVolumeSlider = document.getElementById('masterVolumeSlider');
const masterVolumeValue = document.getElementById('masterVolumeValue');
const musicVolumeSlider = document.getElementById('musicVolumeSlider');
const musicVolumeValue = document.getElementById('musicVolumeValue');
const sfxVolumeSlider = document.getElementById('sfxVolumeSlider');
const sfxVolumeValue = document.getElementById('sfxVolumeValue');

const playlist = [ 'graphicalinterface.mp3', 'powersupply.mp3', 'circuit.mp3', 'lint.mp3', 'pcb.mp3' ];
let gameLoopStarted = false;
let audioSettings = JSON.parse(localStorage.getItem('nibblAudioSettings') || '{"master":1,"music":1,"sfx":1}');
let titleAnimationId = null;
let titleMarbles = [];
const TITLE_MARBLE_RADIUS = 20;
const TITLE_MARBLE_SPEED = 0.75;

const hardware = {
    cpu: { name: 'Intel 8088', brand: 'Intel', clock: '4.8 MHz', wattage: 1, cores: 1, production: .36 },
    gpu: { name: 'Cirrus Logic GD5428', vram: '512 KB DRAM', clock: '45 MHz', wattage: 3, production: .37 },
    ram: { name: 'Fujitsu MB8118-15', speed: 15, wattage: 0.5, type: 'DRAM', capacity: 0.0001220703125, production: .12 },
    motherboard: { name: 'ASUS P2B', chipset: 'Intel', type: 'DRAM', maxSpeed: 66, wattage: 25, production: 0 },
    psu: { name: 'Antec SP-200', wattage: 200, production: 0 },
    storage: { name: 'Seagate ST125N', type: 'HDD', size: '16 MB', speed: '5400 RPM', wattage: 5, production: .1 },
    monitor: { name: 'Commodore 1084S', type: 'CRT', "resolution": "640 × 480", aspect: "4:3", refresh: "60 Hz", depth: "4-bit", production: 0.05 },
    fan: { name: 'Intel Stock Fan (Core 2 Duo)', speed: '2000 RPM', airflow: '24 CPM', noise: '28 dB', wattage: 3, production: 0 }
};

const hardwareUpgrade = {
    "cpu": [
        { "name": "AMD 8088", "brand": "AMD", "clock": "5 MHz", "wattage": 2, "cores": 1 },
        { "name": "AMD 80286", "brand": "AMD", "clock": "6 MHz", "wattage": 4, "cores": 1 },
        { "name": "Intel 80386 DX", "brand": "Intel", "clock": "12 MHz", "wattage": 7, "cores": 1 },
        { "name": "Intel 486 DX2", "brand": "Intel", "clock": "66 MHz", "wattage": 5, "cores": 1 },
        { "name": "AMD K5 PR75", "brand": "AMD", "clock": "75 MHz", "wattage": 15, "cores": 1 },
        { "name": "Intel Pentium OverDrive", "brand": "Intel", "clock": "83 MHz", "wattage": 4, "cores": 1 },
        { "name": "Intel Pentium 166 MHz", "brand": "Intel", "clock": "166 MHz", "wattage": 15, "cores": 1 },
        { "name": "Intel Pentium II 450", "brand": "Intel", "clock": "450 MHz", "wattage": 29, "cores": 1 },
        { "name": "Intel Celeron 533", "brand": "Intel", "clock": "533 MHz", "wattage": 15, "cores": 1 },
        { "name": "AMD K6-2 550", "brand": "AMD", "clock": "550 MHz", "wattage": 15, "cores": 1 },
        { "name": "Intel Pentium III 800 MHz", "brand": "Intel", "clock": "800 MHz", "wattage": 25, "cores": 1 },
        { "name": "AMD Athlon 900", "brand": "AMD", "clock": "900 MHz", "wattage": 15, "cores": 1 },
        { "name": "Intel Core i3-2375M", "brand": "Intel", "clock": "1.5 GHz", "wattage": 17, "cores": 2 },
        { "name": "Intel Core i3-330M", "brand": "Intel", "clock": "2.1 GHz", "wattage": 35, "cores": 2 },
        { "name": "AMD A4-6300", "brand": "AMD", "clock": "3.7 GHz", "wattage": 65, "cores": 2 },
        { "name": "Intel Core2 Duo E7500", "brand": "Intel", "clock": "2.93 GHz", "wattage": 65, "cores": 2 },
        { "name": "AMD A6-6400K", "brand": "AMD", "clock": "3.9 GHz", "wattage": 65, "cores": 2 },
        { "name": "AMD A8-7100", "brand": "AMD", "clock": "1.8 GHz", "wattage": 19, "cores": 4 },
        { "name": "Intel Celeron J4005", "brand": "Intel", "clock": "2.0 GHz", "wattage": 10, "cores": 2 },
        { "name": "Intel Core i5-2537M", "brand": "Intel", "clock": "1.4 GHz", "wattage": 17, "cores": 2 },
        { "name": "AMD Phenom II P920", "brand": "AMD", "clock": "1.6 GHz", "wattage": 25, "cores": 4 },
        { "name": "AMD Athlon II X2 270", "brand": "AMD", "clock": "3.4 GHz", "wattage": 65, "cores": 2 },
        { "name": "AMD A6-7310", "brand": "AMD", "clock": "2.0 GHz", "wattage": 25, "cores": 4 },
        { "name": "Intel Celeron 4205U", "brand": "Intel", "clock": "1.8 GHz", "wattage": 15, "cores": 2 },
        { "name": "Intel Core i3-350M", "brand": "Intel", "clock": "2.3 GHz", "wattage": 35, "cores": 2 },
        { "name": "AMD A6-6310", "brand": "AMD", "clock": "1.8 GHz", "wattage": 15, "cores": 4 },
        { "name": "Intel Celeron 3867U", "brand": "Intel", "clock": "1.8 GHz", "wattage": 15, "cores": 2 },
        { "name": "Intel Celeron G530", "brand": "Intel", "clock": "2.4 GHz", "wattage": 65, "cores": 2 },
        { "name": "AMD A8-3500M", "brand": "AMD", "clock": "1.5 GHz", "wattage": 35, "cores": 4 },
        { "name": "AMD Phenom II X2 555", "brand": "AMD", "clock": "3.2 GHz", "wattage": 80, "cores": 2 },
        { "name": "Intel Core i3-3217U", "brand": "Intel", "clock": "1.8 GHz", "wattage": 17, "cores": 2 },
        { "name": "Intel Core i3-390M", "brand": "Intel", "clock": "2.67 GHz", "wattage": 35, "cores": 2 },
        { "name": "AMD A8-7410", "brand": "AMD", "clock": "2.2 GHz", "wattage": 15, "cores": 4 },
        { "name": "Intel Core2 Duo E8500", "brand": "Intel", "clock": "3.2 GHz", "wattage": 65, "cores": 2 },
        { "name": "Intel Core2 Duo T9900", "brand": "Intel", "clock": "3.1 GHz", "wattage": 35, "cores": 2 },
        { "name": "AMD Athlon II X3 445", "brand": "AMD", "clock": "3.1 GHz", "wattage": 95, "cores": 3 },
        { "name": "Intel Pentium B980", "brand": "Intel", "clock": "2.4 GHz", "wattage": 35, "cores": 2 },
        { "name": "Intel Pentium G2010", "brand": "Intel", "clock": "2.8 GHz", "wattage": 35, "cores": 2 },
        { "name": "Intel Core i3-2310M", "brand": "Intel", "clock": "2.1 GHz", "wattage": 35, "cores": 2 },
        { "name": "AMD A10 PRO-7350B", "brand": "AMD", "clock": "2.1 GHz", "wattage": 35, "cores": 4 },
        { "name": "Intel Celeron G550", "brand": "Intel", "clock": "2.6 GHz", "wattage": 65, "cores": 2 },
        { "name": "Intel Core i3-2328M", "brand": "Intel", "clock": "2.2 GHz", "wattage": 35, "cores": 2 },
        { "name": "AMD Phenom II X2 560", "brand": "AMD", "clock": "3.3 GHz", "wattage": 80, "cores": 2 },
        { "name": "Intel Pentium 4415Y", "brand": "Intel", "clock": "1.6 GHz", "wattage": 15, "cores": 2 },
        { "name": "Intel Core i3-2350M", "brand": "Intel", "clock": "2.3 GHz", "wattage": 35, "cores": 2 },
        { "name": "Intel Core i5-480M", "brand": "Intel", "clock": "2.7 GHz", "wattage": 35, "cores": 2 },
        { "name": "Intel Celeron N3450", "brand": "Intel", "clock": "1.1 GHz", "wattage": 6, "cores": 4 },
        { "name": "AMD FX-7500", "brand": "AMD", "clock": "2.1 GHz", "wattage": 35, "cores": 4 },
        { "name": "AMD Athlon II X3 440", "brand": "AMD", "clock": "3.0 GHz", "wattage": 95, "cores": 3 },
        { "name": "AMD Athlon II X3 450", "brand": "AMD", "clock": "3.2 GHz", "wattage": 95, "cores": 3 },
        { "name": "Intel Core2 Quad Q6600", "brand": "Intel", "clock": "2.4 GHz", "wattage": 105, "cores": 4 },
        { "name": "Intel Atom x6211E", "brand": "Intel", "clock": "2.1 GHz", "wattage": 6, "cores": 2 },
        { "name": "Intel Pentium G2030", "brand": "Intel", "clock": "3.0 GHz", "wattage": 53, "cores": 2 },
        { "name": "Intel Core i3-4020Y", "brand": "Intel", "clock": "1.5 GHz", "wattage": 12, "cores": 2 },
        { "name": "Intel Pentium G3220", "brand": "Intel", "clock": "3.0 GHz", "wattage": 54, "cores": 2 },
        { "name": "AMD Phenom II X4 820", "brand": "AMD", "clock": "2.8 GHz", "wattage": 95, "cores": 4 },
        { "name": "AMD PRO A10-8750B", "brand": "AMD", "clock": "3.6 GHz", "wattage": 65, "cores": 4 },
        { "name": "AMD Athlon X4 740", "brand": "AMD", "clock": "3.2 GHz", "wattage": 65, "cores": 4 },
        { "name": "AMD A6-9500", "brand": "AMD", "clock": "3.5 GHz", "wattage": 65, "cores": 2 },
        { "name": "Intel Core i5-2390T", "brand": "Intel", "clock": "2.7 GHz", "wattage": 35, "cores": 2 },
        { "name": "Intel Pentium G3250", "brand": "Intel", "clock": "3.2 GHz", "wattage": 53, "cores": 2 },
        { "name": "Intel Core i5-670", "brand": "Intel", "clock": "3.5 GHz", "wattage": 95, "cores": 2 },
        { "name": "AMD A10-9600P", "brand": "AMD", "clock": "2.4 GHz", "wattage": 15, "cores": 4 },
        { "name": "Intel Xeon E5-2609 v2", "brand": "Intel", "clock": "2.5 GHz", "wattage": 95, "cores": 4 },
        { "name": "Intel Xeon E5606", "brand": "Intel", "clock": "2.1 GHz", "wattage": 95, "cores": 4 },
        { "name": "Intel Core i5-3340M", "brand": "Intel", "clock": "2.7 GHz", "wattage": 35, "cores": 2 },
        { "name": "AMD A8 PRO-7600B", "brand": "AMD", "clock": "3.1 GHz", "wattage": 65, "cores": 4 },
        { "name": "AMD A8-7600", "brand": "AMD", "clock": "3.1 GHz", "wattage": 95, "cores": 4 },
        { "name": "Intel Xeon X3440", "brand": "Intel", "clock": "2.5 GHz", "wattage": 95, "cores": 4 },
        { "name": "Intel Core i5-4250U", "brand": "Intel", "clock": "1.3 GHz", "wattage": 15, "cores": 2 },
        { "name": "AMD Ryzen 3 3200U", "brand": "AMD", "clock": "2.6 GHz", "wattage": 15, "cores": 2 },
        { "name": "AMD FX-8120", "brand": "AMD", "clock": "3.1 GHz", "wattage": 125, "cores": 8 },
        { "name": "AMD FX-6350", "brand": "AMD", "clock": "3.9 GHz", "wattage": 125, "cores": 6 },
        { "name": "Intel Core i7-870", "brand": "Intel", "clock": "2.9 GHz", "wattage": 95, "cores": 4 },
        { "name": "Intel Xeon E5530", "brand": "Intel", "clock": "2.4 GHz", "wattage": 95, "cores": 8 },
        { "name": "AMD FX-8320E", "brand": "AMD", "clock": "3.2 GHz", "wattage": 95, "cores": 8 },
        { "name": "Intel Core i5-3550S", "brand": "Intel", "clock": "3.0 GHz", "wattage": 65, "cores": 4 },
        { "name": "AMD FX-8320", "brand": "AMD", "clock": "3.5 GHz", "wattage": 125, "cores": 8 },
        { "name": "Intel Core i7-4600M", "brand": "Intel", "clock": "2.9 GHz", "wattage": 38, "cores": 2 },
        { "name": "AMD FX-9370", "brand": "AMD", "clock": "4.4 GHz", "wattage": 220, "cores": 8 },
        { "name": "Intel Core i7-3940XM", "brand": "Intel", "clock": "2.6 GHz", "wattage": 65, "cores": 2 },
        { "name": "Intel Core i5-8600", "brand": "Intel", "clock": "3.1 GHz", "wattage": 65, "cores": 6 },
        { "name": "AMD Ryzen 3 3100", "brand": "AMD", "clock": "3.6 GHz", "wattage": 65, "cores": 4 },
        { "name": "AMD Ryzen 7 1700", "brand": "AMD", "clock": "3.0 GHz", "wattage": 65, "cores": 8 },
        { "name": "Intel Xeon E-2276M", "brand": "Intel", "clock": "2.8 GHz", "wattage": 45, "cores": 6 },
        { "name": "AMD Ryzen 5 2600X", "brand": "AMD", "clock": "3.6 GHz", "wattage": 95, "cores": 6 },
        { "name": "Intel Xeon Silver 4210", "brand": "Intel", "clock": "2.2 GHz", "wattage": 85, "cores": 10 },
        { "name": "AMD Ryzen 7 1700X", "brand": "AMD", "clock": "3.4 GHz", "wattage": 95, "cores": 8 },
        { "name": "AMD Ryzen 7 1800X", "brand": "AMD", "clock": "3.6 GHz", "wattage": 95, "cores": 8 },
        { "name": "Intel Core i5-1235U", "brand": "Intel", "clock": "1.3 GHz", "wattage": 15, "cores": 10 },
        { "name": "Intel Xeon Silver 4116", "brand": "Intel", "clock": "2.1 GHz", "wattage": 85, "cores": 12 },
        { "name": "Intel Core i5-8600K", "brand": "Intel", "clock": "3.6 GHz", "wattage": 95, "cores": 6 },
        { "name": "AMD Ryzen 7 2700X", "brand": "AMD", "clock": "3.7 GHz", "wattage": 105, "cores": 8 },
        { "name": "Intel Xeon E5-2600 v4", "brand": "Intel", "clock": "2.0 GHz", "wattage": 145, "cores": 14 },
        { "name": "Intel Xeon E5-2680 v3", "brand": "Intel", "clock": "2.5 GHz", "wattage": 120, "cores": 12 },
        { "name": "Intel Core i5-10500E", "brand": "Intel", "clock": "3.1 GHz", "wattage": 35, "cores": 6 },
        { "name": "Intel Xeon Gold 5118", "brand": "Intel", "clock": "2.3 GHz", "wattage": 105, "cores": 12 },
        { "name": "AMD Ryzen 5 3600", "brand": "AMD", "clock": "3.6 GHz", "wattage": 65, "cores": 6 },
        { "name": "AMD Ryzen 5 3600X", "brand": "AMD", "clock": "3.8 GHz", "wattage": 95, "cores": 6 },
        { "name": "AMD Ryzen Threadripper 1920X", "brand": "AMD", "clock": "3.5 GHz", "wattage": 180, "cores": 12 },
        { "name": "Intel Core i7-6900K", "brand": "Intel", "clock": "3.2 GHz", "wattage": 140, "cores": 8 },
        { "name": "Intel Core i7-9700K", "brand": "Intel", "clock": "3.6 GHz", "wattage": 95, "cores": 8 },
        { "name": "AMD Ryzen Threadripper 2970WX", "brand": "AMD", "clock": "3.0 GHz", "wattage": 250, "cores": 24 },
        { "name": "Intel Core i7-9700KF", "brand": "Intel", "clock": "3.6 GHz", "wattage": 95, "cores": 8 },
        { "name": "AMD Ryzen Threadripper 2920X", "brand": "AMD", "clock": "3.5 GHz", "wattage": 180, "cores": 12 },
        { "name": "AMD Ryzen 7 7736U", "brand": "AMD", "clock": "2.7 GHz", "wattage": 65, "cores": 8 },
        { "name": "AMD Ryzen Threadripper 2990WX", "brand": "AMD", "clock": "3.0 GHz", "wattage": 250, "cores": 32 },
        { "name": "Intel Core i7-11800H", "brand": "Intel", "clock": "2.3 GHz", "wattage": 45, "cores": 8 },
        { "name": "AMD EPYC 7502P", "brand": "AMD", "clock": "2.5 GHz", "wattage": 200, "cores": 32 },
        { "name": "AMD Ryzen 7 3700X", "brand": "AMD", "clock": "3.6 GHz", "wattage": 65, "cores": 8 },
        { "name": "AMD Ryzen Threadripper 1950X", "brand": "AMD", "clock": "3.4 GHz", "wattage": 180, "cores": 16 },
        { "name": "AMD Ryzen 7 3800X", "brand": "AMD", "clock": "3.9 GHz", "wattage": 105, "cores": 8 },
        { "name": "Intel Core i9-13900E", "brand": "Intel", "clock": "1.8 GHz", "wattage": 65, "cores": 24 },
        { "name": "Intel Xeon Gold 6138", "brand": "Intel", "clock": "2.0 GHz", "wattage": 150, "cores": 20 },
        { "name": "Intel Xeon Gold 6244", "brand": "Intel", "clock": "3.6 GHz", "wattage": 150, "cores": 8 },
        { "name": "Intel Xeon E5-2698 v4", "brand": "Intel", "clock": "2.2 GHz", "wattage": 145, "cores": 20 },
        { "name": "AMD Ryzen Threadripper 2950X", "brand": "AMD", "clock": "3.5 GHz", "wattage": 180, "cores": 16 },
        { "name": "Intel Xeon W-2150B", "brand": "Intel", "clock": "3.0 GHz", "wattage": 105, "cores": 10 },
        { "name": "Intel Core i9-7900X", "brand": "Intel", "clock": "3.3 GHz", "wattage": 140, "cores": 10 },
        { "name": "Intel Core i9-7920X", "brand": "Intel", "clock": "2.9 GHz", "wattage": 140, "cores": 12 },
        { "name": "Intel Core i9-9900X", "brand": "Intel", "clock": "3.5 GHz", "wattage": 165, "cores": 10 },
        { "name": "AMD Ryzen 7 8840U", "brand": "AMD", "clock": "3.3 GHz", "wattage": 15, "cores": 8 },
        { "name": "AMD Ryzen 9 3900", "brand": "AMD", "clock": "3.1 GHz", "wattage": 105, "cores": 12 },
        { "name": "AMD Ryzen Threadripper 3960X", "brand": "AMD", "clock": "3.8 GHz", "wattage": 240, "cores": 24 },
        { "name": "AMD Ryzen Threadripper PRO 3955WX", "brand": "AMD", "clock": "3.9 GHz", "wattage": 280, "cores": 16 },
        { "name": "Intel Core i5-10600K", "brand": "Intel", "clock": "4.1 GHz", "wattage": 125, "cores": 6 },
        { "name": "Intel Core i9-10900F", "brand": "Intel", "clock": "2.8 GHz", "wattage": 65, "cores": 10 },
        { "name": "AMD Ryzen 7 3800X", "brand": "AMD", "clock": "3.9 GHz", "wattage": 105, "cores": 8 },
        { "name": "AMD Ryzen 9 3900X", "brand": "AMD", "clock": "3.8 GHz", "wattage": 105, "cores": 12 },
        { "name": "Intel Core i7-10700K", "brand": "Intel", "clock": "3.8 GHz", "wattage": 125, "cores": 8 },
        { "name": "AMD Ryzen 9 3950X", "brand": "AMD", "clock": "3.5 GHz", "wattage": 105, "cores": 16 },
        { "name": "Intel Core i9-10910", "brand": "Intel", "clock": "3.4 GHz", "wattage": 65, "cores": 8 },
        { "name": "Intel Core i5-1155G7", "brand": "Intel", "clock": "2.5 GHz", "wattage": 28, "cores": 4 },
        { "name": "AMD Ryzen 7 5700X", "brand": "AMD", "clock": "3.4 GHz", "wattage": 65, "cores": 8 },
        { "name": "Intel Xeon w5-2465X", "brand": "Intel", "clock": "3.1 GHz", "wattage": 150, "cores": 16 },
        { "name": "AMD Ryzen 9 5900X", "brand": "AMD", "clock": "3.4 GHz", "wattage": 105, "cores": 12 },
        { "name": "AMD Ryzen 9 5950X", "brand": "AMD", "clock": "3.4 GHz", "wattage": 105, "cores": 16 },
        { "name": "Intel Core i5-12400F", "brand": "Intel", "clock": "2.5 GHz", "wattage": 65, "cores": 6 },
        { "name": "AMD Ryzen 7 7800X3D", "brand": "AMD", "clock": "4.2 GHz", "wattage": 120, "cores": 8 },
        { "name": "AMD Ryzen 9 7945HX3D", "brand": "AMD", "clock": "2.3 GHz", "wattage": 55, "cores": 16 },
        { "name": "Intel Core i5-14600K", "brand": "Intel", "clock": "3.5 GHz", "wattage": 125, "cores": 14 },
        { "name": "AMD Ryzen 9 7900X3D", "brand": "AMD", "clock": "4.4 GHz", "wattage": 120, "cores": 12 },
        { "name": "AMD Ryzen 5 7600X", "brand": "AMD", "clock": "4.7 GHz", "wattage": 105, "cores": 6 },
        { "name": "Intel Core i9-13900KF", "brand": "Intel", "clock": "3.0 GHz", "wattage": 125, "cores": 24 },
        { "name": "AMD Ryzen Threadripper PRO 5995WX", "brand": "AMD", "clock": "2.7 GHz", "wattage": 280, "cores": 64 },
        { "name": "AMD Ryzen Threadripper PRO 5975WX", "brand": "AMD", "clock": "3.6 GHz", "wattage": 280, "cores": 32 },
        { "name": "Intel Core i7-14700K", "brand": "Intel", "clock": "3.4 GHz", "wattage": 125, "cores": 20 },
        { "name": "AMD Ryzen 9 7950X3D", "brand": "AMD", "clock": "4.2 GHz", "wattage": 120, "cores": 16 },
        { "name": "AMD Ryzen 9 7950X", "brand": "AMD", "clock": "4.5 GHz", "wattage": 170, "cores": 16 },
        { "name": "AMD Ryzen Threadripper 7980X", "brand": "AMD", "clock": "3.2 GHz", "wattage": 350, "cores": 64 },
        { "name": "AMD Ryzen Threadripper PRO 7985WX", "brand": "AMD", "clock": "3.2 GHz", "wattage": 350, "cores": 64 },
        { "name": "AMD Ryzen Threadripper PRO 7995WX", "brand": "AMD", "clock": "2.5 GHz", "wattage": 350, "cores": 96 },
        { "name": "Intel Core i9-15900K", "brand": "Intel", "clock": "3.6 GHz", "wattage": 350, "cores": 24 },
        { "name": "AMD Ryzen 9 8650X", "brand": "AMD", "clock": "4.0 GHz", "wattage": 350, "cores": 32 },
        { "name": "AMD Ryzen 9 8800X", "brand": "AMD", "clock": "4.5 GHz", "wattage": 170, "cores": 24 },
        { "name": "AMD Ryzen 9 8800X3D", "brand": "AMD", "clock": "4.9 GHz", "wattage": 185, "cores": 32 },
        { "name": "Intel Core i9-16900K", "brand": "Intel", "clock": "4.0 GHz", "wattage": 180, "cores": 24 },
        { "name": "AMD Ryzen 9 8850X", "brand": "AMD", "clock": "4.7 GHz", "wattage": 195, "cores": 48 },
        { "name": "AMD Ryzen Threadripper PRO 8005WX", "brand": "AMD", "clock": "3.7 GHz", "wattage": 350, "cores": 96 },
        { "name": "AMD Ryzen Threadripper PRO 8015WX", "brand": "AMD", "clock": "3.8 GHz", "wattage": 345, "cores": 96 },
        { "name": "AMD Ryzen 9 8880X", "brand": "AMD", "clock": "5.1 GHz", "wattage": 215, "cores": 72 },
        { "name": "Intel Core i9-17900K", "brand": "Intel", "clock": "4.5 GHz", "wattage": 185, "cores": 32 },
        { "name": "Intel Core i9-18900K", "brand": "Intel", "clock": "5.1 GHz", "wattage": 170, "cores": 24 },
        { "name": "AMD Ryzen 9 8900X", "brand": "AMD", "clock": "4.9 GHz", "wattage": 195, "cores": 48 },
        { "name": "AMD Ryzen 9 8900X3D", "brand": "AMD", "clock": "5.2 GHz", "wattage": 185, "cores": 72 },
        { "name": "AMD Ryzen 9 8950X", "brand": "AMD", "clock": "5.2 GHz", "wattage": 215, "cores": 72 },
        { "name": "AMD Ryzen Threadripper PRO 8550WX", "brand": "AMD", "clock": "4.7 GHz", "wattage": 360, "cores": 112 },
        { "name": "AMD Ryzen Threadripper PRO 8575WX", "brand": "AMD", "clock": "5.3 GHz", "wattage": 365, "cores": 112 },
        { "name": "AMD Ryzen Threadripper PRO 8595WX", "brand": "AMD", "clock": "5.2 GHz", "wattage": 375, "cores": 144 },
        { "name": "AMD Ryzen 9 8960X3D", "brand": "AMD", "clock": "5.7 GHz", "wattage": 250, "cores": 96 },
        { "name": "AMD Ryzen 9 8990X", "brand": "AMD", "clock": "6.2 GHz", "wattage": 240, "cores": 112 },
        { "name": "Intel Core i9-19900K", "brand": "Intel", "clock": "6.3 GHz", "wattage": 255, "cores": 32 },
        { "name": "AMD Ryzen 9 8990X3D", "brand": "AMD", "clock": "6.3 GHz", "wattage": 255, "cores": 128 },
        { "name": "Intel i9-20900K", "brand": "AMD", "clock": "5.3 GHz", "wattage": 270, "cores": 72 },
        { "name": "Intel Xeon E-9690X", "brand": "AMD", "clock": "4.9 GHz", "wattage": 195, "cores": 48 },
        { "name": "AMD Ryzen 9 9000X", "brand": "AMD", "clock": "7.0 GHz", "wattage": 270, "cores": 144 },
        { "name": "AMD Ryzen 9 9000X3D", "brand": "AMD", "clock": "7.0 GHz", "wattage": 270, "cores": 144 },
        { "name": "AMD Ryzen 9 9900X", "brand": "AMD", "clock": "9.3 GHz", "wattage": 330, "cores": 144 },
        { "name": "AMD Ryzen 9 9900X3D", "brand": "AMD", "clock": "9.4 GHz", "wattage": 335, "cores": 172 },
        { "name": "AMD Ryzen Threadripper PRO 8990WX", "brand": "AMD", "clock": "7.9 GHz", "wattage": 335, "cores": 256 },
        { "name": "AMD Ryzen Threadripper PRO 8995WX", "brand": "AMD", "clock": "8.5 GHz", "wattage": 380, "cores": 256 },
        { "name": "Intel Core i10-21900K", "brand": "AMD", "clock": "8.5 GHz", "wattage": 380, "cores": 72 },
        { "name": "AMD Ryzen 10 3300X", "brand": "AMD", "clock": "10.2 GHz", "wattage": 280, "cores": 172 },
        { "name": "AMD Ryzen 10 3300X3D", "brand": "AMD", "clock": "10.8 GHz", "wattage": 350, "cores": 172 },
        { "name": "AMD Ryzen 10 3400X", "brand": "AMD", "clock": "10.7 GHz", "wattage": 350, "cores": 256 },
        { "name": "Intel Core i10-22900K", "brand": "Intel", "clock": "10.5 GHz", "wattage": 345, "cores": 172 },
        { "name": "AMD Ryzen 10 3400X3D", "brand": "AMD", "clock": "11.3 GHz", "wattage": 350, "cores": 256 },
        { "name": "AMD Ryzen 10 3500X", "brand": "AMD", "clock": "11.7 GHz", "wattage": 350, "cores": 272 },
        { "name": "AMD Ryzen 10 3500X3D", "brand": "AMD", "clock": "11.7 GHz", "wattage": 350, "cores": 272 },
        { "name": "Intel Core i10-23900K", "brand": "Intel", "clock": "12.5 GHz", "wattage": 400, "cores": 172 },
        { "name": "AMD Ryzen 10 3600X", "brand": "AMD", "clock": "12.5 GHz", "wattage": 405, "cores": 256 },
        { "name": "AMD Ryzen 10 3600X3D", "brand": "AMD", "clock": "13.0 GHz", "wattage": 415, "cores": 256 },
        { "name": "AMD Ryzen 10 3700X", "brand": "AMD", "clock": "13.4 GHz", "wattage": 420, "cores": 272 },
        { "name": "AMD Ryzen 10 3700X3D", "brand": "AMD", "clock": "14.4 GHz", "wattage": 425, "cores": 296 },
        { "name": "AMD Ryzen Threadripper PRO 9100WX", "brand": "AMD", "clock": "13.2 GHz", "wattage": 445, "cores": 320 },
        { "name": "AMD Ryzen 10 3850X", "brand": "AMD", "clock": "14.5 GHz", "wattage": 430, "cores": 296 },
        { "name": "Intel Core i10-24900K", "brand": "Intel", "clock": "12.9 GHz", "wattage": 430, "cores": 296 },
        { "name": "AMD Ryzen 10 3850X3D", "brand": "AMD", "clock": "15.1 GHz", "wattage": 440, "cores": 320 },
        { "name": "AMD Ryzen 10 3900X", "brand": "AMD", "clock": "15.6 GHz", "wattage": 440, "cores": 320 },
        { "name": "AMD Ryzen 10 3900X3D", "brand": "AMD", "clock": "15.6 GHz", "wattage": 440, "cores": 320 },
        { "name": "AMD Ryzen Threadripper PRO 9255WX", "brand": "AMD", "clock": "15.9 GHz", "wattage": 490, "cores": 448 },
        { "name": "AMD Ryzen 10 3950X", "brand": "AMD", "clock": "16.6 GHz", "wattage": 490, "cores": 320 },
        { "name": "AMD Ryzen 10 4000X", "brand": "AMD", "clock": "16.8 GHz", "wattage": 490, "cores": 448 },
        { "name": "Intel Core i10-25900K", "brand": "Intel", "clock": "17.0 GHz", "wattage": 490, "cores": 296 },
        { "name": "Intel Xeon E-7010X", "brand": "Intel", "clock": "16.8 GHz", "wattage": 490, "cores": 320 },
        { "name": "AMD Ryzen 10 4000X3D", "brand": "AMD", "clock": "17.2 GHz", "wattage": 490, "cores": 464 },
        { "name": "AMD Ryzen 10 4100X", "brand": "AMD", "clock": "18.0 GHz", "wattage": 495, "cores": 448 },
        { "name": "AMD Ryzen 10 4100X3D", "brand": "AMD", "clock": "18.1 GHz", "wattage": 500, "cores": 464 },
        { "name": "AMD Ryzen 10 4150X", "brand": "AMD", "clock": "18.8 GHz", "wattage": 375, "cores": 448 },
        { "name": "AMD Ryzen 10 4150X3D", "brand": "AMD", "clock": "18.8 GHz", "wattage": 395, "cores": 464 },
        { "name": "AMD Ryzen 10 4200X", "brand": "AMD", "clock": "19.5 GHz", "wattage": 400, "cores": 448 },
        { "name": "AMD Ryzen 10 4300X", "brand": "AMD", "clock": "20.4 GHz", "wattage": 415, "cores": 448 },
        { "name": "AMD Ryzen 10 4300X3D", "brand": "AMD", "clock": "20.4 GHz", "wattage": 420, "cores": 464 },
        { "name": "AMD Ryzen 10 4350X", "brand": "AMD", "clock": "21.2 GHz", "wattage": 425, "cores": 464 },
        { "name": "Intel Core i10-26900K", "brand": "Intel", "clock": "22.6 GHz", "wattage": 430, "cores": 448 },
        { "name": "AMD Ryzen 10 4400X", "brand": "AMD", "clock": "22.0 GHz", "wattage": 430, "cores": 464 },
        { "name": "AMD Ryzen 10 4400X3D", "brand": "AMD", "clock": "22.0 GHz", "wattage": 435, "cores": 480 },
        { "name": "AMD Ryzen 10 4450X", "brand": "AMD", "clock": "22.8 GHz", "wattage": 445, "cores": 480 },
        { "name": "AMD Ryzen 10 4500X", "brand": "AMD", "clock": "24.0 GHz", "wattage": 450, "cores": 480 },
        { "name": "AMD Ryzen 10 4600X", "brand": "AMD", "clock": "24.8 GHz", "wattage": 460, "cores": 480 },
        { "name": "AMD Ryzen 10 4600X3D", "brand": "AMD", "clock": "25.2 GHz", "wattage": 465, "cores": 480 },
        { "name": "AMD Ryzen 10 4700X", "brand": "AMD", "clock": "25.8 GHz", "wattage": 470, "cores": 480 },
        { "name": "AMD Ryzen 10 4700X3D", "brand": "AMD", "clock": "26.6 GHz", "wattage": 475, "cores": 496 },
        { "name": "AMD Ryzen 10 4800X", "brand": "AMD", "clock": "27.5 GHz", "wattage": 480, "cores": 480 },
        { "name": "AMD Ryzen 10 4800X3D", "brand": "AMD", "clock": "27.7 GHz", "wattage": 485, "cores": 496 },
        { "name": "AMD Ryzen 10 4850X", "brand": "AMD", "clock": "28.1 GHz", "wattage": 490, "cores": 480 },
        { "name": "AMD Ryzen 10 4900X", "brand": "AMD", "clock": "29.0 GHz", "wattage": 495, "cores": 480 },
        { "name": "AMD Ryzen 10 4900X3D", "brand": "AMD", "clock": "29.9 GHz", "wattage": 500, "cores": 496 },
        { "name": "AMD Ryzen 10 4950X", "brand": "AMD", "clock": "29.8 GHz", "wattage": 500, "cores": 504 },
        { "name": "Intel Core i10-27900K", "brand": "Intel", "clock": "29.8 GHz", "wattage": 505, "cores": 496 },
        { "name": "AMD Ryzen 10 5000X", "brand": "AMD", "clock": "30.1 GHz", "wattage": 505, "cores": 504 },
        { "name": "AMD Ryzen 10 5000X3D", "brand": "AMD", "clock": "30.6 GHz", "wattage": 510, "cores": 512 },
        { "name": "AMD Ryzen 10 5100X", "brand": "AMD", "clock": "31.2 GHz", "wattage": 515, "cores": 512 },
        { "name": "AMD Ryzen 10 5100X3D", "brand": "AMD", "clock": "32.0 GHz", "wattage": 520, "cores": 512 },
        { "name": "AMD Ryzen 10 5200X", "brand": "AMD", "clock": "32.8 GHz", "wattage": 525, "cores": 512 },
        { "name": "AMD Ryzen 10 5200X3D", "brand": "AMD", "clock": "33.0 GHz", "wattage": 530, "cores": 512 },
        { "name": "AMD Ryzen 10 5300X", "brand": "AMD", "clock": "34.0 GHz", "wattage": 535, "cores": 512 },
        { "name": "AMD Ryzen 10 5300X3D", "brand": "AMD", "clock": "34.8 GHz", "wattage": 540, "cores": 512 },
        { "name": "AMD Ryzen 10 5400X", "brand": "AMD", "clock": "35.8 GHz", "wattage": 545, "cores": 512 },
        { "name": "AMD Ryzen 10 5400X3D", "brand": "AMD", "clock": "36.5 GHz", "wattage": 550, "cores": 512 },
        { "name": "AMD Ryzen 10 5500X", "brand": "AMD", "clock": "37.4 GHz", "wattage": 555, "cores": 512 },
        { "name": "Intel Core i10-29900K", "brand": "Intel", "clock": "38.1 GHz", "wattage": 560, "cores": 496 },
        { "name": "AMD Ryzen 10 5500X3D", "brand": "AMD", "clock": "38.0 GHz", "wattage": 560, "cores": 520 },
        { "name": "AMD Ryzen 10 5600X", "brand": "AMD", "clock": "39.0 GHz", "wattage": 565, "cores": 512 },
        { "name": "AMD Ryzen 10 5600X3D", "brand": "AMD", "clock": "39.8 GHz", "wattage": 570, "cores": 520 },
        { "name": "AMD Ryzen 10 5700X", "brand": "AMD", "clock": "40.8 GHz", "wattage": 575, "cores": 520 },
        { "name": "Intel Core i10-30900K", "brand": "Intel", "clock": "41.2 GHz", "wattage": 580, "cores": 496 },
        { "name": "AMD Ryzen 10 5700X3D", "brand": "AMD", "clock": "41.6 GHz", "wattage": 580, "cores": 520 },
        { "name": "AMD Ryzen 10 5800X", "brand": "AMD", "clock": "42.4 GHz", "wattage": 585, "cores": 520 },
        { "name": "AMD Ryzen 10 5800X3D", "brand": "AMD", "clock": "43.0 GHz", "wattage": 590, "cores": 520 },
        { "name": "AMD Ryzen 10 5900X", "brand": "AMD", "clock": "44.0 GHz", "wattage": 595, "cores": 520 },
        { "name": "AMD Ryzen 10 5900X3D", "brand": "AMD", "clock": "44.3 GHz", "wattage": 600, "cores": 528 },
        { "name": "Intel Core i11-31900K", "brand": "AMD", "clock": "44.8 GHz", "wattage": 605, "cores": 512 },
        { "name": "AMD Ryzen 10 5950X", "brand": "AMD", "clock": "45.0 GHz", "wattage": 605, "cores": 528 },
        { "name": "AMD Ryzen 10 5950X3D", "brand": "AMD", "clock": "45.5 GHz", "wattage": 610, "cores": 528 },
        { "name": "AMD Ryzen 10 6000X", "brand": "AMD", "clock": "46.0 GHz", "wattage": 500, "cores": 528 },
        { "name": "AMD Ryzen 10 6000X3D", "brand": "AMD", "clock": "46.6 GHz", "wattage": 525, "cores": 544 },
        { "name": "AMD Ryzen 10 6100X", "brand": "AMD", "clock": "49.1 GHz", "wattage": 510, "cores": 528 },
        { "name": "AMD Ryzen 10 6100X3D", "brand": "AMD", "clock": "49.5 GHz", "wattage": 535, "cores": 544 },
        { "name": "Intel Core i11-33900K", "brand": "Intel", "clock": "50.2 GHz", "wattage": 520, "cores": 528 },
        { "name": "Intel Core i11-34900K", "brand": "Intel", "clock": "50.7 GHz", "wattage": 535, "cores": 528 },
        { "name": "AMD Ryzen 10 6200X", "brand": "AMD", "clock": "51.1 GHz", "wattage": 540, "cores": 544 },
        { "name": "AMD Ryzen 10 6200X3D", "brand": "AMD", "clock": "52.0 GHz", "wattage": 545, "cores": 544 },
        { "name": "AMD Ryzen 10 6300X", "brand": "AMD", "clock": "52.1 GHz", "wattage": 550, "cores": 544 },
        { "name": "AMD Ryzen 10 6300X3D", "brand": "AMD", "clock": "52.9 GHz", "wattage": 555, "cores": 544 },
        { "name": "AMD Ryzen 10 6400X", "brand": "AMD", "clock": "53.5 GHz", "wattage": 560, "cores": 544 },
        { "name": "Intel Core i11-35900K", "brand": "Intel", "clock": "53.8 GHz", "wattage": 565, "cores": 528 },
        { "name": "AMD Ryzen 10 6400X3D", "brand": "AMD", "clock": "54.3 GHz", "wattage": 565, "cores": 544 },
        { "name": "AMD Ryzen 10 6500X", "brand": "AMD", "clock": "55.1 GHz", "wattage": 570, "cores": 544 },
        { "name": "AMD Ryzen 10 6500X3D", "brand": "AMD", "clock": "55.9 GHz", "wattage": 575, "cores": 544 },
        { "name": "Intel Core i11-37900K", "brand": "Intel", "clock": "56.2 GHz", "wattage": 570, "cores": 544 },
        { "name": "AMD Ryzen 10 6600X", "brand": "AMD", "clock": "57.0 GHz", "wattage": 580, "cores": 544 },
        { "name": "AMD Ryzen 10 6600X3D", "brand": "AMD", "clock": "58.0 GHz", "wattage": 585, "cores": 544 },
        { "name": "AMD Ryzen 10 6700X", "brand": "AMD", "clock": "58.6 GHz", "wattage": 590, "cores": 544 },
        { "name": "AMD Ryzen 10 6700X3D", "brand": "AMD", "clock": "59.7 GHz", "wattage": 595, "cores": 544 },
        { "name": "AMD Ryzen 10 6800X", "brand": "AMD", "clock": "62.5 GHz", "wattage": 600, "cores": 544 },
        { "name": "AMD Ryzen 10 6800X3D", "brand": "AMD", "clock": "62.7 GHz", "wattage": 605, "cores": 544 },
        { "name": "AMD Ryzen Threadripper PRO 10295WX", "brand": "AMD", "clock": "62.5 GHz", "wattage": 620, "cores": 640 },
        { "name": "AMD Ryzen Threadripper PRO 10395WX", "brand": "AMD", "clock": "64.2 GHz", "wattage": 645, "cores": 640 },
        { "name": "AMD Ryzen 10 6850X", "brand": "AMD", "clock": "66.3 GHz", "wattage": 575, "cores": 544 },
        { "name": "AMD Ryzen 10 6850X3D", "brand": "AMD", "clock": "67.0 GHz", "wattage": 580, "cores": 560 },
        { "name": "AMD Ryzen 10 6900X", "brand": "AMD", "clock": "67.7 GHz", "wattage": 590, "cores": 544 },
        { "name": "AMD Ryzen 10 6900X3D", "brand": "AMD", "clock": "68.3 GHz", "wattage": 595, "cores": 560 },
        { "name": "AMD Ryzen 10 6950X", "brand": "AMD", "clock": "69.4 GHz", "wattage": 600, "cores": 560 },
        { "name": "AMD Ryzen 10 6950X3D", "brand": "AMD", "clock": "70.7 GHz", "wattage": 605, "cores": 560 },
        { "name": "Intel Core i12-39900K", "brand": "Intel", "clock": "71.6 GHz", "wattage": 610, "cores": 544 },
        { "name": "AMD Ryzen 10 7000X", "brand": "AMD", "clock": "72.0 GHz", "wattage": 620, "cores": 560 },
        { "name": "AMD Ryzen 10 7000X3D", "brand": "AMD", "clock": "72.8 GHz", "wattage": 625, "cores": 560 },
        { "name": "AMD Ryzen 10 7250X", "brand": "AMD", "clock": "78.1 GHz", "wattage": 630, "cores": 560 },
        { "name": "AMD Ryzen 10 7250X3D", "brand": "AMD", "clock": "79.0 GHz", "wattage": 635, "cores": 560 },
        { "name": "AMD Ryzen 10 7300X", "brand": "AMD", "clock": "79.8 GHz", "wattage": 640, "cores": 560 },
        { "name": "AMD Ryzen 10 7300X3D", "brand": "AMD", "clock": "80.8 GHz", "wattage": 645, "cores": 560 },
        { "name": "AMD Ryzen Threadripper PRO 10495WX", "brand": "AMD", "clock": "80.6 GHz", "wattage": 670, "cores": 640 },
        { "name": "Intel Core i12-42900K", "brand": "Intel", "clock": "82.8 GHz", "wattage": 650, "cores": 560 },
        { "name": "AMD Ryzen 10 7400X", "brand": "AMD", "clock": "84.5 GHz", "wattage": 545, "cores": 560 },
        { "name": "AMD Ryzen 10 7400X3D", "brand": "AMD", "clock": "85.7 GHz", "wattage": 560, "cores": 576 },
        { "name": "AMD Ryzen 10 7450X", "brand": "AMD", "clock": "86.2 GHz", "wattage": 560, "cores": 560 },
        { "name": "AMD Ryzen 10 7450X3D", "brand": "AMD", "clock": "87.0 GHz", "wattage": 565, "cores": 576 },
        { "name": "AMD Ryzen 10 7550X", "brand": "AMD", "clock": "89.4 GHz", "wattage": 565, "cores": 576 },
        { "name": "AMD Ryzen 10 7550X3D", "brand": "AMD", "clock": "91.3 GHz", "wattage": 570, "cores": 576 },
        { "name": "Intel Core i12-45900K", "brand": "Intel", "clock": "93.8 GHz", "wattage": 575, "cores": 592 },
        { "name": "AMD Ryzen 10 7700X", "brand": "AMD", "clock": "97.9 GHz", "wattage": 575, "cores": 602 },
        { "name": "AMD Ryzen 10 7700X3D", "brand": "AMD", "clock": "99.5 GHz", "wattage": 580, "cores": 602 },
        { "name": "AMD Ryzen 10 7750X", "brand": "AMD", "clock": "100.5 GHz", "wattage": 585, "cores": 602 },
        { "name": "AMD Ryzen 10 7750X3D", "brand": "AMD", "clock": "102.4 GHz", "wattage": 590, "cores": 602 },
        { "name": "AMD Ryzen 10 7880X", "brand": "AMD", "clock": "108.1 GHz", "wattage": 600, "cores": 618 },
        { "name": "Intel Core i12-46900K", "brand": "Intel", "clock": "108.5 GHz", "wattage": 605, "cores": 602 },
        { "name": "Intel Core i12-47900K", "brand": "Intel", "clock": "111.3 GHz", "wattage": 610, "cores": 618 },
        { "name": "AMD Ryzen 10 7900X", "brand": "AMD", "clock": "111.9 GHz", "wattage": 615, "cores": 618 },
        { "name": "AMD Ryzen 10 7900X3D", "brand": "AMD", "clock": "112.8 GHz", "wattage": 620, "cores": 618 },
        { "name": "AMD Ryzen 10 7990X", "brand": "AMD", "clock": "114.4 GHz", "wattage": 620, "cores": 640 },
        { "name": "AMD Ryzen 10 7990X3D", "brand": "AMD", "clock": "116.0 GHz", "wattage": 625, "cores": 640 },
        { "name": "AMD Ryzen 10 8250X", "brand": "AMD", "clock": "134.6 GHz", "wattage": 630, "cores": 640 },
        { "name": "AMD Ryzen 10 8250X3D", "brand": "AMD", "clock": "134.7 GHz", "wattage": 610, "cores": 656 },
        { "name": "AMD Ryzen Threadripper PRO 11005WX", "brand": "AMD", "clock": "189.9 GHz", "wattage": 675, "cores": 768 },
        { "name": "AMD Ryzen Threadripper PRO 19285WX", "brand": "AMD", "clock": "208.5 GHz", "wattage": 690, "cores": 768 },
        { "name": "AMD Ryzen 10 8500X", "brand": "AMD", "clock": "235.8 GHz", "wattage": 505, "cores": 704 },
        { "name": "AMD Ryzen 10 8500X3D", "brand": "AMD", "clock": "238.0 GHz", "wattage": 510, "cores": 704 },
        { "name": "Intel Core i13-49900K", "brand": "Intel", "clock": "245.6 GHz", "wattage": 530, "cores": 768 },
        { "name": "AMD Ryzen 10 8600X", "brand": "AMD", "clock": "250.3 GHz", "wattage": 535, "cores": 768 },
        { "name": "AMD Ryzen 10 8600X3D", "brand": "AMD", "clock": "253.2 GHz", "wattage": 540, "cores": 768 },
        { "name": "Intel Core i13-50900K", "brand": "Intel", "clock": "256.1 GHz", "wattage": 560, "cores": 768 },
        { "name": "AMD Ryzen 10 8700X", "brand": "AMD", "clock": "260.9 GHz", "wattage": 565, "cores": 768 },
        { "name": "AMD Ryzen 10 8700X3D", "brand": "AMD", "clock": "263.8 GHz", "wattage": 570, "cores": 768 },
        { "name": "AMD Ryzen 10 8750X", "brand": "AMD", "clock": "368.9 GHz", "wattage": 575, "cores": 768 },
        { "name": "AMD Ryzen 10 8750X3D", "brand": "AMD", "clock": "411.8 GHz", "wattage": 580, "cores": 896 },
        { "name": "AMD Ryzen 10 8850X", "brand": "AMD", "clock": "410.7 GHz", "wattage": 585, "cores": 896 },
        { "name": "AMD Ryzen 10 8850X3D", "brand": "AMD", "clock": "460.1 GHz", "wattage": 590, "cores": 896 },
        { "name": "Intel Core i13-53900K", "brand": "Intel", "clock": "668.5 GHz", "wattage": 675, "cores": 992 },
        { "name": "AMD Ryzen 11 1150X", "brand": "AMD", "clock": "918.9 GHz", "wattage": 595, "cores": 1024 },
        { "name": "AMD Ryzen 11 1160X", "brand": "AMD", "clock": "1.01 THz", "wattage": 600, "cores": 1024 },
        { "name": "AMD Ryzen 11 1160X3D", "brand": "AMD", "clock": "1.04 THz", "wattage": 615, "cores": 1024 },
        { "name": "AMD Ryzen Threadripper PRO 22975WX", "brand": "AMD", "clock": "1.1 THz", "wattage": 670, "cores": 1536 }
    ],
    "gpu": [
        { "name": "S3 Trio64", "vram": "1 MB DRAM", "clock": "60 MHz", "wattage": 5 },
        { "name": "Cirrus Logic GD5446", "vram": "1 MB DRAM", "clock": "60 MHz", "wattage": 5 },
        { "name": "ATi Rage II", "vram": "2 MB DRAM", "clock": "66 MHz", "wattage": 5 },
        { "name": "Matrox Millennium", "vram": "2 MB DRAM", "clock": "100 MHz", "wattage": 7 },
        { "name": "NVIDIA RIVA 128", "vram": "4 MB DRAM", "clock": "100 MHz", "wattage": 10 },
        { "name": "NVIDIA RIVA 128ZX", "vram": "8 MB DRAM", "clock": "100 MHz", "wattage": 10 },
        { "name": "NVIDIA RIVA TNT", "vram": "16 MB DRAM", "clock": "125 MHz", "wattage": 15 },
        { "name": "Diamond Viper V770", "vram": "32 MB DRAM", "clock": "125 MHz", "wattage": 20 },
        { "name": "S3 Savage3D", "vram": "8 MB DRAM", "clock": "143 MHz", "wattage": 20 },
        { "name": "NVIDIA RIVA TNT2 M64", "vram": "32 MB SDR", "clock": "100 MHz", "wattage": 10 },
        { "name": "NVIDIA Geforce 256", "vram": "32 MB SDR", "clock": "120 MHz", "wattage": 30 },
        { "name": "3DFX Voodoo3 2000", "vram": "16 MB SDR", "clock": "166 MHz", "wattage": 15 },
        { "name": "Matrox G400", "vram": "32 MB SDR", "clock": "166 MHz", "wattage": 10 },
        { "name": "NVIDIA GeForce 2 MX", "vram": "32 MB SDR", "clock": "175 MHz", "wattage": 30 },
        { "name": "3DFX Voodoo 5 5500", "vram": "64 MB SDR", "clock": "166 MHz", "wattage": 30 },
        { "name": "NVIDIA Geforce2 GTS", "vram": "64 MB SDR", "clock": "200 MHz", "wattage": 30 },
        { "name": "NVIDIA Geforce2 Ti", "vram": "64 MB SDR", "clock": "250 MHz", "wattage": 35 },
        { "name": "NVIDIA GeForce 9300 GS", "vram": "256 MB GDDR2", "clock": "550 MHz", "wattage": 50 },
        { "name": "NVIDIA GeForce 9400 GT", "vram": "512 MB GDDR2", "clock": "550 MHz", "wattage": 50 },
        { "name": "NVIDIA GT 220", "vram": "512 MB GDDR2", "clock": "625 MHz", "wattage": 50 },
        { "name": "NVIDIA GT 240", "vram": "512 MB GDDR3", "clock": "550 MHz", "wattage": 50 },
        { "name": "AMD Radeon HD 5450", "vram": "512 MB GDDR3", "clock": "650 MHz", "wattage": 19 },
        { "name": "NVIDIA GT 310", "vram": "1 GB GDDR2", "clock": "648 MHz", "wattage": 30 },
        { "name": "NVIDIA GT 320", "vram": "1 GB GDDR3", "clock": "540 MHz", "wattage": 60 },
        { "name": "NVIDIA GT 330", "vram": "1 GB GDDR3", "clock": "600 MHz", "wattage": 75 },
        { "name": "AMD Radeon R7 250", "vram": "2 GB GDDR3", "clock": "1.05 GHz", "wattage": 65 },
        { "name": "NVIDIA GTX 460", "vram": "1 GB GDDR5", "clock": "675 MHz", "wattage": 160 },
        { "name": "AMD Radeon HD 5670", "vram": "1 GB GDDR5", "clock": "775 MHz", "wattage": 61 },
        { "name": "AMD Radeon HD 6850", "vram": "1 GB GDDR5", "clock": "775 GHz", "wattage": 127 },
        { "name": "NVIDIA GTX 470", "vram": "1.2 GB GDDR5", "clock": "607 MHz", "wattage": 215 },
        { "name": "NVIDIA GTX 480", "vram": "1.5 GB GDDR5", "clock": "700 MHz", "wattage": 250 },
        { "name": "AMD Radeon HD 7750", "vram": "1 GB GDDR5", "clock": "800 MHz", "wattage": 55 },
        { "name": "AMD Radeon HD 6870", "vram": "1 GB GDDR5", "clock": "900 MHz", "wattage": 151 },
        { "name": "NVIDIA GTX 550 Ti", "vram": "1 GB GDDR5", "clock": "900 MHz", "wattage": 116 },
        { "name": "AMD Radeon HD 7770", "vram": "1 GB GDDR5", "clock": "1 GHz", "wattage": 80 },
        { "name": "NVIDIA GTX 660", "vram": "2 GB GDDR5", "clock": "980 MHz", "wattage": 140 },
        { "name": "AMD Radeon HD 7870", "vram": "2 GB GDDR5", "clock": "1 GHz", "wattage": 175 },
        { "name": "NVIDIA GTX 680", "vram": "2 GB GDDR5", "clock": "1.01 GHz", "wattage": 195 },
        { "name": "NVIDIA GTX 750", "vram": "2 GB GDDR5", "clock": "1.02 GHz", "wattage": 55 },
        { "name": "AMD Radeon R9 270X", "vram": "2 GB GDDR5", "clock": "1.05 GHz", "wattage": 180 },
        { "name": "NVIDIA GTX 770", "vram": "2 GB GDDR5", "clock": "1.06 GHz", "wattage": 230 },
        { "name": "NVIDIA GTX 950", "vram": "2 GB GDDR5", "clock": "1.02 GHz", "wattage": 90 },
        { "name": "NVIDIA GTX 960", "vram": "2 GB GDDR5", "clock": "1.13 GHz", "wattage": 120 },
        { "name": "AMD Radeon RX 460", "vram": "2 GB GDDR5", "clock": "1.09 GHz", "wattage": 75 },
        { "name": "AMD Radeon R9 280X", "vram": "3 GB GDDR5", "clock": "1 GHz", "wattage": 250 },
        { "name": "AMD Radeon R9 290X", "vram": "4 GB GDDR5", "clock": "1 GHz", "wattage": 60 },
        { "name": "NVIDIA GTX 970", "vram": "4 GB GDDR5", "clock": "1.05 GHz", "wattage": 145 },
        { "name": "AMD Radeon RX 550", "vram": "2 GB GDDR5", "clock": "1.18 GHz", "wattage": 50 },
        { "name": "ASUS Strix GTX 970", "vram": "4 GB GDDR5", "clock": "1.11 GHz", "wattage": 145 },
        { "name": "NVIDIA GTX 980", "vram": "4 GB GDDR5", "clock": "1.13 GHz", "wattage": 165 },
        { "name": "MSI GTX 970 Gaming 4G", "vram": "4 GB GDDR5", "clock": "1.14 GHz", "wattage": 145 },
        { "name": "PNY GTX 970 XLR8 OC", "vram": "4 GB GDDR5", "clock": "1.15 GHz", "wattage": 145 },
        { "name": "AMD Radeon RX 560", "vram": "4 GB GDDR5", "clock": "1.17 GHz", "wattage": 60 },
        { "name": "Gigabyte GTX 970 G1 Gaming", "vram": "4 GB GDDR5", "clock": "1.18 GHz", "wattage": 145 },
        { "name": "ASUS Strix GTX 980", "vram": "4 GB GDDR5", "clock": "1.18 GHz", "wattage": 165 },
        { "name": "MSI GTX 980 Gaming 4G", "vram": "4 GB GDDR5", "clock": "1.19 GHz", "wattage": 165 },
        { "name": "AMD Radeon RX 570", "vram": "4 GB GDDR5", "clock": "1.2 GHz", "wattage": 150 },
        { "name": "NVIDIA GTX 1050", "vram": "2 GB GDDR5", "clock": "1.35 GHz", "wattage": 75 },
        { "name": "NVIDIA GTX 980 Ti", "vram": "6 GB GDDR5", "clock": "1 GHz", "wattage": 250 },
        { "name": "EVGA GTX 970 FTW+ ACX 2.0", "vram": "4 GB GDDR5", "clock": "1.23 GHz", "wattage": 145 },
        { "name": "Zotac GTX 970 AMP! Extreme Core Edition", "vram": "4 GB GDDR5", "clock": "1.23 GHz", "wattage": 145 },
        { "name": "Gigabyte GTX 980 G1 Gaming", "vram": "4 GB GDDR5", "clock": "1.23 GHz", "wattage": 165 },
        { "name": "PNY GTX 980 XLR8 OC", "vram": "4 GB GDDR5", "clock": "1.23 GHz", "wattage": 165 },
        { "name": "EVGA GTX 980 FTW ACX 2.0", "vram": "4 GB GDDR5", "clock": "1.28 GHz", "wattage": 165 },
        { "name": "PNY GTX 980 Ti XLR8 OC", "vram": "6 GB GDDR5", "clock": "1.15 GHz", "wattage": 250 },
        { "name": "MSI GTX 980 Ti Gaming 6G", "vram": "6 GB GDDR5", "clock": "1.18 GHz", "wattage": 250 },
        { "name": "ASUS Strix GTX 980 Ti", "vram": "6 GB GDDR5", "clock": "1.19 GHz", "wattage": 250 },
        { "name": "EVGA GTX 980 Ti FTW ACX 2.0+", "vram": "6 GB GDDR5", "clock": "1.19 GHz", "wattage": 250 },
        { "name": "Gigabyte GTX 980 Ti G1 Gaming", "vram": "6 GB GDDR5", "clock": "1.19 GHz", "wattage": 250 },
        { "name": "Zotac GTX 980 AMP! Extreme", "vram": "4 GB GDDR5", "clock": "1.29 GHz", "wattage": 165 },
        { "name": "Zotac GTX 980 Ti AMP! Extreme", "vram": "6 GB GDDR5", "clock": "1.25 GHz", "wattage": 250 },
        { "name": "NVIDIA GTX 1060", "vram": "3 GB GDDR5", "clock": "1.51 GHz", "wattage": 120 },
        { "name": "AMD Radeon R9 390X", "vram": "8 GB GDDR5", "clock": "1.05 GHz", "wattage": 275 },
        { "name": "AMD Radeon RX 580", "vram": "8 GB GDDR5", "clock": "1.34 GHz", "wattage": 185 },
        { "name": "ASUS Strix GTX 1070", "vram": "8 GB GDDR5", "clock": "1.51 GHz", "wattage": 150 },
        { "name": "NVIDIA GTX 1070", "vram": "8 GB GDDR5", "clock": "1.51 GHz", "wattage": 150 },
        { "name": "AMD Radeon RX 590", "vram": "8 GB GDDR5", "clock": "1.55 GHz", "wattage": 225 },
        { "name": "Gigabyte GTX 1070 G1 Gaming", "vram": "8 GB GDDR5", "clock": "1.59 GHz", "wattage": 150 },
        { "name": "PNY GTX 1070 XLR8 Gaming OC", "vram": "8 GB GDDR5", "clock": "1.61 GHz", "wattage": 150 },
        { "name": "EVGA GTX 1070 FTW ACX 3.0", "vram": "8 GB GDDR5", "clock": "1.61 GHz", "wattage": 150 },
        { "name": "MSI GTX 1070 Gaming X 8G", "vram": "8 GB GDDR5", "clock": "1.61 GHz", "wattage": 150 },
        { "name": "PNY GTX 1070 Ti XLR8 OC", "vram": "8 GB GDDR5", "clock": "1.61 GHz", "wattage": 180 },
        { "name": "EVGA GTX 1070 Ti FTW2", "vram": "8 GB GDDR5", "clock": "1.61 GHz", "wattage": 180 },
        { "name": "MSI GTX 1070 Ti Gaming 8G", "vram": "8 GB GDDR5", "clock": "1.61 GHz", "wattage": 180 },
        { "name": "NVIDIA GTX 1070 Ti", "vram": "8 GB GDDR5", "clock": "1.61 GHz", "wattage": 180 },
        { "name": "Zotac GTX 1070 AMP! Extreme", "vram": "8 GB GDDR5", "clock": "1.63 GHz", "wattage": 150 },
        { "name": "ASUS Strix GTX 1080", "vram": "8 GB GDDR5X", "clock": "1.61 GHz", "wattage": 180 },
        { "name": "MSI GTX 1080 Gaming X 8G", "vram": "8 GB GDDR5X", "clock": "1.61 GHz", "wattage": 180 },
        { "name": "NVIDIA GTX 1080 Founders Edition", "vram": "8 GB GDDR5X", "clock": "1.61 GHz", "wattage": 180 },
        { "name": "Zotac GTX 1070 Ti AMP! Extreme", "vram": "8 GB GDDR5", "clock": "1.68 GHz", "wattage": 180 },
        { "name": "NVIDIA GTX 1080 Ti Founders Edition", "vram": "11 GB GDDR5X", "clock": "1.5 GHz", "wattage": 250 },
        { "name": "ASUS Strix GTX 1080 Ti", "vram": "11 GB GDDR5X", "clock": "1.57 GHz", "wattage": 250 },
        { "name": "MSI GTX 1080 Ti Gaming X Trio", "vram": "11 GB GDDR5X", "clock": "1.57 GHz", "wattage": 250 },
        { "name": "EVGA GTX 1080 Ti FTW3 ACX 3.0", "vram": "11 GB GDDR5X", "clock": "1.57 GHz", "wattage": 250 },
        { "name": "PNY GTX 1080 Ti XLR8 Gaming OC", "vram": "11 GB GDDR5X", "clock": "1.61 GHz", "wattage": 250 },
        { "name": "Gigabyte GTX 1080 G1 Gaming", "vram": "8 GB GDDR5X", "clock": "1.7 GHz", "wattage": 180 },
        { "name": "Gigabyte GTX 1080 Ti AORUS Xtreme", "vram": "11 GB GDDR5X", "clock": "1.63 GHz", "wattage": 250 },
        { "name": "Zotac GTX 1080 Ti AMP! Extreme", "vram": "11 GB GDDR5X", "clock": "1.65 GHz", "wattage": 250 },
        { "name": "PNY GTX 1080 XLR8 OC", "vram": "8 GB GDDR5X", "clock": "1.71 GHz", "wattage": 180 },
        { "name": "EVGA GTX 1080 FTW ACX 3.0", "vram": "8 GB GDDR5X", "clock": "1.72 GHz", "wattage": 180 },
        { "name": "Gigabyte RTX 2060 Gaming OC", "vram": "6 GB GDDR6", "clock": "1.37 GHz", "wattage": 160 },
        { "name": "Zotac RTX 2060 AMP!", "vram": "6 GB GDDR6", "clock": "1.37 GHz", "wattage": 160 },
        { "name": "PNY RTX 2060 XLR8 Gaming OC", "vram": "6 GB GDDR6", "clock": "1.37 GHz", "wattage": 160 },
        { "name": "MSI RTX 2060 Gaming Z", "vram": "6 GB GDDR6", "clock": "1.37 GHz", "wattage": 160 },
        { "name": "NVIDIA RTX 2060 Founders Edition", "vram": "8 GB GDDR6", "clock": "1.37 GHz", "wattage": 160 },
        { "name": "Zotac GTX 1080 AMP! Extreme", "vram": "8 GB GDDR5X", "clock": "1.77 GHz", "wattage": 180 },
        { "name": "AMD Radeon RX 5600 XT", "vram": "6 GB GDDR6", "clock": "1.56 GHz", "wattage": 150 },
        { "name": "MSI RTX 2070 Gaming Z", "vram": "8 GB GDDR6", "clock": "1.41 GHz", "wattage": 175 },
        { "name": "Gigabyte RTX 2070 Gaming OC", "vram": "8 GB GDDR6", "clock": "1.41 GHz", "wattage": 175 },
        { "name": "NVIDIA RTX 2070 Founders Edition", "vram": "8 GB GDDR6", "clock": "1.41 GHz", "wattage": 175 },
        { "name": "Gigabyte RTX 2060 Super Gaming OC", "vram": "8 GB GDDR6", "clock": "1.47 GHz", "wattage": 175 },
        { "name": "MSI RTX 2060 Super Gaming X", "vram": "8 GB GDDR6", "clock": "1.47 GHz", "wattage": 175 },
        { "name": "NVIDIA RTX 2060 Super Founders Edition", "vram": "8 GB GDDR6", "clock": "1.47 GHz", "wattage": 175 },
        { "name": "AMD Radeon RX 5700 XT", "vram": "8 GB GDDR6", "clock": "1.6 GHz", "wattage": 225 },
        { "name": "PNY RTX 2070 Super XLR8 Gaming OC", "vram": "8 GB GDDR6", "clock": "1.77 GHz", "wattage": 215 },
        { "name": "NVIDIA RTX 2070 Super Founders Edition", "vram": "8 GB GDDR6", "clock": "1.77 GHz", "wattage": 215 },
        { "name": "MSI RTX 2080 Gaming X Trio", "vram": "8 GB GDDR6", "clock": "1.52 GHz", "wattage": 215 },
        { "name": "Gigabyte RTX 2080 Gaming OC", "vram": "8 GB GDDR6", "clock": "1.52 GHz", "wattage": 215 },
        { "name": "PNY RTX 2080 XLR8 Gaming OC", "vram": "8 GB GDDR6", "clock": "1.52 GHz", "wattage": 215 },
        { "name": "ASUS Strix RTX 2080", "vram": "8 GB GDDR6", "clock": "1.52 GHz", "wattage": 215 },
        { "name": "NVIDIA RTX 2080 Founders Edition", "vram": "8 GB GDDR6", "clock": "1.52 GHz", "wattage": 215 },
        { "name": "MSI RTX 2080 Super Gaming X Trio", "vram": "8 GB GDDR6", "clock": "1.65 GHz", "wattage": 250 },
        { "name": "PNY RTX 2080 Super XLR8 Gaming OC", "vram": "8 GB GDDR6", "clock": "1.65 GHz", "wattage": 250 },
        { "name": "Gigabyte RTX 2080 Ti Gaming OC", "vram": "11 GB GDDR6", "clock": "1.65 GHz", "wattage": 250 },
        { "name": "NVIDIA RTX 2080 Super Founders Edition", "vram": "8 GB GDDR6", "clock": "1.65 GHz", "wattage": 250 },
        { "name": "ASUS Strix RTX 2080 Ti", "vram": "11 GB GDDR6", "clock": "1.35 GHz", "wattage": 260 },
        { "name": "Gigabyte RTX 2080 Ti Gaming OC", "vram": "11 GB GDDR6", "clock": "1.35 GHz", "wattage": 260 },
        { "name": "NVIDIA RTX 2080 Ti Founders Edition", "vram": "11 GB GDDR6", "clock": "1.35 GHz", "wattage": 250 },
        { "name": "NVIDIA RTX 3060 Founders Edition", "vram": "12 GB GDDR6", "clock": "1.32 GHz", "wattage": 170 },
        { "name": "PNY RTX 3060 XLR8 Gaming", "vram": "12 GB GDDR6", "clock": "1.32 GHz", "wattage": 170 },
        { "name": "Gigabyte RTX 3060 Gaming OC", "vram": "12 GB GDDR6", "clock": "1.32 GHz", "wattage": 170 },
        { "name": "Zotac RTX 3060 Twin Edge", "vram": "12 GB GDDR6", "clock": "1.32 GHz", "wattage": 170 },
        { "name": "NVIDIA RTX 3070 Founders Edition", "vram": "8 GB GDDR6", "clock": "1.5 GHz", "wattage": 220 },
        { "name": "PNY RTX 3070 XLR8 Gaming", "vram": "8 GB GDDR6", "clock": "1.5 GHz", "wattage": 220 },
        { "name": "Gigabyte RTX 3070 Gaming OC", "vram": "8 GB GDDR6", "clock": "1.5 GHz", "wattage": 220 },
        { "name": "Zotac RTX 3070 AMP!", "vram": "8 GB GDDR6", "clock": "1.5 GHz", "wattage": 220 },
        { "name": "MSI RTX 3070 Gaming X Trio", "vram": "8 GB GDDR6", "clock": "1.5 GHz", "wattage": 220 },
        { "name": "EVGA RTX 3070 FTW3 Ultra", "vram": "8 GB GDDR6", "clock": "1.58 GHz", "wattage": 290 },
        { "name": "NVIDIA RTX 3070 Ti Founders Edition", "vram": "8 GB GDDR6", "clock": "1.58 GHz", "wattage": 290 },
        { "name": "Gigabyte RTX 3070 Ti Gaming OC", "vram": "8 GB GDDR6", "clock": "1.58 GHz", "wattage": 290 },
        { "name": "EVGA RTX 3070 Ti FTW3 Ultra", "vram": "8 GB GDDR6", "clock": "1.58 GHz", "wattage": 290 },
        { "name": "PNY RTX 3070 Ti XLR8 Gaming", "vram": "8 GB GDDR6", "clock": "1.58 GHz", "wattage": 290 },
        { "name": "NVIDIA RTX 3080 Founders Edition", "vram": "10 GB GDDR6X", "clock": "1.44 GHz", "wattage": 320 },
        { "name": "MSI RTX 3080 Gaming X Trio", "vram": "10 GB GDDR6X", "clock": "1.44 GHz", "wattage": 320 },
        { "name": "EVGA 3080 FTW3 Ultra", "vram": "10 GB GDDR6X", "clock": "1.44 GHz", "wattage": 320 },
        { "name": "NVIDIA RTX 3080 Ti Founders Edition", "vram": "12 GB GDDR6X", "clock": "1.37 GHz", "wattage": 350 },
        { "name": "Gigabyte RTX 3080 Ti Gaming OC", "vram": "12 GB GDDR6X", "clock": "1.37 GHz", "wattage": 350 },
        { "name": "NVIDIA RTX 3090 Founders Edition", "vram": "24 GB GDDR6X", "clock": "1.4 GHz", "wattage": 350 },
        { "name": "ASUS Strix RTX 3090", "vram": "24 GB GDDR6X", "clock": "1.4 GHz", "wattage": 350 },
        { "name": "Gigabyte RTX 3090 Gaming OC", "vram": "24 GB GDDR6X", "clock": "1.4 GHz", "wattage": 350 },
        { "name": "MSI RTX 3090 Gaming X Trio", "vram": "24 GB GDDR6X", "clock": "1.4 GHz", "wattage": 350 },
        { "name": "EVGA RTX 3090 FTW3 Ultra", "vram": "24 GB GDDR6X", "clock": "1.4 GHz", "wattage": 350 },
        { "name": "Zotac RTX 3090 AMP!", "vram": "24 GB GDDR6X", "clock": "1.4 GHz", "wattage": 350 },
        { "name": "PNY RTX 3090 XLR8 Gaming", "vram": "24 GB GDDR6X", "clock": "1.4 GHz", "wattage": 350 },
        { "name": "NVIDIA RTX 3090 Ti Founders Edition", "vram": "24 GB GDDR6X", "clock": "1.56 GHz", "wattage": 450 },
        { "name": "Gigabyte RTX 3090 Ti Gaming OC", "vram": "24 GB GDDR6X", "clock": "1.56 GHz", "wattage": 450 },
        { "name": "EVGA RTX 3090 Ti FTW3 Ultra", "vram": "24 GB GDDR6X", "clock": "1.56 GHz", "wattage": 450 },
        { "name": "NVIDIA RTX 4060 Founders Edition", "vram": "8 GB GDDR6", "clock": "1.83 GHz", "wattage": 115 },
        { "name": "Zotac RTX 4060 Twin Edge OC", "vram": "8 GB GDDR6", "clock": "1.86 GHz", "wattage": 115 },
        { "name": "NVIDIA RTX 4060 Ti Founders Edition", "vram": "8 GB GDDR6", "clock": "2.54 GHz", "wattage": 160 },
        { "name": "NVIDIA RTX 4070 Founders Edition", "vram": "12 GB GDDR6", "clock": "1.92 GHz", "wattage": 200 },
        { "name": "AMD Radeon RX 6700 XT", "vram": "12 GB GDDR6", "clock": "2.3 GHz", "wattage": 230 },
        { "name": "NVIDIA RTX 4070 Ti Founders Edition", "vram": "12 GB GDDR6", "clock": "2.31 GHz", "wattage": 285 },
        { "name": "AMD Radeon RX 6900 XT", "vram": "16 GB GDDR6", "clock": "2.02 GHz", "wattage": 300 },
        { "name": "AMD Radeon RX 7900 XTX", "vram": "24 GB GDDR6", "clock": "1.9 GHz", "wattage": 355 },
        { "name": "NVIDIA RTX 4080 Founders Edition", "vram": "16 GB GDDR6X", "clock": "2.21 GHz", "wattage": 320 },
        { "name": "NVIDIA RTX 4090 Founders Edition", "vram": "24 GB GDDR6X", "clock": "2.24 GHz", "wattage": 450 },
        { "name": "NVIDIA RTX 5060 Founders Edition", "vram": "8 GB GDDR7", "clock": "2.24 GHz", "wattage": 170 },
        { "name": "NVIDIA RTX 5070 Founders Edition", "vram": "12 GB GDDR7", "clock": "2.25 GHz", "wattage": 220 },
        { "name": "NVIDIA RTX 5070 Ti Founders Edition", "vram": "14 GB GDDR7", "clock": "2.24 GHz", "wattage": 280 },
        { "name": "NVIDIA RTX 5080 Founders Edition", "vram": "16 GB GDDR7", "clock": "2.26 GHz", "wattage": 200 },
        { "name": "NVIDIA RTX 5080 Ti Founders Edition", "vram": "20 GB GDDR7", "clock": "2.3 GHz", "wattage": 400 },
        { "name": "NVIDIA RTX 5090 Founders Edition", "vram": "32 GB GDDR7", "clock": "2.52 GHz", "wattage": 500 },
        { "name": "NVIDIA RTX 5090 Ti Founders Edition", "vram": "48 GB GDDR7", "clock": "2.48 GHz", "wattage": 600 },
        { "name": "NVIDIA RTX 6060 Founders Edition", "vram": "24 GB GDDR7", "clock": "2.58 GHz", "wattage": 225 },
        { "name": "NVIDIA RTX 6070 Founders Edition", "vram": "32 GB GDDR7", "clock": "3.06 GHz", "wattage": 300 },
        { "name": "NVIDIA RTX 6080 Founders Edition", "vram": "48 GB GDDR7X", "clock": "3.08 GHz", "wattage": 425 },
        { "name": "NVIDIA RTX 6080 Ti Founders Edition", "vram": "64 GB GDDR7X", "clock": "3.02 GHz", "wattage": 550 },
        { "name": "NVIDIA RTX 6090 Founders Edition", "vram": "64 GB GDDR7X", "clock": "3.5 GHz", "wattage": 570 },
        { "name": "NVIDIA RTX 7060 Founders Edition", "vram": "64 GB GDDR7", "clock": "4.9 GHz", "wattage": 80 },
        { "name": "NVIDIA RTX 7060 Ti Founders Edition", "vram": "96 GB GDDR7", "clock": "4.83 GHz", "wattage": 85 },
        { "name": "NVIDIA RTX 7070 Founders Edition", "vram": "96 GB GDDR7", "clock": "5.6 GHz", "wattage": 90 },
        { "name": "NVIDIA RTX 7070 Ti Founders Edition", "vram": "128 GB GDDR7", "clock": "5.4 GHz", "wattage": 100 },
        { "name": "NVIDIA RTX 7080 Founders Edition", "vram": "128 GB GDDR7X", "clock": "5.33 GHz", "wattage": 110 },
        { "name": "NVIDIA RTX 7080 Ti Founders Edition", "vram": "192 GB GDDR7X", "clock": "6.9 GHz", "wattage": 150 },
        { "name": "NVIDIA RTX 7090 Founders Edition", "vram": "256 GB GDDR7X", "clock": "8.2 GHz", "wattage": 220 },
        { "name": "NVIDIA RTX 7090 Ti Founders Edition", "vram": "384 GB GDDR7X", "clock": "11.3 GHz", "wattage": 260 },
        { "name": "NVIDIA RTX 8060 Founders Edition", "vram": "1.02 TB GDDR7", "clock": "6.7 GHz", "wattage": 330 },
        { "name": "NVIDIA RTX 8070 Founders Edition", "vram": "2.05 TB GDDR7", "clock": "6.9 GHz", "wattage": 360 },
        { "name": "NVIDIA RTX 8070 Ti Founders Edition", "vram": "2.3 TB GDDR7X", "clock": "8.0 GHz", "wattage": 370 },
        { "name": "NVIDIA RTX 8080 Founders Edition", "vram": "2.56 TB GDDR7X", "clock": "9.8 GHz", "wattage": 380 },
        { "name": "NVIDIA RTX 8080 Ti Founders Edition", "vram": "2.82 TB GDDR7X", "clock": "9.6 GHz", "wattage": 375 },
        { "name": "NVIDIA RTX 8090 Founders Edition", "vram": "3.07 TB GDDR7X", "clock": "12.2 GHz", "wattage": 395 },
        { "name": "NVIDIA RTX 8090 Ti Founders Edition", "vram": "3.33 TB GDDR7X", "clock": "12.4 GHz", "wattage": 400 },
        { "name": "NVIDIA RTX 9060 Founders Edition", "vram": "4.1 TB GDDR7", "clock": "11.5 GHz", "wattage": 110 },
        { "name": "NVIDIA RTX 9060 Ti Founders Edition", "vram": "4.36 TB GDDR7", "clock": "11.9 GHz", "wattage": 120 },
        { "name": "NVIDIA RTX 9070 Founders Edition", "vram": "4.62 TB GDDR7", "clock": "12.5 GHz", "wattage": 130 },
        { "name": "NVIDIA RTX 9070 Ti Founders Edition", "vram": "4.88 TB GDDR7", "clock": "12.6 GHz", "wattage": 140 },
        { "name": "NVIDIA RTX 9080 Founders Edition", "vram": "5.4 TB GDDR7X", "clock": "12.8 GHz", "wattage": 160 },
        { "name": "NVIDIA RTX 9080 Ti Founders Edition", "vram": "5.66 TB GDDR7X", "clock": "13.0 GHz", "wattage": 170 },
        { "name": "NVIDIA RTX 9090 Founders Edition", "vram": "5.92 TB GDDR7X", "clock": "12.9 GHz", "wattage": 180 },
        { "name": "NVIDIA RTX 9090 Ti Founders Edition", "vram": "6.44 TB GDDR7X", "clock": "13.4 GHz", "wattage": 200 },
        { "name": "NVIDIA RTX 10060 Founders Edition", "vram": "7.7 TB GDDR8", "clock": "12.6 GHz", "wattage": 70 },
        { "name": "NVIDIA RTX 10070 Founders Edition", "vram": "7.96 TB GDDR8", "clock": "13.2 GHz", "wattage": 80 },
        { "name": "NVIDIA RTX 10070 Ti Founders Edition", "vram": "8.22 TB GDDR8", "clock": "13.8 GHz", "wattage": 90 },
        { "name": "NVIDIA RTX 10080 Founders Edition", "vram": "8.48 TB GDDR8", "clock": "14.4 GHz", "wattage": 100 },
        { "name": "NVIDIA RTX 10080 Ti Founders Edition", "vram": "8.74 TB GDDR8", "clock": "15.6 GHz", "wattage": 110 },
        { "name": "NVIDIA RTX 10090 Founders Edition", "vram": "9.0 TB GDDR8", "clock": "17.77 GHz", "wattage": 120 },
        { "name": "NVIDIA RTX 11060 Founders Edition", "vram": "9.26 TB GDDR8", "clock": "15.1 GHz", "wattage": 90 },
        { "name": "NVIDIA RTX 11060 Ti Founders Edition", "vram": "9.52 TB GDDR8", "clock": "15.3 GHz", "wattage": 100 },
        { "name": "NVIDIA RTX 11070 Founders Edition", "vram": "9.78 TB GDDR8", "clock": "15.9 GHz", "wattage": 110 },
        { "name": "NVIDIA RTX 11080 Founders Edition", "vram": "10.04 TB GDDR8", "clock": "17.1 GHz", "wattage": 120 },
        { "name": "NVIDIA RTX 11080 Ti Founders Edition", "vram": "11.3 TB GDDR8", "clock": "17.0 GHz", "wattage": 130 },
        { "name": "NVIDIA RTX 11090 Founders Edition", "vram": "11.56 TB GDDR8", "clock": "17.78 GHz", "wattage": 140 },
        { "name": "NVIDIA RTX 12060 Founders Edition", "vram": "14.9 TB GDDR8", "clock": "16.88 GHz", "wattage": 47 },
        { "name": "NVIDIA RTX 12060 Ti Founders Edition", "vram": "15.16 TB GDDR8", "clock": "17.2 GHz", "wattage": 50 },
        { "name": "NVIDIA RTX 12070 Founders Edition", "vram": "15.42 TB GDDR8", "clock": "18.0 GHz", "wattage": 52 },
        { "name": "NVIDIA RTX 12070 Ti Founders Edition", "vram": "15.68 TB GDDR8", "clock": "18.1 GHz", "wattage": 55 },
        { "name": "NVIDIA RTX 12080 Founders Edition", "vram": "15.94 TB GDDR8", "clock": "18.0 GHz", "wattage": 55 },
        { "name": "NVIDIA RTX 12080 Ti Founders Edition", "vram": "16.2 TB GDDR8", "clock": "19.2 GHz", "wattage": 60 },
        { "name": "NVIDIA RTX 12090 Founders Edition", "vram": "16.46 TB GDDR8", "clock": "22.3 GHz", "wattage": 70 },
        { "name": "NVIDIA RTX 12090 Ti Founders Edition", "vram": "16.72 TB GDDR8", "clock": "22.1 GHz", "wattage": 75 },
        { "name": "NVIDIA RTX 13060 Founders Edition", "vram": "16.98 TB GDDR8", "clock": "19.7 GHz", "wattage": 80 },
        { "name": "NVIDIA RTX 13070 Founders Edition", "vram": "17.24 TB GDDR8", "clock": "20.5 GHz", "wattage": 85 },
        { "name": "NVIDIA RTX 13070 Ti Founders Edition", "vram": "17.5 TB GDDR8", "clock": "22.7 GHz", "wattage": 80 },
        { "name": "NVIDIA RTX 13080 Founders Edition", "vram": "17.76 TB GDDR8", "clock": "27.3 GHz", "wattage": 82 },
        { "name": "NVIDIA RTX 13090 Founders Edition", "vram": "18.02 TB GDDR8", "clock": "29.6 GHz", "wattage": 90 },
        { "name": "NVIDIA RTX 13090 Ti Founders Edition", "vram": "18.28 TB GDDR8", "clock": "33.32 GHz", "wattage": 95 },
        { "name": "NVIDIA RTX 14060 Founders Edition", "vram": "19.32 TB GDDR8", "clock": "27.9 GHz", "wattage": 115 },
        { "name": "NVIDIA RTX 14070 Founders Edition", "vram": "19.58 TB GDDR8", "clock": "28.0 GHz", "wattage": 170 },
        { "name": "NVIDIA RTX 14070 Ti Founders Edition", "vram": "19.84 TB GDDR8", "clock": "30.2 GHz", "wattage": 250 },
        { "name": "NVIDIA RTX 14080 Founders Edition", "vram": "96.52 TB GDDR8", "clock": "37.1 GHz", "wattage": 220 },
        { "name": "NVIDIA RTX 14080 Ti Founders Edition", "vram": "96.52 TB GDDR8", "clock": "736.9 GHz", "wattage": 222 },
        { "name": "NVIDIA RTX 14090 Founders Edition", "vram": "96.52 TB GDDR8", "clock": "41.0 GHz", "wattage": 225 },
        { "name": "NVIDIA RTX 14090 Ti Founders Edition", "vram": "96.52 TB GDDR8", "clock": "41.2 GHz", "wattage": 240 },
        { "name": "NVIDIA RTX 15060 Founders Edition", "vram": "114.85 TB GDDR8", "clock": "58.1 GHz", "wattage": 235 },
        { "name": "NVIDIA RTX 15070 Founders Edition", "vram": "197.76 TB GDDR8", "clock": "62.8 GHz", "wattage": 170 },
        { "name": "NVIDIA RTX 15070 Ti Founders Edition", "vram": "197.76 TB GDDR8", "clock": "67.1 GHz", "wattage": 175 },
        { "name": "NVIDIA RTX 15080 Founders Edition", "vram": "197.76 TB GDDR8", "clock": "99.67 GHz", "wattage": 180 },
        { "name": "NVIDIA RTX 15080 Ti Founders Edition", "vram": "223.7 TB GDDR9", "clock": "100.01 GHz", "wattage": 160 },
        { "name": "NVIDIA RTX 15090 Founders Edition", "vram": "223.7 TB GDDR9", "clock": "153.18 GHz", "wattage": 165 },
        { "name": "NVIDIA RTX 15090 Ti Founders Edition", "vram": "223.7 TB GDDR9", "clock": "154.0 GHz", "wattage": 170 },
        { "name": "NVIDIA RTX 16060 Founders Edition", "vram": "223.7 TB GDDR9", "clock": "115.62 GHz", "wattage": 175 },
        { "name": "NVIDIA RTX 16060 Ti Founders Edition", "vram": "223.7 TB GDDR9", "clock": "144.38 GHz", "wattage": 180 },
        { "name": "NVIDIA RTX 16070 Founders Edition", "vram": "249.14 TB GDDR9", "clock": "183.71 GHz", "wattage": 180 },
        { "name": "NVIDIA RTX 16070 Ti Founders Edition", "vram": "249.14 TB GDDR9", "clock": "198.1 GHz", "wattage": 185 },
        { "name": "NVIDIA RTX 16080 Founders Edition", "vram": "245.5 TB GDDR9", "clock": "244.7 GHz", "wattage": 190 },
        { "name": "NVIDIA RTX 16080 Ti Founders Edition", "vram": "245.5 TB GDDR9", "clock": "250.66 GHz", "wattage": 195 },
        { "name": "NVIDIA RTX 16090 Founders Edition", "vram": "245.51 TB GDDR9", "clock": "445.97 GHz", "wattage": 200 },
        { "name": "NVIDIA RTX 16090 Ti Founders Edition", "vram": "709.9 TB GDDR9", "clock": "446.8 GHz", "wattage": 305 },
        { "name": "NVIDIA RTX 17060 Founders Edition", "vram": "712 TB GDDR9", "clock": "400.61 GHz", "wattage": 310 },
        { "name": "NVIDIA RTX 17060 Ti Founders Edition", "vram": "777 TB GDDR9", "clock": "448.89 GHz", "wattage": 298 },
        { "name": "NVIDIA RTX 17070 Founders Edition", "vram": "777 TB GDDR9", "clock": "557.26 GHz", "wattage": 305 },
        { "name": "NVIDIA RTX 17070 Ti Founders Edition", "vram": "778 TB GDDR9", "clock": "576.12 GHz", "wattage": 360 },
        { "name": "NVIDIA RTX 17080 Founders Edition", "vram": "778 TB GDDR9", "clock": "1.91 THz", "wattage": 400 },
        { "name": "NVIDIA RTX 17080 Ti Founders Edition", "vram": "782 TB GDDR9", "clock": "1.92 THz", "wattage": 470 },
        { "name": "NVIDIA RTX 17090 Founders Edition", "vram": "7.7 PB GDDR9", "clock": "7.46 THz", "wattage": 277 },
        { "name": "NVIDIA RTX 17090 Ti Founders Edition", "vram": "7.7 PB GDDR9", "clock": "7.72 THz", "wattage": 280 },
        { "name": "NVIDIA RTX 18060 Founders Edition", "vram": "7.78 PB GDDR9", "clock": "7.79 THz", "wattage": 285 },
        { "name": "NVIDIA RTX 18070 Founders Edition", "vram": "14.01 PB GDDR9", "clock": "7.77 THz", "wattage": 290 },
        { "name": "NVIDIA RTX 18070 Ti Founders Edition", "vram": "14.03 PB GDDR9", "clock": "19.12 THz", "wattage": 295 },
        { "name": "NVIDIA RTX 18080 Founders Edition", "vram": "20.48 PB GDDR9", "clock": "19.73 THz", "wattage": 300 },
        { "name": "NVIDIA RTX 18080 Ti Founders Edition", "vram": "20.48 PB GDDR9", "clock": "20.2 THz", "wattage": 305 },
        { "name": "NVIDIA RTX 18090 Founders Edition", "vram": "81.92 PB GDDR9", "clock": "22.19 THz", "wattage": 310 },
        { "name": "NVIDIA RTX 18090 Ti Founders Edition", "vram": "81.92 PB GDDR9", "clock": "29.67 THz", "wattage": 315 },
        { "name": "NVIDIA RTX 19060 Founders Edition", "vram": "81.92 PB GDDR9", "clock": "30.67 THz", "wattage": 320 },
        { "name": "NVIDIA RTX 19060 Ti Founders Edition", "vram": "81.92 PB GDDR9", "clock": "70.77 THz", "wattage": 325 },
        { "name": "NVIDIA RTX 19070 Founders Edition", "vram": "81.92 PB GDDR9", "clock": "70.82 THz", "wattage": 330 },
        { "name": "NVIDIA RTX 19070 Ti Founders Edition", "vram": "81.92 PB GDDR9", "clock": "72.02 THz", "wattage": 335 },
        { "name": "NVIDIA RTX 19080 Founders Edition", "vram": "81.92 PB GDDR10 Founders Edition", "clock": "73.84 THz", "wattage": 430 },
        { "name": "NVIDIA RTX 19090 Founders Edition", "vram": "163.84 PB GDDR10 Founders Edition", "clock": "73.88 THz", "wattage": 445 },
        { "name": "NVIDIA RTX 19090 Ti Founders Edition", "vram": "163.84 PB GDDR10 Founders Edition", "clock": "74.02 THz", "wattage": 460 },
        { "name": "NVIDIA RTX 20060 Founders Edition", "vram": "163.84 PB GDDR10 Founders Edition", "clock": "74 THz", "wattage": 475 },
        { "name": "NVIDIA RTX 20060 Ti Founders Edition", "vram": "163.84 PB GDDR10 Founders Edition", "clock": "74.39 THz", "wattage": 490 },
        { "name": "NVIDIA RTX 20070 Founders Edition", "vram": "163.84 PB GDDR10 Founders Edition", "clock": "76.03 THz", "wattage": 505 },
        { "name": "NVIDIA RTX 20070 Ti Founders Edition", "vram": "163.84 PB GDDR10 Founders Edition", "clock": "80.07 THz", "wattage": 520 },
        { "name": "NVIDIA RTX 20080 Founders Edition", "vram": "327.68 PB GDDR10 Founders Edition", "clock": "167.77 THz", "wattage": 500 },
        { "name": "NVIDIA RTX 20080 Ti Founders Edition", "vram": "327.68 PB GDDR10 Founders Edition", "clock": "167.82 THz", "wattage": 515 },
        { "name": "NVIDIA RTX 20090 Founders Edition", "vram": "327.68 PB GDDR10 Founders Edition", "clock": "373.87 THz", "wattage": 530 },
        { "name": "NVIDIA RTX 20090 Ti Founders Edition", "vram": "655.36 PB GQDR1", "clock": "379.2 THz", "wattage": 60 },
        { "name": "NVIDIA RTX 21060 Founders Edition", "vram": "655.36 PB GQDR1", "clock": "990.8 THz", "wattage": 65 },
        { "name": "NVIDIA RTX 21060 Ti Founders Edition", "vram": "655.36 PB GQDR1", "clock": "991.5 THz", "wattage": 70 },
        { "name": "NVIDIA RTX 21070 Founders Edition", "vram": "655.36 PB GQDR1", "clock": "992.2 THz", "wattage": 75 },
        { "name": "NVIDIA RTX 21070 Ti Founders Edition", "vram": "655.36 PB GQDR1", "clock": "992.9 THz", "wattage": 80 },
        { "name": "NVIDIA RTX 21080 Founders Edition", "vram": "655.36 PB GQDR1", "clock": "993.6 THz", "wattage": 90 },
        { "name": "NVIDIA RTX 21080 Ti Founders Edition", "vram": "655.36 PB GQDR1", "clock": "993.9 THz", "wattage": 95 },
        { "name": "NVIDIA RTX 21090 Founders Edition", "vram": "655.36 PB GQDR1", "clock": "998.3 THz", "wattage": 110 },
        { "name": "NVIDIA RTX 21090 Ti Founders Edition", "vram": "2 EB GQDR1", "clock": "1.1 PHz", "wattage": 135 },
        { "name": "NVIDIA RTX 22060 Founders Edition", "vram": "4 EB GQDR1", "clock": "1.2 PHz", "wattage": 150 },
        { "name": "NVIDIA RTX 22060 Ti Founders Edition", "vram": "4 EB GQDR1", "clock": "1.35 PHz", "wattage": 165 },
        { "name": "NVIDIA RTX 22070 Founders Edition", "vram": "8 EB GQDR1", "clock": "1.92 PHz", "wattage": 180 },
        { "name": "NVIDIA RTX 22070 Ti Founders Edition", "vram": "10 EB GQDR1", "clock": "1.93 PHz", "wattage": 195 },
        { "name": "NVIDIA RTX 22080 Founders Edition", "vram": "10 EB GQDR1", "clock": "1.95 PHz", "wattage": 210 },
        { "name": "NVIDIA RTX 22080 Ti Founders Edition", "vram": "10 EB GQDR1", "clock": "1.99 PHz", "wattage": 225 },
        { "name": "NVIDIA RTX 22090 Founders Edition", "vram": "10 EB GQDR1", "clock": "2.32 PHz", "wattage": 240 },
        { "name": "NVIDIA RTX 22090 Ti Founders Edition", "vram": "12 EB GQDR1", "clock": "2.61 PHz", "wattage": 255 },
        { "name": "NVIDIA RTX 23060 Founders Edition", "vram": "24 EB GQDR1", "clock": "12.05 PHz", "wattage": 285 },
        { "name": "NVIDIA RTX 23060 Ti Founders Edition", "vram": "28 EB GQDR1", "clock": "12.95 PHz", "wattage": 300 },
        { "name": "NVIDIA RTX 23070 Founders Edition", "vram": "28 EB GQDR1", "clock": "12.94 PHz", "wattage": 315 },
        { "name": "NVIDIA RTX 23070 Ti Founders Edition", "vram": "16 EB GQDR1", "clock": "13.01 PHz", "wattage": 330 },
        { "name": "NVIDIA RTX 23080 Founders Edition", "vram": "20 EB GQDR1", "clock": "13.08 PHz", "wattage": 345 },
        { "name": "NVIDIA RTX 23080 Ti Founders Edition", "vram": "24 EB GQDR1", "clock": "13.15 PHz", "wattage": 360 },
        { "name": "NVIDIA RTX 23090 Founders Edition", "vram": "28 EB GQDR1", "clock": "13.22 PHz", "wattage": 375 },
        { "name": "NVIDIA RTX 23090 Ti Founders Edition", "vram": "28 EB GQDR1", "clock": "14.29 PHz", "wattage": 390 },
        { "name": "NVIDIA RTX 24060 Founders Edition", "vram": "28 EB GQDR1", "clock": "14.36 PHz", "wattage": 405 },
        { "name": "NVIDIA RTX 24060 Ti Founders Edition", "vram": "28 EB GQDR1", "clock": "14.43 PHz", "wattage": 420 },
        { "name": "NVIDIA RTX 24070 Founders Edition", "vram": "32 EB GQDR1", "clock": "14.5 PHz", "wattage": 435 },
        { "name": "NVIDIA RTX 24070 Ti Founders Edition", "vram": "32 EB GQDR1", "clock": "14.57 PHz", "wattage": 450 },
        { "name": "NVIDIA RTX 24080 Founders Edition", "vram": "48 EB GQDR1", "clock": "14.64 PHz", "wattage": 465 },
        { "name": "NVIDIA RTX 24080 Ti Founders Edition", "vram": "40 EB GQDR1", "clock": "14.71 PHz", "wattage": 225 },
        { "name": "NVIDIA RTX 24090 Founders Edition", "vram": "48 EB GQDR1", "clock": "14.78 PHz", "wattage": 240 },
        { "name": "NVIDIA RTX 24090 Ti Founders Edition", "vram": "48 EB GQDR1", "clock": "14.85 PHz", "wattage": 255 },
        { "name": "NVIDIA RTX 25060 Founders Edition", "vram": "48 EB GQDR1", "clock": "14.92 PHz", "wattage": 270 },
        { "name": "NVIDIA RTX 25060 Ti Founders Edition", "vram": "48 EB GQDR1", "clock": "14.99 PHz", "wattage": 285 },
        { "name": "NVIDIA RTX 25070 Founders Edition", "vram": "60 EB GQDR1", "clock": "15.06 PHz", "wattage": 300 },
        { "name": "NVIDIA RTX 25070 Ti Founders Edition", "vram": "60 EB GQDR1", "clock": "15.13 PHz", "wattage": 315 },
        { "name": "NVIDIA RTX 25080 Founders Edition", "vram": "60 EB GQDR1", "clock": "15.2 PHz", "wattage": 330 },
        { "name": "NVIDIA RTX 25080 Ti Founders Edition", "vram": "64 EB GQDR1", "clock": "15.27 PHz", "wattage": 345 },
        { "name": "NVIDIA RTX 25090 Founders Edition", "vram": "72 EB GQDR1", "clock": "15.34 PHz", "wattage": 360 },
        { "name": "NVIDIA RTX 25090 Ti Founders Edition", "vram": "64 EB GQDR1", "clock": "15.29 PHz", "wattage": 375 },
        { "name": "NVIDIA RTX 26060 Founders Edition", "vram": "64 EB GQDR1", "clock": "15.36 PHz", "wattage": 390 },
        { "name": "NVIDIA RTX 26060 Ti Founders Edition", "vram": "70 EB GQDR1", "clock": "15.43 PHz", "wattage": 405 },
        { "name": "NVIDIA RTX 26070 Founders Edition", "vram": "72 EB GQDR1", "clock": "15.5 PHz", "wattage": 420 },
        { "name": "NVIDIA RTX 26070 Ti Founders Edition", "vram": "72 EB GQDR1", "clock": "15.57 PHz", "wattage": 435 },
        { "name": "NVIDIA RTX 26080 Founders Edition", "vram": "72 EB GQDR1", "clock": "15.64 PHz", "wattage": 450 },
        { "name": "NVIDIA RTX 26080 Ti Founders Edition", "vram": "84 EB GQDR1", "clock": "15.7 PHz", "wattage": 465 },
        { "name": "NVIDIA RTX 26090 Founders Edition", "vram": "84 EB GQDR1", "clock": "17.79 PHz", "wattage": 470 },
        { "name": "NVIDIA RTX 26090 Ti Founders Edition", "vram": "90 EB GQDR1", "clock": "17.86 PHz", "wattage": 485 },
        { "name": "NVIDIA RTX 27060 Founders Edition", "vram": "90 EB GQDR1", "clock": "18.93 PHz", "wattage": 495 },
        { "name": "NVIDIA RTX 27060 Ti Founders Edition", "vram": "86 EB GQDR1", "clock": "19.01 PHz", "wattage": 510 },
        { "name": "NVIDIA RTX 27070 Founders Edition", "vram": "86 EB GQDR1", "clock": "19.08 PHz", "wattage": 525 },
        { "name": "NVIDIA RTX 27070 Ti Founders Edition", "vram": "90 EB GQDR1", "clock": "19.15 PHz", "wattage": 540 },
        { "name": "NVIDIA RTX 27080 Founders Edition", "vram": "94 EB GQDR1", "clock": "19.22 PHz", "wattage": 555 },
        { "name": "NVIDIA RTX 27080 Ti Founders Edition", "vram": "94 EB GQDR1", "clock": "19.29 PHz", "wattage": 570 },
        { "name": "NVIDIA RTX 27090 Founders Edition", "vram": "96 EB GQDR1", "clock": "19.36 PHz", "wattage": 585 },
        { "name": "NVIDIA RTX 27090 Ti Founders Edition", "vram": "96 EB GQDR1", "clock": "19.43 PHz", "wattage": 600 },
        { "name": "NVIDIA RTX 28060 Founders Edition", "vram": "128 EB GQDR1", "clock": "19.57 PHz", "wattage": 615 },
        { "name": "NVIDIA RTX 28060 Ti Founders Edition", "vram": "128 EB GQDR1", "clock": "19.64 PHz", "wattage": 620 },
        { "name": "NVIDIA RTX 28070 Founders Edition", "vram": "128 EB GQDR1", "clock": "22.02 PHz", "wattage": 625 },
        { "name": "NVIDIA RTX 28070 Ti Founders Edition", "vram": "128 EB GQDR1", "clock": "22.09 PHz", "wattage": 640 },
        { "name": "NVIDIA RTX 28080 Founders Edition", "vram": "128 EB GQDR1", "clock": "22.16 PHz", "wattage": 655 },
        { "name": "NVIDIA RTX 28080 Ti Founders Edition", "vram": "128 EB GQDR1", "clock": "22.23 PHz", "wattage": 670 },
        { "name": "NVIDIA RTX 28090 Founders Edition", "vram": "128 EB GQDR1", "clock": "22.3 PHz", "wattage": 675 },
        { "name": "NVIDIA RTX 28090 Ti Founders Edition", "vram": "128 EB GQDR1", "clock": "22.37 PHz", "wattage": 690 },
        { "name": "NVIDIA RTX 29060 Founders Edition", "vram": "128 EB GQDR1", "clock": "22.52 PHz", "wattage": 670 },
        { "name": "NVIDIA RTX 29060 Ti Founders Edition", "vram": "128 EB GQDR1", "clock": "22.59 PHz", "wattage": 685 },
        { "name": "NVIDIA RTX 29070 Founders Edition", "vram": "128 EB GQDR1", "clock": "22.66 PHz", "wattage": 690 },
        { "name": "NVIDIA RTX 29070 Ti Founders Edition", "vram": "172 EB GQDR2", "clock": "22.8 PHz", "wattage": 695 },
        { "name": "NVIDIA RTX 29080 Founders Edition", "vram": "172 EB GQDR2", "clock": "22.92 PHz", "wattage": 700 },
        { "name": "NVIDIA RTX 29080 Ti Founders Edition", "vram": "172 EB GQDR2", "clock": "22.99 PHz", "wattage": 710 },
        { "name": "NVIDIA RTX 29090 Founders Edition", "vram": "172 EB GQDR2", "clock": "23.06 PHz", "wattage": 715 },
        { "name": "NVIDIA RTX 29090 Ti Founders Edition", "vram": "188 EB GQDR2", "clock": "23.13 PHz", "wattage": 725 },
        { "name": "NVIDIA RTX 30060 Founders Edition", "vram": "172 EB GQDR2", "clock": "24.26 PHz", "wattage": 650 },
        { "name": "NVIDIA RTX 30060 Ti Founders Edition", "vram": "172 EB GQDR2", "clock": "24.33 PHz", "wattage": 675 },
        { "name": "NVIDIA RTX 30070 Founders Edition", "vram": "188 EB GQDR2", "clock": "24.4 PHz", "wattage": 680 },
        { "name": "NVIDIA RTX 30070 Ti Founders Edition", "vram": "188 EB GQDR2", "clock": "24.47 PHz", "wattage": 695 },
        { "name": "NVIDIA RTX 30080 Founders Edition", "vram": "188 EB GQDR2", "clock": "24.54 PHz", "wattage": 700 },
        { "name": "NVIDIA RTX 30080 Ti Founders Edition", "vram": "192 EB GQDR2", "clock": "24.61 PHz", "wattage": 710 },
        { "name": "NVIDIA RTX 30090 Founders Edition", "vram": "192 EB GQDR2", "clock": "32.68 PHz", "wattage": 715 },
        { "name": "NVIDIA RTX 30090 Ti Founders Edition", "vram": "208 EB GQDR2", "clock": "33.95 PHz", "wattage": 720 },
        { "name": "NVIDIA RTX 31060 Founders Edition", "vram": "192 EB GQDR2", "clock": "28.12 PHz", "wattage": 625 },
        { "name": "NVIDIA RTX 31060 Ti Founders Edition", "vram": "192 EB GQDR2", "clock": "28.19 PHz", "wattage": 650 },
        { "name": "NVIDIA RTX 31070 Founders Edition", "vram": "208 EB GQDR2", "clock": "28.26 PHz", "wattage": 655 },
        { "name": "NVIDIA RTX 31070 Ti Founders Edition", "vram": "208 EB GQDR2", "clock": "28.33 PHz", "wattage": 670 },
        { "name": "NVIDIA RTX 31080 Founders Edition", "vram": "208 EB GQDR2", "clock": "28.4 PHz", "wattage": 675 },
        { "name": "NVIDIA RTX 31080 Ti Founders Edition", "vram": "216 EB GQDR2", "clock": "28.47 PHz", "wattage": 680 },
        { "name": "NVIDIA RTX 31090 Founders Edition", "vram": "216 EB GQDR2", "clock": "29.54 PHz", "wattage": 685 },
        { "name": "NVIDIA RTX 31090 Ti Founders Edition", "vram": "224 EB GQDR2", "clock": "29.61 PHz", "wattage": 690 },
        { "name": "NVIDIA RTX 32060 Founders Edition", "vram": "224 EB GQDR2", "clock": "29.68 PHz", "wattage": 625 },
        { "name": "NVIDIA RTX 32060 Ti Founders Edition", "vram": "224 EB GQDR2", "clock": "29.75 PHz", "wattage": 650 },
        { "name": "NVIDIA RTX 32070 Founders Edition", "vram": "240 EB GQDR2", "clock": "29.82 PHz", "wattage": 655 },
        { "name": "NVIDIA RTX 32070 Ti Founders Edition", "vram": "240 EB GQDR2", "clock": "29.89 PHz", "wattage": 670 },
        { "name": "NVIDIA RTX 32080 Founders Edition", "vram": "240 EB GQDR2", "clock": "29.96 PHz", "wattage": 675 },
        { "name": "NVIDIA RTX 32080 Ti Founders Edition", "vram": "256 EB GQDR2", "clock": "30.03 PHz", "wattage": 680 },
        { "name": "NVIDIA RTX 32090 Founders Edition", "vram": "256 EB GQDR2", "clock": "30.1 PHz", "wattage": 685 },
        { "name": "NVIDIA RTX 32090 Ti Founders Edition", "vram": "256 EB GQDR2", "clock": "30.17 PHz", "wattage": 690 },
        { "name": "NVIDIA RTX 33060 Founders Edition", "vram": "256 EB GQDR2", "clock": "30.24 PHz", "wattage": 625 },
        { "name": "NVIDIA RTX 33060 Ti Founders Edition", "vram": "256 EB GQDR2", "clock": "30.31 PHz", "wattage": 650 },
        { "name": "NVIDIA RTX 33070 Founders Edition", "vram": "272 EB GQDR2", "clock": "30.38 PHz", "wattage": 655 },
        { "name": "NVIDIA RTX 33070 Ti Founders Edition", "vram": "272 EB GQDR2", "clock": "30.45 PHz", "wattage": 670 },
        { "name": "NVIDIA RTX 33080 Founders Edition", "vram": "272 EB GQDR2", "clock": "30.52 PHz", "wattage": 675 },
        { "name": "NVIDIA RTX 33080 Ti Founders Edition", "vram": "288 EB GQDR2", "clock": "30.59 PHz", "wattage": 680 },
        { "name": "NVIDIA RTX 33090 Founders Edition", "vram": "288 EB GQDR2", "clock": "30.66 PHz", "wattage": 690 },
        { "name": "NVIDIA RTX 33090 Ti Founders Edition", "vram": "288 EB GQDR2", "clock": "30.73 PHz", "wattage": 695 }
    ],
    "ram": [
        { "name": "Micron MT4C1024", "speed": 20, "wattage": 0.5, "type": "DRAM", "capacity": 0.0001220703125 },
        { "name": "Fujitsu MB81C4256A-70", "speed": 14, "wattage": 0.5, "type": "DRAM", "capacity": 0.000244140625 },
        { "name": "Samsung KM41C256A-15", "speed": 20, "wattage": 1, "type": "DRAM", "capacity": 0.000244140625 },
        { "name": "Hitachi HM514256A-10", "speed": 40, "wattage": 1, "type": "DRAM", "capacity": 0.000244140625 },
        { "name": "Micron MT4C4256", "speed": 66, "wattage": 1, "type": "DRAM", "capacity": 0.000244140625 },
        { "name": "NEC D44256G", "speed": 80, "wattage": 1, "type": "DRAM", "capacity": 0.00048828125 },
        { "name": "Micron MT8C1000", "speed": 66, "wattage": 1.5, "type": "DRAM", "capacity": 0.0009765625 },
        { "name": "Fujitsu MB81C1000-12", "speed": 50, "wattage": 0.5, "type": "SDR", "capacity": 0.0009765625 },
        { "name": "Toshiba TC514100ASJ-60", "speed": 60, "wattage": 0.55, "type": "SDR", "capacity": 0.0009765625 },
        { "name": "Micron MT48LC1M16A1", "speed": 66, "wattage": 0.6, "type": "SDR", "capacity": 0.0009765625 },
        { "name": "Nanya NT5SV8M16DS-75", "speed": 75, "wattage": 0.75, "type": "SDR", "capacity": 0.0009765625 },
        { "name": "Fujitsu MB81C2000-12", "speed": 50, "wattage": 0.5, "type": "SDR", "capacity": 0.001953125 },
        { "name": "Toshiba TC514257D-60", "speed": 60, "wattage": 0.55, "type": "SDR", "capacity": 0.001953125 },
        { "name": "Samsung KM416S1024C-60", "speed": 60, "wattage": 0.55, "type": "SDR", "capacity": 0.001953125 },
        { "name": "Infineon HYB39S6416", "speed": 66, "wattage": 0.6, "type": "SDR", "capacity": 0.001953125 },
        { "name": "IBM 42H2820 SDRAM", "speed": 66, "wattage": 0.6, "type": "SDR", "capacity": 0.001953125 },
        { "name": "Hitachi HM514800DJP-70", "speed": 70, "wattage": 0.6, "type": "SDR", "capacity": 0.001953125 },
        { "name": "NEC D41264 SDRAM", "speed": 66, "wattage": 0.6, "type": "SDR", "capacity": 0.00390625 },
        { "name": "Texas Instruments TMS44C256-80", "speed": 80, "wattage": 0.8, "type": "SDR", "capacity": 0.00390625 },
        { "name": "Samsung KM416S1020CT-G10", "speed": 66, "wattage": 0.6, "type": "SDR", "capacity": 0.0078125 },
        { "name": "Samsung K4S511632M-GL75", "speed": 75, "wattage": 0.75, "type": "SDR", "capacity": 0.0078125 },
        { "name": "Micron MT8LSDT864AG", "speed": 100, "wattage": 1, "type": "SDR", "capacity": 0.0078125 },
        { "name": "Micron MT48LC4M16A2", "speed": 66, "wattage": 0.6, "type": "SDR", "capacity": 0.015625 },
        { "name": "Infineon HYB39S16320", "speed": 100, "wattage": 1, "type": "SDR", "capacity": 0.015625 },
        { "name": "Samsung DDR SDRAM 16 MB", "speed": 100, "wattage": 2.5, "type": "DDR", "capacity": 0.015625 },
        { "name": "Crucial DDR SDRAM 16 MB", "speed": 133, "wattage": 2.5, "type": "DDR", "capacity": 0.015625 },
        { "name": "Kingston ValueRAM DDR SDRAM 32 MB", "speed": 100, "wattage": 2.5, "type": "DDR", "capacity": 0.03125 },
        { "name": "Mushkin DDR SDRAM 32 MB", "speed": 100, "wattage": 2.5, "type": "DDR", "capacity": 0.03125 },
        { "name": "Crucial DDR SDRAM 32 MB", "speed": 133, "wattage": 2.5, "type": "DDR", "capacity": 0.03125 },
        { "name": "Kingston ValueRAM 64 MB", "speed": 100, "wattage": 2.5, "type": "DDR", "capacity": 0.0625 },
        { "name": "Samsung DDR SDRAM 96 MB", "speed": 100, "wattage": 2.5, "type": "DDR", "capacity": 0.09375 },
        { "name": "Crucial DDR SDRAM 96 MB", "speed": 133, "wattage": 2.5, "type": "DDR", "capacity": 0.09375 },
        { "name": "Kingston DDR SDRAM 128 MB", "speed": 100, "wattage": 2.5, "type": "DDR", "capacity": 0.125 },
        { "name": "Crucial DDR SDRAM 128 MB", "speed": 133, "wattage": 2.5, "type": "DDR", "capacity": 0.125 },
        { "name": "Crucial DDR SDRAM 256 MB", "speed": 266, "wattage": 2.5, "type": "DDR", "capacity": 0.25 },
        { "name": "OCZ DDR SDRAM 256 MB", "speed": 320, "wattage": 2.5, "type": "DDR", "capacity": 0.25 },
        { "name": "GeIL DDR SDRAM 256 MB", "speed": 400, "wattage": 2.5, "type": "DDR", "capacity": 0.25 },
        { "name": "Crucial DDR SDRAM 512 MB", "speed": 400, "wattage": 2.5, "type": "DDR", "capacity": 0.5 },
        { "name": "Corsair XMS DDR SDRAM 512 MB", "speed": 400, "wattage": 1.8, "type": "DDR", "capacity": 0.5 },
        { "name": "Corsair XMS DDR4000 1 GB", "speed": 500, "wattage": 2.5, "type": "DDR", "capacity": 1 },
        { "name": "Corsair ValueSelect DDR2 1GB", "speed": 667, "wattage": 1.8, "type": "DDR2", "capacity": 1 },
        { "name": "Crucial DDR2 1GB", "speed": 667, "wattage": 1.8, "type": "DDR2", "capacity": 1 },
        { "name": "Kingston KVR DDR2 1GB", "speed": 800, "wattage": 1.8, "type": "DDR2", "capacity": 1 },
        { "name": "Patriot Signature DDR2 2GB", "speed": 667, "wattage": 1.8, "type": "DDR2", "capacity": 2 },
        { "name": "Crucial DDR2 2GB", "speed": 800, "wattage": 1.8, "type": "DDR2", "capacity": 2 },
        { "name": "Mushkin Enhanced DDR2 2GB", "speed": 800, "wattage": 1.8, "type": "DDR2", "capacity": 2 },
        { "name": "Corsair XMS2 DDR2 2GB", "speed": 800, "wattage": 1.8, "type": "DDR2", "capacity": 2 },
        { "name": "OCZ Gold DDR2 2GB", "speed": 800, "wattage": 1.8, "type": "DDR2", "capacity": 2 },
        { "name": "Kingston HyperX DDR2 2GB", "speed": 800, "wattage": 1.8, "type": "DDR2", "capacity": 2 },
        { "name": "G.Skill DDR2 2GB", "speed": 1066, "wattage": 2, "type": "DDR2", "capacity": 2 },
        { "name": "Crucial Ballistix 4GB DDR2-800", "speed": 800, "wattage": 1.8, "type": "DDR2", "capacity": 4 },
        { "name": "Patriot Viper DDR2 4GB", "speed": 800, "wattage": 1.8, "type": "DDR2", "capacity": 4 },
        { "name": "G.Skill Ripjaws DDR2 4GB", "speed": 1066, "wattage": 2, "type": "DDR2", "capacity": 4 },
        { "name": "Kingston HyperX DDR2 4GB", "speed": 1066, "wattage": 2, "type": "DDR2", "capacity": 4 },
        { "name": "G.Skill Ripjaws X DDR3 4GB", "speed": 1333, "wattage": 1.5, "type": "DDR3", "capacity": 4 },
        { "name": "Kingston HyperX Fury DDR3 4GB", "speed": 1333, "wattage": 1.65, "type": "DDR3", "capacity": 4 },
        { "name": "Corsair XMS3 DDR3 4GB", "speed": 1600, "wattage": 1.5, "type": "DDR3", "capacity": 4 },
        { "name": "Kingston ValueRAM DDR3 8GB", "speed": 1333, "wattage": 1.5, "type": "DDR3", "capacity": 8 },
        { "name": "Patriot Signature DDR3 8GB", "speed": 1333, "wattage": 1.5, "type": "DDR3", "capacity": 8 },
        { "name": "G.Skill Sniper DDR3 8GB", "speed": 1600, "wattage": 1.5, "type": "DDR3", "capacity": 8 },
        { "name": "Crucial Ballistix Sport DDR3 8GB", "speed": 1600, "wattage": 1.5, "type": "DDR3", "capacity": 8 },
        { "name": "Corsair Vengeance LPX DDR3 8GB", "speed": 1600, "wattage": 1.5, "type": "DDR3", "capacity": 8 },
        { "name": "Crucial Ballistix Elite DDR3 16GB", "speed": 1866, "wattage": 1.5, "type": "DDR3", "capacity": 16 },
        { "name": "Kingston HyperX Predator DDR3 16GB", "speed": 1866, "wattage": 1.65, "type": "DDR3", "capacity": 16 },
        { "name": "Corsair Vengeance LPX DDR4 8GB", "speed": 3200, "wattage": 1.35, "type": "DDR4", "capacity": 8 },
        { "name": "Crucial Ballistix DDR4", "speed": 2666, "wattage": 1.2, "type": "DDR4", "capacity": 16 },
        { "name": "Corsair Vengeance LPX DDR4 16GB", "speed": 3200, "wattage": 1.2, "type": "DDR4", "capacity": 16 },
        { "name": "G.Skill Ripjaws V DDR4 16GB", "speed": 3200, "wattage": 1.35, "type": "DDR4", "capacity": 16 },
        { "name": "HyperX Fury DDR4 16GB", "speed": 3200, "wattage": 1.35, "type": "DDR4", "capacity": 16 },
        { "name": "Kingston HyperX Predator DDR4 16GB", "speed": 3200, "wattage": 1.35, "type": "DDR4", "capacity": 16 },
        { "name": "G.SKILL Trident Z RGB DDR4 16GB", "speed": 3600, "wattage": 1.35, "type": "DDR4", "capacity": 16 },
        { "name": "Corsair Vengeance LPX DDR4 32GB", "speed": 2400, "wattage": 1.35, "type": "DDR4", "capacity": 32 },
        { "name": "G.Skill Ripjaws V DDR4 32GB", "speed": 3200, "wattage": 1.35, "type": "DDR4", "capacity": 32 },
        { "name": "Crucial Ballistix Elite DDR4", "speed": 3200, "wattage": 1.35, "type": "DDR4", "capacity": 32 },
        { "name": "G.Skill Trident Z DDR4 32GB", "speed": 3600, "wattage": 1.35, "type": "DDR4", "capacity": 32 },
        { "name": "G.SKILL Ripjaws S5 DDR5 16GB DDR5", "speed": 4800, "wattage": 1.1, "type": "DDR5", "capacity": 16 },
        { "name": "Corsair Vengeance LPX 16GB DDR5", "speed": 5200, "wattage": 1.1, "type": "DDR5", "capacity": 16 },
        { "name": "TeamGroup T-Force Delta 16GB DDR5", "speed": 6000, "wattage": 1.35, "type": "DDR5", "capacity": 16 },
        { "name": "G.Skill Ripjaws S5 32GB DDR5", "speed": 4800, "wattage": 1.1, "type": "DDR5", "capacity": 32 },
        { "name": "Corsair Vengeance DDR5 32GB", "speed": 5200, "wattage": 1.25, "type": "DDR5", "capacity": 32 },
        { "name": "Kingston Fury Beast DDR5 32GB", "speed": 6400, "wattage": 1.4, "type": "DDR5", "capacity": 32 },
        { "name": "Teamgroup T-Force Delta RGB DDR5 32GB", "speed": 7200, "wattage": 1.35, "type": "DDR5", "capacity": 32 },
        { "name": "Corsair Vengeance LPX 64GB DDR5", "speed": 5200, "wattage": 1.1, "type": "DDR5", "capacity": 64 },
        { "name": "G.SKILL Trident Z5 RGB DDR5 64GB", "speed": 6000, "wattage": 1.25, "type": "DDR5", "capacity": 64 },
        { "name": "Corsair Dominator Platinum RGB DDR5 64GB", "speed": 6600, "wattage": 1.35, "type": "DDR5", "capacity": 64 },
        { "name": "TEAMGROUP T-Force Xtreem 8000MHz", "speed": 8000, "wattage": 1.35, "type": "DDR5", "capacity": 64 },
        { "name": "Kingston Fury Beast 128GB DDR5", "speed": 4800, "wattage": 1.1, "type": "DDR5", "capacity": 128 },
        { "name": "Corsair Vengeance DDR5 128GB", "speed": 5200, "wattage": 1.1, "type": "DDR5", "capacity": 128 },
        { "name": "Kingston Fury Renegade 128GB", "speed": 6000, "wattage": 1.35, "type": "DDR5", "capacity": 128 },
        { "name": "Crucial Ballistix MAX DDR5 128GB", "speed": 6400, "wattage": 1.35, "type": "DDR5", "capacity": 128 },
        { "name": "Corsair Dominator Platinum RGB DDR5 128GB", "speed": 8000, "wattage": 1.45, "type": "DDR5", "capacity": 128 },
        { "name": "Kingston Fury Renegade 256GB", "speed": 6400, "wattage": 1.45, "type": "DDR5", "capacity": 256 },
        { "name": "Corsair Vengeance DDR5 256GB", "speed": 7200, "wattage": 1.25, "type": "DDR5", "capacity": 256 },
        { "name": "Corsair Dominator Platinum RGB DDR5 256GB", "speed": 8000, "wattage": 1.35, "type": "DDR5", "capacity": 256 },
        { "name": "Corsair Dominator Platinum RGB DDR5 512GB", "speed": 8000, "wattage": 1.35, "type": "DDR5", "capacity": 512 },
        { "name": "Corsair Vengeance DDR5 512GB", "speed": 7200, "wattage": 1.25, "type": "DDR5", "capacity": 512 },
        { "name": "G.Skill Trident Z5 DDR5 512GB", "speed": 7200, "wattage": 1.25, "type": "DDR5", "capacity": 512 },
        { "name": "Crucial Ballistix 512GB DDR5", "speed": 6000, "wattage": 1.35, "type": "DDR5", "capacity": 512 },
        { "name": "HyperX Predator DDR6 512GB", "speed": 14000, "wattage": 1.1, "type": "DDR6", "capacity": 512 },
        { "name": "G.SKILL Ripjaws DDR6 1TB", "speed": 16000, "wattage": 1.1, "type": "DDR6", "capacity": 1024 },
        { "name": "Corsair Vengeance DDR6 1TB", "speed": 18000, "wattage": 1.1, "type": "DDR6", "capacity": 1024 },
        { "name": "G.Skill Trident Z DDR6 1TB", "speed": 18000, "wattage": 1.1, "type": "DDR6", "capacity": 1024 },
        { "name": "Teamgroup T-Force DDR6 1TB", "speed": 16000, "wattage": 1.1, "type": "DDR6", "capacity": 1024 },
        { "name": "Corsair Dominator Platinum DDR6 1TB", "speed": 18000, "wattage": 1.1, "type": "DDR6", "capacity": 1024 },
        { "name": "Corsair Vengeance DDR6 2TB", "speed": 24000, "wattage": 1.2, "type": "DDR6", "capacity": 2048 },
        { "name": "G.SKILL Trident Z RGB DDR6 2TB", "speed": 22400, "wattage": 1.2, "type": "DDR6", "capacity": 2048 },
        { "name": "Corsair Vengeance LPX DDR6 2TB", "speed": 24000, "wattage": 1.2, "type": "DDR6", "capacity": 2048 },
        { "name": "Teamgroup T-Force DDR7 2TB", "speed": 33000, "wattage": 0.9, "type": "DDR7", "capacity": 2048 },
        { "name": "Corsair Dominator Platinum RGB DDR7 2TB", "speed": 32000, "wattage": 0.9, "type": "DDR7", "capacity": 2048 },
        { "name": "Corsair Vengeance DDR7 2TB", "speed": 32000, "wattage": 0.9, "type": "DDR7", "capacity": 2048 },
        { "name": "Corsair Vengeance DDR7 4TB", "speed": 48000, "wattage": 0.9, "type": "DDR7", "capacity": 4096 },
        { "name": "Corsair Vengeance LPX DDR7 4TB", "speed": 48000, "wattage": 0.9, "type": "DDR7", "capacity": 4096 },
        { "name": "G.SKILL Ripjaws V DDR7 4TB", "speed": 48000, "wattage": 0.9, "type": "DDR7", "capacity": 4096 },
        { "name": "Corsair Vengeance LPX DDR7 8TB", "speed": 64000, "wattage": 0.9, "type": "DDR7", "capacity": 8192 },
        { "name": "Corsair Vengeance LPX DDR7 16TB", "speed": 96000, "wattage": 0.9, "type": "DDR7", "capacity": 16384 },
        { "name": "Teamgroup T-Force DDR7 16TB", "speed": 97000, "wattage": 0.9, "type": "DDR7", "capacity": 16384 },
        { "name": "Corsair Vengeance LPX DDR7 32TB", "speed": 128000, "wattage": 0.9, "type": "DDR7", "capacity": 32768 },
        { "name": "Corsair Vengeance LPX DDR7 64TB", "speed": 192500, "wattage": 0.9, "type": "DDR7", "capacity": 65536 },
        { "name": "G.SKILL Trident Z RGB DDR7 64TB", "speed": 194000, "wattage": 0.9, "type": "DDR7", "capacity": 65536 },
        { "name": "Corsair Vengeance LPX DDR7 96TB", "speed": 192500, "wattage": 0.9, "type": "DDR7", "capacity": 98304 },
        { "name": "Corsair Vengeance LPX DDR7 128TB", "speed": 256200, "wattage": 0.9, "type": "DDR7", "capacity": 131072 },
        { "name": "Teamgroup T-Force DDR7 128TB", "speed": 257000, "wattage": 0.9, "type": "DDR7", "capacity": 131072 },
        { "name": "Corsair Vengeance LPX DDR7 160TB", "speed": 256200, "wattage": 0.9, "type": "DDR7", "capacity": 163840 },
        { "name": "Corsair Vengeance LPX DDR7 192TB", "speed": 256200, "wattage": 0.9, "type": "DDR7", "capacity": 196608 },
        { "name": "Corsair Vengeance LPX DDR7 256TB", "speed": 256200, "wattage": 0.9, "type": "DDR7", "capacity": 262144 },
        { "name": "Corsair Vengeance LPX DDR7 512TB", "speed": 256200, "wattage": 0.9, "type": "DDR7", "capacity": 524288 },
        { "name": "Corsair Vengeance LPX DDR7 1PB", "speed": 256200, "wattage": 0.9, "type": "DDR7", "capacity": 1048576 },
        { "name": "G.SKILL Ripjaws V DDR7 1PB", "speed": 256800, "wattage": 0.9, "type": "DDR7", "capacity": 1048576 },
        { "name": "Teamgroup T-Force DDR7 2PB", "speed": 256900, "wattage": 0.95, "type": "DDR7", "capacity": 2097152 },
        { "name": "Corsair Vengeance QDR 4PB", "speed": 784700, "wattage": 0.35, "type": "QDR", "capacity": 4194304 },
        { "name": "G.SKILL Ripjaws V QDR 4PB", "speed": 785900, "wattage": 0.35, "type": "QDR", "capacity": 4194304 },
        { "name": "Kingston Fury Renegade 6PB", "speed": 784500, "wattage": 0.3, "type": "QDR", "capacity": 6291456 },
        { "name": "Corsair Vengeance QDR 6PB", "speed": 784700, "wattage": 0.35, "type": "QDR", "capacity": 6291456 },
        { "name": "Corsair Vengeance QDR 8PB", "speed": 784700, "wattage": 0.35, "type": "QDR", "capacity": 8388608 },
        { "name": "Corsair Vengeance QDR 16PB", "speed": 784700, "wattage": 0.35, "type": "QDR", "capacity": 16777216 },
        { "name": "G.SKILL Ripjaws V QDR 16PB", "speed": 784700, "wattage": 0.35, "type": "QDR", "capacity": 16777216 },
        { "name": "Corsair Vengeance QDR 24PB", "speed": 784700, "wattage": 0.35, "type": "QDR", "capacity": 25165824 },
        { "name": "Corsair Vengeance QDR 32PB", "speed": 784700, "wattage": 0.35, "type": "QDR", "capacity": 33554432 },
        { "name": "Corsair Vengeance QDR 64PB", "speed": 787000, "wattage": 0.4, "type": "QDR", "capacity": 67108864 },
        { "name": "Corsair Vengeance QDR 128PB", "speed": 787000, "wattage": 0.4, "type": "QDR", "capacity": 134217728 },
        { "name": "Corsair Vengeance QDR 256PB", "speed": 787000, "wattage": 0.4, "type": "QDR", "capacity": 268435456 },
        { "name": "Corsair Vengeance QDR 512PB", "speed": 787000, "wattage": 0.4, "type": "QDR", "capacity": 536870912 },
        { "name": "Corsair Vengeance QDR 1EB", "speed": 798900, "wattage": 0.4, "type": "QDR", "capacity": 1073741824 },
        { "name": "Corsair Vengeance QDR 2EB", "speed": 798900, "wattage": 0.4, "type": "QDR", "capacity": 2147483648 },
        { "name": "Corsair Vengeance QDR 4EB", "speed": 798900, "wattage": 0.4, "type": "QDR", "capacity": 4294967296 },
        { "name": "Corsair Vengeance QDR 8EB", "speed": 798900, "wattage": 0.4, "type": "QDR", "capacity": 8589934592 },
        { "name": "Corsair Vengeance QDR 16EB", "speed": 798900, "wattage": 0.4, "type": "QDR", "capacity": 17179869184 },
        { "name": "G.SKILL Ripjaws V QDR 24EB", "speed": 799600, "wattage": 0.4, "type": "QDR", "capacity": 34359738368 },
        { "name": "Corsair Vengeance QDR 24EB", "speed": 798900, "wattage": 0.4, "type": "QDR", "capacity": 34359738368 },
        { "name": "Corsair Vengeance QDR 32EB", "speed": 798900, "wattage": 0.4, "type": "QDR", "capacity": 34359738368 },
        { "name": "Corsair Vengeance QDR 48EB", "speed": 798900, "wattage": 0.4, "type": "QDR", "capacity": 68719476736 },
        { "name": "Corsair Vengeance QDR 64EB", "speed": 802500, "wattage": 0.45, "type": "QDR", "capacity": 68719476736 },
        { "name": "Corsair Vengeance QDR 128EB", "speed": 802500, "wattage": 0.45, "type": "QDR", "capacity": 137438953472 },
        { "name": "Kingston Fury Renegade 256EB", "speed": 802200, "wattage": 0.4, "type": "QDR", "capacity": 274877906944 },
        { "name": "Corsair Vengeance QDR 256EB", "speed": 802500, "wattage": 0.45, "type": "QDR", "capacity": 274877906944 },
        { "name": "Corsair Vengeance QDR 512EB", "speed": 802500, "wattage": 0.45, "type": "QDR", "capacity": 549755813888 },
        { "name": "Corsair Vengeance QDR 1ZB", "speed": 802500, "wattage": 0.45, "type": "QDR", "capacity": 1099511627776 },
        { "name": "Corsair Vengeance QDR 2ZB", "speed": 803300, "wattage": 0.5, "type": "QDR", "capacity": 2199023255552 },
        { "name": "Corsair Vengeance QDR 4ZB", "speed": 803300, "wattage": 0.5, "type": "QDR", "capacity": 4398046511104 },
        { "name": "Teamgroup T-Force QDR 8ZB", "speed": 803300, "wattage": 0.55, "type": "QDR", "capacity": 8796093022208 },
        { "name": "Corsair Vengeance QDR 16ZB", "speed": 803300, "wattage": 0.55, "type": "QDR", "capacity": 17592186044416 },
        { "name": "Corsair Vengeance QDR 32ZB", "speed": 803300, "wattage": 0.55, "type": "QDR", "capacity": 35184372088832 },
        { "name": "Corsair Vengeance QDR 64ZB", "speed": 806500, "wattage": 0.6, "type": "QDR", "capacity": 70368744177664 }
    ],
    "motherboard": [
        { "name": "ASUS P3B-F", "chipset": "Intel", "type": "SDR", "maxSpeed": 100, "wattage": 30 },
        { "name": "ABIT BE6-II", "chipset": "Intel", "type": "SDR", "maxSpeed": 100, "wattage": 35 },
        { "name": "Gigabyte GA-7ZX", "chipset": "AMD", "type": "SDR", "maxSpeed": 100, "wattage": 35 },
        { "name": "ASUS P4B", "chipset": "Intel", "type": "DDR", "maxSpeed": 266, "wattage": 30 },
        { "name": "ASRock K7S41GX", "chipset": "AMD", "type": "DDR", "maxSpeed": 266, "wattage": 35 },
        { "name": "MSI K7N2 Delta-L", "chipset": "AMD", "type": "DDR", "maxSpeed": 400, "wattage": 40 },
        { "name": "Abit NF7-S", "chipset": "AMD", "type": "DDR", "maxSpeed": 400, "wattage": 30 },
        { "name": "ASUS A7V600", "chipset": "AMD", "type": "DDR", "maxSpeed": 400, "wattage": 45 },
        { "name": "Gigabyte GA-8IG1000-G", "chipset": "Intel", "type": "DDR", "maxSpeed": 400, "wattage": 40 },
        { "name": "Gigabyte GA-8I845G", "chipset": "Intel", "type": "DDR", "maxSpeed": 400, "wattage": 40 },
        { "name": "ASRock 775i65G", "chipset": "Intel", "type": "DDR2", "maxSpeed": 800, "wattage": 45 },
        { "name": "Foxconn G31MX-K", "chipset": "Intel", "type": "DDR2", "maxSpeed": 800, "wattage": 60 },
        { "name": "ASUS M2N68-AM PLUS", "chipset": "AMD", "type": "DDR2", "maxSpeed": 800, "wattage": 60 },
        { "name": "ASUS P5GC-MX", "chipset": "Intel", "type": "DDR2", "maxSpeed": 800, "wattage": 60 },
        { "name": "MSI K9N6PGM2-V2", "chipset": "AMD", "type": "DDR2", "maxSpeed": 800, "wattage": 65 },
        { "name": "Gigabyte GA-G31M-ES2L", "chipset": "Intel", "type": "DDR2", "maxSpeed": 800, "wattage": 65 },
        { "name": "MSI K9N6PGM2-V2", "chipset": "AMD", "type": "DDR2", "maxSpeed": 800, "wattage": 65 },
        { "name": "Intel DG965WH", "chipset": "Intel", "type": "DDR2", "maxSpeed": 800, "wattage": 70 },
        { "name": "Intel DG965RY", "chipset": "Intel", "type": "DDR2", "maxSpeed": 800, "wattage": 70 },
        { "name": "ASUS P7P55D-E Pro", "chipset": "Intel", "type": "DDR3", "maxSpeed": 1333, "wattage": 30 },
        { "name": "ASRock H61M-DGS", "chipset": "Intel", "type": "DDR3", "maxSpeed": 1333, "wattage": 35 },
        { "name": "ASRock H81M-DGS", "chipset": "Intel", "type": "DDR3", "maxSpeed": 1333, "wattage": 35 },
        { "name": "ASUS Z87-A", "chipset": "Intel", "type": "DDR3", "maxSpeed": 1600, "wattage": 40 },
        { "name": "Biostar TA970", "chipset": "AMD", "type": "DDR3", "maxSpeed": 1866, "wattage": 55 },
        { "name": "MSI 970A-G43", "chipset": "AMD", "type": "DDR3", "maxSpeed": 1866, "wattage": 50 },
        { "name": "Gigabyte GA-970A-DS3P", "chipset": "AMD", "type": "DDR3", "maxSpeed": 1866, "wattage": 45 },
        { "name": "ASRock 990FX Extreme4", "chipset": "AMD", "type": "DDR3", "maxSpeed": 1866, "wattage": 60 },
        { "name": "Gigabyte Z370 AORUS Gaming 7", "chipset": "Intel", "type": "DDR3", "maxSpeed": 2400, "wattage": 75 },
        { "name": "Gigabyte Z390 Aorus Pro", "chipset": "Intel", "type": "DDR4", "maxSpeed": 2666, "wattage": 60 },
        { "name": "ASRock B450M Steel Legend", "chipset": "AMD", "type": "DDR4", "maxSpeed": 2933, "wattage": 40 },
        { "name": "ASUS Z490-A PRO", "chipset": "Intel", "type": "DDR4", "maxSpeed": 2933, "wattage": 40 },
        { "name": "MSI B450 Tomahawk Max", "chipset": "AMD", "type": "DDR4", "maxSpeed": 2933, "wattage": 45 },
        { "name": "Gigabyte B450 AORUS ELITE", "chipset": "AMD", "type": "DDR4", "maxSpeed": 2933, "wattage": 50 },
        { "name": "Gigabyte GA-AX370-Gaming 5", "chipset": "AMD", "type": "DDR4", "maxSpeed": 2933, "wattage": 55 },
        { "name": "ASUS ROG Strix B350-F Gaming", "chipset": "AMD", "type": "DDR4", "maxSpeed": 2933, "wattage": 60 },
        { "name": "MSI X470 GAMING PLUS", "chipset": "AMD", "type": "DDR4", "maxSpeed": 2933, "wattage": 60 },
        { "name": "ASUS ROG Strix Z490-I Gaming", "chipset": "Intel", "type": "DDR4", "maxSpeed": 2933, "wattage": 70 },
        { "name": "MSI MAG Z490 Tomahawk", "chipset": "Intel", "type": "DDR4", "maxSpeed": 2933, "wattage": 65 },
        { "name": "Gigabyte B550M Aorus Pro", "chipset": "AMD", "type": "DDR4", "maxSpeed": 3200, "wattage": 50 },
        { "name": "MSI MPG B550 Gaming Plus", "chipset": "AMD", "type": "DDR4", "maxSpeed": 3200, "wattage": 50 },
        { "name": "ASUS TUF Gaming B550-Plus", "chipset": "AMD", "type": "DDR4", "maxSpeed": 3200, "wattage": 55 },
        { "name": "ASUS ROG Strix B550-F Gaming (Wi-Fi)", "chipset": "AMD", "type": "DDR4", "maxSpeed": 3200, "wattage": 60 },
        { "name": "MSI MPG X570 Gaming Pro Carbon WiFi", "chipset": "AMD", "type": "DDR4", "maxSpeed": 3200, "wattage": 65 },
        { "name": "Gigabyte Z690 Gaming X DDR4", "chipset": "Intel", "type": "DDR4", "maxSpeed": 3200, "wattage": 70 },
        { "name": "ASUS TUF Gaming Z690-Plus WiFi D4", "chipset": "Intel", "type": "DDR4", "maxSpeed": 3200, "wattage": 70 },
        { "name": "ASRock Z690 Taichi", "chipset": "Intel", "type": "DDR5", "maxSpeed": 4800, "wattage": 75 },
        { "name": "ASUS ROG Crosshair VIII Hero", "chipset": "AMD", "type": "DDR5", "maxSpeed": 4800, "wattage": 80 },
        { "name": "ASUS Rog Strix Z690-E Gaming WiFi", "chipset": "Intel", "type": "DDR5", "maxSpeed": 4800, "wattage": 80 },
        { "name": "MSI MEG Z690 Unify", "chipset": "Intel", "type": "DDR5", "maxSpeed": 4800, "wattage": 80 },
        { "name": "ASUS ROG Strix X670E-E Gaming WiFi", "chipset": "AMD", "type": "DDR5", "maxSpeed": 4800, "wattage": 90 },
        { "name": "Gigabyte Z790 Aorus Master", "chipset": "Intel", "type": "DDR5", "maxSpeed": 4800, "wattage": 100 },
        { "name": "MSI MEG X570 Godlike", "chipset": "AMD", "type": "DDR5", "maxSpeed": 4800, "wattage": 100 },
        { "name": "ASUS ROG Maximus Z790 Hero", "chipset": "Intel", "type": "DDR5", "maxSpeed": 4800, "wattage": 105 },
        { "name": "MSI MEG Z790 Godlike", "chipset": "AMD", "type": "DDR5", "maxSpeed": 4800, "wattage": 110 },
        { "name": "Gigabyte Z790 Aorus Xtreme", "chipset": "Intel", "type": "DDR5", "maxSpeed": 4800, "wattage": 135 },
        { "name": "MSI MEG X670E Godlike", "chipset": "AMD", "type": "DDR5", "maxSpeed": 4800, "wattage": 145 },
        { "name": "MSI MPG Z790 Carbon WiFi", "chipset": "Intel", "type": "DDR5", "maxSpeed": 4800, "wattage": 130 },
        { "name": "MSI Creator TRX40", "chipset": "AMD", "type": "DDR5", "maxSpeed": 4800, "wattage": 135 },
        { "name": "ASUS ROG Zenith VI Ultra", "chipset": "AMD", "type": "DDR6", "maxSpeed": 5800, "wattage": 130 },
        { "name": "MSI MEG X690 GODLIKE", "chipset": "Intel", "type": "DDR6", "maxSpeed": 5800, "wattage": 135 },
        { "name": "Gigabyte AORUS Master X800", "chipset": "AMD", "type": "DDR6", "maxSpeed": 5800, "wattage": 140 },
        { "name": "ASUS ROG Zenith VIII Extreme", "chipset": "AMD", "type": "DDR6", "maxSpeed": 5800, "wattage": 140 },
        { "name": "MSI Quanta Pro X100", "chipset": "AMD", "type": "DDR6", "maxSpeed": 6200, "wattage": 140 },
        { "name": "ASUS TUF Gaming Z985-Plus WiFi D6", "chipset": "Intel", "type": "DDR6", "maxSpeed": 6200, "wattage": 145 },
        { "name": "MSI Quanta Pro X210", "chipset": "AMD", "type": "DDR7", "maxSpeed": 9800, "wattage": 145 },
        { "name": "Gigabyte AORUS Master X880", "chipset": "AMD", "type": "DDR7", "maxSpeed": 9800, "wattage": 145 },
        { "name": "MSI Quanta Pro X275", "chipset": "AMD", "type": "DDR7", "maxSpeed": 9800, "wattage": 150 },
        { "name": "ASUS TUF Gaming Z690-Plus WiFi D6", "chipset": "Intel", "type": "DDR7", "maxSpeed": 12000, "wattage": 155 },
        { "name": "MSI Quanta Pro X470", "chipset": "AMD", "type": "DDR7", "maxSpeed": 12000, "wattage": 160 },
        { "name": "MSI Quanta Pro X500", "chipset": "AMD", "type": "DDR7", "maxSpeed": 12000, "wattage": 160 },
        { "name": "Gigabyte AORUS Master X970", "chipset": "AMD", "type": "DDR7", "maxSpeed": 12000, "wattage": 175 },
        { "name": "MSI Quanta QDR X670", "chipset": "AMD", "type": "QDR", "maxSpeed": 960000, "wattage": 175 },
        { "name": "Gigabyte Z995 Aorus Xtreme", "chipset": "Intel", "type": "QDR", "maxSpeed": 990000, "wattage": 175 },
        { "name": "MSI Quanta QDR X675", "chipset": "AMD", "type": "QDR", "maxSpeed": 990000, "wattage": 175 },
        { "name": "MSI Quanta QDR X695", "chipset": "AMD", "type": "QDR", "maxSpeed": 990000, "wattage": 175 },
        { "name": "MSI Quanta QDR X700", "chipset": "AMD", "type": "QDR", "maxSpeed": 990000, "wattage": 175 },
        { "name": "Gigabyte Z1000 Aorus Xtreme", "chipset": "Intel", "type": "QDR", "maxSpeed": 990000, "wattage": 180 },
        { "name": "MSI Quanta QDR X710", "chipset": "AMD", "type": "QDR", "maxSpeed": 1200000, "wattage": 180 }
    ],
    "psu": [
        { "name": "Thermaltake TR2-200", "wattage": 200 },
        { "name": "Cooler Master RS-225-ACLY", "wattage": 225 },
        { "name": "FSP Group FSP250-60GHS", "wattage": 250 },
        { "name": "Antec SP275", "wattage": 275 },
        { "name": "Corsair CV300", "wattage": 300 },
        { "name": "EVGA 350 BR", "wattage": 350 },
        { "name": "SilverStone SFX SX375-G", "wattage": 375 },
        { "name": "FSP 375W ATX PSU", "wattage": 375 },
        { "name": "Corsair CX400M", "wattage": 400 },
        { "name": "be quiet! Pure Power 11 425W", "wattage": 425 },
        { "name": "Corsair VS450", "wattage": 450 },
        { "name": "Thermaltake Smart 450W", "wattage": 450 },
        { "name": "Antec NeoECO 475C", "wattage": 475 },
        { "name": "Thermaltake Smart Series 475W", "wattage": 475 },
        { "name": "EVGA 500 W1", "wattage": 500 },
        { "name": "Cooler Master MWE Bronze 500W", "wattage": 500 },
        { "name": "Cooler Master MWE Bronze 525W", "wattage": 525 },
        { "name": "Seasonic S12III 550", "wattage": 550 },
        { "name": "Corsair CV550", "wattage": 550 },
        { "name": "Antec EarthWatts EA-575 Green", "wattage": 575 },
        { "name": "Thermaltake Smart 600W", "wattage": 600 },
        { "name": "be quiet! System Power 9 600W", "wattage": 600 },
        { "name": "EVGA 600 W1 80+ WHITE 600W", "wattage": 600 },
        { "name": "Thermaltake TR2 600W", "wattage": 600 },
        { "name": "Corsair CV650", "wattage": 650 },
        { "name": "Antec HCG Gold 650W", "wattage": 650 },
        { "name": "Cooler Master MWE Gold 650", "wattage": 650 },
        { "name": "Cooler Master G650M 675W", "wattage": 675 },
        { "name": "Be Quiet! Pure Power 11 700W", "wattage": 700 },
        { "name": "FSP Hyper K 700W", "wattage": 700 },
        { "name": "Corsair CX700 700W", "wattage": 700 },
        { "name": "EVGA SuperNOVA 725 G2 725W", "wattage": 725 },
        { "name": "Corsair RM750", "wattage": 750 },
        { "name": "EVGA SuperNOVA 750 G5", "wattage": 750 },
        { "name": "Corsair CX750F RGB", "wattage": 750 },
        { "name": "Thermaltake Toughpower GF1 750W", "wattage": 750 },
        { "name": "Seasonic PRIME Ultra 800W Titanium", "wattage": 800 },
        { "name": "SilverStone Strider Plus 825W", "wattage": 825 },
        { "name": "XPG Core Reactor 850W", "wattage": 850 },
        { "name": "Seasonic Focus GX-850", "wattage": 850 },
        { "name": "Thermaltake Smart Pro RGB 850W", "wattage": 850 },
        { "name": "Corsair RM850x", "wattage": 850 },
        { "name": "MSI MPG A850GF", "wattage": 850 },
        { "name": "EVGA SuperNOVA 850 G5", "wattage": 850 },
        { "name": "Cooler Master V850 Gold", "wattage": 850 },
        { "name": "Corsair AX860i", "wattage": 860 },
        { "name": "Seasonic Focus Plus 900W", "wattage": 900 },
        { "name": "be quiet! Dark Power 12 900W", "wattage": 900 },
        { "name": "Corsair RM900", "wattage": 900 },
        { "name": "Thermaltake Toughpower 925W 80+ Gold", "wattage": 925 },
        { "name": "Thermaltake Toughpower 950W", "wattage": 950 },
        { "name": "FSP Cannon Pro 975W (80+ Platinum)", "wattage": 950 },
        { "name": "SilverStone Strider Platinum 1000W", "wattage": 1000 },
        { "name": "EVGA SuperNOVA 1000 G5", "wattage": 1000 },
        { "name": "Corsair RM1000x", "wattage": 1000 },
        { "name": "Thermaltake Toughpower 1000W", "wattage": 1000 },
        { "name": "Corsair HX1100i", "wattage": 1100 },
        { "name": "EVGA SuperNOVA 1100 G2", "wattage": 1100 },
        { "name": "Corsair AX1200i", "wattage": 1200 },
        { "name": "EVGA SuperNOVA 1250 G2", "wattage": 1250 },
        { "name": "Seasonic PRIME 1300W Titanium", "wattage": 1300 },
        { "name": "Corsair RM1300x", "wattage": 1300 },
        { "name": "Corsair HX1350", "wattage": 1350 },
        { "name": "Thermaltake Toughpower Grand RGB", "wattage": 1400 },
        { "name": "EVGA SuperNOVA 1400 G2", "wattage": 1400 },
        { "name": "Cooler Master V1450 Platinum", "wattage": 1450 },
        { "name": "Corsair HX1500i", "wattage": 1500 },
        { "name": "Corsair AX1600i", "wattage": 1600 },
        { "name": "Thermaltake Toughpower GF3 1650W", "wattage": 1650 }
    ],
    "storage": [
        { "name": "Western Digital WDAC 64", "type": "HDD", "size": "32 MB", "speed": "5400 RPM", "wattage": 4 },
        { "name": "Seagate ST51080A", "type": "HDD", "size": "48 MB", "speed": "5400 RPM", "wattage": 4 },
        { "name": "Conner CP3024", "type": "HDD", "size": "48 MB", "speed": "5400 RPM", "wattage": 3 },
        { "name": "Seagate ST5145A", "type": "HDD", "size": "64 MB", "speed": "5400 RPM", "wattage": 5 },
        { "name": "Western Digital WD641", "type": "HDD", "size": "64 MB", "speed": "5400 RPM", "wattage": 5 },
        { "name": "Western Digital WD961", "type": "HDD", "size": "96 MB", "speed": "5400 RPM", "wattage": 5 },
        { "name": "Seagate ST32155A", "type": "HDD", "size": "128 MB", "speed": "5400 RPM", "wattage": 5 },
        { "name": "Conner Peripherals CP-2064", "type": "HDD", "size": "256 MB", "speed": "5400 RPM", "wattage": 5.5 },
        { "name": "IBM Deskstar 1G (DTLA-307030)", "type": "HDD", "size": "512 MB", "speed": "5400 RPM", "wattage": 10 },
        { "name": "Western Digital Caviar 1GB (WDAC10100)", "type": "HDD", "size": "1 GB", "speed": "5400 RPM", "wattage": 8.5 },
        { "name": "Seagate Barracuda 2GB (ST32140A)", "type": "HDD", "size": "2 GB", "speed": "5400 RPM", "wattage": 10 },
        { "name": "Seagate Barracuda 4GB", "type": "HDD", "size": "4 GB", "speed": "5400 RPM", "wattage": 2.5 },
        { "name": "IBM Deskstar 10GB", "type": "HDD", "size": "10 GB", "speed": "7200 RPM", "wattage": 3 },
        { "name": "Maxtor DiamondMax 40GB", "type": "HDD", "size": "40 GB", "speed": "7200 RPM", "wattage": 5 },
        { "name": "Western Digital Caviar 80GB", "type": "HDD", "size": "80 GB", "speed": "7200 RPM", "wattage": 5.5 },
        { "name": "Seagate Barracuda 120GB", "type": "HDD", "size": "120 GB", "speed": "7200 RPM", "wattage": 6 },
        { "name": "Seagate Barracuda 160GB", "type": "HDD", "size": "160 GB", "speed": "7200 RPM", "wattage": 5 },
        { "name": "Hitachi Deskstar 250GB", "type": "HDD", "size": "250 GB", "speed": "7200 RPM", "wattage": 6 },
        { "name": "Western Digital Caviar Blue 320GB", "type": "HDD", "size": "320 GB", "speed": "7200 RPM", "wattage": 5 },
        { "name": "Western Digital Caviar Blue 400GB", "type": "HDD", "size": "400 GB", "speed": "7200 RPM", "wattage": 6 },
        { "name": "Western Digital Caviar Blue 500GB", "type": "HDD", "size": "500 GB", "speed": "7200 RPM", "wattage": 6 },
        { "name": "Samsung 850 EVO 500GB", "type": "SSD", "size": "500 GB", "speed": "520 MB/s", "wattage": 4 },
        { "name": "Samsung 970 EVO Plus 500GB", "type": "SSD", "size": "500 GB", "speed": "3.5 GB/s", "wattage": 5 },
        { "name": "Samsung 860 EVO 750GB", "type": "SSD", "size": "750 GB", "speed": "550 MB/s", "wattage": 4 },
        { "name": "Crucial MX500 800GB", "type": "SSD", "size": "800 GB", "speed": "560 MB/s", "wattage": 3 },
        { "name": "Samsung 970 EVO 900GB", "type": "SSD", "size": "900 GB", "speed": "3.5 GB/s", "wattage": 5 },
        { "name": "Samsung 870 EVO 1TB", "type": "SSD", "size": "1 TB", "speed": "560 MB/s", "wattage": 4 },
        { "name": "Crucial P5 1TB", "type": "SSD", "size": "1 TB", "speed": "3.4 GB/s", "wattage": 5 },
        { "name": "Western Digital Black SN750 1TB", "type": "SSD", "size": "1 TB", "speed": "3.47 GB/s", "wattage": 5 },
        { "name": "Samsung 970 EVO Plus 1.5TB", "type": "SSD", "size": "1.5 TB", "speed": "3.5 GB/s", "wattage": 6 },
        { "name": "Samsung 870 QVO 2TB", "type": "SSD", "size": "2 TB", "speed": "560 MB/s", "wattage": 4 },
        { "name": "Crucial P3 2TB", "type": "SSD", "size": "2 TB", "speed": "3.5 GB/s", "wattage": 5 },
        { "name": "Samsung 970 EVO Plus 2TB", "type": "SSD", "size": "2 TB", "speed": "3.5 GB/s", "wattage": 6 },
        { "name": "Samsung 970 EVO Plus 2.5TB", "type": "SSD", "size": "2.5 TB", "speed": "3.5 GB/s", "wattage": 7 },
        { "name": "Western Digital Black SN850 3TB", "type": "SSD", "size": "3 TB", "speed": "7 GB/s", "wattage": 6 },
        { "name": "Samsung 870 QVO 4TB", "type": "SSD", "size": "4 TB", "speed": "560 MB/s", "wattage": 4 },
        { "name": "Crucial MX500 5TB", "type": "SSD", "size": "5 TB", "speed": "560 MB/s", "wattage": 4 },
        { "name": "Sabrent Rocket 6TB", "type": "SSD", "size": "6 TB", "speed": "5 GB/s", "wattage": 6 },
        { "name": "Seagate Exos 8TB", "type": "SSD", "size": "8 TB", "speed": "550 MB/s", "wattage": 8 },
        { "name": "Sabrent Rocket 10TB", "type": "SSD", "size": "10 TB", "speed": "7 GB/s", "wattage": 12 },
        { "name": "Corsair MP600 Pro XT 12TB", "type": "SSD", "size": "12 TB", "speed": "7.1 GB/s", "wattage": 10.5 },
        { "name": "Sabrent Rocket 4 Plus 16TB", "type": "SSD", "size": "16 TB", "speed": "7.1 GB/s", "wattage": 12 },
        { "name": "Seagate Barracuda 16TB", "type": "SSD", "size": "16 TB", "speed": "7.2 GB/s", "wattage": 10.5 },
        { "name": "Western Digital Caviar 20TB", "type": "SSD", "size": "20 TB", "speed": "7.5 GB/s", "wattage": 11 },
        { "name": "Samsung 870 EVO 22TB", "type": "SSD", "size": "22 TB", "speed": "650 MB/s", "wattage": 9 },
        { "name": "Crucial P6 24TB", "type": "SSD", "size": "24 TB", "speed": "3.9 GB/s", "wattage": 12 },
        { "name": "Seagate Exos 25TB", "type": "SSD", "size": "25 TB", "speed": "6.2 GB/s", "wattage": 11 },
        { "name": "Western Digital Black SN860 27TB", "type": "SSD", "size": "27 TB", "speed": "7.8 GB/s", "wattage": 13 },
        { "name": "Sabrent Rocket 30TB", "type": "SSD", "size": "30 TB", "speed": "8.0 GB/s", "wattage": 14 },
        { "name": "Samsung 980 PRO 32TB", "type": "SSD", "size": "32 TB", "speed": "7.5 GB/s", "wattage": 11.5 },
        { "name": "Seagate Exos 35TB", "type": "SSD", "size": "35 TB", "speed": "7.2 GB/s", "wattage": 12 },
        { "name": "Western Digital Caviar 38TB", "type": "SSD", "size": "38 TB", "speed": "7.3 GB/s", "wattage": 12.5 },
        { "name": "Crucial P7 40TB", "type": "SSD", "size": "40 TB", "speed": "8.1 GB/s", "wattage": 13 },
        { "name": "Seagate Barracuda 42TB", "type": "SSD", "size": "42 TB", "speed": "8.3 GB/s", "wattage": 12.5 },
        { "name": "Western Digital Black SN870 45TB", "type": "SSD", "size": "45 TB", "speed": "8.5 GB/s", "wattage": 14 },
        { "name": "Samsung 990 EVO 48TB", "type": "SSD", "size": "48 TB", "speed": "8.7 GB/s", "wattage": 15 },
        { "name": "Crucial P8 50TB", "type": "SSD", "size": "50 TB", "speed": "9.0 GB/s", "wattage": 14 },
        { "name": "Seagate Exos 52TB", "type": "SSD", "size": "52 TB", "speed": "9.5 GB/s", "wattage": 15 },
        { "name": "Western Digital Caviar 55TB", "type": "SSD", "size": "55 TB", "speed": "9.2 GB/s", "wattage": 15.5 },
        { "name": "Samsung 990 PRO 58TB", "type": "SSD", "size": "58 TB", "speed": "9.8 GB/s", "wattage": 16 },
        { "name": "Sabrent Rocket 60TB", "type": "SSD", "size": "60 TB", "speed": "10.0 GB/s", "wattage": 16 },
        { "name": "Seagate Barracuda 65TB", "type": "SSD", "size": "65 TB", "speed": "10.5 GB/s", "wattage": 17 },
        { "name": "Western Digital Black SN880 70TB", "type": "SSD", "size": "70 TB", "speed": "11.0 GB/s", "wattage": 18 },
        { "name": "Crucial P9 75TB", "type": "SSD", "size": "75 TB", "speed": "11.5 GB/s", "wattage": 18 },
        { "name": "Samsung 100 EVO 80TB", "type": "SSD", "size": "80 TB", "speed": "12.0 GB/s", "wattage": 20 },
        { "name": "Seagate Exos 85TB", "type": "SSD", "size": "85 TB", "speed": "12.5 GB/s", "wattage": 21 },
        { "name": "Western Digital Caviar 90TB", "type": "SSD", "size": "90 TB", "speed": "13.0 GB/s", "wattage": 22 },
        { "name": "Crucial P10 95TB", "type": "SSD", "size": "95 TB", "speed": "13.5 GB/s", "wattage": 23 },
        { "name": "Samsung 200 EVO 100TB", "type": "SSD", "size": "100 TB", "speed": "14.0 GB/s", "wattage": 25 },
        { "name": "Seagate Barracuda 110TB", "type": "SSD", "size": "110 TB", "speed": "15.0 GB/s", "wattage": 26 },
        { "name": "Western Digital Black SN900 120TB", "type": "SSD", "size": "120 TB", "speed": "15.5 GB/s", "wattage": 28 },
        { "name": "Sabrent Rocket 150TB", "type": "SSD", "size": "150 TB", "speed": "16.0 GB/s", "wattage": 30 },
        { "name": "Samsung 500 EVO 200TB", "type": "SSD", "size": "200 TB", "speed": "17.0 GB/s", "wattage": 32 },
        { "name": "Seagate Exos 250TB", "type": "SSD", "size": "250 TB", "speed": "18.0 GB/s", "wattage": 34 },
        { "name": "Western Digital Caviar 300TB", "type": "SSD", "size": "300 TB", "speed": "19.0 GB/s", "wattage": 36 },
        { "name": "Crucial P11 400TB", "type": "SSD", "size": "400 TB", "speed": "20.0 GB/s", "wattage": 40 },
        { "name": "Samsung 500 EVO 450TB", "type": "SSD", "size": "450 TB", "speed": "20.5 GB/s", "wattage": 42 },
        { "name": "Seagate Barracuda 500TB", "type": "SSD", "size": "500 TB", "speed": "21.0 GB/s", "wattage": 44 },
        { "name": "Western Digital Black SN910 600TB", "type": "SSD", "size": "600 TB", "speed": "22.0 GB/s", "wattage": 46 },
        { "name": "Crucial P12 700TB", "type": "SSD", "size": "700 TB", "speed": "23.0 GB/s", "wattage": 48 },
        { "name": "Seagate Exos 800TB", "type": "SSD", "size": "800 TB", "speed": "24.0 GB/s", "wattage": 50 },
        { "name": "Samsung 1PB Pro 1PB", "type": "SSD", "size": "1 PB", "speed": "25.0 GB/s", "wattage": 52 },
        { "name": "Western Digital Caviar 1.5PB", "type": "SSD", "size": "1.5 PB", "speed": "26.0 GB/s", "wattage": 55 },
        { "name": "Seagate Barracuda 2PB", "type": "SSD", "size": "2 PB", "speed": "27.0 GB/s", "wattage": 56 },
        { "name": "Crucial P13 2.5PB", "type": "SSD", "size": "2.5 PB", "speed": "28.0 GB/s", "wattage": 57 },
        { "name": "Samsung 3PB Ultra 3PB", "type": "SSD", "size": "3 PB", "speed": "29.0 GB/s", "wattage": 58 },
        { "name": "Seagate Exos 4PB", "type": "SSD", "size": "4 PB", "speed": "30.0 GB/s", "wattage": 59 },
        { "name": "Western Digital Black SN920 5PB", "type": "SSD", "size": "5 PB", "speed": "31.0 GB/s", "wattage": 60 },
        { "name": "Crucial P14 6PB", "type": "SSD", "size": "6 PB", "speed": "32.0 GB/s", "wattage": 62 },
        { "name": "Seagate Barracuda 7PB", "type": "SSD", "size": "7 PB", "speed": "33.0 GB/s", "wattage": 63 },
        { "name": "Samsung 8PB Turbo 8PB", "type": "SSD", "size": "8 PB", "speed": "34.0 GB/s", "wattage": 64 },
        { "name": "Western Digital Caviar 9PB", "type": "SSD", "size": "9 PB", "speed": "35.0 GB/s", "wattage": 65 },
        { "name": "Seagate Exos 10PB", "type": "SSD", "size": "10 PB", "speed": "36.0 GB/s", "wattage": 65.5 },
        { "name": "Crucial P15 11PB", "type": "SSD", "size": "11 PB", "speed": "37.0 GB/s", "wattage": 66 },
        { "name": "Samsung 12PB Elite 12PB", "type": "SSD", "size": "12 PB", "speed": "38.0 GB/s", "wattage": 67 },
        { "name": "Seagate Barracuda 13PB", "type": "SSD", "size": "13 PB", "speed": "39.0 GB/s", "wattage": 68 },
        { "name": "Western Digital Black SN930 14PB", "type": "SSD", "size": "14 PB", "speed": "40.0 GB/s", "wattage": 69 },
        { "name": "Crucial P16 15PB", "type": "SSD", "size": "15 PB", "speed": "41.0 GB/s", "wattage": 77 },
        { "name": "Samsung 16PB Quantum 16PB", "type": "SSD", "size": "16 PB", "speed": "42.0 GB/s", "wattage": 60 },
        { "name": "Seagate Exos 18PB", "type": "SSD", "size": "18 PB", "speed": "43.0 GB/s", "wattage": 61 },
        { "name": "Western Digital Caviar 20PB", "type": "SSD", "size": "20 PB", "speed": "44.0 GB/s", "wattage": 62 },
        { "name": "Crucial P17 22PB", "type": "SSD", "size": "22 PB", "speed": "45.0 GB/s", "wattage": 63 },
        { "name": "Samsung 24PB Max 24PB", "type": "SSD", "size": "24 PB", "speed": "46.0 GB/s", "wattage": 64 },
        { "name": "Seagate Barracuda 26PB", "type": "SSD", "size": "26 PB", "speed": "47.0 GB/s", "wattage": 65 },
        { "name": "Western Digital Black SN940 28PB", "type": "SSD", "size": "28 PB", "speed": "48.0 GB/s", "wattage": 66 },
        { "name": "Crucial P18 30PB", "type": "SSD", "size": "30 PB", "speed": "49.0 GB/s", "wattage": 67 },
        { "name": "Samsung 32PB Pro 32PB", "type": "SSD", "size": "32 PB", "speed": "50.0 GB/s", "wattage": 68.5 },
        { "name": "Seagate Exos 34PB", "type": "SSD", "size": "34 PB", "speed": "51.0 GB/s", "wattage": 57 },
        { "name": "Western Digital Caviar 36PB", "type": "SSD", "size": "36 PB", "speed": "52.0 GB/s", "wattage": 58 },
        { "name": "Crucial P19 38PB", "type": "SSD", "size": "38 PB", "speed": "53.0 GB/s", "wattage": 59 },
        { "name": "Samsung 40PB Ultra 40PB", "type": "SSD", "size": "40 PB", "speed": "54.0 GB/s", "wattage": 60 },
        { "name": "Seagate Barracuda 42PB", "type": "SSD", "size": "42 PB", "speed": "55.0 GB/s", "wattage": 60.5 },
        { "name": "Western Digital Black SN950 44PB", "type": "SSD", "size": "44 PB", "speed": "56.0 GB/s", "wattage": 61 },
        { "name": "Crucial P20 46PB", "type": "SSD", "size": "46 PB", "speed": "57.0 GB/s", "wattage": 62 },
        { "name": "Samsung 48PB Extreme 48PB", "type": "SSD", "size": "48 PB", "speed": "58.0 GB/s", "wattage": 63 },
        { "name": "Seagate Exos 50PB", "type": "SSD", "size": "50 PB", "speed": "59.0 GB/s", "wattage": 20.5 },
        { "name": "Western Digital Caviar 60PB", "type": "SSD", "size": "60 PB", "speed": "60.0 GB/s", "wattage": 21 },
        { "name": "Crucial P21 70PB", "type": "SSD", "size": "70 PB", "speed": "61.0 GB/s", "wattage": 23 },
        { "name": "Samsung 80PB Performance 80PB", "type": "SSD", "size": "80 PB", "speed": "62.0 GB/s", "wattage": 25 },
        { "name": "Seagate Barracuda 90PB", "type": "SSD", "size": "90 PB", "speed": "63.0 GB/s", "wattage": 27 },
        { "name": "Western Digital Black SN960 100PB", "type": "SSD", "size": "100 PB", "speed": "64.0 GB/s", "wattage": 28 },
        { "name": "Crucial P22 110PB", "type": "SSD", "size": "110 PB", "speed": "65.0 GB/s", "wattage": 30 },
        { "name": "Samsung 120PB Turbo 120PB", "type": "SSD", "size": "120 PB", "speed": "66.0 GB/s", "wattage": 21 },
        { "name": "Seagate Exos 130PB", "type": "SSD", "size": "130 PB", "speed": "67.0 GB/s", "wattage": 20 },
        { "name": "Western Digital Caviar 140PB", "type": "SSD", "size": "140 PB", "speed": "68.0 GB/s", "wattage": 21 },
        { "name": "Crucial P23 150PB", "type": "SSD", "size": "150 PB", "speed": "69.0 GB/s", "wattage": 21.5 },
        { "name": "Samsung 160PB Quantum 160PB", "type": "SSD", "size": "160 PB", "speed": "70.0 GB/s", "wattage": 22 },
        { "name": "Seagate Barracuda 170PB", "type": "SSD", "size": "170 PB", "speed": "71.0 GB/s", "wattage": 23 },
        { "name": "Western Digital Black SN970 180PB", "type": "SSD", "size": "180 PB", "speed": "72.0 GB/s", "wattage": 24 },
        { "name": "Crucial P24 190PB", "type": "SSD", "size": "190 PB", "speed": "73.0 GB/s", "wattage": 25 },
        { "name": "Samsung 200PB Pro 200PB", "type": "SSD", "size": "200 PB", "speed": "74.0 GB/s", "wattage": 26 },
        { "name": "Seagate Exos 220PB", "type": "SSD", "size": "220 PB", "speed": "75.0 GB/s", "wattage": 27 },
        { "name": "Western Digital Caviar 240PB", "type": "SSD", "size": "240 PB", "speed": "76.0 GB/s", "wattage": 28 },
        { "name": "Crucial P25 260PB", "type": "SSD", "size": "260 PB", "speed": "77.0 GB/s", "wattage": 29 },
        { "name": "Samsung 280PB Ultra 280PB", "type": "SSD", "size": "280 PB", "speed": "78.0 GB/s", "wattage": 30 },
        { "name": "Seagate Barracuda 300PB", "type": "SSD", "size": "300 PB", "speed": "79.0 GB/s", "wattage": 19 },
        { "name": "Western Digital Black SN980 320PB", "type": "SSD", "size": "320 PB", "speed": "80.0 GB/s", "wattage": 20 },
        { "name": "Crucial P26 340PB", "type": "SSD", "size": "340 PB", "speed": "81.0 GB/s", "wattage": 20.5 },
        { "name": "Samsung 360PB Max 360PB", "type": "SSD", "size": "360 PB", "speed": "82.0 GB/s", "wattage": 21 },
        { "name": "Seagate Exos 380PB", "type": "SSD", "size": "380 PB", "speed": "83.0 GB/s", "wattage": 21.5 },
        { "name": "Western Digital Caviar 400PB", "type": "SSD", "size": "400 PB", "speed": "84.0 GB/s", "wattage": 22 },
        { "name": "Crucial P27 420PB", "type": "SSD", "size": "420 PB", "speed": "85.0 GB/s", "wattage": 22.5 },
        { "name": "Samsung 440PB Quantum 440PB", "type": "SSD", "size": "440 PB", "speed": "86.0 GB/s", "wattage": 23 },
        { "name": "Seagate Barracuda 460PB", "type": "SSD", "size": "460 PB", "speed": "88.0 GB/s", "wattage": 23.5 },
        { "name": "Western Digital Black SN990 480PB", "type": "SSD", "size": "480 PB", "speed": "88.0 GB/s", "wattage": 24 },
        { "name": "Crucial P28 500PB", "type": "SSD", "size": "500 PB", "speed": "88.0 GB/s", "wattage": 24.5 },
        { "name": "Samsung 520PB Pro 520PB", "type": "SSD", "size": "520 PB", "speed": "88.0 GB/s", "wattage": 25 },
        { "name": "Seagate Exos 540PB", "type": "SSD", "size": "540 PB", "speed": "88.0 GB/s", "wattage": 26 },
        { "name": "Western Digital Caviar 560PB", "type": "SSD", "size": "560 PB", "speed": "88.0 GB/s", "wattage": 26.5 },
        { "name": "Crucial P29 580PB", "type": "SSD", "size": "580 PB", "speed": "88.0 GB/s", "wattage": 27 },
        { "name": "Samsung 600PB Ultra 600PB", "type": "SSD", "size": "600 PB", "speed": "88.0 GB/s", "wattage": 27 },
        { "name": "Seagate Barracuda 640PB", "type": "SSD", "size": "640 PB", "speed": "98.0 GB/s", "wattage": 28 },
        { "name": "Western Digital Black SN1000 680PB", "type": "SSD", "size": "680 PB", "speed": "98.0 GB/s", "wattage": 29 },
        { "name": "Crucial P30 720PB", "type": "SSD", "size": "720 PB", "speed": "98.0 GB/s", "wattage": 30 },
        { "name": "Samsung 760PB Pro 760PB", "type": "SSD", "size": "760 PB", "speed": "98.0 GB/s", "wattage": 32 },
        { "name": "Seagate Exos 800PB", "type": "SSD", "size": "800 PB", "speed": "99.2 GB/s", "wattage": 33 },
        { "name": "Western Digital Caviar 850PB", "type": "SSD", "size": "850 PB", "speed": "99.2 GB/s", "wattage": 34 },
        { "name": "Crucial P31 900PB", "type": "SSD", "size": "900 PB", "speed": "99.2 GB/s", "wattage": 35 },
        { "name": "Samsung 960PB Ultra 960PB", "type": "SSD", "size": "960 PB", "speed": "99.2 GB/s", "wattage": 36.5 },
        { "name": "Western Digital Caviar 1EB", "type": "SSD", "size": "1 EB", "speed": "216.9 GB/s", "wattage": 37 },
        { "name": "Crucial P30 1EB", "type": "SSD", "size": "1 EB", "speed": "216.9 GB/s", "wattage": 38 },
        { "name": "Samsung 1.1EB Pro", "type": "SSD", "size": "1.1 EB", "speed": "216.9 GB/s", "wattage": 39 },
        { "name": "Seagate Barracuda 1.2EB", "type": "SSD", "size": "1.2 EB", "speed": "216.9 GB/s", "wattage": 40 },
        { "name": "Western Digital Black SN2000 1.3EB", "type": "SSD", "size": "1.3 EB", "speed": "216.9 GB/s", "wattage": 40.5 },
        { "name": "Crucial P31 1.4EB", "type": "SSD", "size": "1.4 EB", "speed": "216.9 GB/s", "wattage": 41 },
        { "name": "Samsung 1.5EB Turbo", "type": "SSD", "size": "1.5 EB", "speed": "216.9 GB/s", "wattage": 42 },
        { "name": "Seagate Exos 1.6EB", "type": "SSD", "size": "1.6 EB", "speed": "216.9 GB/s", "wattage": 43 },
        { "name": "Western Digital Caviar 1.7EB", "type": "SSD", "size": "1.7 EB", "speed": "219.0 GB/s", "wattage": 44 },
        { "name": "Crucial P32 1.8EB", "type": "SSD", "size": "1.8 EB", "speed": "219.0 GB/s", "wattage": 45 },
        { "name": "Samsung 1.9EB Pro", "type": "SSD", "size": "1.9 EB", "speed": "219.0 GB/s", "wattage": 46 },
        { "name": "Seagate Barracuda 2EB", "type": "SSD", "size": "2 EB", "speed": "219.0 GB/s", "wattage": 47 },
        { "name": "Western Digital Black SN3000 2.1EB", "type": "SSD", "size": "2.1 EB", "speed": "219.0 GB/s", "wattage": 48 },
        { "name": "Crucial P33 2.2EB", "type": "SSD", "size": "2.2 EB", "speed": "219.0 GB/s", "wattage": 49.5 },
        { "name": "Samsung 2.3EB Turbo", "type": "SSD", "size": "2.3 EB", "speed": "219.0 GB/s", "wattage": 51 },
        { "name": "Seagate Exos 2.4EB", "type": "SSD", "size": "2.4 EB", "speed": "219.0 GB/s", "wattage": 53 },
        { "name": "Western Digital Caviar 2.5EB", "type": "SSD", "size": "2.5 EB", "speed": "221.0 GB/s", "wattage": 50 },
        { "name": "Crucial P34 2.6EB", "type": "SSD", "size": "2.6 EB", "speed": "221.0 GB/s", "wattage": 51 },
        { "name": "Samsung 2.7EB Pro", "type": "SSD", "size": "2.7 EB", "speed": "221.0 GB/s", "wattage": 52 },
        { "name": "Seagate Barracuda 2.8EB", "type": "SSD", "size": "2.8 EB", "speed": "221.0 GB/s", "wattage": 53 },
        { "name": "Western Digital Black SN4000 2.9EB", "type": "SSD", "size": "2.9 EB", "speed": "221.0 GB/s", "wattage": 54 },
        { "name": "Crucial P35 3EB", "type": "SSD", "size": "3 EB", "speed": "221.0 GB/s", "wattage": 55 },
        { "name": "Samsung 3.1EB Turbo", "type": "SSD", "size": "3.1 EB", "speed": "221.0 GB/s", "wattage": 40 },
        { "name": "Seagate Exos 3.2EB", "type": "SSD", "size": "3.2 EB", "speed": "221.0 GB/s", "wattage": 41 },
        { "name": "Western Digital Caviar 3.3EB", "type": "SSD", "size": "3.3 EB", "speed": "223.0 GB/s", "wattage": 41.5 },
        { "name": "Crucial P36 3.4EB", "type": "SSD", "size": "3.4 EB", "speed": "223.0 GB/s", "wattage": 42 },
        { "name": "Samsung 3.5EB Pro", "type": "SSD", "size": "3.5 EB", "speed": "223.0 GB/s", "wattage": 43 },
        { "name": "Seagate Barracuda 3.6EB", "type": "SSD", "size": "3.6 EB", "speed": "223.0 GB/s", "wattage": 44 },
        { "name": "Western Digital Black SN5000 3.7EB", "type": "SSD", "size": "3.7 EB", "speed": "223.0 GB/s", "wattage": 45 },
        { "name": "Crucial P37 3.8EB", "type": "SSD", "size": "3.8 EB", "speed": "225.0 GB/s", "wattage": 46 },
        { "name": "Samsung 3.9EB Turbo", "type": "SSD", "size": "3.9 EB", "speed": "225.0 GB/s", "wattage": 47 },
        { "name": "Western Digital Caviar 4EB", "type": "SSD", "size": "4 EB", "speed": "216.9 GB/s", "wattage": 11 },
        { "name": "Crucial P40 4.5EB", "type": "SSD", "size": "4.5 EB", "speed": "216.9 GB/s", "wattage": 12 },
        { "name": "Samsung 4.9EB Pro", "type": "SSD", "size": "4.9 EB", "speed": "216.9 GB/s", "wattage": 12.5 },
        { "name": "Seagate Barracuda 5EB", "type": "SSD", "size": "5 EB", "speed": "219.1 GB/s", "wattage": 13 },
        { "name": "Western Digital Black SN7000 5.5EB", "type": "SSD", "size": "5.5 EB", "speed": "219.1 GB/s", "wattage": 17 },
        { "name": "Crucial P41 6EB", "type": "SSD", "size": "6 EB", "speed": "219.1 GB/s", "wattage": 13 },
        { "name": "Samsung 6.3EB Turbo", "type": "SSD", "size": "6.3 EB", "speed": "219.1 GB/s", "wattage": 14 },
        { "name": "Seagate Exos 6.5EB", "type": "SSD", "size": "6.5 EB", "speed": "221.5 GB/s", "wattage": 15.5 },
        { "name": "Western Digital Caviar 7EB", "type": "SSD", "size": "7 EB", "speed": "221.5 GB/s", "wattage": 16 },
        { "name": "Crucial P42 7.5EB", "type": "SSD", "size": "7.5 EB", "speed": "221.5 GB/s", "wattage": 17 },
        { "name": "Samsung 8EB Pro", "type": "SSD", "size": "8 EB", "speed": "221.5 GB/s", "wattage": 18 },
        { "name": "Seagate Barracuda 8.4EB", "type": "SSD", "size": "8.4 EB", "speed": "223.3 GB/s", "wattage": 18.5 },
        { "name": "Western Digital Black SN8000 8.5EB", "type": "SSD", "size": "8.5 EB", "speed": "223.3 GB/s", "wattage": 19 },
        { "name": "Crucial P43 9EB", "type": "SSD", "size": "9 EB", "speed": "223.3 GB/s", "wattage": 20 },
        { "name": "Samsung 9.3EB Turbo", "type": "SSD", "size": "9.3 EB", "speed": "223.3 GB/s", "wattage": 21 },
        { "name": "Seagate Exos 9.5EB", "type": "SSD", "size": "9.5 EB", "speed": "225.0 GB/s", "wattage": 23 },
        { "name": "Western Digital Caviar 10EB", "type": "SSD", "size": "10 EB", "speed": "225.0 GB/s", "wattage": 23.5 },
        { "name": "Crucial P44 10.1EB", "type": "SSD", "size": "10.1 EB", "speed": "225.0 GB/s", "wattage": 24 },
        { "name": "Samsung 10.5EB Pro", "type": "SSD", "size": "10.5 EB", "speed": "225.0 GB/s", "wattage": 24.5 },
        { "name": "Seagate Barracuda 11EB", "type": "SSD", "size": "11 EB", "speed": "227.8 GB/s", "wattage": 25 },
        { "name": "Western Digital Black SN9000 11.3EB", "type": "SSD", "size": "11.3 EB", "speed": "227.8 GB/s", "wattage": 25.5 },
        { "name": "Crucial P45 12EB", "type": "SSD", "size": "12 EB", "speed": "227.8 GB/s", "wattage": 26 },
        { "name": "Samsung 12.1EB Turbo", "type": "SSD", "size": "12.1 EB", "speed": "227.8 GB/s", "wattage": 27 },
        { "name": "Seagate Exos 12.5EB", "type": "SSD", "size": "12.5 EB", "speed": "229.1 GB/s", "wattage": 28 },
        { "name": "Western Digital Caviar 13EB", "type": "SSD", "size": "13 EB", "speed": "229.1 GB/s", "wattage": 29 },
        { "name": "Crucial P46 13.5EB", "type": "SSD", "size": "13.5 EB", "speed": "229.1 GB/s", "wattage": 30 },
        { "name": "Samsung 14EB Pro", "type": "SSD", "size": "14 EB", "speed": "229.1 GB/s", "wattage": 31 },
        { "name": "Seagate Barracuda 14.5EB", "type": "SSD", "size": "14.5 EB", "speed": "231.4 GB/s", "wattage": 24 },
        { "name": "Western Digital Black SN10000 15EB", "type": "SSD", "size": "15 EB", "speed": "231.4 GB/s", "wattage": 24.5 },
        { "name": "Crucial P47 15.1EB", "type": "SSD", "size": "15.1 EB", "speed": "231.4 GB/s", "wattage": 24 },
        { "name": "Samsung 15.5EB Turbo", "type": "SSD", "size": "15.5 EB", "speed": "231.4 GB/s", "wattage": 24.5 },
        { "name": "Seagate Exos 16EB", "type": "SSD", "size": "16 EB", "speed": "233.7 GB/s", "wattage": 26 },
        { "name": "Western Digital Caviar 16.5EB", "type": "SSD", "size": "16.5 EB", "speed": "233.7 GB/s", "wattage": 27 },
        { "name": "Crucial P48 17EB", "type": "SSD", "size": "17 EB", "speed": "233.7 GB/s", "wattage": 28 },
        { "name": "Samsung 17.3EB Pro", "type": "SSD", "size": "17.3 EB", "speed": "233.7 GB/s", "wattage": 29 },
        { "name": "Seagate Barracuda 17.5EB", "type": "SSD", "size": "17.5 EB", "speed": "235.1 GB/s", "wattage": 30 },
        { "name": "Western Digital Black SN11000 18EB", "type": "SSD", "size": "18 EB", "speed": "235.1 GB/s", "wattage": 31 },
        { "name": "Western Digital Caviar 20EB", "type": "SSD", "size": "20 EB", "speed": "236.5 GB/s", "wattage": 31 },
        { "name": "Samsung 21EB Turbo", "type": "SSD", "size": "21 EB", "speed": "3.2 TB/s", "wattage": 32 },
        { "name": "Seagate Barracuda 24EB", "type": "SSD", "size": "24 EB", "speed": "3.2 TB/s", "wattage": 32 },
        { "name": "Western Digital Black SN12000 28EB", "type": "SSD", "size": "28 EB", "speed": "3.3 TB/s", "wattage": 33 },
        { "name": "Western Digital Caviar 32EB", "type": "SSD", "size": "32 EB", "speed": "3.3 TB/s", "wattage": 35 },
        { "name": "Samsung 36EB Pro", "type": "SSD", "size": "36 EB", "speed": "3.3 TB/s", "wattage": 38 },
        { "name": "Seagate Barracuda 40EB", "type": "SSD", "size": "40 EB", "speed": "3.3 TB/s", "wattage": 40 },
        { "name": "Western Digital Black SN13000 48EB", "type": "SSD", "size": "48 EB", "speed": "3.3 TB/s", "wattage": 43 },
        { "name": "Western Digital Caviar 56EB", "type": "SSD", "size": "56 EB", "speed": "3.8 TB/s", "wattage": 45 },
        { "name": "Samsung 60EB Pro", "type": "SSD", "size": "60 EB", "speed": "3.8 TB/s", "wattage": 48 },
        { "name": "Seagate Barracuda 64EB", "type": "SSD", "size": "64 EB", "speed": "3.8 TB/s", "wattage": 50 },
        { "name": "Western Digital Black SN14000 72EB", "type": "SSD", "size": "72 EB", "speed": "3.8 TB/s", "wattage": 53 },
        { "name": "Western Digital Caviar 80EB", "type": "SSD", "size": "80 EB", "speed": "3.8 TB/s", "wattage": 55 },
        { "name": "Samsung 84EB Pro", "type": "SSD", "size": "84 EB", "speed": "3.8 TB/s", "wattage": 58 },
        { "name": "Seagate Barracuda 88EB", "type": "SSD", "size": "88 EB", "speed": "3.8 TB/s", "wattage": 60 },
        { "name": "Western Digital Black SN15000 96EB", "type": "SSD", "size": "96 EB", "speed": "82.5 TB/s", "wattage": 75 },
        { "name": "Western Digital Caviar 112EB", "type": "SSD", "size": "112 EB", "speed": "82.5 TB/s", "wattage": 80 },
        { "name": "Samsung 120EB Pro", "type": "SSD", "size": "120 EB", "speed": "82.5 TB/s", "wattage": 85 },
        { "name": "Seagate Barracuda 128EB", "type": "SSD", "size": "128 EB", "speed": "82.5 TB/s", "wattage": 90 },
        { "name": "Western Digital Black SN16000 144EB", "type": "SSD", "size": "144 EB", "speed": "82.5 TB/s", "wattage": 95 },
        { "name": "Western Digital Caviar 160EB", "type": "SSD", "size": "160 EB", "speed": "91.8 PB/s", "wattage": 2 },
        { "name": "Samsung 168EB Pro", "type": "SSD", "size": "168 EB", "speed": "91.8 PB/s", "wattage": 2.5 },
        { "name": "Seagate Barracuda 176EB", "type": "SSD", "size": "176 EB", "speed": "91.8 PB/s", "wattage": 3 },
        { "name": "Western Digital Black SN17000 192EB", "type": "SSD", "size": "192 EB", "speed": "91.8 PB/s", "wattage": 3 },
        { "name": "Western Digital Caviar 208EB", "type": "SSD", "size": "208 EB", "speed": "91.8 PB/s", "wattage": 3 },
        { "name": "Samsung 216EB Pro", "type": "SSD", "size": "216 EB", "speed": "91.8 PB/s", "wattage": 3 },
        { "name": "Seagate Barracuda 224EB", "type": "SSD", "size": "224 EB", "speed": "91.8 PB/s", "wattage": 3.5 },
        { "name": "Western Digital Black SN18000 240EB", "type": "SSD", "size": "240 EB", "speed": "91.8 PB/s", "wattage": 4 },
        { "name": "Western Digital Caviar 256EB", "type": "SSD", "size": "256 EB", "speed": "91.8 PB/s", "wattage": 5 }
    ],
    "monitor": [
        { "name": "Acer 14 CRT", "type": "CRT", "resolution": "640 × 480", "aspect": "4:3", "refresh": "60 Hz", "depth": "6-bit" },
        { "name": "Samsung SyncMaster 710N", "type": "CRT", "resolution": "800 × 600", "aspect": "4:3", "refresh": "75 Hz", "depth": "8-bit" },
        { "name": "ViewSonic E90f+", "type": "CRT", "resolution": "800 × 600", "aspect": "4:3", "refresh": "85 Hz", "depth": "8-bit" },
        { "name": "ViewSonic P815", "type": "CRT", "resolution": "1024 × 768", "aspect": "4:3", "refresh": "85 Hz", "depth": "8-bit" },
        { "name": "Dell P991", "type": "CRT", "resolution": "1280 × 1024", "aspect": "5:4", "refresh": "85 Hz", "depth": "8-bit" },
        { "name": "Samsung SyncMaster 900NF", "type": "CRT", "resolution": "1600 × 1200", "aspect": "4:3", "refresh": "85 Hz", "depth": "8-bit" },
        { "name": "Mitsubishi Diamond Pro 2070", "type": "CRT", "resolution": "2048 × 1536", "aspect": "4:3", "refresh": "85 Hz", "depth": "8-bit" },
        { "name": "Dell S2419H", "type": "LCD", "resolution": "1920 × 1080", "aspect": "16:9", "refresh": "60 Hz", "depth": "8-bit" },
        { "name": "BenQ GW2480", "type": "LCD", "resolution": "1920 × 1080", "aspect": "16:9", "refresh": "60 Hz", "depth": "8-bit" },
        { "name": "Dell UltraSharp U2412M", "type": "LCD", "resolution": "1920 × 1080", "aspect": "16:9", "refresh": "60 Hz", "depth": "8-bit" },
        { "name": "ASUS VS228H", "type": "LCD", "resolution": "1920 × 1080", "aspect": "16:9", "refresh": "60 Hz", "depth": "8-bit" },
        { "name": "Dell P2219H", "type": "LCD", "resolution": "1920 × 1080", "aspect": "16:9", "refresh": "60 Hz", "depth": "8-bit" },
        { "name": "HP 24f", "type": "LCD", "resolution": "1920 × 1080", "aspect": "16:9", "refresh": "75 Hz", "depth": "8-bit" },
        { "name": "ASUS VG279Q", "type": "LCD", "resolution": "1920 × 1080", "aspect": "16:9", "refresh": "144 Hz", "depth": "8-bit" },
        { "name": "ASUS VG248QE", "type": "LCD", "resolution": "1920 × 1080", "aspect": "16:9", "refresh": "144 Hz", "depth": "8-bit" },
        { "name": "Samsung Odyssey G3", "type": "LCD", "resolution": "1920 × 1080", "aspect": "16:9", "refresh": "144 Hz", "depth": "8-bit" },
        { "name": "LG 27GN750-B", "type": "LCD", "resolution": "1920 × 1080", "aspect": "16:9", "refresh": "240 Hz", "depth": "8-bit" },
        { "name": "ASUS MX299", "type": "LCD", "resolution": "2560 × 1080", "aspect": "21:9", "refresh": "60 Hz", "depth": "8-bit" },
        { "name": "Dell UltraSharp U2719D", "type": "LCD", "resolution": "2560 × 1440", "aspect": "16:9", "refresh": "60 Hz", "depth": "8-bit" },
        { "name": "ASUS ROG Swift PG27VQ", "type": "LCD", "resolution": "2560 × 1440", "aspect": "16:9", "refresh": "120 Hz", "depth": "10-bit" },
        { "name": "ASUS ROG Strix XG279Q", "type": "LCD", "resolution": "2560 × 1440", "aspect": "16:9", "refresh": "144 Hz", "depth": "10-bit" },
        { "name": "Samsung Odyssey G7", "type": "LCD", "resolution": "2560 × 1440", "aspect": "16:9", "refresh": "240 Hz", "depth": "10-bit" },
        { "name": "Dell Alienware AW2521H", "type": "OLED", "resolution": "2560 × 1440", "aspect": "16:9", "refresh": "360 Hz", "depth": "10-bit" },
        { "name": "LG 34GN850-B", "type": "LCD", "resolution": "3440 × 1440", "aspect": "21:9", "refresh": "144 Hz", "depth": "10-bit" },
        { "name": "BenQ PD3220U", "type": "LCD", "resolution": "3840 × 2160", "aspect": "16:9", "refresh": "60 Hz", "depth": "10-bit" },
        { "name": "LG 27UK850-W", "type": "LCD", "resolution": "3840 × 2160", "aspect": "16:9", "refresh": "60 Hz", "depth": "10-bit" },
        { "name": "LG UltraFine 32UN880-B", "type": "LCD", "resolution": "3840 × 2160", "aspect": "16:9", "refresh": "60 Hz", "depth": "10-bit" },
        { "name": "ASUS ProArt PA32UCX", "type": "OLED", "resolution": "3840 × 2160", "aspect": "16:9", "refresh": "120 Hz", "depth": "10-bit" },
        { "name": "ASUS ROG Swift PG32UQX", "type": "OLED", "resolution": "3840 × 2160", "aspect": "16:9", "refresh": "144 Hz", "depth": "10-bit" },
        { "name": "LG OLED88Z9PUA", "type": "OLED", "resolution": "7680 × 4320", "aspect": "16:9", "refresh": "60 Hz", "depth": "10-bit" },
        { "name": "Samsung QN900A", "type": "OLED", "resolution": "7680 × 4320", "aspect": "16:9", "refresh": "120 Hz", "depth": "10-bit" },
        { "name": "ASUS ROG Swift PG32UQ", "type": "OLED", "resolution": "7680 × 4320", "aspect": "16:9", "refresh": "144 Hz", "depth": "10-bit" },
        { "name": "Samsung Odyssey Neo G9", "type": "OLED", "resolution": "7680 × 2160", "aspect": "32:9", "refresh": "240 Hz", "depth": "10-bit" }
    ],
    "fan": [
        { "name": "Intel Stock Fan (Pentium D)", "speed": "1800 RPM", "airflow": "28 CFM", "noise": "29 dB", "wattage": 3 },
        { "name": "Intel Stock Fan (Pentium 4)", "speed": "2500 RPM", "airflow": "30 CFM", "noise": "34 dB", "wattage": 4 },
        { "name": "Intel Stock Fan (Pentium II)", "speed": "3000 RPM", "airflow": "20 CFM", "noise": "27 dB", "wattage": 3 },
        { "name": "Vantec Aeroflow VA4-C7040", "speed": "5600 RPM", "airflow": "35 CFM", "noise": "37 dB", "wattage": 6 },
        { "name": "Intel Stock Fan (Pentium III)", "speed": "3600 RPM", "airflow": "25 CFM", "noise": "28 dB", "wattage": 4 },
        { "name": "Alpha PAL6035", "speed": "5000 RPM", "airflow": "28 CFM", "noise": "36 dB", "wattage": 5 },
        { "name": "GlobalWin WBK38", "speed": "6800 RPM", "airflow": "38 CFM", "noise": "44 dB", "wattage": 8 },
        { "name": "Cooler Master DP5-6J31C", "speed": "4000 RPM", "airflow": "30 CFM", "noise": "25 dB", "wattage": 4 },
        { "name": "Spire CoolWave II", "speed": "2400 RPM", "airflow": "40 CFM", "noise": "25 dB", "wattage": 3 },
        { "name": "Thermaltake Volcano 7", "speed": "5500 RPM", "airflow": "30 CFM", "noise": "42 dB", "wattage": 7 },
        { "name": "Thermaltake Silent Boost", "speed": "3000 RPM", "airflow": "25 CFM", "noise": "19 dB", "wattage": 4 },
        { "name": "Cooler Master V8", "speed": "2200 RPM", "airflow": "60 CFM", "noise": "28 dB", "wattage": 5 },
        { "name": "Zalman CNPS7000B", "speed": "2500 RPM", "airflow": "35 CFM", "noise": "25 dB", "wattage": 4 },
        { "name": "Noctua NH-U12S", "speed": "1500 RPM", "airflow": "55 CFM", "noise": "18.6 dB", "wattage": 4 },
        { "name": "Cooler Master Hyper 212 EVO", "speed": "2000 RPM", "airflow": "42 CFM", "noise": "36 dB", "wattage": 5 },
        { "name": "Deepcool Gammaxx 400", "speed": "1800 RPM", "airflow": "50 CFM", "noise": "25 dB", "wattage": 4 },
        { "name": "ARCTIC Freezer 34 eSports DUO", "speed": "2100 RPM", "airflow": "68 CFM", "noise": "24 dB", "wattage": 4 },
        { "name": "be quiet! Pure Rock 2", "speed": "1500 RPM", "airflow": "50 CFM", "noise": "20.4 dB", "wattage": 3 },
        { "name": "Cryorig H7", "speed": "1200 RPM", "airflow": "50 CFM", "noise": "19.5 dB", "wattage": 4 },
        { "name": "Wraith Spire", "speed": "2400 RPM", "airflow": "55 CFM", "noise": "29 dB", "wattage": 7 },
        { "name": "Cooler Master MasterAir MA410M", "speed": "1600 RPM", "airflow": "40 CFM", "noise": "25 dB", "wattage": 5 },
        { "name": "Scythe Fuma 2", "speed": "1400 RPM", "airflow": "60 CFM", "noise": "22 dB", "wattage": 4 },
        { "name": "be quiet! Dark Rock 4", "speed": "1400 RPM", "airflow": "60 CFM", "noise": "24.4 dB", "wattage": 4 },
        { "name": "Thermalright Macho Rev.B", "speed": "1400 RPM", "airflow": "70 CFM", "noise": "22 dB", "wattage": 4 },
        { "name": "Cooler Master MasterLiquid ML240L RGB", "speed": "2000 RPM", "airflow": "70 CFM", "noise": "30 dB", "wattage": 8 },
        { "name": "Corsair H100i RGB Platinum", "speed": "2400 RPM", "airflow": "75 CFM", "noise": "36 dB", "wattage": 6 },
        { "name": "NZXT Kraken X62", "speed": "2000 RPM", "airflow": "73 CFM", "noise": "30 dB", "wattage": 5 },
        { "name": "ARCTIC Liquid Freezer II 280", "speed": "1900 RPM", "airflow": "78 CFM", "noise": "26 dB", "wattage": 6 },
        { "name": "Corsair iCUE H150i Elite Capellix", "speed": "2000 RPM", "airflow": "75 CFM", "noise": "36 dB", "wattage": 6 },
        { "name": "Deepcool Castle 360EX", "speed": "2000 RPM", "airflow": "72 CFM", "noise": "30 dB", "wattage": 8 },
        { "name": "Thermalright Le Grand Macho RT", "speed": "1400 RPM", "airflow": "68 CFM", "noise": "21 dB", "wattage": 4 },
        { "name": "Fractal Design Celsius S24", "speed": "2400 RPM", "airflow": "100 CFM", "noise": "36 dB", "wattage": 6 },
        { "name": "Cooler Master MasterLiquid ML360R RGB", "speed": "2000 RPM", "airflow": "75 CFM", "noise": "36 dB", "wattage": 8 },
        { "name": "be quiet! Dark Loop 360", "speed": "2000 RPM", "airflow": "78 CFM", "noise": "28 dB", "wattage": 8 },
        { "name": "Thermaltake Floe DX 360", "speed": "2000 RPM", "airflow": "80 CFM", "noise": "30 dB", "wattage": 8 },
        { "name": "Corsair H115i RGB Platinum", "speed": "2400 RPM", "airflow": "70 CFM", "noise": "35 dB", "wattage": 6 },
        { "name": "ARCTIC Liquid Freezer II 360", "speed": "2000 RPM", "airflow": "70 CFM", "noise": "25 dB", "wattage": 6 },
        { "name": "Alphacool Eisbaer 360", "speed": "1800 RPM", "airflow": "65 CFM", "noise": "30 dB", "wattage": 8 },
        { "name": "NZXT Kraken Z63", "speed": "2000 RPM", "airflow": "75 CFM", "noise": "30 dB", "wattage": 6 },
        { "name": "Cooler Master MasterLiquid ML240R RGB", "speed": "2000 RPM", "airflow": "70 CFM", "noise": "30 dB", "wattage": 8 },
        { "name": "be quiet! Dark Rock Pro 4", "speed": "1500 RPM", "airflow": "60 CFM", "noise": "24.4 dB", "wattage": 4 },
        { "name": "Noctua NH-D15S", "speed": "1400 RPM", "airflow": "82 CFM", "noise": "19.2 dB", "wattage": 6 },
        { "name": "Thermalright Silver Arrow ITX", "speed": "1500 RPM", "airflow": "80 CFM", "noise": "25 dB", "wattage": 6 },
        { "name": "Enermax Liqmax III 240", "speed": "2000 RPM", "airflow": "70 CFM", "noise": "36 dB", "wattage": 6 },
        { "name": "Thermaltake Toughfan 12 Turbo", "speed": "2500 RPM", "airflow": "72 CFM", "noise": "40 dB", "wattage": 6 },
        { "name": "ID-COOLING AURAFLOW X 240", "speed": "1800 RPM", "airflow": "66 CFM", "noise": "35 dB", "wattage": 5 },
        { "name": "Scythe Mugen 5 Rev.B", "speed": "1400 RPM", "airflow": "51 CFM", "noise": "24 dB", "wattage": 4 },
        { "name": "Thermaltake Riing Trio 12 RGB", "speed": "2000 RPM", "airflow": "60 CFM", "noise": "30 dB", "wattage": 6 },
        { "name": "Noctua NH-D15", "speed": "1400 RPM", "airflow": "82 CFM", "noise": "19.2 dB", "wattage": 6 }
    ]
};

function showScreen(screenElement) {
    if (devLogoScreen.classList.contains('active') && screenElement !== devLogoScreen) {
        return;
    }

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screenElement.classList.add('active');

    titleMusic.pause();
    gameMusic.pause();

    if (screenElement === titleScreen || screenElement === settingsScreen) {
        resizeTitleCanvas();
        startTitleAnimation();
        titleMusic.play().catch(e => console.error("Error playing title music:", e));
    } else {
        stopTitleAnimation();
    }

    if (screenElement === gameScreen) {
        const randomSong = playlist[Math.floor(Math.random() * playlist.length)];
        gameMusic.src = `media/audio/music/${randomSong}`;
        gameMusic.play().catch(e => console.error("Error playing game music:", e));
        if (!gameLoopStarted) {
            gameLoopStarted = true;
            startGameLoop();
        }
    }
}

const splashes = ["Now with more bits!", "Also try Marmora!", "Upgrade everything!", "It's not much, but it's honest work.", "From humble beginnings...", "Where did I put that thermal paste?"];
const randomSplash = Math.floor(Math.random() * splashes.length);
if(titleSplash) titleSplash.textContent = splashes[randomSplash];

function playSound(soundElement, volume) {
    try {
        const sound = soundElement.cloneNode();
        sound.volume = volume;
        sound.currentTime = 0;
        sound.play().catch(e => console.warn(`Error playing sound: ${e}`));
    } catch (e) {
        console.warn(`Error cloning sound: ${e}`);
    }
}

function saveAudioSettings() {
    localStorage.setItem('nibblAudioSettings', JSON.stringify(audioSettings));
}

function applyAudioSettings() {
    titleMusic.volume = audioSettings.master * audioSettings.music;
    gameMusic.volume = audioSettings.master * audioSettings.music;
    tapSound.volume = audioSettings.master * audioSettings.sfx;
}

function updateSettingsUI() {
    if (masterVolumeSlider) {
        masterVolumeSlider.value = audioSettings.master;
        masterVolumeValue.textContent = `${Math.round(audioSettings.master * 100)}%`;
    }
    if (musicVolumeSlider) {
        musicVolumeSlider.value = audioSettings.music;
        musicVolumeValue.textContent = `${Math.round(audioSettings.music * 100)}%`;
    }
    if (sfxVolumeSlider) {
        sfxVolumeSlider.value = audioSettings.sfx;
        sfxVolumeValue.textContent = `${Math.round(audioSettings.sfx * 100)}%`;
    }
    applyAudioSettings();
}

function resizeTitleCanvas() {
    if (!titleScreenCanvas) return;
    titleScreenCanvas.width = titleScreen.clientWidth;
    titleScreenCanvas.height = titleScreen.clientHeight;
    if (titleAnimationId);
}

function titleAnimationLoop() {
    if (!titleAnimationId) return;
    titleAnimationId = requestAnimationFrame(titleAnimationLoop);
}

function startTitleAnimation() {
    if (!titleAnimationId && titleScreenCtx) {
        titleAnimationId = requestAnimationFrame(titleAnimationLoop);
    }
}

function stopTitleAnimation() {
    if (titleAnimationId) {
        cancelAnimationFrame(titleAnimationId);
        titleAnimationId = null;
    }
}

devLogoScreen.addEventListener('click', () => {
    playSound(selectSound, audioSettings.master * audioSettings.sfx);
    devLogoScreen.style.display = 'none';
    devLogoScreen.classList.remove('active');
    showScreen(titleScreen);
}, { once: true });

playBtn.addEventListener('click', () => {
    playSound(selectSound, audioSettings.master * audioSettings.sfx);
    showScreen(gameScreen);
});

goToSettingsBtn.addEventListener('click', () => {
    playSound(selectSound, audioSettings.master * audioSettings.sfx);
    showScreen(settingsScreen);
});

backToTitleFromSettingsBtn.addEventListener('click', () => {
    playSound(selectSound, audioSettings.master * audioSettings.sfx);
    showScreen(titleScreen);
});

document.querySelectorAll('.titleScreenSelection').forEach(element => {
    element.addEventListener('mouseenter', () => playSound(tickSound, audioSettings.master * audioSettings.sfx));
});

if (masterVolumeSlider) {
    masterVolumeSlider.addEventListener('input', (e) => {
        audioSettings.master = parseFloat(e.target.value);
        saveAudioSettings();
        applyAudioSettings();
        updateSettingsUI();
    });
}
if (musicVolumeSlider) {
    musicVolumeSlider.addEventListener('input', (e) => {
        audioSettings.music = parseFloat(e.target.value);
        saveAudioSettings();
        applyAudioSettings();
        updateSettingsUI();
    });
}
if (sfxVolumeSlider) {
    sfxVolumeSlider.addEventListener('input', (e) => {
        audioSettings.sfx = parseFloat(e.target.value);
        saveAudioSettings();
        applyAudioSettings();
        updateSettingsUI();
    });
}

window.addEventListener('resize', resizeTitleCanvas);

function saveGame() {
    const gameState = {
        credits: credits,
        hardware: hardware,
        hardwareUpgrade: hardwareUpgrade
    };
    try {
        localStorage.setItem('nibblSaveData', JSON.stringify(gameState));
    } catch (e) {
        console.error("Failed to save game state:", e);
    }
}

function loadGame() {
    const savedStateJSON = localStorage.getItem('nibblSaveData');
    if (savedStateJSON) {
        try {
            const savedState = JSON.parse(savedStateJSON);
            credits = savedState.credits || 0;
            Object.assign(hardware, savedState.hardware);
            Object.assign(hardwareUpgrade, savedState.hardwareUpgrade);
        } catch (e) {
            console.error("Failed to load or parse saved game state:", e);
        }
    }
}

function updateAllHardwareUI() {
    const parts = ['cpu', 'gpu', 'ram', 'motherboard', 'psu', 'storage', 'monitor', 'fan'];
    parts.forEach(part => {
        updateHardwareUI(part);
    });
}

function formatRamCapacity(capacityInGB) {
    if (capacityInGB < (1 / 1024)) {
        return `${(capacityInGB * 1024 * 1024).toFixed(0)} KB`;
    } else if (capacityInGB < 1) {
        return `${(capacityInGB * 1024).toFixed(0)} MB`;
    } else if (capacityInGB < 1024) {
        return `${capacityInGB.toFixed(2).replace(/\.00$/, '')} GB`;
    } else if (capacityInGB < 1048576) {
        return `${(capacityInGB / 1024).toFixed(2).replace(/\.00$/, '')} TB`;
    } else if (capacityInGB < 1073741824) {
        return `${(capacityInGB / 1048576).toFixed(2).replace(/\.00$/, '')} PB`;
    } else if (capacityInGB < 1099511627776) {
        return `${(capacityInGB / 1073741824).toFixed(2).replace(/\.00$/, '')} EB`;
    } else {
        return `${(capacityInGB / 1099511627776).toFixed(2).replace(/\.00$/, '')} ZB`;
    }
}

function updateHardwareUI(part) {
    const currentPart = hardware[part];
    if (!currentPart) return;

    document.getElementById(`${part}Name`).textContent = currentPart.name;

    if (document.getElementById(`${part}Wattage`)) {
        document.getElementById(`${part}Wattage`).textContent = `${currentPart.wattage} W`;
    }

    if (currentPart.production !== undefined && document.getElementById(`${part}Production`)) {
        document.getElementById(`${part}Production`).textContent = `${formatCredits(currentPart.production)} cps`;
    }

    switch (part) {
        case 'cpu':
            document.getElementById('cpuClock').innerText = currentPart.clock;
            document.getElementById('cpuCores').innerText = currentPart.cores;
            break;
        case 'gpu':
            document.getElementById('gpuVram').innerText = currentPart.vram;
            document.getElementById('gpuClock').innerText = currentPart.clock;
            break;
        case 'ram':
            document.getElementById('ramCapacity').innerText = formatRamCapacity(currentPart.capacity);
            document.getElementById('ramType').innerText = currentPart.type;
            document.getElementById('ramSpeed').innerText = `${currentPart.speed} MHz`;
            break;
        case 'motherboard':
            document.getElementById('motherboardChipset').innerText = currentPart.chipset;
            document.getElementById('motherboardRam').innerText = currentPart.type;
            document.getElementById('motherboardMaxRamSpeed').innerText = `${currentPart.maxSpeed} MHz`;
            break;
        case 'storage':
            document.getElementById('storageSize').innerText = currentPart.size;
            document.getElementById('storageType').innerText = currentPart.type;
            document.getElementById('storageSpeed').innerText = currentPart.speed;
            break;
        case 'monitor':
            document.getElementById('monitorType').innerText = currentPart.type;
            document.getElementById('monitorResolution').innerText = currentPart.resolution;
            document.getElementById('monitorAspect').innerText = currentPart.aspect;
            document.getElementById('monitorRefresh').innerText = currentPart.refresh;
            document.getElementById('monitorDepth').innerText = currentPart.depth;
            break;
        case 'fan':
            document.getElementById('fanSpeed').innerText = currentPart.speed;
            document.getElementById(`fanAirflow`).textContent = currentPart.airflow;
            document.getElementById(`fanNoise`).textContent = currentPart.noise;
            break;
    }
}

for(let i = 0; i < hardwareUpgrade.cpu.length; i++) {
    hardwareUpgrade.cpu[i].price = Math.ceil(8 * (Math.pow(1.639, i + 1)));
    hardwareUpgrade.cpu[i].production = Math.ceil(.35 * (Math.pow(1.6375, i + 1)));
}
for(let i = 0; i < hardwareUpgrade.gpu.length; i++) {
    hardwareUpgrade.gpu[i].price = Math.ceil(9 * (Math.pow(1.66, i + 1)));
    hardwareUpgrade.gpu[i].production = Math.ceil(.36 * (Math.pow(1.659, i + 1)));
}
for(let i = 0; i < hardwareUpgrade.ram.length; i++) {
    hardwareUpgrade.ram[i].price = Math.ceil(8 * (Math.pow(2.193, i + 1)));
    hardwareUpgrade.ram[i].production = Math.ceil(.12 * (Math.pow(2.19175, i + 1)));
}
for(let i = 0; i < hardwareUpgrade.motherboard.length; i++) {
    hardwareUpgrade.motherboard[i].price = Math.ceil(26 * (Math.pow(2.015, i + 1)));
    hardwareUpgrade.motherboard[i].production = 0;
}
for(let i = 0; i < hardwareUpgrade.psu.length; i++) {
    hardwareUpgrade.psu[i].price = Math.ceil(775 * (Math.pow(1.985, i + 1)));
    hardwareUpgrade.psu[i].production = 0;
}
for(let i = 0; i < hardwareUpgrade.storage.length; i++) {
    hardwareUpgrade.storage[i].price = Math.ceil(8 * (Math.pow(1.85, i + 1)));
    hardwareUpgrade.storage[i].production = Math.ceil(.1 * (Math.pow(1.847, i + 1)));
}
for(let i = 0; i < hardwareUpgrade.monitor.length; i++) {
    hardwareUpgrade.monitor[i].price = Math.ceil(8 * (Math.pow(6.35, i + 1)));
    hardwareUpgrade.monitor[i].production = Math.ceil(.07 * (Math.pow(6.345, i + 1)));
}
for(let i = 0; i < hardwareUpgrade.fan.length; i++) {
    hardwareUpgrade.fan[i].price = Math.ceil(8.45 * (Math.pow(1.9815, i + 1)));
    hardwareUpgrade.fan[i].production = 0;
}

function formatCredits(number) {
    if (number < 1000) {
       return number % 1 === 0 ? number.toString() : number.toFixed(2);
    }
    const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc", "Vg", "UVg", "DVg", "TVg", "QaVg", "QiVg", "SxVg", "SpVg", "OcVg", "NoVg", "Tg", "UTg", "DTg", "TTg", "QaTg", "QiTg", "SxTg", "SpTg", "OcTg", "NoTg", "Qd", "UQd", "DQd", "TQd", "QaQd", "QiQd", "SxQd", "SpQd", "OcQd", "NoQd", "Qn", "UQn", "DQn", "TQn", "QaQn", "QiQn", "SxQn", "SpQn", "OcQn", "NoQn", "Se", "USe", "DSe", "TSe", "QaSe", "QiSe", "SxSe", "SpSe", "OcSe", "NoSe", "Sg", "USg", "DSg", "TSg", "QaSg", "QiSg", "SxSg", "SpSg", "OcSg", "NoSg", "Og", "UOg", "DOg", "TOg", "QaOg", "QiOg", "SxOg", "SpOg", "OcOg", "NoOg", "Ng", "UNg", "DNg", "TNg", "QaNg", "QiNg", "SxNg", "SpNg", "OcNg", "NoNg", "Cn", "UCn", "DCn", "TCn"];
    let tier = Math.floor(Math.log10(number) / 3);
    if (tier < suffixes.length) {
        let suffix = suffixes[tier];
        let scale = Math.pow(10, tier * 3);
        let scaledNumber = number / scale;
        return scaledNumber.toFixed(2) + suffix;
    }
    return number.toExponential(2);
}

function updateCreditRate() {
    const creditRate = hardware.cpu.production + hardware.gpu.production + hardware.storage.production + hardware.ram.production + hardware.monitor.production;
    document.getElementById("rate").textContent = formatCredits(creditRate) + ' / second';
}

function updateCredits(deltaTime) {
    const creditRate = hardware.cpu.production + hardware.gpu.production + hardware.storage.production + hardware.ram.production + hardware.monitor.production;
    credits += creditRate * deltaTime;
    document.getElementById("credits").textContent = formatCredits(Math.floor(credits));
}

function updateUpgradeButtons() {
    const parts = ['cpu', 'gpu', 'ram', 'motherboard', 'psu', 'storage', 'monitor', 'fan'];
    parts.forEach(part => {
        const button = document.getElementById(`upgrade${part}`);
        const nextUpgrade = hardwareUpgrade[part] && hardwareUpgrade[part].length > 0 ? hardwareUpgrade[part][0] : null;
        if (button) {
            if (nextUpgrade) {
                button.textContent = 'Upgrade (' + formatCredits(nextUpgrade.price) + ' Credits)';
                button.disabled = credits < nextUpgrade.price;
            } else {
                button.textContent = '(Max)';
                button.disabled = true;
            }
        }
    });
}

function playTapSound() {
    tapSound.volume = audioSettings.master * audioSettings.sfx;
    tapSound.currentTime = 0;
    tapSound.play();
}

function setupButtonListeners() {
    const parts = ['cpu', 'gpu', 'ram', 'motherboard', 'psu', 'storage', 'monitor', 'fan'];
    parts.forEach(part => {
        const button = document.getElementById(`upgrade${part}`);
        if (button) {
            button.addEventListener('click', () => {
                playTapSound();
                upgrade(part);
            });
        }
    });
}

function upgrade(part) {
    const upgradeOptions = hardwareUpgrade[part];
    if (!upgradeOptions || upgradeOptions.length === 0) return;

    const upgradeItem = upgradeOptions[0];
    if (credits < upgradeItem.price) return;

    let totalWattage = 0;
    for (const key in hardware) {
        if (key !== 'psu' && hardware[key].wattage) {
            totalWattage += hardware[key].wattage;
        }
    }
    totalWattage -= hardware[part].wattage || 0;
    totalWattage += upgradeItem.wattage || 0;

    if (part !== 'psu' && totalWattage > hardware.psu.wattage) {
        const button = document.getElementById(`upgrade${part}`);
        if(button) {
            button.style.backgroundColor = 'darkred';
            setTimeout(() => {
                if(button) button.style.backgroundColor = '';
            }, 1000);
        }
        return;
    }

    credits -= upgradeItem.price;
    hardware[part] = { ...upgradeItem }; 
    upgradeOptions.shift(); 

    updateHardwareUI(part);
    updateCreditRate();
    updateUpgradeButtons();
}

function checkUpgrades() {
    const parts = ['cpu', 'gpu', 'ram', 'motherboard', 'psu', 'storage', 'monitor', 'fan'];
    parts.forEach(part => {
        const button = document.getElementById(`upgrade${part}`);
        if (!button) return;
        const upgradeItem = hardwareUpgrade[part] && hardwareUpgrade[part].length > 0 ? hardwareUpgrade[part][0] : null;
        if (upgradeItem) button.disabled = credits < upgradeItem.price;
    });
}

function startGameLoop() {
    let lastTime = 0;
    function gameLoop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = (timestamp - lastTime) / 1000;
        lastTime = timestamp;
        updateCredits(deltaTime);
        updateCreditRate();
        updateUpgradeButtons();
        checkUpgrades();
        requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
}

function scaleUI() {
    const baseWidth = 1920;
    const baseHeight = 1080;

    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;

    const scale = Math.min(currentWidth / baseWidth, currentHeight / baseHeight);

    const hardwareGrid = document.querySelector(".hardware-grid");
    if (hardwareGrid) {
        hardwareGrid.style.transform = `scale(${scale})`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    updateSettingsUI();
    setupButtonListeners();
    updateAllHardwareUI();
    updateUpgradeButtons();
    updateCreditRate();
    scaleUI();
    setInterval(saveGame, 5000);
});

window.addEventListener('resize', scaleUI);