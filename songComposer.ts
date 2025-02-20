namespace micromusic {
    import CursorScene = user_interface_base.CursorSceneWithPriorPage
    import GridNavigator = user_interface_base.GridNavigator
    import AppInterface = user_interface_base.AppInterface
    import Screen = user_interface_base.Screen
    import Bounds = user_interface_base.Bounds
    import RowNavigator = user_interface_base.RowNavigator
    import getIcon = user_interface_base.getIcon
    import CustomButton = user_interface_base.CustomButton
    import Button = user_interface_base.Button
    import ButtonStyles = user_interface_base.ButtonStyles
    import font = user_interface_base.font

    const NUM_TRACKS = 2
    const NUM_STEPS = 8
    const NOTES = ["C", "D", "E", "F", "G", "A", "B"]

    export class SoundTrackerScreen extends CursorScene {
        private currentStep: number
        private currentTrack: number
        private trackData: string[][]
        private controlBtns: Button[]
        private playBtn: Button
        private stopBtn: Button
        private pauseBtn: Button
        private fastFordwardBtn: Button
        private rewindBtn: Button
        private clickThroughBtn: CustomButton
        private sampleSelectBtn: Button
        private noteSelectBtn: Button
        private icon: Bitmap
        private sampleSelectBtn1: Button
        private controlSelectBtn: Button
        private stepOffset: number

        constructor(app: AppInterface) {
            super(
                app,
                function () {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
                new GridNavigator(3, 1)
            )

            this.trackData = []

            for (let i = 0; i < NUM_TRACKS; i++) {
                this.trackData[i] = []
                for (let j = 0; j < NUM_STEPS; j++) {
                    this.trackData[i][j] = "-"
                }
            }

            this.stepOffset = 0
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

            this.clickThroughBtn = new CustomButton({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "placeholder",
                ariaId: "placeholder",
                tooltipEnabled: false,
                x: -24,
                y: y - 80,
                onClick: () => {},
                height: 200,
                width: 200,
            })

            this.clickThroughBtn.bounds.right = 200

            this.playBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "play",
                ariaId: "play",
                tooltipEnabled: false,
                x: -14,
                y: y - 80,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
            })

            this.fastFordwardBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "fast_forward",
                ariaId: "fast forward",
                tooltipEnabled: false,
                x: 24,
                y: y - 80,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
            })

            this.rewindBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "rewind",
                ariaId: "rewind",
                tooltipEnabled: false,
                x: -24,
                y: y - 80,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
            })

            this.stopBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "stop",
                ariaId: "stop",
                tooltipEnabled: false,
                x: 10,
                y: y - 80,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
            })

            this.pauseBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "pause",
                ariaId: "",
                tooltipEnabled: false,
                x: -2,
                y: y - 80,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
            })

            this.sampleSelectBtn1 = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "sample_button",
                ariaId: "",
                tooltipEnabled: false,
                x: -42,
                y: y - 60,
                onClick: () => {
                    // this.app.popScene()
                    // this.app.pushScene(new Home(this.app))
                },
            })

            this.controlSelectBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "section_select",
                ariaId: "ctrl",
                tooltipEnabled: false,
                x: 0,
                y: y - 80,
                onClick: () => {
                    this.setNavigator(1, 5, [this.playBtn])
                    // control.onEvent(
                    //     ControllerButtonEvent.Pressed,
                    //     controller.B.id,
                    //     () => {}
                    // )
                    // this.app.popScene()
                    // this.app.pushScene(new Home(this.app))
                },
            })

            this.sampleSelectBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "sample_section_select",
                ariaId: "",
                tooltipEnabled: false,
                x: 0,
                y: y - 64,
                onClick: () => {
                    // this.app.popScene()
                    // this.app.pushScene(new Home(this.app))
                },
            })

            this.noteSelectBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: this.icon,
                ariaId: "",
                tooltipEnabled: false,
                x: 0,
                y: 14,
                onClick: () => {
                    // this.app.popScene()
                    // this.app.pushScene(new Home(this.app))
                },
            })

            this.controlBtns = [
                this.rewindBtn,
                this.playBtn,
                this.pauseBtn,
                this.stopBtn,
                this.fastFordwardBtn,
            ]

            const btns: Button[] = [
                this.controlSelectBtn,
                this.sampleSelectBtn,
                this.noteSelectBtn,
                // this.sampleSelectBtn1,
                // this.clickThroughBtn,
                // this.rewindBtn,
                // this.playBtn,
                // this.pauseBtn,
                // this.stopBtn,
                // this.fastFordwardBtn,
                // this.prevNoteBtn,
                // this.nextNoteBtn,
                // this.prevStepBtn,
                // this.nextStepBtn,
            ]

            this.navigator.addButtons(btns)
        }

        private changeStep(direction: number) {
            this.currentStep =
                (this.currentStep + direction + NUM_STEPS) % NUM_STEPS
        }

        private changeNote(direction: number) {
            const track = this.currentTrack
            const step = this.currentStep

            let noteIndex = NOTES.indexOf(this.trackData[track][step])
            noteIndex = (noteIndex + direction + NOTES.length) % NOTES.length

            this.trackData[track][step] = NOTES[noteIndex]
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

            this.playBtn.draw()
            this.stopBtn.draw()
            this.pauseBtn.draw()
            this.fastFordwardBtn.draw()
            this.rewindBtn.draw()
            this.clickThroughBtn.draw()
            // this.nextNoteBtn.draw()
            // this.prevNoteBtn.draw()
            // this.nextStepBtn.draw()
            // this.prevStepBtn.draw()

            this.drawGrid()
            // this.drawControls()
            super.draw()
        }

        private drawGrid() {
            const startX = -40
            const startY = Screen.HEIGHT * 0.234 - 50
            const cellWidth = 70
            const cellHeight = 10

            for (let track = 0; track < NUM_TRACKS; track++) {
                for (let step = 0; step < NUM_STEPS; step++) {
                    const x = startX + track * cellWidth
                    const y = startY + step * cellHeight

                    const note = this.trackData[track][step]
                    Screen.print(note, x, y, 0xb, font)
                }
            }
        }

        private setNavigator(rows: number, cols: number, btns: Button[]) {
            // this.navigator.clear()
            // console.log("1: " + this.navigator)
            // this.navigator = null
            console.log("2: " + this.navigator)
            this.navigator = new RowNavigator()
            this.navigator.addButtons(btns)
            console.log("3: " + this.navigator)
        }

        private drawControls() {
            this.drawText(0, Screen.HEIGHT * 0.234 + 30, `Drum 1`)
            this.drawText(0, Screen.HEIGHT * 0.234 + 40, `String`)
            this.drawText(0, Screen.HEIGHT * 0.234 + 50, `Drum 2`)
            this.drawText(0, Screen.HEIGHT * 0.234 + 60, `Bass`)
        }

        private drawText(x: number, y: number, text: string) {
            screen().print(text, x, y, 0xb, font)
        }
    }
}
