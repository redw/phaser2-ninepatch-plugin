import { INinePatchCacheData, INinePatchGame } from "./NinePatchPlugin";

export class NinePatch extends Phaser.Sprite {
    /**
     * The eventual sizes of the container
     */
    public localWidth: number;
    public localHeight: number;

    /**
     * The sizes of the edges
     */
    private leftSize: number;
    private topSize: number;
    private rightSize: number;
    private bottomSize: number;

    /**
     * The original texture, unmodified
     */
    private baseTexture: PIXI.BaseTexture;
    private baseFrame: PIXI.Rectangle;

    constructor(
        game: INinePatchGame,
        x: number,
        y: number,
        key: string,
        frame: string,
        width: number,
        height: number,
        data?: INinePatchCacheData
    ) {
        super(game, x, y, key, frame);

        this.baseTexture = this.texture.baseTexture;
        this.baseFrame = this.texture.frame;

        if (frame !== null && !data) {
            data = game.cache.getNinePatch(frame);
        } else if (!data) {
            data = game.cache.getNinePatch(key);
        }

        if (undefined === data) {
            return;
        }

        this.topSize = data.top;
        this.leftSize = data.left || this.topSize;
        this.rightSize = data.right || this.leftSize;
        this.bottomSize = data.bottom || this.topSize;

        this.loadTexture(new Phaser.RenderTexture(this.game, this.localWidth, this.localHeight));
        this.resize(width, height);
    }

    /**
     * Set the size of the container, then update all the parts
     *
     * @param width
     * @param height
     */
    public resize(width: number, height: number): void {
        this.localWidth = Math.round(width);
        this.localHeight = Math.round(height);

        this.renderTexture();
    }

    /**
     * Override the destroy to fix PIXI leaking CanvasBuffers
     *
     * @param args
     */
    public destroy(...args: any[]): void {
        super.destroy(args[0]);
        this.texture.destroy(true);
        this.texture = null;
        this.baseTexture = null;
        this.baseFrame = null;
    }

    /**
     * Redraw the the current texture to adjust for the new sizes;
     */
    private renderTexture(): void {
        // Set a new empty texture
        (this.texture as any).resize(this.localWidth, this.localHeight, true);

        // The positions we want from the base texture
        const textureXs: number[] = [0, this.leftSize, this.baseFrame.width - this.rightSize, this.baseFrame.width];
        const textureYs: number[] = [0, this.topSize, this.baseFrame.height - this.bottomSize, this.baseFrame.height];

        // These are the positions we need the eventual texture to have
        const finalXs: number[] = [0, this.leftSize, this.localWidth - this.rightSize, this.localWidth];
        const finalYs: number[] = [0, this.topSize, this.localHeight - this.bottomSize, this.localHeight];

        (this.texture as any).clear();
        for (let yi: number = 0; yi < 3; yi++) {
            for (let xi: number = 0; xi < 3; xi++) {
                const s: Phaser.Image = this.createTexturePart(
                    textureXs[xi], // x
                    textureYs[yi], // y
                    textureXs[xi + 1] - textureXs[xi], // width
                    textureYs[yi + 1] - textureYs[yi] // height
                );

                s.width = finalXs[xi + 1] - finalXs[xi];
                s.height = finalYs[yi + 1] - finalYs[yi];

                (this.texture as Phaser.RenderTexture).renderXY(s, finalXs[xi], finalYs[yi]);
            }
        }
    }

    /**
     * Here we create a sprite part for the container based on the given input
     *
     * @param x
     * @param y
     * @param width
     * @param height
     * @returns {PIXI.Sprite}
     */
    private createTexturePart(x: number, y: number, width: number, height: number): Phaser.Image {
        const frame: PIXI.Rectangle = new PIXI.Rectangle(
            this.baseFrame.x + this.texture.frame.x + x,
            this.baseFrame.y + this.texture.frame.y + y,
            Math.max(width, 1),
            Math.max(height, 1)
        );

        return new Phaser.Sprite(this.game, 0, 0, new PIXI.Texture(this.baseTexture, frame));
    }
}
