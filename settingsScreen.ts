namespace micromusic {
    import CursorSceneWithPriorPage = user_interface_base.CursorSceneWithPriorPage
    import AppInterface = user_interface_base.AppInterface
    import GridNavigator = user_interface_base.GridNavigator
    import Button = user_interface_base.Button
    import ButtonStyles = user_interface_base.ButtonStyles
    import Screen = user_interface_base.Screen

    export class SettingsScreen extends CursorSceneWithPriorPage {
        private previousScene: SoundTrackerScreen

        constructor(app: AppInterface, previousScene: SoundTrackerScreen) {
            super(
                app,
                function () {
                    this.app.popScene()
                    this.previousScene.resetNavigator()
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
