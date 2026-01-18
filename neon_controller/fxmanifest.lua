fx_version 'cerulean'
game 'gta5'
author 'FILLE'
description 'Neon Control where you can control your neon color'
version '1.0.0'

shared_scripts {
    '@es_extended/imports.lua',
    'config.lua',
    'locales/sv.lua',
    'locales/en.lua', 
    'locale.lua' 
}

client_scripts {
    'client.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server.lua'
}

ui_page 'html/index.html'
files {
    'html/index.html',
    'html/style.css',
    'html/script.js'
}