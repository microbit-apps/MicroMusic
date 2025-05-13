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

<<<<<<< HEAD
<<<<<<< HEAD
    const NUM_TRACKS = 4
    const NUM_VISIBLE_STEPS = 8
    const NUM_NOTES = 128
    const LEFT_TRACK_INDEX = 0
    const RIGHT_TRACK_INDEX = 1
    const TOTAL_BANKS = 4
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

    const SEMITONE_OFFSETS: { [key: string]: number | null } = {
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

    type Note = [string, number]

    export class SoundTrackerScreen extends CursorSceneWithPriorPage {
        private static instance: SoundTrackerScreen | null = null
        private currentStep: number
        private currentTrack: number
        private trackData: Note[][][]
        private currentBank: number
        private controlBtns: Button[]
        private samples: Sample[]
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
        private octave: number

        private constructor(
            app: AppInterface,
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
            this.trackData = []
            this.currentBank = 0

            this.samples = [
                // TODO: Temporary
                new Sample("FunBass_L", 1),
                new Sample("ResBass", 2),
                new Sample("ShortB", 3),
                new Sample("r8_drum", 4),
            ]

            // Grid data
            for (let b = 0; b < TOTAL_BANKS; b++) {
                this.trackData[b] = []
                for (let i = 0; i < NUM_TRACKS; i++) {
                    this.trackData[b][i] = []
                    for (let j = 0; j < NUM_NOTES; j++) {
                        this.trackData[b][i][j] = ["-", 3]
                    }
                }
            }
        }

        public static getInstance(
            app?: AppInterface,
            volume?: Setting,
            bpm?: Setting,
        ) {
            if (!SoundTrackerScreen.instance) {
                if (app === undefined) {
                    console.error(
                        "SoundTrackerScreen singleton not initialized. Call with parameters first.",
                    )
                }
                SoundTrackerScreen.instance = new SoundTrackerScreen(app)
            }

            return SoundTrackerScreen.instance
        }

        /* override */ startup() {
            super.startup()

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
                    x: 0,
                    y: -54,
                    onClick: () => {
                        this.pause()
                    },
                }),
                new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "stop",
                    x: 12,
                    y: -54,
                    onClick: () => {
                        this.stop()
                    },
                }),
                new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "fast_forward",
                    x: 26,
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
                                this.bpm,
                            ),
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
                    x: -22,
                    y: -54,
                    onClick: () => {
                        this.rewind()
                    },
                }),
                new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "play",
                    x: -12,
                    y: -54,
                    onClick: () => {
                        this.play()
                    },
                }),
            ]

            this.resetNavigator()
            this.resetControllerEvents()
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
                            this.resetNavigator()
                            this.moveCursor(CursorDir.Up)
                            this.moveCursor(CursorDir.Down)
                        },
                    }),
                ],
            ])
            this.moveCursor(CursorDir.Down)
        }

        public resetNavigator() {
            this.navigator.setBtns([
                [
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "sample_section_select",
                        x: 0,
                        y: -40,
                        onClick: () => {
                            this.activateSampleSelection()
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
                [
                    new Button({
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
                    }),
                    new Button({
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
                    }),
                ],
                this.controlBtns,
            ])
        }

        private play() {
            if (this.isPlaying == true) return
            this.isPlaying = true
            this.cursorVisible = true

            samples.enable()
            music.setVolume((this.volume.value / 100) * 255)

            control.inBackground(() => {
                const tickSpeed = 60000 / this.bpm.value
                while (this.isPlaying && this.playedNote < NUM_NOTES) {
                    for (let i = 0; i < NUM_TRACKS; i++) {
                        this.playNote(i, this.samples[i].audioBuffer)
                    }
                    basic.pause(tickSpeed)
                    // Only increment highlightHeight if it's within bounds
                    if (this.highlightHeight < 3) this.highlightHeight++
                    else if (
                        this.currentStep > NUM_NOTES - 6 &&
                        this.currentStep < NUM_NOTES - 1
                    ) {
                        if (this.highlightHeight < 7) {
                            this.highlightHeight++
                        }
                    }

                    if (this.currentStep != NUM_NOTES - 1)
                        this.currentStep =
                            Math.abs(this.currentStep + 1) % NUM_NOTES

                    this.playedNote += 1
                }
                this.isPlaying = false
            })
        }

        private playNote(src: number, buf: Buffer) {
            const offset =
                SEMITONE_OFFSETS[
                    (
                        this.trackData[this.currentBank][src][
                            this.playedNote
                        ] as any[]
                    )[0]
                ]
            if (offset == null) return // "-" or invalid note

            const multiplier =
                2 **
                ((
                    this.trackData[this.currentBank][src][
                        this.playedNote
                    ] as any[]
                )[1] -
                    3 +
                    offset / 12)
            const rate = 8800 * multiplier

            samples.setSampleRate(src, rate)
            samples.playAsync(src, buf)
        }

        private pause() {
            music.setVolume(0)
            this.isPlaying = false
        }

        private stop() {
            music.setVolume(0)
            this.isPlaying = false
            this.cursorVisible = false
            basic.pause(200)
            this.playedNote = 0
            this.highlightHeight = 0
            this.currentStep = 0
            this.drawGrid()
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
            if (this.currentStep > NUM_NOTES - 8) {
                this.currentStep = NUM_NOTES - 8
            }
            this.drawGrid()
        }

        private drawBankSelector() {
            const bankWidth = 20
            const bankHeight = 10
            const startX = -60
            const y = 55

            for (let i = 0; i < TOTAL_BANKS; i++) {
                const x = startX + i * (bankWidth + 5)
                const color = i === this.currentBank ? 0x2 : 0x1
                Screen.fillRect(x, y, bankWidth, bankHeight, color)
                Screen.print((i + 1).toString(), x + 7, y + 2, 0x0)
            }

            // Add labels
            Screen.print("BANK:", -90, y + 2, 0x1)
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
                this.drawText(-36, -30, "Return Home?")
                Screen.print("Any unsaved work", -48, -20, 0x2)
                Screen.print("will be lost", -38, -10, 0x2)
                this.drawText(-30, 15, "Yes")
                this.drawText(15, 15, "No")
                this.cursor.draw()
                return
            }

            for (let btns of this.controlBtns) {
                btns.draw()
            }

            this.drawSamples()
            this.drawGrid()
            this.drawBankSelector()
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
            this.drawText(-60, -44, this.samples[this.leftTrack].name)
            this.drawText(8, -44, this.samples[this.rightTrack].name)
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
                let noteTuple =
                    this.trackData[this.currentBank][this.leftTrack][tempStep]
                let note: any
                if ((noteTuple as any[])[0] != "-") {
                    note = `${(noteTuple as any[])[0]}${
                        (noteTuple as any[])[1]
                    }`
                } else {
                    note = "-"
                }
                Screen.print(note, x, y, 0, font)

                // Draw right track
                x = startX + 1 * cellWidth
                noteTuple =
                    this.trackData[this.currentBank][this.rightTrack][tempStep]
                if ((noteTuple as any[])[0] != "-") {
                    note = `${(noteTuple as any[])[0]}${
                        (noteTuple as any[])[1]
                    }`
                } else {
                    note = "-"
                }
                Screen.print(note, x, y, 0, font)
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

        private switchToBank(bankIndex: number) {
            if (bankIndex >= 0 && bankIndex < TOTAL_BANKS) {
                // If playing, stop before switching banks
                if (this.isPlaying) {
                    this.pause()
                }

                this.currentBank = bankIndex

                // Reset current step when switching banks
                this.currentStep = 0

                // Redraw the screen
                this.draw()
            }
        }

        private nextBank() {
            this.switchToBank((this.currentBank + 1) % TOTAL_BANKS)
        }

        public setSampleForTrack(sample: Sample, track: number) {
            this.samples[track] = sample
            this.drawGrid()
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
            let octave = (
                this.trackData[this.currentBank][this.selectedTrack][
                    this.currentStep
                ] as any[]
            )[1]
            let note = (
                this.trackData[this.currentBank][this.selectedTrack][
                    this.currentStep
                ] as any[]
            )[0]

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

            this.trackData[this.currentBank][this.selectedTrack][
                this.currentStep
            ] = [NOTES[noteIndex], octave]

            console.log(
                this.trackData[this.currentBank][this.selectedTrack][
                    this.currentStep
                ],
            )
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
                                (this.currentStep - 1) % NUM_NOTES

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
                            this.currentStep > NUM_NOTES - 6 &&
                            this.currentStep < NUM_NOTES - 1
                        ) {
                            // Prevent the highlightHeight from exceeding a reasonable maximum
                            if (this.highlightHeight < 7) {
                                this.highlightHeight++
                            }
                        }

                        if (this.currentStep != NUM_NOTES - 1)
                            this.currentStep =
                                Math.abs(this.currentStep + 1) % NUM_NOTES

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
                                    this.samples[this.leftTrack],
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
                                    this.samples[this.rightTrack],
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
=======
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

    export class SongComposerScreen extends CursorSceneWithPriorPage {}
>>>>>>> e1d8b8e6a8c632f1ed4c74980ec2b6c18445423e
=======
    export class SongComposerScreen extends CursorSceneWithPriorPage {
        private static instance: SongComposerScreen | null = null
        private song: Song
        private controlBtns: Button[]
        private patternBtns: Button[]
        private bpm: Setting
        private volume: Setting
        private hasClickedBack: boolean
        private hasClickedPick: boolean
        private hasClickedNumber: boolean
        private hasClickedPlus: boolean
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

            if (this.hasClickedPick) {
                this.drawPick()
                this.navigator.drawComponents()
                this.cursor.draw()
                this.moveCursor(CursorDir.Down)
                return
            }

            this.drawBoxes()

            this.navigator.drawComponents()
            this.cursor.draw()
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
                        icon: ic.doubledX().doubledY(),
                        x: 21,
                        y: 18,
                        onClick: () => {
                            // TODO: Replace, this should let you swap it out or create a new one ideally. New dialogue for this
                            this.pickClicked(clickedPatternIndex)
                            // this.replaceClicked(clickedPatternIndex)
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
                            this.pickClicked(clickedPatternIndex)
                            this.resetBooleans()
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
                                this.resetBooleans()
                                this.resetNavigator()
                                this.moveCursor(CursorDir.Left)
                                this.moveCursor(CursorDir.Right)
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

            this.navigator.setBtns([
                // TODO: Make this add enough buttons for the number of patterns available
                patternBtns,
            ])
            // Way of making hasClickedPick false, also buttons for actually selecting and replacing
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
            this.hasClickedPick = false
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
>>>>>>> a2c7a471f0c0041e5ba1893016d84c032021aaea
}
