namespace micromusic {
    import Screen = user_interface_base.Screen
    import CursorScene = user_interface_base.CursorScene
    import Button = user_interface_base.Button
    import ButtonStyles = user_interface_base.ButtonStyles
    import AppInterface = user_interface_base.AppInterface
    import CursorSceneEnum = user_interface_base.CursorSceneEnum
    import font = user_interface_base.font
    import resolveTooltip = user_interface_base.resolveTooltip

    export class Home extends CursorScene {
        private liveDataBtn: Button
        private recordDataBtn: Button
        private distributedLoggingBtn: Button

        constructor(app: AppInterface) {
            super(app)
        }

        /* override */ startup() {
            super.startup()
            this.cursor.setBorderThickness(2)
            const y = Screen.HEIGHT * 0.234 // y = 30 on an Arcade Shield of height 128 pixels
            this.navigator.setBtns([
                [
                    (this.liveDataBtn = new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "edit_program",
                        ariaId: "New Song",
                        x: -40,
                        y,
                        onClick: () => {
                            this.app.popScene()
                            this.app.pushScene(
                                // SongComposerScreen.getInstance(this.app)
                                new SongComposerScreen(this.app)
                            )
                        },
                    })),
                    (this.recordDataBtn = new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "largeDisk",
                        ariaId: "Saved Songs",
                        x: 0,
                        y,
                        onClick: () => {},
                    })),
                    (this.distributedLoggingBtn = new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "largeSettingsGear",
                        ariaId: "Settings",
                        x: 40,
                        y,
                        onClick: () => {
                            this.app.popScene()
                            this.app.pushScene(
                                SettingsScreen.getInstance(this, this.app)
                            )
                        },
                    })),
                ],
            ])
        }

        private drawVersion() {
            const font = bitmaps.font5
            Screen.print(
                "v0.1",
                Screen.RIGHT_EDGE - font.charWidth * "v0.1".length,
                Screen.BOTTOM_EDGE - font.charHeight - 2,
                0xb,
                font
            )
        }

        private yOffset = -Screen.HEIGHT >> 1
        draw() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                0xc
            )
            control.dmesg("working?2\n")

            this.yOffset = Math.min(0, this.yOffset + 2)
            const t = control.millis()
            const dy = this.yOffset == 0 ? (Math.idiv(t, 800) & 1) - 1 : 0
            const margin = 2
            const OFFSET = (Screen.HEIGHT >> 1) - wordLogo.height - margin
            const y = Screen.TOP_EDGE + OFFSET //+ dy
            Screen.drawTransparentImage(
                wordLogo,
                Screen.LEFT_EDGE + ((Screen.WIDTH - wordLogo.width) >> 1), // + dy
                y + this.yOffset
            )
            Screen.drawTransparentImage(
                microbitLogo,
                Screen.LEFT_EDGE +
                    ((Screen.WIDTH - microbitLogo.width) >> 1) +
                    dy,
                y - wordLogo.height + this.yOffset + margin
            )

            if (!this.yOffset) {
                const tagline = resolveTooltip("More Music!")
                Screen.print(
                    tagline,
                    Screen.LEFT_EDGE +
                        ((Screen.WIDTH + wordLogo.width) >> 1) +
                        dy -
                        font.charWidth * tagline.length,
                    Screen.TOP_EDGE +
                        OFFSET +
                        wordLogo.height +
                        dy +
                        this.yOffset +
                        1,
                    0xb,
                    font
                )
            }

            this.liveDataBtn.draw()
            this.recordDataBtn.draw()
            this.distributedLoggingBtn.draw()

            this.drawVersion()
            super.draw()
        }
    }
}
