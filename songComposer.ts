namespace micromusic {
    import CursorSceneWithPriorPage = user_interface_base.CursorSceneWithPriorPage
    import GridNavigator = user_interface_base.GridNavigator
    import CursorDir = user_interface_base.CursorDir
    import AppInterface = user_interface_base.AppInterface
    import Screen = user_interface_base.Screen
    import GUIComponentScene = microgui.GUIComponentScene
    import getIcon = user_interface_base.getIcon
    import ButtonCollection = microgui.ButtonCollection
    import Button = user_interface_base.Button
    import GUIComponentAlignment = microgui.GUIComponentAlignment
    import ButtonStyles = user_interface_base.ButtonStyles
    import font = user_interface_base.font

    const NUM_TRACKS = 4
    const NUM_VISIBLE_TRACKS = 2
    const NUM_VISIBLE_STEPS = 8
    const NUM_NOTES = 256
    const NOTES = [
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "E#",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B",
        "B#",
    ]

    export class SoundTrackerScreen extends CursorSceneWithPriorPage {
        private currentStep: number
        private currentTrack: number
        private trackData: string[][]
        private controlBtns: Button[]
        private sampleSelectBtn: Button
        private noteSelectBtn: Button
        private icon: Bitmap
        private playing: boolean

        constructor(app: AppInterface) {
            super(
                app,
                function () {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
                new GridNavigator()
            )

            this.currentStep = 0
            this.currentTrack = 0

            this.trackData = []

            // Grid data
            for (let i = 0; i < NUM_TRACKS; i++) {
                this.trackData[i] = []
                for (let j = 0; j < NUM_NOTES; j++) {
                    if (j % 2 == 0) this.trackData[i][j] = "-"
                    else this.trackData[i][j] = "C"
                }
            }
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
                    icon: "back_arrow",
                    x: -68,
                    y: -52,
                    onClick: () => {
                        this.app.popScene()
                        this.app.pushScene(new Home(this.app))
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
                    icon: "small_cog",
                    x: 70,
                    y: -52,
                    onClick: () => {
                        this.app.popScene()
                        this.app.pushScene(new SettingsScreen(this.app, this))
                    },
                }),
            ]

            this.resetNavigator()
        }

        public resetNavigator() {
            this.navigator.setBtns([
                this.controlBtns,
                [
                    (this.sampleSelectBtn = new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "sample_section_select",
                        x: 0,
                        y: -40,
                        onClick: () => {},
                    })),
                ],
                [
                    (this.noteSelectBtn = new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: this.icon,
                        x: -36,
                        y: 12,
                        onClick: () => {
                            // this.navigator.setBtns([
                            //     [
                            //         new Button({
                            //             parent: null,
                            //             style: ButtonStyles.Transparent,
                            //             icon: "sample_button",
                            //             x: -42,
                            //             y: -30,
                            //             onClick: () => {
                            //                 // this.app.popScene()
                            //                 // this.app.pushScene(new Home(this.app))
                            //             },
                            //         }),
                            //     ],
                            // ])
                            // this.moveCursor(CursorDir.Down)
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
                            // this.navigator.setBtns([
                            //     [
                            //         new Button({
                            //             parent: null,
                            //             style: ButtonStyles.Transparent,
                            //             icon: "sample_button",
                            //             x: -42,
                            //             y: -30,
                            //             onClick: () => {
                            //                 // this.app.popScene()
                            //                 // this.app.pushScene(new Home(this.app))
                            //             },
                            //         }),
                            //     ],
                            // ])
                            // this.moveCursor(CursorDir.Down)
                        },
                    })),
                ],
            ])
        }

        private play() {
            this.playing = true
            control.inBackground(() => {
                while (this.playing && this.currentStep <= 255 - 8) {
                    this.currentStep += 1
                    this.draw()
                    basic.pause(200)
                }
                this.playing = false
            })
        }

        private pause() {
            this.playing = false
        }

        private stop() {
            this.playing = false
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
            if (this.currentStep > 255 - 7) {
                this.currentStep = 255 - 7
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

            for (let btns of this.controlBtns) {
                btns.draw()
            }

            this.drawSamples()
            this.drawGrid()
            super.draw()
        }

        private drawSamples() {
            this.drawText(-60, -44, "Sample 1")
            this.drawText(15, -44, "Sample 2")
            Screen.drawLine(0, -44, 0, -36, 0xb)
            Screen.drawLine(0, -24, 0, 49, 0xb)
        }

        private drawGrid() {
            const startX = -30
            const startY = -30
            const cellWidth = 55
            const cellHeight = 11

            for (let track = 0; track < NUM_VISIBLE_TRACKS; track++) {
                for (
                    let step = this.currentStep;
                    step - this.currentStep < NUM_VISIBLE_STEPS;
                    step++
                ) {
                    const x = startX + track * cellWidth
                    const y = startY + (step - this.currentStep) * cellHeight

                    const note = this.trackData[track][step]
                    Screen.print(note, x, y, 0xb, font)
                }
            }

            for (
                let step = this.currentStep;
                step < this.currentStep + 8;
                step++
            ) {
                const y = startY + (step - this.currentStep) * cellHeight
                const stepString = step.toString()
                const digitCount = stepString.length

                // Adjust X position dynamically based on number of digits
                const rightX = 65 - (digitCount - 1) * 6 // Move left 6 pixels per extra digit, helps keep number clean

                // Print step numbers
                Screen.print(stepString, -70, y, 0xb, font) // Left side stays the same
                Screen.print(stepString, rightX, y, 0xb, font) // Right side adjusts to make numbers look more natural
            }
        }

        private drawText(x: number, y: number, text: string) {
            Screen.print(text, x, y, 0xb, font)
        }

        private changeNote(direction: number) {
            const track = this.currentTrack
            const step = this.currentStep

            let noteIndex = NOTES.indexOf(this.trackData[track][step])
            noteIndex = (noteIndex + direction + NOTES.length) % NOTES.length

            this.trackData[track][step] = NOTES[noteIndex]
        }

        private activateNoteSelection() {
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
                    this.currentStep =
                        (Math.abs(this.currentStep - 1) % 256) - 1
                }
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => {
                    this.currentStep = Math.abs(this.currentStep + 1) % 256
                }
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => {
                    this.resetControllerEvents()
                    // Code for setting the buttons again
                }
            )
        }

        private resetControllerEvents() {
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.up.id,
                () => this.moveCursor(CursorDir.Up)
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => this.moveCursor(CursorDir.Down)
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
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                }
            )
        }
    }
}
