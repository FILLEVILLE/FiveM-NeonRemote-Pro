Config = {}
Config.Locale = 'sv' -- Choose 'sv' or 'en'

Config.RGBBlinkSpeed = 2000 -- Speed of RGB color cycling in milliseconds (2000 = 2 second) 
Config.RGBRandomBrightness = true

Config.Presets = {
    ['s1'] = {r = 100, g = 0, b = 0},
    ['s2'] = {r = 0, g = 255, b = 0},
    ['s3'] = {r = 0, g = 0, b = 255},
}

Config.EnabledNeonSides = {0, 1, 2, 3}
Config.AllowCustomColor = true