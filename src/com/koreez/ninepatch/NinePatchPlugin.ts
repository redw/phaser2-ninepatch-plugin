import { NinePatch } from "./NinePatch";

export class NinePatchPlugin extends Phaser.Plugin {
    constructor(game: Phaser.Game, parent: Phaser.PluginManager) {
        super(game, parent);

        this.addNinePatchCache();
        this.addNinePatchFactory();
        this.addNinePatchLoader();
    }

    private addNinePatchLoader(): void {
        (Phaser.Loader.prototype as INinePatchLoader).ninePatch = function(
            key: string,
            url: string,
            top: number,
            left?: number,
            right?: number,
            bottom?: number
        ): void {
            const cacheData: INinePatchCacheData = {
                top
            };

            if (left) {
                cacheData.left = left;
            }

            if (right) {
                cacheData.right = right;
            }

            if (bottom) {
                cacheData.bottom = bottom;
            }

            this.addToFileList("image", key, url);

            this.game.cache.addNinePatch(key, cacheData);
        };
    }

    /**
     * Extends the GameObjectFactory prototype with the support of adding NinePatch. this allows us to add NinePatch methods to the game just like any other object:
     * game.add.NinePatch();
     */
    private addNinePatchFactory(): void {
        (Phaser.GameObjectFactory.prototype as INinePatchObjectFactory).ninePatch = function(
            x: number,
            y: number,
            key: string,
            frame: string,
            width: number,
            height: number,
            group?: Phaser.Group
        ): NinePatch {
            if (group === undefined) {
                group = this.world;
            }

            const ninePatchObject: NinePatch = new NinePatch(this.game, x, y, key, frame, width, height);

            return group.add(ninePatchObject);
        };

        (Phaser.GameObjectCreator.prototype as INinePatchObjectCreator).ninePatch = function(
            x: number,
            y: number,
            key: string,
            frame: string,
            width: number,
            height: number
        ): NinePatch {
            return new NinePatch(this.game, x, y, key, frame, width, height);
        };
    }

    /**
     * Extends the Phaser.Cache prototype with NinePatch properties
     */
    private addNinePatchCache(): void {
        // Create the cache space
        (Phaser.Cache.prototype as INinePatchCache).ninePatch = {};

        // Method for adding a NinePatch dict to the cache space
        (Phaser.Cache.prototype as INinePatchCache).addNinePatch = function(key: string, data: any): void {
            this.ninePatch[key] = data;
        };

        // Method for fetching a NinePatch dict from the cache space
        (Phaser.Cache.prototype as INinePatchCache).getNinePatch = function(key: string): any {
            const data: any = this.ninePatch[key];

            if (undefined === data) {
                console.warn('Phaser.Cache.getNinePatch: Key "' + key + '" not found in Cache.');
            }

            return data;
        };
    }
}

export interface INinePatchObjectFactory extends Phaser.GameObjectFactory {
    ninePatch: (x: number, y: number, key: string, frame: string, width: number, height: number, group?: Phaser.Group) => NinePatch;
}

export interface INinePatchObjectCreator extends Phaser.GameObjectCreator {
    ninePatch: (x: number, y: number, key: string, frame: string, width: number, height: number, group?: Phaser.Group) => NinePatch;
}

export interface INinePatchCache extends Phaser.Cache {
    addNinePatch: (key: string, data: INinePatchCacheData) => void;
    getNinePatch: (key: string) => INinePatchCacheData;
    ninePatch: { [key: string]: INinePatchCacheData };
}

export interface INinePatchLoader extends Phaser.Loader {
    ninePatch: (key: string, url: string, top: number, left?: number, right?: number, bottom?: number) => void;
    cache: INinePatchCache;
}

export interface INinePatchGame extends Phaser.Game {
    add: INinePatchObjectFactory;
    load: INinePatchLoader;
    cache: INinePatchCache;
}

export interface INinePatchCacheData {
    top: number;
    bottom?: number;
    left?: number;
    right?: number;
}
