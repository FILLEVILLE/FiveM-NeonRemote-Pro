local ESX = exports['es_extended']:getSharedObject()

RegisterNetEvent('neon:useController', function()
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsIn(ped, false)
    
    if not veh or veh == 0 then
        ESX.ShowNotification(_L('not_in_veh'))
        return 
    end

    local plate = GetVehicleNumberPlateText(veh):gsub("^%s*(.-)%s*$", "%1")

    local isGlowing = false
    for i = 0, 3 do
        if IsVehicleNeonLightEnabled(veh, i) then isGlowing = true break end
    end

    ESX.TriggerServerCallback('neon_controller:checkNeonDatabase', function(hasNeonInDB)

        if isGlowing and not hasNeonInDB then
            TriggerServerEvent('neon_controller:registerNeonHardware', plate)
            hasNeonInDB = true
        end

        if hasNeonInDB then
            SetNuiFocus(true, true)
            SendNUIMessage({ 
                action = 'open',
                config = Config,
                neonActive = isGlowing, 
                locales = {
                    title = _L('ui_title'),
                    s_minus = _L('ui_s_minus'),
                    s_plus = _L('ui_s_plus'),
                    custom = _L('ui_custom_paint'),
                    rgb = _L('ui_rgb'),
                    stop = _L('ui_stop'),
                    start = _L('ui_start')
                }
            })
        else
            ESX.ShowNotification(_L('no_neon'))
        end
    end, plate)
end)

RegisterNUICallback('close', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)

RegisterNUICallback('applyNeon', function(data, cb)
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsIn(ped, false)
    
    if veh ~= 0 then
        if data.r == 0 and data.g == 0 and data.b == 0 then
            for i = 0, 3 do SetVehicleNeonLightEnabled(veh, i, false) end
        else
            for i = 0, 3 do SetVehicleNeonLightEnabled(veh, i, true) end
            SetVehicleNeonLightsColour(veh, math.floor(data.r), math.floor(data.g), math.floor(data.b))
        end
    end
    cb('ok')
end)