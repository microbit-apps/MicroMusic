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

    export class SettingsScreen extends CursorSceneWithPriorPage {
        private previousScene: CursorScene

        constructor(app: AppInterface, previousScene: CursorScene) {
            super(
                app,
                function () {
                    this.app.popScene()
                    this.previousScene.navigator = new GridNavigator()
                    this.app.pushScene(this.previousScene)
                    // if (previousScene instanceof SoundTrackerScreen)
                    //     this.previousScene.resetNavigator()
                },
                new GridNavigator()
            )

            this.previousScene = previousScene
        }

        /* override */ startup() {
            super.startup()

            this.navigator.setBtns([
                [
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "rewind",
                        x: 0,
                        y: 0,
                        onClick: () => {
                            this.app.popScene()
                            this.previousScene.navigator = new GridNavigator() // Has to be given a new GridNavigator, old one stops working
                            this.app.pushScene(this.previousScene)
                        },
                    }),
                ],
            ])
        }

        private changeVolume(direction: number) {}

        draw() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                0xc
            )

            Screen.print("Volume", 0, 0, 0xb)

            this.navigator.drawComponents()
            super.draw()
        }
    }
}
