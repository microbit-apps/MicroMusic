namespace micromusic {
    import CursorScene = user_interface_base.CursorScene
    import AppInterface = user_interface_base.AppInterface
    import Screen = user_interface_base.Screen
    import Bounds = user_interface_base.Bounds
    import Button = user_interface_base.Button
    import ButtonStyles = user_interface_base.ButtonStyles
    import font = user_interface_base.font

    const NUM_TRACKS = 4
    const NUM_STEPS = 8
    const NOTES = ["C", "D", "E", "F", "G", "A", "B"]

    export class SoundTrackerScreen extends CursorScene {
        private currentStep: number
        private currentTrack: number
        private trackData: string[][]
        private playBtn: Button
        private stopBtn: Button
        private pauseBtn: Button
        private fastFordwardBtn: Button
        private rewindBtn: Button
        private nextNoteBtn: Button
        private prevNoteBtn: Button
        private nextStepBtn: Button
        private prevStepBtn: Button
        private stepOffset: number

        constructor(app: AppInterface) {
            super(app)

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

            const y = Screen.HEIGHT * 0.234 // y = 30 on an Arcade Shield of height 128 pixels

            this.nextNoteBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "arrow_up",
                ariaId: "next note",
                tooltipEnabled: true,
                x: -20,
                y: y - 60,
                onClick: () => this.changeNote(1),
            })

            this.prevNoteBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "arrow_down",
                ariaId: "prev note",
                tooltipEnabled: true,
                x: -40,
                y: y - 60,
                onClick: () => this.changeNote(-1),
            })

            this.nextStepBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "arrow_right",
                ariaId: "next step",
                tooltipEnabled: true,
                x: 40,
                y: y - 60,
                onClick: () => this.changeStep(1),
            })

            this.prevStepBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "arrow_left",
                ariaId: "prev step",
                tooltipEnabled: true,
                x: 20,
                y: y - 60,
                onClick: () => this.changeStep(-1),
            })

            this.playBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "play",
                ariaId: "play",
                tooltipEnabled: false,
                x: -18,
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
                x: 20,
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
                x: -28,
                y: y - 80,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
            })

            this.stopBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "stop", // TODO: Change this
                ariaId: "stop",
                tooltipEnabled: false,
                x: 6,
                y: y - 80,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
            })

            this.pauseBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "pause", // TODO: Change this
                ariaId: "",
                tooltipEnabled: false,
                x: -6,
                y: y - 80,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
            })

            const btns: Button[] = [
                this.rewindBtn,
                this.playBtn,
                this.pauseBtn,
                this.stopBtn,
                this.fastFordwardBtn,
                this.prevNoteBtn,
                this.nextNoteBtn,
                this.prevStepBtn,
                this.nextStepBtn,
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
            this.nextNoteBtn.draw()
            this.prevNoteBtn.draw()
            this.nextStepBtn.draw()
            this.prevStepBtn.draw()

            this.drawGrid()
            // this.drawControls()
            super.draw()
        }

        private drawGrid() {
            const startX = -40
            const startY = Screen.HEIGHT * 0.234 - 30
            const cellWidth = 15
            const cellHeight = 10

            for (let track = 0; track < NUM_TRACKS; track++) {
                for (let step = 0; step < NUM_STEPS; step++) {
                    const x = startX + step * cellWidth
                    const y = startY + track * cellHeight

                    const note = this.trackData[track][step]
                    Screen.print(note, x, y, 0xb, font)
                }
            }

            // Highlight current step
            const cursorX = startX + this.currentStep * cellWidth
            const cursorY = startY + this.currentTrack * cellHeight
            Screen.drawRect(
                cursorX - 3,
                cursorY - 1,
                cellWidth - 4,
                cellHeight,
                0xf
            ) // White border
        }

        // private drawControls() {
        //     this.drawText(5, 5, `Play`)
        //     this.drawText(35, 5, `Stop`)
        //     this.drawText(65, 5, `Step: ${this.currentStep + 1}`)
        // }

        private drawText(x: number, y: number, text: string) {
            screen().print(text, x, y, 0xb, font)
        }
    }
}
