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

<img width="107" height="110" alt="image" src="https://github.com/user-attachments/assets/79bcb6bc-c7ea-4da8-8150-1d398cc43c0b" />
<img width="231" height="381" alt="image" src="https://github.com/user-attachments/assets/227d1fec-1887-4f54-9dc8-3952b0486d4d" />
<img width="232" height="245" alt="image" src="https://github.com/user-attachments/assets/c590deea-d643-49a8-aa64-96aa9af368a3" />
<img width="217" height="67" alt="image" src="https://github.com/user-attachments/assets/c64f7c71-3e4e-4eac-bb3d-015b84efa4af" />


