	["neons_controller"] = {
		label = "Neon Control where you can control your neon color",
		weight = 3,
		stack = true,
		close = true,
		client = {
			use = function(slot)
				TriggerEvent('neon:useController')
			end
		}
	},