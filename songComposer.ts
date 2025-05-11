namespace micromusic {
    import CursorSceneWithPriorPage = user_interface_base.CursorSceneWithPriorPage
    import GridNavigator = user_interface_base.GridNavigator
    import CursorDir = user_interface_base.CursorDir
    import AppInterface = user_interface_base.AppInterface
    import Screen = user_interface_base.Screen
    import getIcon = user_interface_base.getIcon
    import Button = user_interface_base.Button
    import ButtonStyles = user_interface_base.ButtonStyles
    import font = user_interface_base.font

    /**
     * PLAN FOR SONG PATTERNS
     *
     * Screen will open up for song
     * By default, one block and a plus sign somewhere called "add block" or such
     * Clicking add block visually adds a block and sets it up
     * Perhaps some class to hold all our info
     * Can click onto blocks
     *
     * For copy paste:
     * Click copy, asks whether you want to copy a single channel from a pattern or a number of rows
     * Paste into existing or new block, then which channel it should be pasted onto
     *
     */

    export class SongComposerScreen extends CursorSceneWithPriorPage {
        private static instance: SongComposerScreen | null = null
        private song: Song
        private controlBtns: Button[]
        private bpm: Setting
        private volume: Setting
        private hasClickedBack: boolean
        private isPlaying: boolean

        private constructor(app: AppInterface) {
            super(
                app,
                function () {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
                new GridNavigator()
            )

            this.volume = new Setting(100)
            this.bpm = new Setting(120)
            this.hasClickedBack = false
        }

        public static getInstance(app?: AppInterface, song?: Song) {
            if (!SongComposerScreen.instance) {
                if (app === undefined) {
                    console.error(
                        "SongComposerScreen singleton not initialized. Call with parameters first."
                    )
                }
                SongComposerScreen.instance = new SongComposerScreen(app)
            }

            if (song) {
                SongComposerScreen.instance.setSong(song)
            } else {
                SongComposerScreen.instance.setSong(new Song())
            }

            return SongComposerScreen.instance
        }

        private setSong(song: Song) {
            this.song = song
        }

        /*override*/ startup() {
            super.startup()

            this.cursor.setBorderThickness(1)

            this.controlBtns = [
                new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "pause",
                    x: -25,
                    y: -54,
                    onClick: () => {
                        this.pause()
                    },
                }),
                new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "stop",
                    x: -13,
                    y: -54,
                    onClick: () => {
                        this.stop()
                    },
                }),
                new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "fast_forward",
                    x: 1,
                    y: -54,
                    onClick: () => {
                        this.fastForward()
                    },
                }),
                new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "settings_cog_small",
                    x: 70,
                    y: -52,
                    onClick: () => {
                        this.isPlaying = false
                        this.app.popScene()
                        this.app.pushScene(
                            SettingsScreen.getInstance(
                                this.app,
                                this,
                                this.volume,
                                this.bpm
                            )
                        )
                    },
                }),
                new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "back_button",
                    x: -68,
                    y: -52,
                    onClick: () => {
                        this.backConfirmation()
                    },
                }),
                new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "rewind",
                    x: -47,
                    y: -54,
                    onClick: () => {
                        this.rewind()
                    },
                }),
                new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "play",
                    x: -37,
                    y: -54,
                    onClick: () => {
                        this.play()
                    },
                }),
            ]

            this.navigator.setBtns([
                this.controlBtns,
                [
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "invisiblePatternButton",
                        x: -53,
                        y: 6,
                        onClick: () => {
                            this.play()
                        },
                    }),
                ],
            ])
        }

        draw() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                0xc
            )

            const startX = -56
            const startY = 0
            const cellWidth = 21
            const cellHeight = 31

            for (let i = 0; i < this.song.patternSequence.length; i++) {
                // const y = startY + i * cellHeight
                const x = startX + i * cellWidth
                const digitCount = i.toString().length

                Screen.print(i.toString(), x, startY, 0, bitmaps.font12)
            }
            // TODO: plus sign in the ones without? or perhaps not show anything past 6,
            // 6 to have a plus sign then that adds the seventh as a possibility as well?
            let count = 0

            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < 6; i++) {
                    const y = startY + j * cellHeight
                    const x = startX + i * cellWidth

                    if (count < this.song.patternSequence.length) {
                        const x = startX + i * cellWidth

                        Screen.print(i.toString(), x, y, 0, bitmaps.font12)
                    } else if (count == this.song.patternSequence.length) {
                        const x = startX + i * cellWidth
                        Screen.print("+", x + 1, y + 2, 0, bitmaps.font8)
                    }

                    const digitCount = count.toString().length
                    const rightX = x - (digitCount - 1) * 2

                    Screen.drawRect(x - 5, y - 2, 17, 17, 0)
                    Screen.print(
                        count.toString(),
                        rightX,
                        y + 16,
                        0,
                        bitmaps.font5
                    )

                    count += 1
                    if (count > this.song.patternSequence.length) {
                        break
                    }
                }
                if (count > this.song.patternSequence.length) {
                    break
                }
            }

            this.navigator.drawComponents()
            this.cursor.draw()
            super.draw()
        }

        private play() {}

        private pause() {}

        private stop() {}

        private fastForward() {}

        private rewind() {}

        private backConfirmation() {
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }

            this.hasClickedBack = true
            const ic = icons.get("placeholder")
            this.navigator.setBtns([
                [
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: ic,
                        x: -22,
                        y: 18,
                        onClick: () => {
                            this.app.popScene()
                            this.app.pushScene(new Home(this.app))
                        },
                    }),
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: ic,
                        x: 21,
                        y: 18,
                        onClick: () => {
                            this.hasClickedBack = false
                            this.moveCursor(CursorDir.Up)
                            this.moveCursor(CursorDir.Down)
                        },
                    }),
                ],
            ])
            this.moveCursor(CursorDir.Down)
        }

        private resetControllerEvents() {
            this.cursor.visible = true
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.up.id,
                () => {
                    if (!this.isPlaying) this.moveCursor(CursorDir.Up)
                }
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => {
                    if (!this.isPlaying) this.moveCursor(CursorDir.Down)
                }
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.right.id,
                () => this.moveCursor(CursorDir.Right)
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.left.id,
                () => this.moveCursor(CursorDir.Left)
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => {
                    this.backConfirmation()
                    this.moveCursor(CursorDir.Right)
                }
            )
        }
    }
}
