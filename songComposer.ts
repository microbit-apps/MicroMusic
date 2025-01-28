namespace micromusic {
    import CursorScene = user_interface_base.CursorScene
    import AppInterface = user_interface_base.AppInterface
    import Screen = user_interface_base.Screen
    import Button = user_interface_base.Button
    import ButtonStyles = user_interface_base.ButtonStyles
    import font = user_interface_base.font

    const NUM_TRACKS = 4
    const NUM_STEPS = 16

    export class SoundTrackerScreen extends CursorScene {
        private currentStep: number
        private liveDataBtn: Button
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
                icon: "green_tick", // TODO: Change this
                ariaId: "Button Works!",
                x: -58,
                y,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                },
            })

            const btns: Button[] = [
                this.liveDataBtn,
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
            this.drawVersion()
            this.drawControls()
            super.draw()
        }

        private drawVersion() {
            const font = bitmaps.font5
            Screen.print(
                "v0.1",
                Screen.RIGHT_EDGE - font.charWidth * "v0.1".length,
                Screen.BOTTOM_EDGE - font.charHeight - 2,
                0xb,
                font
            )
        }

        private drawControls() {
            this.drawText(5, 5, `Play`)
            this.drawText(35, 5, `Stop`)
            this.drawText(65, 5, `Step: ${this.currentStep + 1}`)
        }

        private drawText(x: number, y: number, text: string) {
            screen().print(text, x, y, 0xb, font)
        }
    }
}
