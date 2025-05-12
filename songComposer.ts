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
        private patternBtns: Button[]
        private bpm: Setting
        private volume: Setting
        private hasClickedBack: boolean
        private isTemp: boolean
        private hasClickedNumber: boolean
        private hasClickedPlus: boolean
        private hasClickedReplace: boolean
        private isPlaying: boolean
        private clickedPattern: number // TODO: Get pattern for click

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
                SongComposerScreen.instance.setSong(new Song())
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
            console.log(this.song.name)

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

            if (this.hasClickedBack) {
                this.drawBackConfirmation()
                this.navigator.drawComponents()
                return
            }

            if (this.hasClickedNumber) {
                this.drawPatternConfirmation()
                this.navigator.drawComponents()
                return
            }

            if (this.hasClickedPlus) {
                this.drawPlusConfirmation()
                this.navigator.drawComponents()
                return
            }

            if (this.isTemp) {
                this.drawTemp()
                this.navigator.drawComponents()
                return
            }

            this.drawBoxes()

            this.navigator.drawComponents()
            this.cursor.draw()
            super.draw()
        }

        private drawTemp() {
            const startX = -56
            const startY = 0
            const cellWidth = 21
            const cellHeight = 31

            let count = 0

            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < 6; i++) {
                    const y = startY + j * cellHeight
                    const x = startX + i * cellWidth

                    if (count == this.song.patternSequence.length) {
                        break
                    }

                    if (count < this.song.patterns.length) {
                        const x = startX + i * cellWidth

                        Screen.print(i.toString(), x, y, 0, bitmaps.font12)
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
                }
                if (count > this.song.patternSequence.length) {
                    break
                }
            }
        }

        private drawPatternConfirmation() {
            Screen.fillRect(-57, -37, 120, 80, 0)
            Screen.fillRect(-60, -40, 120, 80, 0x6)
            this.drawText(-51, -30, "Would you like to")
            Screen.print("edit or replace", -45, -20, 0)
            Screen.print("this pattern?", -34, -10, 0)
            this.drawText(-40, 15, "Edit")
            this.drawText(2, 15, "Replace")
            this.cursor.draw()
            this.cursor.setOutlineColour(0x2)
        }

        private drawPlusConfirmation() {
            Screen.fillRect(-57, -37, 120, 80, 0)
            Screen.fillRect(-60, -40, 120, 80, 0x6)
            this.drawText(-46, -30, "Create new pattern")
            Screen.print("or use an", -38, -20, 0)
            Screen.print("existing one?", -38, -10, 0)
            this.drawText(-40, 15, "new")
            this.drawText(2, 15, "existing")
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

            this.hasClickedNumber = true
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
                            console.log(
                                this.song.patternSequence[clickedPatternIndex]
                                    .id
                            )
                            this.editPattern(
                                this.song.patternSequence[clickedPatternIndex]
                            )
                            this.resetBooleans()
                        },
                    }),
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: ic.doubledX(),
                        x: 21,
                        y: 18,
                        onClick: () => {
                            // TODO: Replace, this should let you swap it out or create a new one ideally
                            this.replaceClicked(clickedPatternIndex)
                        },
                    }),
                ],
            ])
            this.moveCursor(CursorDir.Down)
        }

        private replaceClicked(clickedPatternIndex: number) {
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }

            this.unbindBackButton()

            this.pickPattern(clickedPatternIndex)
        }

        private plusClicked(clickedPatternIndex: number) {
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }
            this.hasClickedPlus = true
            this.unbindBackButton()
            const ic = icons.get("placeholder")
            this.navigator.setBtns([
                [
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: ic,
                        x: -30,
                        y: 18,
                        onClick: () => {
                            this.newPattern(clickedPatternIndex)
                            this.resetBooleans()
                        },
                    }),
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: ic.doubledX(),
                        x: 21,
                        y: 18,
                        onClick: () => {
                            this.pickPattern(clickedPatternIndex)
                            this.resetBooleans()
                        },
                    }),
                ],
            ])
            this.cursor.setOutlineColour(0x2)
            this.moveCursor(CursorDir.Down)
        }

        private temp(clickedPatternIndex: number) {
            this.resetBooleans()
            this.isTemp = true
        }

        private pickPattern(clickedPatternIndex: number) {
            this.resetBooleans()
            // Create a UI to display all available patterns
            Screen.fillRect(-57, -37, 120, 80, 0)
            Screen.fillRect(-60, -40, 120, 80, 0x6)
            this.drawText(-49, -30, "Select a pattern:")

            const patterns = this.song.patterns
            const navButtons = []
            const buttonRow = []

            // Display pattern options based on available patterns
            const startX = -40
            const startY = -10
            const spacing = 25
            const maxPerRow = 3

            for (let i = 0; i < patterns.length; i++) {
                const rowIndex = Math.floor(i / maxPerRow)
                const colIndex = i % maxPerRow
                const x = startX + colIndex * spacing
                const y = startY + rowIndex * 20

                const patternButton = new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "green_tick_2",
                    x: x,
                    y: y,
                    onClick: () => {
                        // Replace the pattern in the sequence
                        if (
                            this.hasClickedReplace &&
                            clickedPatternIndex !== undefined
                        ) {
                            this.song.patternSequence[clickedPatternIndex] =
                                patterns[i]
                            this.resetBooleans()
                            this.fillPatternBtns()
                        }
                    },
                })

                buttonRow.push(patternButton)

                // Display pattern ID or other identifier
                Screen.print(
                    `ID: ${patterns[i].id}`,
                    x - 8,
                    y,
                    0,
                    bitmaps.font5
                )
            }

            // Add a button to create a new pattern
            const newPatternButton = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "invisiblePatternButton",
                x: startX,
                y: startY + Math.ceil(patterns.length / maxPerRow) * 20,
                onClick: () => {
                    const newPattern = this.song.newPattern()
                    if (
                        this.hasClickedReplace &&
                        this.clickedPattern !== undefined
                    ) {
                        this.song.patternSequence[this.clickedPattern] =
                            newPattern
                    }
                    this.resetBooleans()
                    this.fillPatternBtns()
                },
            })

            buttonRow.push(newPatternButton)
            Screen.print(
                "New Pattern",
                startX - 12,
                startY + Math.ceil(patterns.length / maxPerRow) * 20,
                0,
                bitmaps.font5
            )

            // Add a cancel button
            const cancelButton = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "back_arrow",
                x: 20,
                y: startY + Math.ceil(patterns.length / maxPerRow) * 20,
                onClick: () => {
                    this.resetBooleans()
                },
            })

            buttonRow.push(cancelButton)
            Screen.print(
                "Cancel",
                10,
                startY + Math.ceil(patterns.length / maxPerRow) * 20,
                0,
                bitmaps.font5
            )

            navButtons.push(buttonRow)
            this.navigator.setBtns(navButtons)
            this.cursor.setOutlineColour(0x2)
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
            this.hasClickedNumber = false
            this.hasClickedPlus = false
            this.hasClickedReplace = false
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
