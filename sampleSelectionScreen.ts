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
        private currentSample: Sample
        private channel: Channel

        constructor(
            app: AppInterface,
            previousScene: PatternScreen,
            channel: Channel
        ) {
            super(
                app,
                function () {
                    this.app.popScene()
                    this.app.pushScene(this.previousScene)
                },
                new GridNavigator()
            )

            this.sampleNames = listSamples()
            this.channel = channel
            this.currentSample = channel.sample
            this.previousScene = previousScene
            this.selectedIndex = this.sampleNames.indexOf(
                this.currentSample.name
            )
        }

        /* override */ startup() {
            super.startup()
            basic.pause(1)

            this.cursor.setBorderThickness(1)
            console.log(this.sampleNames)
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

                    const sample = new Sample(
                        this.sampleNames[this.selectedIndex]
                    )
                    // TODO: sort this out on a different branch
                }
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => {
                    this.selectedIndex += 1
                    if (this.selectedIndex == this.sampleNames.length)
                        this.selectedIndex = 0

                    // Play the selected sample so user can hear it
                    const sample = new Sample(
                        this.sampleNames[this.selectedIndex]
                    )
                }
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id,
                () => {
                    this.selectSample()
                }
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => {
                    this.app.popScene()
                    this.app.pushScene(this.previousScene)
                }
            )
        }

        private resetControllerEvents() {
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.up.id,
                () => {}
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => {}
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id,
                () => {
                    this.selectSample()
                }
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => {
                    this.app.popScene()
                    this.app.pushScene(this.previousScene)
                }
            )
        }

        private selectSample() {
            const sampleName = this.sampleNames[this.selectedIndex]
            const sample = new Sample(sampleName)
            this.channel.sample = sample
            this.app.popScene()
            this.app.pushScene(this.previousScene)
        }

        draw() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                0xc
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
            // for (let i = this.selectedIndex; i < i + NUM_SAMPLES_SHOWN; i++) {
            //     if (i > this.sampleNames.length) {
            //         i = 0
            //     } else if (i) const y = startY + i * 12
            //     const colour = i === this.selectedIndex ? 0x1 : 0
            //     Screen.print(this.sampleNames[i], -40, y, colour)
            // }

            // Draw title at top of screen
            Screen.print("Select Sample", -40, -50, 0x1)

            this.cursor.draw()
            super.draw()
        }
    }
}
