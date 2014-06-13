// This script will apply the provided settings on all the items of given type in the project
// if applicable
var settings = {
    //time: 30, // in seconds
    //width:720
    //height:576
    //duration:30
    pixelAspect:1.09401709401709, // D1/DV Pal
    frameRate:25.0
};

var itemTypes = [ "Composition", "Footage" ];

function exceptionalSetting(item, x, val, type) {
    switch (type) {
        case "Footage":
            source = item.useProxy ? "proxySource" : "mainSource";
            switch (x) {
                case "frameRate":
                    if (!item.isStill && !item[source].isStill) {
                        item[source].conformFrameRate = val;
                        $.writeln("\"" + item.name + "\"." + x + " = " + val);
                    }
                    return true;
                case "time":
                    if (item.isStill) return true;
                    break;
                case "width":
                case "height":
                    if ("file" in item[source]) // filesource
                        return true;
                    break;
                case "duration":
                    return true;
            } // switch x
    } // switch type
    return false;
}

function applySettingsToItems(items, settings, itemTypes) {
    for (i=1; i<=items.length;i++) {
        item = items[i];
        type = item.typeName;
        for (it in itemTypes) {
            itemType=itemTypes[it];
            if (type == itemType) {
                for (x in settings) {
                    try {
                        if (!exceptionalSetting(item, x, settings[x], itemType) && x in item) {
                            item[x]=settings[x];
                            $.writeln("\"" + item.name + "\"." + x + " = " + settings[x]);
                        }
                    }
                    catch (err) {
                        $.writeln([err, item.name + "." + x]);
                    } // try ... catch
                } // for
                break; // from itemTypes
            }
        } // for itemTypes
    } // for items
    return true;
}

var items = app.project.items;
applySettingsToItems(items, settings, itemTypes);
