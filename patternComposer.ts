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

    export const NUM_VISIBLE_STEPS = 8
    export const LEFT_TRACK_INDEX = 0
    export const RIGHT_TRACK_INDEX = 1
    const NOTES = [
        "-",
        "C#",
        "C",
        "Cb",
        "D#",
        "D",
        "Db",
        "E#",
        "E",
        "Eb",
        "F#",
        "F",
        "Fb",
        "G#",
        "G",
        "Gb",
        "A#",
        "A",
        "Ab",
        "B#",
        "B",
        "Bb",
    ]

    export const SEMITONE_OFFSETS: { [key: string]: number | null } = {
        C: 0,
        "C#": 1,
        Db: 1,
        D: 2,
        "D#": 3,
        Eb: 3,
        E: 4,
        Fb: 4,
        "E#": 5,
        F: 5,
        "F#": 6,
        Gb: 6,
        G: 7,
        "G#": 8,
        Ab: 8,
        A: 9,
        "A#": 10,
        Bb: 10,
        B: 11,
        Cb: 11,
        "B#": 0, // enharmonic to C
        "-": null,
    }

    enum NoteDirection {
        UP = 1,
        DOWN = -1,
    }

    export class PatternScreen extends CursorSceneWithPriorPage {
        private static instance: PatternScreen | null = null
        private currentStep: number
        private currentTrack: number
        private controlBtns: Button[]
        private sampleSelectBtn: Button
        private noteSelectBtn: Button
        private icon: Bitmap
        private isPlaying: boolean
        private highlightHeight: number
        private isSelectingNote: boolean
        private selectedTrack: number
        private leftTrack: number
        private volume: Setting
        private selectedTrackPos: number
        private bpm: Setting
        private isSelectingSample: boolean
        private rightTrack: number
        private cursorVisible: boolean
        private playedNote: number
        private hasClickedBack: boolean
        private stopped: boolean

        private pattern: Pattern

        private constructor(
            app: AppInterface,
            pattern: Pattern,
            volume?: Setting,
            bpm?: Setting,
        ) {
            super(
                app,
                function () {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
                new GridNavigator(),
            )

            if (volume) {
                this.volume = volume
            } else {
                this.volume = new Setting(100)
            }
            if (bpm) {
                this.bpm = bpm
            } else {
                this.bpm = new Setting(120)
            }

            this.pattern = pattern

            this.selectedTrackPos = 0
            this.currentStep = 0
            this.currentTrack = 0
            this.leftTrack = 0
            this.rightTrack = 1
            this.highlightHeight = 0
            this.isSelectingNote = false
            this.volume = new Setting(100)
            this.bpm = new Setting(120)
            this.isSelectingSample = false
            this.playedNote = 0
            this.hasClickedBack = false
            this.stopped = false
        }

        public static getInstance(
            pattern: Pattern,
            app?: AppInterface,
            volume?: Setting,
            bpm?: Setting,
        ) {
            if (!PatternScreen.instance) {
                if (app === undefined || pattern === undefined) {
                    console.error(
                        "PatternScreen singleton not initialized. Call with parameters first.",
                    )
                }
                PatternScreen.instance = new PatternScreen(app, pattern)
            }

            if (!pattern) {
                console.error("Pattern required")
            }
            PatternScreen.instance.setPattern(pattern)

            return PatternScreen.instance
        }

        /* override */ startup() {
            super.startup()
            basic.pause(1)

            this.icon = getIcon("placeholder", true)
                .doubled()
                .doubled()
                .doubledY()

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
                    icon: "small_pattern_button",
                    x: 34,
                    y: -54,
                    onClick: () => {
                        this.app.popScene()
                        this.app.pushScene(SongComposerScreen.getInstance())
                        SongComposerScreen.getInstance().swapPattern()
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

            this.resetNavigator()
            this.resetControllerEvents()
        }

        private setPattern(pattern: Pattern) {
            this.pattern = pattern
        }

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
                            this.hasClickedBack = false
                            this.app.popScene()
                            this.app.pushScene(
                                SongComposerScreen.getInstance(this.app),
                            )
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
                            this.moveCursor(CursorDir.Left)
                            this.moveCursor(CursorDir.Right)
                        },
                    }),
                ],
            ])
            this.moveCursor(CursorDir.Down)
        }

        public resetNavigator() {
            this.navigator.setBtns([
                [
                    (this.sampleSelectBtn = new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "sample_section_select",
                        x: 0,
                        y: -40,
                        onClick: () => {
                            this.activateSampleSelection()
                        },
                    })),
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
                [
                    (this.noteSelectBtn = new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: this.icon,
                        x: -36,
                        y: 12,
                        onClick: () => {
                            this.activateNoteSelection()
                            this.selectedTrackPos = LEFT_TRACK_INDEX
                            this.selectedTrack = this.leftTrack
                        },
                    })),
                    (this.noteSelectBtn = new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: this.icon,
                        x: 37,
                        y: 12,
                        onClick: () => {
                            this.activateNoteSelection()
                            this.selectedTrackPos = RIGHT_TRACK_INDEX
                            this.selectedTrack = this.rightTrack
                        },
                    })),
                ],
                this.controlBtns,
            ])
        }

        private play() {
            if (this.isPlaying == true) return
            this.stopped = false
            music.setVolume((Settings.volume.value / 100) * 255)
            samples.enable()
            this.isPlaying = true
            this.cursorVisible = true
            control.inBackground(() => {
                const tickSpeed = 60000 / Settings.bpm.value
                while (this.isPlaying && this.playedNote < MAX_NOTES) {
                    for (let i = 0; i < NUM_CHANNELS; i++) {
                        this.playNote(
                            i,
                            this.pattern.channels[i].sample.audioBuffer,
                        )
                    }
                    basic.pause(tickSpeed)
                    // Only increment highlightHeight if it's within bounds
                    if (this.highlightHeight < 3) this.highlightHeight++
                    else if (
                        this.currentStep > MAX_NOTES - 6 &&
                        this.currentStep < MAX_NOTES - 1
                    ) {
                        if (this.highlightHeight < 7) {
                            this.highlightHeight++
                        }
                    }

                    if (this.currentStep != MAX_NOTES - 1)
                        this.currentStep =
                            Math.abs(this.currentStep + 1) % MAX_NOTES

                    this.playedNote += 1
                }
                this.isPlaying = false
                if (this.stopped) {
                    this.playedNote = 0
                    this.highlightHeight = 0
                    this.currentStep = 0
                }
            })
        }

        private playNote(src: number, buf: Buffer) {
            const offset =
                SEMITONE_OFFSETS[
                    this.pattern.channels[src].notes[this.playedNote]
                ]
            if (offset == null) return // "-" or invalid note

            const multiplier =
                2 **
                (this.pattern.channels[src].octaves[this.playedNote] -
                    3 +
                    offset / 12)
            const rate = 8800 * multiplier

            samples.setSampleRate(src, rate)
            samples.playAsync(src, buf)
        }

        private pause() {
            this.isPlaying = false
        }

        private stop() {
            this.isPlaying = false
            this.stopped = true
            this.cursorVisible = false
            this.playedNote = 0
            this.currentStep = 0
            this.highlightHeight = 0
        }

        private rewind() {
            this.currentStep = this.currentStep - 8
            this.playedNote = this.playedNote - 8
            if (
                this.currentStep < 0 ||
                this.currentStep - this.highlightHeight < 0 ||
                this.playedNote < 0
            ) {
                this.currentStep = 0
                this.highlightHeight = 0
                this.playedNote = 0
            }
            this.drawGrid()
        }

        private fastForward() {
            this.currentStep = this.currentStep + 8
            if (this.currentStep > MAX_NOTES - 8) {
                this.currentStep = MAX_NOTES - 8
            }
            this.drawGrid()
        }

        private drawBankSelector() {
            let y = -56
            let x = 32
            Screen.print(this.pattern.id.toString(), x, y, 0, bitmaps.font5)

            Screen.drawRect(x - 3, y - 3, 10, 11, 0)
        }

        draw() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                0xc,
            )
            this.navigator.drawComponents()

            if (this.hasClickedBack) {
                Screen.fillRect(-57, -37, 120, 80, 0)
                Screen.fillRect(-60, -40, 120, 80, 0x6)
                this.drawText(-53, -25, "Return to previous")
                this.drawText(-15, -8, "page?")
                this.cursor.setOutlineColour(0x2)
                this.drawText(-30, 15, "Yes")
                this.drawText(15, 15, "No")
                this.cursor.draw()
                super.draw()
                return
            }

            for (let btns of this.controlBtns) {
                btns.draw()
            }

            this.drawSamples()
            this.drawGrid()
            this.drawBankSelector()
            this.cursor.setOutlineColour(0x9)
            super.draw()
        }

        private drawSamples() {
            if (this.isSelectingSample) {
                // Screen.drawRect(
                //     startX + this.selectedTrack * (cellWidth + 20) - 42,
                //     startY + this.highlightHeight * cellHeight - 1,
                //     70,
                //     10,
                //     0x9
                // )
            }
            this.drawText(
                -60,
                -44,
                this.pattern.channels[this.leftTrack].sample.name,
            )
            this.drawText(
                8,
                -44,
                this.pattern.channels[this.rightTrack].sample.name,
            )
            Screen.drawLine(0, -44, 0, -36, 0xb)
            Screen.drawLine(0, -20, 0, 42, 0xb)
        }

        private drawGrid() {
            const startX = -30
            const startY = -30
            const cellWidth = 55
            const cellHeight = 11

            for (
                let step = this.currentStep;
                step < this.currentStep + NUM_VISIBLE_STEPS;
                step++
            ) {
                let tempStep = step - this.highlightHeight
                const y = startY + (step - this.currentStep) * cellHeight
                const stepString = (tempStep + 1).toString()
                const digitCount = stepString.length
                const rightX = 65 - (digitCount - 1) * 6

                Screen.print(stepString, -70, y, 0, font)
                Screen.print(stepString, rightX, y, 0, font)

                // Draw left track
                let x = startX + 0 * cellWidth
                let note = this.pattern.channels[this.leftTrack].notes[tempStep]

                if (note == "-") {
                    Screen.print("-", x, y, 0, font)
                } else {
                    note = `${note}${
                        this.pattern.channels[this.leftTrack].octaves[tempStep]
                    }`
                    Screen.print(note, x, y, 0, font)
                }

                // Draw right track
                x = startX + 1 * cellWidth

                note = this.pattern.channels[this.rightTrack].notes[tempStep]
                if (note == "-") {
                    Screen.print("-", x, y, 0, font)
                } else {
                    note = `${note}${
                        this.pattern.channels[this.rightTrack].octaves[tempStep]
                    }`
                    Screen.print(note, x, y, 0, font)
                }
            }

            if (this.isPlaying) {
            }

            if (this.isSelectingNote) {
                Screen.drawRect(
                    startX + this.selectedTrackPos * (cellWidth + 20) - 42,
                    startY + this.highlightHeight * cellHeight - 1,
                    70,
                    10,
                    0x9,
                )
            } else if (this.cursorVisible) {
                Screen.drawRect(
                    startX + 0 * (cellWidth + 20) - 42,
                    startY + this.highlightHeight * cellHeight - 1,
                    145,
                    10,
                    0x1,
                )
            }
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

        private changeNote(direction: NoteDirection) {
            let octave =
                this.pattern.channels[this.selectedTrack].octaves[
                    this.currentStep
                ]
            let note =
                this.pattern.channels[this.selectedTrack].notes[
                    this.currentStep
                ]

            let noteIndex = NOTES.indexOf(note)
            noteIndex = noteIndex + direction

            switch (direction) {
                case NoteDirection.UP: {
                    if (!(noteIndex > NOTES.length - 1)) {
                        break
                    }

                    noteIndex = 0
                    if (octave == 4) {
                        octave = 2
                    } else {
                        octave += 1
                    }
                }
                case NoteDirection.DOWN: {
                    if (!(noteIndex < 0)) {
                        break
                    }
                    noteIndex = NOTES.length - 1

                    if (octave == 2) {
                        octave = 4
                    } else {
                        octave -= 1
                    }
                }
            }

            this.pattern.channels[this.selectedTrack].setNoteAndOctave(
                NOTES[noteIndex],
                octave,
                this.currentStep,
            )

            const offset =
                SEMITONE_OFFSETS[

                ]
            if (offset == null) return // "-" or invalid note

            const multiplier =
                2 **
                (octave -
                    3 +
                    offset / 12)
            const rate = 8800 * multiplier

            samples.setSampleRate(0, rate)
            samples.playAsync(0, this.pattern.channels[this.selectedTrack].sample.audioBuffer)
        }

        private activateNoteSelection() {
            this.cursor.visible = false
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.right.id,
                () => {
                    this.changeNote(1)
                },
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.left.id,
                () => {
                    this.changeNote(-1)
                },
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.up.id,
                () => {
                    let tick = true
                    control.onEvent(
                        ControllerButtonEvent.Released,
                        controller.up.id,
                        () => (tick = false),
                    )
                    let counter = 0
                    // Control logic:
                    while (tick) {
                        if (this.highlightHeight > 0) this.highlightHeight--
                        if (this.currentStep != 0)
                            this.currentStep =
                                (this.currentStep - 1) % MAX_NOTES

                        if (counter < 10) {
                            counter++
                            basic.pause(150)
                        } else if (counter < 30) {
                            counter++
                            basic.pause(100)
                        } else {
                            basic.pause(75)
                        }
                    }

                    // Reset binding
                    control.onEvent(
                        ControllerButtonEvent.Released,
                        controller.up.id,
                        () => {},
                    )
                },
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => {
                    let tick = true
                    control.onEvent(
                        ControllerButtonEvent.Released,
                        controller.down.id,
                        () => (tick = false),
                    )
                    let counter = 0
                    // Control logic:
                    while (tick) {
                        if (this.highlightHeight < 3) this.highlightHeight++
                        else if (
                            this.currentStep > MAX_NOTES - 6 &&
                            this.currentStep < MAX_NOTES - 1
                        ) {
                            // Prevent the highlightHeight from exceeding a reasonable maximum
                            if (this.highlightHeight < 7) {
                                this.highlightHeight++
                            }
                        }

                        if (this.currentStep != MAX_NOTES - 1)
                            this.currentStep =
                                Math.abs(this.currentStep + 1) % MAX_NOTES

                        if (counter < 10) {
                            counter++
                            basic.pause(150)
                        } else if (counter < 30) {
                            counter++
                            basic.pause(100)
                        } else {
                            basic.pause(75)
                        }
                    }

                    // Reset binding
                    control.onEvent(
                        ControllerButtonEvent.Released,
                        controller.down.id,
                        () => {},
                    )
                },
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => {
                    this.resetControllerEvents()
                    this.isSelectingNote = false
                    this.currentStep = this.currentStep - this.highlightHeight
                    this.highlightHeight = 0
                    // Code for setting the buttons again
                },
            )
            this.isSelectingNote = true
        }

        private activateSampleSelection() {
            this.currentTrack = this.leftTrack
            this.isSelectingSample = true
            this.navigator.setBtns([
                [
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "sample_button_small",
                        x: -34,
                        y: -40,
                        onClick: () => {
                            this.app.popScene()
                            this.app.pushScene(
                                new SampleSelectionScreen(
                                    this.app,
                                    this,
                                    this.pattern.channels[this.leftTrack],
                                ),
                            )
                        },
                    }),
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "sample_button_small",
                        x: 35,
                        y: -40,
                        onClick: () => {
                            this.app.popScene()
                            this.app.pushScene(
                                new SampleSelectionScreen(
                                    this.app,
                                    this,
                                    this.pattern.channels[this.rightTrack],
                                ),
                            )
                        },
                    }),
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

            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => {
                    this.resetNavigator()
                    this.resetControllerEvents()
                    this.moveCursor(CursorDir.Right)
                },
            )

            this.moveCursor(CursorDir.Down)
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
