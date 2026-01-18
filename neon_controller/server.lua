local ESX = exports['es_extended']:getSharedObject()

ESX.RegisterUsableItem('neons_controller', function(source)
    TriggerClientEvent('neon:useController', source)
end)

ESX.RegisterServerCallback('neon_controller:checkNeonDatabase', function(source, cb, plate)
    MySQL.query('SELECT has_neon FROM vehicle_neon WHERE plate = ?', { plate }, function(results)
        if results and results[1] then
            local hasNeon = tonumber(results[1].has_neon) == 1
            cb(hasNeon)
        else
            cb(false)
        end
    end)
end)

RegisterNetEvent('neon_controller:registerNeonHardware', function(plate)
    MySQL.execute('INSERT INTO vehicle_neon (plate, has_neon) VALUES (?, 1) ON DUPLICATE KEY UPDATE has_neon = 1', { plate }, function(affectedRows)
        if affectedRows then
            print(("[NEON-SERVER] Databas uppdaterad för plåt: %s"):format(plate))
        end
    end)
end)