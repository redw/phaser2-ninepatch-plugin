import "./phaser";
import { NinePatchPlugin } from "../src";

export default class Game extends Phaser.Game {
    public centerX: number;
    public centerY: number;
    constructor(width?: string | number, height?: string | number, renderer?: number, parent?: any, state?: any) {
        super(width, height, renderer, parent, state);
    }
}

function preload() {
    console.log("preload");
    this.game.plugins.add(NinePatchPlugin);

    this.load.ninePatch("metalPanel_blueCorner", "static/assets/metalPanel_blueCorner.png", 32, 11, 53, 11);
    this.load.image("squareGreen", "static/assets/squareGreen.png");
    // this.load.image("squareYellow", "static/assets/squareYellow.png");
}

function create() {
    this.cache.addNinePatch("squareGreen", {
        bottom: 14, // Amount of pixels for bottom
        left: 6, // Amount of pixels for left
        right: 6, // Amount of pixels for right
        top: 10 // Amount of pixels for top
    });
    this.add.ninePatch(200, 200, "metalPanel_blueCorner", null, 300, 300);
    this.squareGreen = this.add.ninePatch(100, 100, "squareGreen", null, 100, 50);
    this.squareGreen.anchor.setTo(0.5);
    setTimeout(() => {
        this.squareGreen.resize(200, 100);
    }, 5000);
}

function update() {
    this.squareGreen.angle += 1;
}

document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        (window as any).game = new Game(800, 600, Phaser.CANVAS, null, { create, preload, update });
    }
};
