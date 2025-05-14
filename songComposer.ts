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

    export class SongComposerScreen extends CursorSceneWithPriorPage {
        private static instance: SongComposerScreen | null = null
        private song: Song
        private controlBtns: Button[]
        private patternBtns: Button[]
        private arrow: Button
        private arrowLocation: number
        private playedNote: number
        private playedPattern: number
        private hasClickedBack: boolean
        private hasClickedPick: boolean
        private hasClickedPattern: boolean
        private hasClickedPlus: boolean
        private hasClickedRemove: boolean
        private isPlaying: boolean
        private isPaused: boolean
        private patternClickedSwap: boolean
        private arrowVisible: boolean

        private constructor(app: AppInterface) {
            super(
                app,
                function () {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
                new GridNavigator()
            )

            this.song = new Song()

            this.playedNote = 0
            this.playedPattern = 0

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
            }

            return SongComposerScreen.instance
        }

        private setSong(song: Song) {
            this.song = song
        }

        /*override*/ startup() {
            super.startup()
            basic.pause(1)

            this.playedNote = 0
            this.playedPattern = 0

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
                            SettingsScreen.getInstance(this, this.app)
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

            this.fillPatternBtns()
            this.resetNavigator()
            this.resetControllerEvents()
        }

        draw() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                0xc
            )

            if (this.isPlaying || this.isPaused) {
                if (this.arrowLocation != -53 + (this.playedPattern % 6) * 21) {
                    let y = this.playedPattern < 6 ? -6 : 25
                    this.arrow = new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "down_arrow",
                        x: -53 + (this.playedPattern % 6) * 21,
                        y: y,
                        onClick: () => {},
                    })
                    this.arrowLocation = -53 + (this.playedPattern % 6) * 21
                }
                this.arrow.draw()
            }

            if (this.hasClickedBack) {
                this.drawBackConfirmation()
                this.navigator.drawComponents()
                return
            }

            if (this.hasClickedPattern) {
                this.drawPatternConfirmation()
                this.navigator.drawComponents()
                return
            }

            if (this.hasClickedPlus) {
                this.drawPlusConfirmation()
                this.navigator.drawComponents()
                return
            }

            if (this.hasClickedRemove) {
                this.drawRemoveConfirmation()
                this.navigator.drawComponents()
                return
            }

            if (this.hasClickedPick) {
                this.drawPick()
                this.navigator.drawComponents()
                return
            }

            if (this.patternClickedSwap) {
                this.drawPick()
                this.navigator.drawComponents()
                return
            }

            this.drawBoxes()

            this.navigator.drawComponents()
            super.draw()
        }

        private drawPick() {
            const startX = -56
            const startY = 0
            const cellWidth = 21
            const cellHeight = 31

            let count = 0

            this.drawText(-50, -55, "Select a pattern")
            this.drawText(-60, -45, "Or press B to cancel")

            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < 6; i++) {
                    const y = startY + j * cellHeight
                    const x = startX + i * cellWidth

                    if (count == this.song.patterns.length) {
                        break
                    }

                    if (count < this.song.patterns.length) {
                        const x = startX + i * cellWidth

                        Screen.print(
                            this.song.patterns[count].id.toString(),
                            x,
                            y,
                            0,
                            bitmaps.font12
                        )
                        Screen.drawRect(x - 5, y - 2, 17, 17, 0)
                    }

                    count += 1
                }
                if (count == this.song.patterns.length) {
                    break
                }
            }
            this.cursor.draw()
        }

        private drawPatternConfirmation() {
            Screen.fillRect(-57, -37, 120, 80, 0)
            Screen.fillRect(-60, -40, 120, 80, 0x6)
            this.drawText(-51, -36, "Would you like to")
            Screen.print("edit, replace", -40, -26, 0)
            Screen.print("or remove", -26, -16, 0)
            Screen.print("this pattern?", -36, -6, 0)
            this.drawText(-40, 14, "Edit")
            this.drawText(2, 14, "Replace")
            this.drawText(-20, 24, "Remove")
            this.cursor.draw()
            this.cursor.setOutlineColour(0x2)
        }

        private drawPlusConfirmation() {
            Screen.fillRect(-57, -37, 120, 80, 0)
            Screen.fillRect(-60, -40, 120, 80, 0x6)
            this.drawText(-54, -30, "Create new pattern")
            Screen.print("or use an", -26, -20, 0)
            Screen.print("existing one?", -38, -10, 0)
            this.drawText(-40, 15, "new")
            let col = this.song.patterns.length > 0 ? 0 : 0xf
            this.drawText(2, 15, "existing", col)
            this.cursor.draw()
        }

        private drawRemoveConfirmation() {
            Screen.fillRect(-57, -37, 120, 80, 0)
            Screen.fillRect(-60, -40, 120, 80, 0x6)
            this.drawText(-44, -30, "Delete pattern", 0x2)
            Screen.print("or remove from", -44, -20, 0x2)
            Screen.print("the sequence?", -40, -10, 0x2)
            this.drawText(-39, 0, "(B to cancel)", 0, bitmaps.font5)
            this.drawText(-50, 15, "Fully")
            this.drawText(0, 15, "Sequence")
            this.cursor.draw()
        }

        private drawBackConfirmation() {
            Screen.fillRect(-57, -37, 120, 80, 0)
            Screen.fillRect(-60, -40, 120, 80, 0x6)
            this.drawText(-36, -30, "Return Home?")
            Screen.print("Any unsaved work", -48, -20, 0x2)
            Screen.print("will be lost", -38, -10, 0x2)
            this.drawText(-30, 15, "Yes")
            this.drawText(15, 15, "No")
            this.cursor.draw()
        }

        private drawText(
            x: number,
            y: number,
            text: string,
            colour?: number,
            _font?: bitmaps.Font
        ) {
            if (!colour) colour = 0
            if (!_font) _font = font
            Screen.print(text, x, y, colour, _font)
        }

        private drawBoxes() {
            const startX = -56
            const startY = 0
            const cellWidth = 21
            const cellHeight = 31

            let count = 0
            let len = 0

            if (this.hasClickedPick) {
                len = this.song.patterns.length
            } else {
                len = this.song.patternSequence.length
            }

            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < 6; i++) {
                    const y = startY + j * cellHeight
                    const x = startX + i * cellWidth

                    if (count < this.song.patternSequence.length) {
                        const x = startX + i * cellWidth

                        Screen.print(
                            this.song.patternSequence[count].id.toString(),
                            x,
                            y,
                            0,
                            bitmaps.font12
                        )
                    } else if (count == this.song.patternSequence.length) {
                        const x = startX + i * cellWidth
                        Screen.print("+", x + 1, y + 2, 0, bitmaps.font8)
                    }

                    const digitCount = count.toString().length
                    const rightX = x - (digitCount - 1) * 2

                    Screen.drawRect(x - 5, y - 2, 17, 17, 0)
                    Screen.print(
                        (count + 1).toString(),
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
        }

        private play() {
            if (this.isPlaying == true) return
            music.setVolume((Settings.volume.value / 100) * 255)
            this.isPlaying = true
            this.isPaused = false
            control.inBackground(() => {
                const tickSpeed = 60000 / Settings.bpm.value

                while (
                    this.isPlaying &&
                    this.playedPattern < this.song.patternSequence.length
                ) {
                    basic.pause(tickSpeed)

                    this.playedNote += 1
                    if (this.playedNote == MAX_NOTES) {
                        this.playedPattern += 1
                    }
                }
                this.isPlaying = false
                this.resetNavigator()
                this.playedNote = 0
                this.playedPattern = 0
            })
        }

        private pause() {
            if (this.isPlaying) {
                this.isPaused = true
                this.isPlaying = false
            }
        }

        private stop() {
            this.isPlaying = false
            this.isPaused = false
            this.arrowVisible = false
            basic.pause(200)
            this.playedNote = 0
            this.playedPattern = 0
        }

        private fastForward() {
            this.playedNote = 0
            this.playedPattern += 1
            if (this.playedPattern >= this.song.patternSequence.length) {
                this.playedPattern = this.song.patternSequence.length - 1
            }
        }

        private rewind() {
            this.playedNote = 0
            this.playedPattern -= 1
            if (this.playedPattern < 0) {
                this.playedPattern = 0
            }
        }

        private backConfirmation() {
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }

            this.hasClickedBack = true
            this.unbindBackButton()
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
                            this.hasClickedBack = false
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
                            this.resetNavigator()
                            this.resetControllerEvents()
                            this.moveCursor(CursorDir.Up)
                            this.moveCursor(CursorDir.Down)
                        },
                    }),
                ],
            ])
            this.unbindBackButton()
            this.moveCursor(CursorDir.Down)
        }

        private patternClicked(clickedPatternIndex: number) {
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }

            this.unbindBackButton()

            this.hasClickedPattern = true
            const ic = icons.get("placeholder")
            const ic2 = icons.get("placeholder_long")
            this.navigator.setBtns([
                [
                    new Button({
                        // Edit
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: ic2,
                        x: -28,
                        y: 17,
                        onClick: () => {
                            this.editPattern(
                                this.song.patternSequence[clickedPatternIndex]
                            )
                            this.resetBooleans()
                        },
                    }),
                    new Button({
                        // Replace
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: ic2.doubledX(),
                        x: 23,
                        y: 17,
                        onClick: () => {
                            this.resetBooleans()
                            this.plusClicked(clickedPatternIndex)
                        },
                    }),
                ],
                [
                    new Button({
                        // Remove
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: ic.doubledX(),
                        x: -2,
                        y: 28,
                        onClick: () => {
                            this.removeClicked(clickedPatternIndex)
                        },
                    }),
                ],
            ])
            this.moveCursor(CursorDir.Down)
        }

        private removeClicked(clickedPatternIndex: number) {
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }

            this.resetBooleans()
            this.hasClickedRemove = true
            this.cursor.setOutlineColour(0x2)

            this.unbindBackButton()

            const ic = icons.get("placeholder")
            const ic2 = icons.get("placeholder_long")
            this.navigator.setBtns([
                [
                    new Button({
                        // Fully
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: ic.doubledX(),
                        x: -35,
                        y: 18,
                        onClick: () => {
                            this.song.deletePattern(
                                this.song.patternSequence[clickedPatternIndex]
                            )
                            this.resetBooleans()
                            this.fillPatternBtns()
                            this.resetControllerEvents()
                            this.moveCursor(CursorDir.Up)
                            this.moveCursor(CursorDir.Down)
                        },
                    }),
                    new Button({
                        // Sequence
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: ic2.doubledX(),
                        x: 24,
                        y: 18,
                        onClick: () => {
                            this.song.removeSequenceItem(clickedPatternIndex)
                            this.resetBooleans()
                            this.fillPatternBtns()
                            this.resetControllerEvents()
                            this.moveCursor(CursorDir.Up)
                            this.moveCursor(CursorDir.Down)
                        },
                    }),
                ],
            ])
            this.moveCursor(CursorDir.Down)
        }

        private plusClicked(clickedPatternIndex: number) {
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }
            this.hasClickedPlus = true
            this.unbindBackButton()
            const ic = icons.get("placeholder")
            const ic2 = icons.get("placeholder_long")
            this.navigator.setBtns([
                [
                    new Button({
                        // New
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: ic,
                        x: -31,
                        y: 18,
                        onClick: () => {
                            this.newPattern(clickedPatternIndex)
                            this.resetBooleans()
                        },
                    }),
                    new Button({
                        // Existing
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: ic2.doubledX(),
                        x: 26,
                        y: 18,
                        onClick: () => {
                            if (this.song.patterns.length > 0) {
                                this.pickClicked(clickedPatternIndex)
                            }
                        },
                    }),
                ],
            ])
            this.cursor.setOutlineColour(0x2)
            this.moveCursor(CursorDir.Down)
        }

        private pickClicked(clickedPatternIndex: number) {
            this.resetBooleans()
            this.hasClickedPick = true

            const startX = -56
            const startY = 0
            const cellWidth = 21
            const cellHeight = 31
            let count = 0

            let patternBtns = []

            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < 6; i++) {
                    const y = startY + j * cellHeight
                    const x = startX + i * cellWidth
                    const index = count

                    if (count < this.song.patterns.length) {
                        patternBtns[count] = new Button({
                            parent: null,
                            style: ButtonStyles.Transparent,
                            icon: "invisiblePatternButton",
                            x: x + 3,
                            y: y + 6,
                            onClick: () => {
                                this.song.patternSequence[clickedPatternIndex] =
                                    this.song.patterns[index]
                                this.hasClickedPick = false
                                this.resetBooleans()
                                this.resetNavigator()
                                this.fillPatternBtns()
                                this.moveCursor(CursorDir.Left)
                                this.moveCursor(CursorDir.Right)
                            },
                        })
                    }

                    count += 1
                    if (count == this.song.patterns.length) {
                        break
                    }
                }
                if (count == this.song.patterns.length) {
                    break
                }
            }

            this.navigator.setBtns([
                // TODO: Make this add enough buttons for the number of patterns available
                patternBtns,
            ])

            this.moveCursor(CursorDir.Up)
            this.moveCursor(CursorDir.Down)
        }

        public swapPattern() {
            this.resetBooleans()
            this.patternClickedSwap = true

            const startX = -56
            const startY = 0
            const cellWidth = 21
            const cellHeight = 31
            let count = 0

            let patternBtns = []

            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < 6; i++) {
                    const y = startY + j * cellHeight
                    const x = startX + i * cellWidth
                    const index = count

                    if (count < this.song.patterns.length) {
                        patternBtns[count] = new Button({
                            parent: null,
                            style: ButtonStyles.Transparent,
                            icon: "invisiblePatternButton",
                            x: x + 3,
                            y: y + 6,
                            onClick: () => {
                                this.patternClickedSwap = false
                                this.app.popScene()
                                this.app.pushScene(
                                    PatternScreen.getInstance(
                                        this.song.patterns[index]
                                    )
                                )
                            },
                        })
                    }

                    count += 1
                    if (count == this.song.patterns.length) {
                        break
                    }
                }
                if (count == this.song.patterns.length) {
                    break
                }
            }

            this.navigator.setBtns([patternBtns])
            this.moveCursor(CursorDir.Up)
            this.moveCursor(CursorDir.Down)
        }

        private editPattern(clickedPattern: Pattern) {
            this.app.popScene()
            this.app.pushScene(
                PatternScreen.getInstance(clickedPattern, this.app)
            )
        }

        private newPattern(clickedPatternIndex: number) {
            let pattern = this.song.newPattern()
            this.song.patternSequence[clickedPatternIndex] = pattern
            this.app.popScene()
            this.app.pushScene(PatternScreen.getInstance(pattern, this.app))
        }

        private fillPatternBtns() {
            this.patternBtns = []

            const startX = -56
            const startY = 0
            const cellWidth = 21
            const cellHeight = 31

            let count = 0

            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < 6; i++) {
                    const y = startY + j * cellHeight
                    const x = startX + i * cellWidth
                    const index = count
                    if (count < this.song.patternSequence.length) {
                        this.patternBtns[count] = new Button({
                            parent: null,
                            style: ButtonStyles.Transparent,
                            icon: "invisiblePatternButton",
                            x: x + 3,
                            y: y + 6,
                            onClick: () => {
                                this.patternClicked(index)
                            },
                        })
                    } else if (count == this.song.patternSequence.length) {
                        this.patternBtns[count] = new Button({
                            parent: null,
                            style: ButtonStyles.Transparent,
                            icon: "invisiblePatternButton",
                            x: x + 3,
                            y: y + 6,
                            onClick: () => {
                                this.plusClicked(index)
                            },
                        })
                    }

                    count += 1
                    if (count > this.song.patternSequence.length) {
                        break
                    }
                }
                if (count > this.song.patternSequence.length) {
                    break
                }
            }

            this.resetNavigator()
        }

        private resetNavigator() {
            this.navigator.setBtns([this.controlBtns, this.patternBtns])
        }

        private resetBooleans() {
            this.hasClickedBack = false
            this.hasClickedPattern = false
            this.hasClickedPlus = false
            this.hasClickedPick = false
            this.hasClickedRemove = false
            this.cursor.setOutlineColour(0x9)
        }

        private unbindBackButton() {
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => {
                    this.resetBooleans()
                    this.resetControllerEvents()
                    this.resetNavigator()
                    this.cursor.setOutlineColour(0x9)
                    this.moveCursor(CursorDir.Left)
                    this.moveCursor(CursorDir.Right)
                }
            )
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
