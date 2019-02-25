// ------------------------------------------------------------------------------
//  Copyright (c) 2018 Koreez LLC. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { assert } from "chai";
import { NinePatchPlugin } from "../../../../src/index";
import "../../../entry";

describe("ninepatch Plugin", () => {
    it("plugin_is_properly_installed", done => {
        const config = {
            create
        };
        function create() {
            this.game.plugins.add(NinePatchPlugin);
            assert.isFunction(this.add.ninePatch);
            assert.isFunction(this.make.ninePatch);
            done();
        }
        (window as any).game = new Phaser.Game(800, 600, Phaser.CANVAS, null, config);
    });
});
