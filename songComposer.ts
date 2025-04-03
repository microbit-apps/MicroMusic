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
    const NOTES = ["C", "D", "E", "F", "G", "A", "B"]

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

            this.currentStep = 0
            this.currentTrack = 0

            this.icon = getIcon("placeholder", true)
                .doubled()
                .doubled()
                .doubled()
                .doubledY()

            const y = Screen.HEIGHT * 0.234 // y = 30 on an Arcade Shield of height 128 pixels

            this.cursor.setBorderThickness(1)

            this.controlBtns = [
                new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "back_arrow",
                    ariaId: "back_arrow_temp",
                    x: -68,
                    y: y - 78,
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
                    y: y - 80,
                    onClick: () => {
                        this.rewind()
                    },
                }),
                new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "play",
                    x: -12,
                    y: y - 80,
                    onClick: () => {
                        this.play()
                    },
                }),
                new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "pause",
                    x: 0,
                    y: y - 80,
                    onClick: () => {
                        this.pause()
                    },
                }),
                new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "stop",
                    x: 12,
                    y: y - 80,
                    onClick: () => {
                        // this.app.popScene()
                        // this.app.pushScene(new Home(this.app))
                        this.stop()
                    },
                }),
                new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "fast_forward",
                    x: 26,
                    y: y - 80,
                    onClick: () => {
                        // this.app.popScene()
                        this.trackData[0][0] = "G"
                        // this.app.pushScene(new Home(this.app))
                        this.fastForward()
                    },
                }),
                new Button({
                    parent: null,
                    style: ButtonStyles.Transparent,
                    icon: "small_cog",
                    ariaId: "small_cog_temp",
                    x: 70,
                    y: y - 78,
                    onClick: () => {
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
                    // (this.sampleSelectBtn1 = new Button({
                    //     parent: null,
                    //     style: ButtonStyles.Transparent,
                    //     icon: "sample_button",
                    //     ariaId: "1",
                    //     x: -42,
                    //     y: y - 60,
                    //     onClick: () => {
                    //         // this.app.popScene()
                    //         // this.app.pushScene(new Home(this.app))
                    //     },
                    // })),
                    // (this.controlSelectBtn = new Button({
                    //     parent: null,
                    //     style: ButtonStyles.Transparent,
                    //     icon: "section_select",
                    //     ariaId: "2",
                    //     x: 8,
                    //     y: 0,
                    //     onClick: () => {
                    //         this.setNavigator(1, 5, [this.playBtn])
                    //         // control.onEvent(
                    //         //     ControllerButtonEvent.Pressed,
                    //         //     controller.B.id,
                    //         //     () => {}
                    //         // )
                    //         // this.app.popScene()
                    //         // this.app.pushScene(new Home(this.app))
                    //     },
                    // })),
                    (this.sampleSelectBtn = new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "sample_section_select",
                        x: 0,
                        y: -36,
                        onClick: () => {
                            // this.app.popScene()
                            // this.app.pushScene(new Home(this.app))
                        },
                    })),
                ],
                [
                    (this.noteSelectBtn = new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: this.icon,
                        x: 0,
                        y: 16,
                        onClick: () => {
                            this.navigator.setBtns([
                                [
                                    new Button({
                                        parent: null,
                                        style: ButtonStyles.Transparent,
                                        icon: "sample_button",
                                        x: -42,
                                        y: -30,
                                        onClick: () => {
                                            // this.app.popScene()
                                            // this.app.pushScene(new Home(this.app))
                                        },
                                    }),
                                ],
                            ])
                            this.moveCursor(CursorDir.Down)
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
            this.drawText(-60, -40, "Sample 1")
            this.drawText(15, -40, "Sample 2")
            Screen.drawLine(0, -40, 0, -32, 0xb)
            Screen.drawLine(0, -20, 0, 53, 0xb)
        }

        private drawGrid() {
            const startX = -30
            const startY = Screen.HEIGHT * 0.234 - 50
            const cellWidth = 55
            const cellHeight = 10

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

                // Convert step number to string
                const stepString = step.toString()
                const digitCount = stepString.length

                // Adjust X position dynamically based on number of digits
                const rightX = 60 - (digitCount - 1) * 3 // Move left 5 pixels per extra digit

                // Print step numbers
                Screen.print(stepString, -70, y, 0xb, font) // Left side remains the same
                Screen.print(stepString, rightX, y, 0xb, font) // Right side adjusts
            }
        }

        private drawText(x: number, y: number, text: string) {
            Screen.print(text, x, y, 0xb, font)
        }
    }
}
