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
        private settings: Setting[]
        private static instance: SettingsScreen | null = null

        private constructor(app: AppInterface, previousScene: CursorScene) {
            super(
                app,
                function () {
                    this.app.popScene()
                    this.app.pushScene(this.previousScene)
                },
                new GridNavigator()
            )

            this.settings = [Settings.volume, Settings.bpm]

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
                                this.activateSettingContext(VOLUME)
                            },
                        }),
                    ],
                    [
                        new Button({
                            parent: null,
                            style: ButtonStyles.Transparent,
                            icon: "volume", // bpm
                            x: -30,
                            y: 0,
                            onClick: () => {
                                this.activateSettingContext(BPM)
                            },
                        }),
                    ],
                    [
                        new Button({
                            parent: null,
                            style: ButtonStyles.Transparent,
                            icon: "back_button",
                            x: -68,
                            y: -52,
                            onClick: () => {
                                this.app.popScene()
                                this.app.pushScene(this.previousScene)
                            },
                        }),
                    ],
                ])
            )
        }

        public static getInstance(
            previousScene: CursorScene,
            app?: AppInterface
        ) {
            if (!SettingsScreen.instance) {
                if (app === undefined) {
                    console.error(
                        "Singleton not initialized. Call with parameters first."
                    )
                }
                SettingsScreen.instance = new SettingsScreen(app, previousScene)
            }

            if (previousScene) {
                SettingsScreen.instance.previousScene = previousScene
            }

            return SettingsScreen.instance
        }

        private activateSettingContext(setting: number) {
            this.navigator.setBtns([this.allBtns[setting]])
            this.cursor.setOutlineColour(0xd)

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
                    let _setting = this.settings[setting]
                    // Control logic:
                    while (tick) {
                        switch (setting) {
                            case VOLUME: {
                                if (_setting.value < 100) _setting.value++
                                break
                            }
                            case BPM: {
                                if (_setting.value < 220) _setting.value++
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
                    let _setting = this.settings[setting]
                    // Control logic:
                    while (tick) {
                        if (_setting.value > 0) _setting.value--

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
                this.settings[VOLUME].value.toString(),
                44 - (this.settings[VOLUME].value.toString().length - 1) * 6,
                -26,
                0xd,
                bitmaps.doubledFont(bitmaps.font8)
            )

            Screen.print(
                this.settings[BPM].value.toString(),
                44 - (this.settings[BPM].value.toString().length - 1) * 6,
                -1,
                0xd,
                bitmaps.doubledFont(bitmaps.font8)
            )

            this.navigator.drawComponents()
            super.draw()
        }
    }
}
