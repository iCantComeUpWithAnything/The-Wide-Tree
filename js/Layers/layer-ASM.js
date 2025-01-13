addLayer("B", {
    name: "ASM", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ASM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FF4A4A",
    requires: new Decimal(600000), // Can be a function that takes requirement increases into account
    resource: "Instructions", // Name of prestige currency
    baseResource: "Bits", // Name of resource prestige is based on
    baseAmount() {return player.A.points}, // Get the current amount of baseResource
    branches: ["A"],
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
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for Bits", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.A.unlocked},
})