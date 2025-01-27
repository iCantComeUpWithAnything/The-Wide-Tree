addLayer("A", {
    name: "CPU", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CPU", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#5C5C5C",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Bits", // Name of prestige currency
    baseResource: "Hertz", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('A', 13)) mult = mult.times(upgradeEffect('A', 13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for Bits", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    doReset(ThisLayer) {
        if (layers[ThisLayer].row > this.row) {
            let keep = [];
            layerDataReset("A", keep)
        }
    },
    tabFormat: {
        "Main":  {
            content: [
                "main-display",
                "prestige-button", 
                "blank",
                ["display-text", function() {
                    return 'You have ' + format(player.points) + ' Hertz'
                }],
                "blank",
                ["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13]]]
            ]
        },
        "Architecture": {
            content: [
                "main-display",
                "prestige-button", 
                "blank",
                ["display-text", function() {
                    return 'You have ' + format(player.points) + ' Hertz'
                }],
                "blank",
                ["row", [["buyable", 11]]],
            ]
        }
    },
    upgrades: {
        11: {
            title: "Better Architecture.",
            description: "Make a new CPU Die for better performance.",
            cost: new Decimal(2),
            tooltip: "Hertz*2",
        },
        12: {
            title: "Parallelism.",
            description: "Instead of making a new CPU, simply add another one.",
            cost: new Decimal(5),
            tooltip: "(Bits+1)^0.5",
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"},
        },
        13: {
            title: "Smaller = Better",
            description: "A New 20 µm Architecture CPU.",
            cost: new Decimal(5),
            tooltip: "(Hertz+1)^0.15",
            effect() {
                return player.points.add(1).pow(0.15)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x"},
        }
    },
    buyables:  {
        11:  {
            cost(x) {return new Decimal(1).mul(x)},
            display() {return "Cost: "+format()+"<br>Current Cores: "
                        +format(player[this.layer].buyables[this.id], 0)+
                        "<br>The more cores you have, the more Hertz you get."},
            title() {return "More Cores"},
            canAfford() {return player[this.layer].points.gte(this.cost())},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {return new Decimal(128)}
        },
    },
})