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

    const NUM_TRACKS = 4
    const NUM_VISIBLE_TRACKS = 2
    const NUM_VISIBLE_STEPS = 8
    const NUM_NOTES = 128
    const LEFT_TRACK_INDEX = 0
    const RIGHT_TRACK_INDEX = 1
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

    export class SoundTrackerScreen extends CursorSceneWithPriorPage {
        private static instance: SoundTrackerScreen | null = null
        private currentStep: number
        private currentTrack: number
        private trackData: string[][]
        private controlBtns: Button[]
        private sampleSelectBtn: Button
        private noteSelectBtn: Button
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

        private constructor(
            app: AppInterface,
            volume?: Setting,
            bpm?: Setting
        ) {
            super(
                app,
                function () {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
                new GridNavigator()
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

            this.samples = [
                // TODO: Temporary
                new Sample("FunBass_L", 1),
                new Sample("ResBass", 2),
                new Sample("ShortB", 3),
                new Sample("r8_drum", 4),
            ]

            // Grid data
            for (let i = 0; i < NUM_TRACKS; i++) {
                this.trackData[i] = []
                for (let j = 0; j < NUM_NOTES; j++) {
                    if (j % 2 == 0) this.trackData[i][j] = "-"
                    else this.trackData[i][j] = "C"
                }
            }
        }

        public static getInstance(
            app?: AppInterface,
            volume?: Setting,
            bpm?: Setting
        ) {
            if (!SoundTrackerScreen.instance) {
                if (app === undefined) {
                    console.error(
                        "SoundTrackerScreen singleton not initialized. Call with parameters first."
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
                    (this.sampleSelectBtn = new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "sample_section_select",
                        x: 0,
                        y: -40,
                        onClick: () => {
                            // this.activateSampleSelection()
                            // this.openSaveScreen()
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
                            this.selectedTrackPos = 0
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
                            this.selectedTrackPos = 1
                            this.selectedTrack = this.rightTrack
                        },
                    })),
                ],
                this.controlBtns,
            ])
        }

        private play() {
            if (this.isPlaying == true) return
            music.setVolume((this.volume.value / 100) * 255)
            this.isPlaying = true
            this.cursorVisible = true
            control.inBackground(() => {
                const tickSpeed = 60000 / this.bpm.value
                while (this.isPlaying && this.playedNote < NUM_NOTES) {
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

                    // this.draw()
                    this.playedNote += 1
                }
                this.isPlaying = false
            })
        }

        private pause() {
            this.isPlaying = false
        }

        private stop() {
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
            if (this.currentStep < 0) {
                this.currentStep = 0
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

        draw() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                0xc
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
                let note = this.trackData[this.leftTrack][tempStep]
                Screen.print(note, x, y, 0, font)

                // Draw right track
                x = startX + 1 * cellWidth
                note = this.trackData[this.rightTrack][tempStep]
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
                    0x9
                )
            } else if (this.cursorVisible) {
                Screen.drawRect(
                    startX + 0 * (cellWidth + 20) - 42,
                    startY + this.highlightHeight * cellHeight - 1,
                    145,
                    10,
                    0x1
                )
            }
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
            _font?: bitmaps.Font
        ) {
            if (!colour) colour = 0
            if (!_font) _font = font
            Screen.print(text, x, y, colour, _font)
        }

        private changeNote(direction: number) {
            const track = this.selectedTrack
            const step = this.currentStep

            let noteIndex = NOTES.indexOf(this.trackData[track][step])
            noteIndex = (noteIndex + direction + NOTES.length) % NOTES.length

            this.trackData[track][step] = NOTES[noteIndex]

            // Play the current note when it is changed
            // TODO: Implement in main
        }

        private activateNoteSelection() {
            this.cursor.visible = false
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.right.id,
                () => {
                    this.changeNote(1)
                }
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.left.id,
                () => {
                    this.changeNote(-1)
                }
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.up.id,
                () => {
                    let tick = true
                    control.onEvent(
                        ControllerButtonEvent.Released,
                        controller.up.id,
                        () => (tick = false)
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
                        () => {}
                    )
                }
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => {
                    let tick = true
                    control.onEvent(
                        ControllerButtonEvent.Released,
                        controller.down.id,
                        () => (tick = false)
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
                        () => {}
                    )
                }
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
                }
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
                                    this.samples[this.leftTrack]
                                )
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
                                    this.samples[this.rightTrack]
                                )
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
                }
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

        public save(slot: number) {
            let sampleNames = [
                this.samples[0].name,
                this.samples[1].name,
                this.samples[2].name,
                this.samples[3].name,
            ]

            datalogger.log(
                datalogger.createCV("track_data_" + slot, this.trackData),
                datalogger.createCV("samples_" + slot, sampleNames)
            )
        }

        public loadFromSave(
            savedTrackData: string[][],
            savedSamples: Sample[]
        ) {
            // Restore the track data
            this.trackData = savedTrackData

            // Restore the samples
            for (
                let i = 0;
                i < Math.min(this.samples.length, savedSamples.length);
                i++
            ) {
                this.samples[i] = savedSamples[i]
            }

            // Reset playback state
            this.isPlaying = false
            this.currentStep = 0
            this.playedNote = 0
            this.highlightHeight = 0
        }

        public openSaveScreen() {
            this.app.popScene()
            this.app.pushScene(
                new SaveLoadScreen(this.app, this, SaveLoadMode.SAVE)
            )
        }
    }
}
