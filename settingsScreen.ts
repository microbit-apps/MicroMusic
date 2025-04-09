namespace micromusic {
    import CursorSceneWithPriorPage = user_interface_base.CursorSceneWithPriorPage
    import CursorScene = user_interface_base.CursorScene
    import AppInterface = user_interface_base.AppInterface
    import GridNavigator = user_interface_base.GridNavigator
    import Button = user_interface_base.Button
    import ButtonStyles = user_interface_base.ButtonStyles
    import Screen = user_interface_base.Screen

    const VOLUME_INCREASE = 0
    const VOLUME_DECREASE = 1
    const VOLUME = 0
    const BPM = 1
    const OTHER = 2

    export class SettingsScreen extends CursorSceneWithPriorPage {
        private previousScene: CursorScene
        private allBtns: Button[][]
        private settings: number[]

        constructor(
            app: AppInterface,
            previousScene: CursorScene,
            volume?: number,
            bpm?: number,
            other?: number
        ) {
            super(
                app,
                function () {
                    this.app.popScene()
                    this.previousScene.navigator = new GridNavigator()
                    this.app.pushScene(this.previousScene)
                },
                new GridNavigator()
            )

            this.settings = [volume, bpm, other]

            this.previousScene = previousScene
        }

        /* override */ startup() {
            super.startup()

            this.cursor.setBorderThickness(1)

            this.navigator.setBtns(
                (this.allBtns = [
                    [
                        new Button({
                            parent: null,
                            style: ButtonStyles.Transparent,
                            icon: "volume",
                            x: -30,
                            y: -20,
                            onClick: () => {
                                this.setVolumeContext()
                            },
                        }),
                    ],
                    [
                        new Button({
                            parent: null,
                            style: ButtonStyles.Transparent,
                            icon: "volume",
                            x: -30,
                            y: 5,
                            onClick: () => {},
                        }),
                    ],
                    [
                        new Button({
                            parent: null,
                            style: ButtonStyles.Transparent,
                            icon: "volume",
                            x: -30,
                            y: 30,
                            onClick: () => {
                                // this.app.popScene()
                                // this.previousScene.navigator = new GridNavigator() // Has to be given a new GridNavigator, old one stops working
                                // this.app.pushScene(this.previousScene)
                            },
                        }),
                    ],
                    [
                        new Button({
                            parent: null,
                            style: ButtonStyles.Transparent,
                            icon: "back_arrow",
                            x: -68,
                            y: -52,
                            onClick: () => {
                                this.app.popScene()
                                this.previousScene.navigator =
                                    new GridNavigator() // Has to be given a new GridNavigator, old one stops working
                                this.app.pushScene(this.previousScene)
                            },
                        }),
                    ],
                ])
            )
        }

        private changeVolume(direction: number) {}

        private activateSettingContext(setting: number) {
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => {
                    this.resetContext()
                }
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.right.id,
                () => {
                    let tick = true
                    control.onEvent(
                        ControllerButtonEvent.Released,
                        controller.right.id,
                        () => (tick = false)
                    )
                    let counter = 0
                    // Control logic:
                    while (tick) {
                        switch (setting) {
                            case VOLUME: {
                                if (this.settings[setting] < 100)
                                    this.settings[setting]++
                                break
                            }
                            case BPM: {
                                if (this.settings[setting] < 200)
                                    this.settings[setting]++
                                break
                            }
                        }

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
                        controller.right.id,
                        () => {}
                    )
                }
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.left.id,
                () => {
                    let tick = true
                    control.onEvent(
                        ControllerButtonEvent.Released,
                        controller.left.id,
                        () => (tick = false)
                    )
                    let counter = 0
                    // Control logic:
                    while (tick) {
                        if (this.settings[setting] > 0) this.settings[setting]--

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
                        controller.left.id,
                        () => {}
                    )
                }
            )
        }

        private setVolumeContext() {
            this.cursor.setOutlineColour(5)
            this.navigator.setBtns([this.allBtns[0]])
            this.activateSettingContext(VOLUME)
        }

        private setBPMContext() {}

        private resetContext() {
            this.navigator.setBtns(this.allBtns)
            this.cursor.setOutlineColour(9)
        }

        draw() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                0xc
            )

            for (let btns of this.allBtns) {
                for (let btn of btns) {
                    btn.draw()
                }
            }

            Screen.print(
                this.settings[VOLUME].toString(),
                44 - (this.settings[VOLUME].toString().length - 1) * 6,
                -26,
                0xd,
                bitmaps.doubledFont(bitmaps.font8)
            )

            Screen.print(
                this.settings[BPM].toString(),
                44 - (this.settings[BPM].toString().length - 1) * 6,
                -1,
                0xd,
                bitmaps.doubledFont(bitmaps.font8)
            )

            Screen.print(
                this.settings[VOLUME].toString(),
                44 - (this.settings[VOLUME].toString().length - 1) * 6,
                24,
                0xd,
                bitmaps.doubledFont(bitmaps.font8)
            )

            this.navigator.drawComponents()
            super.draw()
        }
    }
}
