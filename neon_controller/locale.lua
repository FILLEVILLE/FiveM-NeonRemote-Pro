local languages = {}

function _L(str, ...)
    local locale = Config.Locale or 'sv'
    if Locales[locale] then
        if Locales[locale][str] then
            return string.format(Locales[locale][str], ...)
        else
            return 'Translation [' .. locale .. '][' .. str .. '] does not exist'
        end
    else
        return 'Locale [' .. locale .. '] does not exist'
    end
end