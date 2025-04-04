namespace micromusic {
    import CursorSceneWithPriorPage = user_interface_base.CursorSceneWithPriorPage
    import CursorScene = user_interface_base.CursorScene
    import AppInterface = user_interface_base.AppInterface
    import GridNavigator = user_interface_base.GridNavigator
    import Button = user_interface_base.Button
    import ButtonStyles = user_interface_base.ButtonStyles
    import Screen = user_interface_base.Screen

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
                            // Has to be given a new GridNavigator, old one stops working
                            this.previousScene.navigator = new GridNavigator()
                            this.app.pushScene(this.previousScene)
                        },
                    }),
                ],
            ])
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
            super.draw()
        }
    }
}
