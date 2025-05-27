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

    enum ScreenShown {
        Default = 0,
        Back = 1,
        Pick = 2,
        Pattern = 3,
        Plus = 4,
        Remove = 5,
        Copy = 6,
        CopyConfirmation = 7,
        CopySelection = 8,
        CopyChannel = 9,
        ChannelSelect = 10,
        PastePattern = 11,
        PastePicker = 12,
        FullCopySelection = 13,
        PatternClickedSwap = 14,
    }

    export class SongComposerScreen extends CursorSceneWithPriorPage {
        private static instance: SongComposerScreen | null = null
        private song: Song
        private controlBtns: Button[]
        private patternBtns: Button[]
        private arrow: Button
        private channelCopied: Channel | null
        private leftTrack: number
        private rightTrack: number
        private arrowLocation: number
        private playedNote: number
        private playedPattern: number
        private copiedPatternIndex: number
        private gridPatternIndex: number
        private pastedChannel: number
        private isPlaying: boolean
        private stopped: boolean
        private isPaused: boolean
        private drawSomething: string | null = null
        private dataLoggerHeader: string[]
        private screenShown: ScreenShown

        private constructor(app: AppInterface) {
            super(
                app,
                function () {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
                new GridNavigator(),
            )

            this.song = new Song()

            this.playedNote = 0
            this.playedPattern = 0
        }

        public static getInstance(app?: AppInterface, song?: Song) {
            if (!SongComposerScreen.instance) {
                if (app === undefined) {
                    console.error(
                        "SongComposerScreen singleton not initialized. Call with parameters first.",
                    )
                }
                SongComposerScreen.instance = new SongComposerScreen(app)
            }

            if (song) {
                SongComposerScreen.instance.setSong(song)
            }

            return SongComposerScreen.instance
        }

        public getSong() {
            return this.song
        }

        public setSong(song: Song) {
            this.song = song
        }

        /*override*/ startup() {
            super.startup()
            basic.pause(1)

            this.playedNote = 0
            this.playedPattern = 0

            this.leftTrack = LEFT_TRACK_INDEX
            this.rightTrack = RIGHT_TRACK_INDEX

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
                            SettingsScreen.getInstance(this, this.app),
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
                0xc,
            )

            if (this.dataLoggerHeader != null) {
                this.drawText(0, 0, this.dataLoggerHeader[0])
            }

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

            switch (this.screenShown) {
                case ScreenShown.Default:
                    break
                case ScreenShown.Back: {
                    this.drawBackConfirmation()
                    this.navigator.drawComponents()
                    return
                }
                case ScreenShown.Pick: {
                    this.drawPick()
                    this.navigator.drawComponents()
                    return
                }
                case ScreenShown.Pattern: {
                    this.drawPattern()
                    this.navigator.drawComponents()
                    return
                }
                case ScreenShown.Plus: {
                    this.drawPlusConfirmation()
                    this.navigator.drawComponents()
                    return
                }
                case ScreenShown.Remove: {
                    this.drawRemoveConfirmation()
                    this.navigator.drawComponents()
                    return
                }
                case ScreenShown.Copy: {
                    this.drawCopy()
                    this.navigator.drawComponents()
                    return
                }
                case ScreenShown.CopyConfirmation: {
                    this.drawFullCopyConfirmation()
                    this.navigator.drawComponents()
                    return
                }
                case ScreenShown.CopySelection: {
                    this.drawCopySelection()
                    this.navigator.drawComponents()
                    return
                }
                case ScreenShown.CopyChannel: {
                    this.drawCopyChannel()
                    this.cursor.draw()
                    this.navigator.drawComponents()
                    return
                }
                case ScreenShown.ChannelSelect: {
                    this.drawPasteNewOrExisting()
                    this.navigator.drawComponents()
                    return
                }
                case ScreenShown.FullCopySelection: {
                    this.drawSelectFullCopy()
                    this.navigator.drawComponents()
                    return
                }
                case ScreenShown.PastePattern: {
                    this.drawPastePattern()
                    this.navigator.drawComponents()
                    return
                }
                case ScreenShown.PastePicker: {
                    this.drawPastePicker()
                    this.navigator.drawComponents()
                    return
                }
                case ScreenShown.PatternClickedSwap: {
                    this.drawPick()
                    this.navigator.drawComponents()
                    return
                }
            }

            let col = this.song.patterns.length > 0 ? 0 : 0xf
            this.drawText(-15, -30, "Copy", col)

            this.drawSequence()

            this.navigator.drawComponents()
            super.draw()
        }

        private drawPastePicker() {
            this.drawText(-44, -60, "Pick a channel")
            this.drawText(-39, -53, "to copy to")
            this.drawGrid()
            this.cursor.draw()
        }

        private drawAllPatterns() {
            const startX = -56
            const startY = 0
            const cellWidth = 21
            const cellHeight = 31

            let count = 0

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
                            bitmaps.font12,
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

        private drawPick() {
            this.drawText(-50, -55, "Select a pattern")
            this.drawText(-60, -45, "Or press B to cancel")

            this.drawAllPatterns()
        }

        private drawSelectFullCopy() {
            const startX = -56
            const startY = 0
            const cellWidth = 21
            const cellHeight = 31

            let count = 0

            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < 6; i++) {
                    const y = startY + j * cellHeight
                    const x = startX + i * cellWidth

                    if (count == this.song.patterns.length) {
                        break
                    }

                    if (count == this.copiedPatternIndex) {
                        continue
                    }

                    if (count < this.song.patterns.length) {
                        const x = startX + i * cellWidth

                        Screen.print(
                            this.song.patterns[count].id.toString(),
                            x,
                            y,
                            0,
                            bitmaps.font12,
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

        private drawPastePattern() {
            this.drawText(-50, -55, "Select a pattern")
            this.drawText(-40, -45, "to copy to")
            this.drawText(-60, -35, "Or press B to cancel")

            this.drawAllPatterns()
        }

        private drawCopy() {
            this.drawText(-50, -55, "Select a pattern")
            this.drawText(-45, -45, "to copy from")
            this.drawText(-60, -35, "Or press B to cancel")

            this.drawAllPatterns()
        }

        private drawCopyChannel() {
            this.drawText(-44, -60, "Pick a channel")
            this.drawText(-39, -53, "to copy from")
            this.drawGrid()
            this.cursor.draw()
        }

        private drawCopySelection() {
            this.drawChoiceBoxBackground()
            this.drawText(-40, -30, "Copy a channel")
            Screen.print("or an entire", -35, -20, 0)
            Screen.print("pattern?", -24, -10, 0)
            this.drawText(-45, 15, "pattern")
            let col = this.song.patterns.length > 0 ? 0 : 0xf
            this.drawText(7, 15, "channel", col)
            this.cursor.draw()
        }

        private drawFullCopyConfirmation() {
            this.drawChoiceBoxBackground()
            this.drawText(-60, -30, "Paste to new pattern")
            Screen.print("or use an", -26, -20, 0)
            Screen.print("existing one?", -38, -10, 0)
            this.drawText(-40, 15, "new")
            let col = this.song.patterns.length > 0 ? 0 : 0xf
            this.drawText(2, 15, "existing", col)
            this.cursor.draw()
        }

        private drawPattern() {
            this.drawChoiceBoxBackground()
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

        private drawPasteNewOrExisting() {
            this.drawChoiceBoxBackground()
            this.drawText(-60, -30, "Paste to new pattern")
            Screen.print("or use an", -26, -20, 0)
            Screen.print("existing one?", -38, -10, 0)
            this.drawText(-40, 15, "new")
            let col = this.song.patterns.length > 0 ? 0 : 0xf
            this.drawText(2, 15, "existing", col)
            this.cursor.draw()
            this.cursor.setOutlineColour(0x2)
        }

        private drawPlusConfirmation() {
            this.drawChoiceBoxBackground()
            this.drawText(-54, -30, "Create new pattern")
            Screen.print("or use an", -26, -20, 0)
            Screen.print("existing one?", -38, -10, 0)
            this.drawText(-40, 15, "new")
            let col = this.song.patterns.length > 0 ? 0 : 0xf
            this.drawText(2, 15, "existing", col)
            this.cursor.draw()
        }

        private drawRemoveConfirmation() {
            this.drawChoiceBoxBackground()
            this.drawText(-44, -30, "Delete pattern", 0x2)
            this.drawText(-44, -20, "or remove from", 0x2)
            this.drawText(-40, -10, "the sequence?", 0x2)
            this.drawText(-39, 0, "(B to cancel)", 0, bitmaps.font5)
            this.drawText(-50, 15, "Fully")
            this.drawText(0, 15, "Sequence")
            this.cursor.draw()
        }

        private drawBackConfirmation() {
            this.drawChoiceBoxBackground()
            this.drawText(-36, -30, "Return Home?")
            Screen.print("Any unsaved work", -48, -20, 0x2)
            Screen.print("will be lost", -38, -10, 0x2)
            this.drawText(-30, 15, "Yes")
            this.drawText(15, 15, "No")
            this.cursor.draw()
        }

        private drawChoiceBoxBackground() {
            Screen.fillRect(-57, -37, 120, 80, 0)
            Screen.fillRect(-60, -40, 120, 80, 0x6)
        }

        private drawText(
            x: number,
            y: number,
            text: string,
            colour?: number,
            _font?: bitmaps.Font,
        ) {
            if (!colour) colour = 0
            if (!_font) _font = font
            Screen.print(text, x, y, colour, _font)
        }

        private drawSequence() {
            const startX = -56
            const startY = 0
            const cellWidth = 21
            const cellHeight = 31

            let count = 0
            let len = 0

            if (this.screenShown == ScreenShown.Pick) {
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
                            bitmaps.font12,
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
                        bitmaps.font5,
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

        private drawGrid() {
            const startX = -30
            const startY = -30
            const cellWidth = 55
            const cellHeight = 11

            this.drawText(
                -60,
                -42,
                this.song.patterns[this.gridPatternIndex].channels[
                    this.leftTrack
                ].sample.name,
            )
            this.drawText(
                8,
                -42,
                this.song.patterns[this.gridPatternIndex].channels[
                    this.rightTrack
                ].sample.name,
            )

            for (let step = 0; step < NUM_VISIBLE_STEPS; step++) {
                const y = startY + step * cellHeight
                const stepString = (step + 1).toString()
                const digitCount = stepString.length
                const rightX = 65 - (digitCount - 1) * 6

                Screen.print(stepString, -70, y, 0, font)
                Screen.print(stepString, rightX, y, 0, font)

                // Draw left track
                let x = startX + 0 * cellWidth
                let note =
                    this.song.patterns[this.gridPatternIndex].channels[
                        this.leftTrack
                    ].notes[step]

                if (note == "-") {
                    Screen.print("-", x, y, 0, font)
                } else {
                    note = `${note}${
                        this.song.patterns[this.gridPatternIndex].channels[
                            this.leftTrack
                        ].octaves[step]
                    }`
                    Screen.print(note, x, y, 0, font)
                }

                // Draw right track
                x = startX + 1 * cellWidth

                note =
                    this.song.patterns[this.gridPatternIndex].channels[
                        this.rightTrack
                    ].notes[step]
                if (note == "-") {
                    Screen.print("-", x, y, 0, font)
                } else {
                    note = `${note}${
                        this.song.patterns[this.gridPatternIndex].channels[
                            this.rightTrack
                        ].octaves[step]
                    }`
                    Screen.print(note, x, y, 0, font)
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
                    for (let i = 0; i < NUM_CHANNELS; i++) {
                        this.playNote(
                            i,
                            this.song.patterns[this.playedPattern].channels[i]
                                .sample.audioBuffer,
                        )
                    }
                    basic.pause(tickSpeed)

                    this.playedNote += 1
                    if (this.playedNote == MAX_NOTES) {
                        this.playedPattern += 1
                        this.playedNote = 0
                    }
                }
                this.isPlaying = false
                this.resetNavigator()
                if (this.stopped) {
                    this.playedNote = 0
                    this.playedPattern = 0
                }
            })
        }

        private playNote(src: number, buf: Buffer) {
            const offset =
                SEMITONE_OFFSETS[
                    this.song.patterns[this.playedPattern].channels[src].notes[
                        this.playedNote
                    ]
                ]
            if (offset == null) return // "-" or invalid note

            const multiplier =
                2 **
                (this.song.patterns[this.playedPattern].channels[src].octaves[
                    this.playedNote
                ] -
                    3 +
                    offset / 12)
            const rate = 8800 * multiplier

            samples.setSampleRate(src, rate)
            samples.playAsync(src, buf)
        }

        private pause() {
            if (this.isPlaying) {
                this.isPaused = true
                this.isPlaying = false
            }
        }

        private stop() {
            this.isPlaying = false
            this.stopped = true
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

            this.screenShown = ScreenShown.Back
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
                            this.resetEnum()
                        },
                    }),
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: ic,
                        x: 21,
                        y: 18,
                        onClick: () => {
                            this.resetEnum()
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

        private copyClicked() {
            // Select One to copy from
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }

            this.unbindBackButton()

            this.screenShown = ScreenShown.Copy
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
                                this.copySelected(index)
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

        private copySelected(copyIndex: number) {
            // Would you like to copy the entire pattern or a single channel?
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }

            this.screenShown = ScreenShown.CopySelection
            this.unbindBackButton()
            const ic2 = icons.get("placeholder_long")
            this.navigator.setBtns([
                [
                    new Button({
                        // Entire
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: ic2.doubledX(),
                        x: -25,
                        y: 19,
                        onClick: () => {
                            this.fullCopyConfirmation(copyIndex)
                        },
                    }),
                    new Button({
                        // Channel
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: ic2.doubledX(),
                        x: 28,
                        y: 19,
                        onClick: () => {
                            this.gridPatternIndex = copyIndex
                            this.channelCopyConfirmation(copyIndex)
                        },
                    }),
                ],
            ])
            this.cursor.setOutlineColour(0x2)
            this.moveCursor(CursorDir.Down)
        }

        private channelCopyConfirmation(copyIndex: number) {
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }

            this.gridPatternIndex = copyIndex

            this.screenShown = ScreenShown.CopyChannel

            let icon = getIcon("placeholder", true)
                .doubled()
                .doubled()
                .doubledY()

            this.navigator.setBtns([
                [
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: icon,
                        x: -36,
                        y: 12,
                        onClick: () => {
                            // left Track
                            this.channelCopied =
                                this.song.patterns[copyIndex].channels[
                                    this.leftTrack
                                ]

                            this.channelCopySelect()
                        },
                    }),
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: icon,
                        x: 37,
                        y: 12,
                        onClick: () => {
                            // right Track
                            this.channelCopied =
                                this.song.patterns[copyIndex].channels[
                                    this.rightTrack
                                ]
                            this.channelCopySelect()
                        },
                    }),
                ],
                [
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "sample_selection_arrow_right",
                        x: 70,
                        y: -40,
                        onClick: () => {
                            this.leftTrack++
                            this.rightTrack++

                            if (this.leftTrack > 3) this.leftTrack = 0
                            if (this.rightTrack > 3) this.rightTrack = 0

                            this.drawGrid()
                        },
                    }),
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "sample_selection_arrow_left",
                        x: -70,
                        y: -40,
                        onClick: () => {
                            this.leftTrack--
                            this.rightTrack--

                            if (this.leftTrack < 0) this.leftTrack = 3
                            if (this.rightTrack < 0) this.rightTrack = 3
                        },
                    }),
                ],
            ])

            this.moveCursor(CursorDir.Left)
            this.moveCursor(CursorDir.Right)
            this.cursor.setOutlineColour(0x9)
        }

        private channelCopySelect() {
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }
            this.screenShown = ScreenShown.ChannelSelect
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
                            // Copy to new pattern
                            let newPat = this.song.newPattern()

                            newPat.channels[0].copy(this.channelCopied)

                            this.channelCopied = null
                            this.fillPatternBtns()
                            this.resetEnum()
                            this.resetControllerEvents()
                            this.moveCursor(CursorDir.Left)
                            this.moveCursor(CursorDir.Right)
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
                            this.channelPastePattern()
                        },
                    }),
                ],
            ])
            this.cursor.setOutlineColour(0x2)
            this.moveCursor(CursorDir.Up)
            this.moveCursor(CursorDir.Down)
        }

        private channelPastePattern() {
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }
            this.screenShown = ScreenShown.PastePattern

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
                                this.gridPatternIndex = index
                                this.channelPastePicker(
                                    this.song.patterns[index],
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
            this.cursor.setOutlineColour(0x9)
        }

        private channelPastePicker(pattern: Pattern) {
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }

            this.screenShown = ScreenShown.PastePicker

            let icon = getIcon("placeholder", true)
                .doubled()
                .doubled()
                .doubledY()

            this.navigator.setBtns([
                [
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: icon,
                        x: -36,
                        y: 12,
                        onClick: () => {
                            // left Track
                            pattern.channels[this.leftTrack].copy(
                                this.channelCopied,
                            )
                            this.channelCopied = null
                            this.fillPatternBtns()
                            this.resetEnum()
                            this.resetControllerEvents()
                            this.moveCursor(CursorDir.Left)
                            this.moveCursor(CursorDir.Right)
                        },
                    }),
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: icon,
                        x: 37,
                        y: 12,
                        onClick: () => {
                            // right Track
                            pattern.channels[this.rightTrack].copy(
                                this.channelCopied,
                            )
                            this.channelCopied = null
                            this.fillPatternBtns()
                            this.resetEnum()
                            this.resetControllerEvents()
                            this.moveCursor(CursorDir.Left)
                            this.moveCursor(CursorDir.Right)
                        },
                    }),
                ],
                [
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "sample_selection_arrow_right",
                        x: 70,
                        y: -40,
                        onClick: () => {
                            this.leftTrack++
                            this.rightTrack++

                            if (this.leftTrack > 3) this.leftTrack = 0
                            if (this.rightTrack > 3) this.rightTrack = 0

                            this.drawGrid()
                        },
                    }),
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "sample_selection_arrow_left",
                        x: -70,
                        y: -40,
                        onClick: () => {
                            this.leftTrack--
                            this.rightTrack--

                            if (this.leftTrack < 0) this.leftTrack = 3
                            if (this.rightTrack < 0) this.rightTrack = 3
                        },
                    }),
                ],
            ])
            this.moveCursor(CursorDir.Left)
        }

        private fullCopyConfirmation(copyIndex: number) {
            // Copy To a new or existing pattern
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }
            this.screenShown = ScreenShown.CopyConfirmation
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
                            // Copy to new pattern
                            let newPat = this.song.newPattern()
                            for (let i = 0; i < newPat.channels.length; i++) {
                                newPat.channels[i].copy(
                                    this.song.patterns[copyIndex].channels[i],
                                )
                            }
                            this.fillPatternBtns()
                            this.resetEnum()
                            this.resetControllerEvents()
                            this.moveCursor(CursorDir.Left)
                            this.moveCursor(CursorDir.Right)
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
                            this.fullCopySelection(copyIndex)
                        },
                    }),
                ],
            ])
            this.cursor.setOutlineColour(0x2)
            this.moveCursor(CursorDir.Down)
        }

        private fullCopySelection(copyIndex: number) {
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }

            this.copiedPatternIndex = copyIndex
            this.screenShown = ScreenShown.FullCopySelection
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

                    if (
                        count < this.song.patterns.length &&
                        count != copyIndex
                    ) {
                        patternBtns[count] = new Button({
                            parent: null,
                            style: ButtonStyles.Transparent,
                            icon: "invisiblePatternButton",
                            x: x + 3,
                            y: y + 6,
                            onClick: () => {
                                for (let i = 0; i < NUM_CHANNELS; i++) {
                                    this.song.patterns[index].channels[i].copy(
                                        this.song.patterns[copyIndex].channels[
                                            i
                                        ],
                                    )
                                }

                                this.resetEnum()
                                this.fillPatternBtns()
                                this.resetControllerEvents()
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

            this.navigator.setBtns([patternBtns])

            this.moveCursor(CursorDir.Up)
            this.moveCursor(CursorDir.Down)
        }

        private patternClicked(clickedPatternIndex: number) {
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }

            this.unbindBackButton()

            this.screenShown = ScreenShown.Pattern
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
                                this.song.patternSequence[clickedPatternIndex],
                            )
                            this.resetEnum()
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
                            this.resetEnum()
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
            this.moveCursor(CursorDir.Up)
            this.moveCursor(CursorDir.Down)
        }

        private removeClicked(clickedPatternIndex: number) {
            if (this.isPlaying) {
                this.resetControllerEvents()
                this.isPlaying = false
            }

            this.resetEnum()
            this.screenShown = ScreenShown.Remove
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
                                this.song.patternSequence[clickedPatternIndex],
                            )
                            this.resetEnum()
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
                            this.resetEnum()
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
            this.screenShown = ScreenShown.Plus
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
                            this.resetEnum()
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
            this.resetEnum()
            this.screenShown = ScreenShown.Pick

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
                                this.resetEnum()
                                this.resetNavigator()
                                this.resetControllerEvents()
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

            this.navigator.setBtns([patternBtns])

            this.moveCursor(CursorDir.Up)
            this.moveCursor(CursorDir.Down)
        }

        public swapPattern() {
            this.resetEnum()
            this.screenShown = ScreenShown.PatternClickedSwap

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
                                this.resetEnum()
                                this.app.popScene()
                                this.app.pushScene(
                                    PatternScreen.getInstance(
                                        this.song.patterns[index],
                                    ),
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
                PatternScreen.getInstance(clickedPattern, this.app),
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
            this.navigator.setBtns([
                this.controlBtns,
                [
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "placeholder_long",
                        x: -3,
                        y: -27,
                        onClick: () => {
                            if (this.song.patterns.length > 0) {
                                this.copyClicked()
                            }
                        },
                    }),
                ],
                this.patternBtns,
            ])
        }

        private resetEnum() {
            this.screenShown = ScreenShown.Default
            this.cursor.setOutlineColour(0x9)
        }

        private unbindBackButton() {
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => {
                    this.resetEnum()
                    this.resetControllerEvents()
                    this.resetNavigator()
                    this.cursor.setOutlineColour(0x9)
                    this.moveCursor(CursorDir.Left)
                    this.moveCursor(CursorDir.Right)
                },
            )
        }

        private resetControllerEvents() {
            this.cursor.visible = true
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.up.id,
                () => {
                    if (!this.isPlaying) this.moveCursor(CursorDir.Up)
                },
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => {
                    if (!this.isPlaying) this.moveCursor(CursorDir.Down)
                },
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.right.id,
                () => this.moveCursor(CursorDir.Right),
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.left.id,
                () => this.moveCursor(CursorDir.Left),
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => {
                    this.backConfirmation()
                    this.moveCursor(CursorDir.Right)
                },
            )
        }
    }
}
