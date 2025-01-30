namespace micromusic {
    import CursorScene = user_interface_base.CursorScene
    import AppInterface = user_interface_base.AppInterface
    import Screen = user_interface_base.Screen
    import Bounds = user_interface_base.Bounds
    import Button = user_interface_base.Button
    import ButtonStyles = user_interface_base.ButtonStyles
    import font = user_interface_base.font

    const NUM_TRACKS = 4
    const NUM_STEPS = 16

    export class SoundTrackerScreen extends CursorScene {
        private currentStep: number
        private liveDataBtn: Button
        private liveDataBtn2: Button
        // private currentTrack: number
        // private isPlaying: boolean

        constructor(app: AppInterface) {
            super(app)
        }

        /* override */ startup() {
            super.startup()

            this.currentStep = 0

            const y = Screen.HEIGHT * 0.234 // y = 30 on an Arcade Shield of height 128 pixels

            this.liveDataBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "stop", // TODO: Change this
                ariaId: "",
                tooltipEnabled: false,
                x: 8,
                y: y - 80,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
            })

            this.liveDataBtn2 = new Button({
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
                this.liveDataBtn,
                this.liveDataBtn2,
                // this.recordDataBtn,
                // this.distributedLoggingBtn,
            ] //, this.viewBtn]

            this.navigator.addButtons(btns)
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

            this.liveDataBtn.draw()
            this.liveDataBtn2.draw()
            // this.drawControls()
            super.draw()
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
