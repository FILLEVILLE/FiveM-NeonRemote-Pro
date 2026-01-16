Here is a professional and advanced README.md that you can use for your script. It covers everything from installation to technical logic and troubleshooting.

🌈 Neon Controller (ESX)
An advanced and user-friendly solution for controlling vehicle neon via an interactive remote control (NUI). The script includes persistent storage in the database, RGB disco mode and customizable shortcuts.

✨ Features
Persistent Hardware: The script saves information about which vehicles have neon installed in a SQL database.

Interactive NUI: A modern remote control with color wheel to select exact colors.

Self-Healing System: If a vehicle has physical neon but is missing from the database, it is automatically registered upon use.

Brightness (1-10): Adjust the intensity of the neon directly via the controller.

RGB Disco: Dynamic mode that switches between random colors based on the configured speed.

Presets (S1-S3): Three preset buttons for your favorite colors.

Multilingual Support: Built-in support for both Swedish and English.

🛠 Installation
1. Requirements
es_extended
ox_inventory 
oxmysql

2. Database Setup
Run the following SQL code in your database to create the necessary table for hardware registration:

SQL

CREATE TABLE IF NOT EXISTS `vehicle_neon` (
`plate` varchar(20) NOT NULL,
`has_neon` int(11) DEFAULT 0,
PRIMARY KEY (`plate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
3. Resource Configuration
Place the neon_controller folder in your resources folder.

Make sure your fxmanifest.lua includes all language files in shared_scripts:

Lua

shared_scripts {
'config.lua',
'locales/sv.lua',
'locales/en.lua',
'locale.lua'}

Add ensure neon_controller to your server.cfg.

⚙️ Configuration (config.lua)

You can easily customize the script to your needs:

Config.Locale: Switch between 'sv' and 'en'.

Config.RGGBlinkSpeed: How fast the RGB mode changes color (in milliseconds).

Config.Presets: Change the RGB values ​​for the S1, S2 and S3 buttons.

🚀 Usage
To open the controller, you need the neons_controller item.

Get into a vehicle.

Use the item in your inventory.

If the vehicle has neon installed (in the database or physically), the remote control will appear on the screen.

🔧 Troubleshooting
"Locale [en] does not exist": Check that locales/en.lua is added to fxmanifest.lua.

Menu does not open: Make sure you have run the SQL file and that the vehicle actually has neon mounted.

"Could not load resource": Check that the folder is named exactly neon_controller and that no extra subfolders were created during unpacking.