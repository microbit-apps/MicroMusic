namespace micromusic {
    import CursorSceneWithPriorPage = user_interface_base.CursorSceneWithPriorPage
    import CursorScene = user_interface_base.CursorScene
    import AppInterface = user_interface_base.AppInterface
    import GridNavigator = user_interface_base.GridNavigator
    import Button = user_interface_base.Button
    import ButtonStyles = user_interface_base.ButtonStyles
    import Screen = user_interface_base.Screen

    const NUM_SAMPLES_SHOWN = 7

    export class SampleSelectionScreen extends CursorSceneWithPriorPage {
        private previousScene: PatternScreen
        private sampleNames: string[]
        private selectedIndex: number
        private currentSample: string
        private startingSample: string
        private channel: Channel

        constructor(
            app: AppInterface,
            previousScene: PatternScreen,
            channel: Channel,
        ) {
            super(
                app,
                function () {
                    this.app.popScene()
                    this.app.pushScene(this.previousScene)
                },
                new GridNavigator(),
            )

            this.sampleNames = listSamples()
            this.channel = channel
            this.currentSample = channel.sample
            this.startingSample = channel.sample
            this.previousScene = previousScene
            this.selectedIndex = this.sampleNames.indexOf(this.currentSample)
        }

        /* override */ startup() {
            super.startup()
            basic.pause(10)

            this.cursor.setBorderThickness(1)
            this.resetNavigator()
            this.setControllerEvents()
        }

        private resetNavigator() {
            this.navigator.setBtns([
                [
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "back_button",
                        x: -60,
                        y: -50,
                        onClick: () => {
                            this.channel.sample = this.startingSample
                            this.app.popScene()
                            this.app.pushScene(this.previousScene)
                        },
                    }),
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "green_tick_2",
                        x: 60,
                        y: -50,
                        onClick: () => {
                            this.selectSample()
                        },
                    }),
                ],
            ])
        }

        private setControllerEvents() {
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.up.id,
                () => {
                    this.selectedIndex -= 1
                    if (this.selectedIndex < 0)
                        this.selectedIndex = this.sampleNames.length - 1

                    this.playNote(this.sampleNames[this.selectedIndex])
                },
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => {
                    this.selectedIndex += 1
                    if (this.selectedIndex == this.sampleNames.length)
                        this.selectedIndex = 0

                    this.playNote(this.sampleNames[this.selectedIndex])
                },
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => {
                    this.channel.sample = this.startingSample
                    this.app.popScene()
                    this.app.pushScene(this.previousScene)
                },
            )
        }

        private selectSample() {
            const sampleName = this.sampleNames[this.selectedIndex]
            this.channel.sample = sampleName
            this.app.popScene()
            this.app.pushScene(this.previousScene)
        }

        private playNote(sampleName: string) {
            samples.enable()
            music.setVolume(255)
            samples.setSampleRate(1, 8800)
            samples.playAsync(1, getSample(sampleName))
        }

        draw() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                0xc,
            ) // Background color
            this.navigator.drawComponents()
            const startY = -30

            let i = this.selectedIndex - 3
            if (i < 0) {
                i = this.sampleNames.length + i
            }
            let endValue = i + NUM_SAMPLES_SHOWN

            let counter = 0
            while (true) {
                if (i == endValue) break
                if (i == this.sampleNames.length) {
                    let remainder = endValue - i
                    endValue = remainder
                    i = 0
                }

                const y = startY + counter * 12
                const colour = i === this.selectedIndex ? 0x2 : 0
                if (i === this.selectedIndex) {
                    Screen.print(this.sampleNames[i], -36, y, colour)
                } else {
                    Screen.print(this.sampleNames[i], -36, y, colour)
                }
                console.log(i)
                i++
                counter++
            }

            // Draw title at top of screen
            Screen.print("Select Sample", -40, -50, 0x1)

            this.cursor.draw()
            super.draw()
        }
    }
}
