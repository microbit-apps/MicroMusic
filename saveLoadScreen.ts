namespace micromusic {
    import CursorSceneWithPriorPage = user_interface_base.CursorSceneWithPriorPage
    import CursorScene = user_interface_base.CursorScene
    import AppInterface = user_interface_base.AppInterface
    import GridNavigator = user_interface_base.GridNavigator
    import Button = user_interface_base.Button
    import ButtonStyles = user_interface_base.ButtonStyles
    import Screen = user_interface_base.Screen

    // Number of save slots available
    const NUM_SAVE_SLOTS = 3
    const NUM_SLOTS_SHOWN = 3

    export enum SaveLoadMode {
        SAVE,
        LOAD,
    }

    export class SaveLoadScreen extends CursorSceneWithPriorPage {
        private previousScene: CursorScene
        private static mode: SaveLoadMode
        private selectedIndex: number
        private saveNames: string[]
        private saveExists: boolean[]
        private static instance: SaveLoadScreen | null = null
        private currentRowOffset: number
        private dataLoggerHeader: string[]

        private constructor(
            app: AppInterface,
            previousScene: SoundTrackerScreen,
            mode: SaveLoadMode
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

            this.previousScene = previousScene
            SaveLoadScreen.mode = mode
            this.selectedIndex = 0
            this.saveNames = []
            this.saveExists = []
            this.currentRowOffset = 0

            // Initialize save names and check if saves exist
            for (let i = 0; i < NUM_SAVE_SLOTS; i++) {
                this.saveNames[i] = `Save ${i + 1}`
                this.saveExists[i] = false
                // Check datalogger for saves
            }
        }

        private static setMode(mode: SaveLoadMode) {
            SaveLoadScreen.mode = mode
        }

        public static getInstance(
            app?: AppInterface,
            previousScene?: CursorScene,
            mode?: SaveLoadMode
        ) {
            if (!SaveLoadScreen.instance) {
                if (!app) {
                    console.error(
                        "SaveLoadScreen singleton not initialized. Call with parameters first."
                    )
                }

                SaveLoadScreen.instance = new SaveLoadScreen(
                    app,
                    <SoundTrackerScreen>previousScene,
                    mode
                )
            }

            if (mode) {
                SaveLoadScreen.setMode(mode)
            }

            return SaveLoadScreen.instance
        }

        /* override */ startup() {
            super.startup()
            this.checkSaveExists()
            this.resetNavigator()
        }

        private resetNavigator() {
            this.navigator.setBtns([
                [
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "back_arrow",
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
                        icon: "green_tick",
                        x: 60,
                        y: -50,
                        onClick: () => {
                            this.processSlotAction()
                        },
                    }),
                ],
            ])
        }

        private processSlotAction() {
            if (SaveLoadScreen.mode === SaveLoadMode.SAVE) {
                // Save the current track data to the selected slot
                ;(<SoundTrackerScreen>this.previousScene).save(
                    this.selectedIndex
                )
                this.saveExists[this.selectedIndex] = true
                // Show a save confirmation
                Screen.print("Saved!", 0, 0, 0x2)
                basic.pause(500)
            } else {
                // Load mode - only proceed if a save exists in the slot
                if (this.saveExists[this.selectedIndex]) {
                    this.loadSave(this.selectedIndex)
                    this.app.popScene()
                    this.app.pushScene(this.previousScene)
                } else {
                    // Indicate there's no save to load
                    Screen.print("No save found!", 0, 0, 0x2)
                    basic.pause(500)
                }
            }
        }

        private checkSaveExists(): boolean {
            this.dataLoggerHeader = datalogger
                .getRows(this.currentRowOffset, 1)
                .split("\n")[0]
                .split(",")

            return false // TODO: implement
        }

        private loadSave(slot: number) {
            try {
                // TODO: implement loading (datalogger)
                console.log("Loading save from slot: " + slot)

                // Temp results
                // if no log do this
                const defaultTrackData: string[][] = []
                for (let i = 0; i < 4; i++) {
                    // 4 tracks
                    defaultTrackData[i] = []
                    for (let j = 0; j < 128; j++) {
                        // 128 notes
                        defaultTrackData[i][j] = j % 2 === 0 ? "-" : "C"
                    }
                }

                // TODO: change defaults
                const samples = [
                    new Sample("FunBass_L", 1),
                    new Sample("FunBass_L", 2),
                    new Sample("FunBass_L", 3),
                    new Sample("FunBass_L", 4),
                ]
                // Load the data into the SoundTrackerScreen
                ;(<SoundTrackerScreen>this.previousScene).loadFromSave(
                    defaultTrackData,
                    samples
                )
            } catch (e) {
                console.log("Error loading save: " + e)
            }
        }

        draw() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                0xc
            )

            const title =
                SaveLoadScreen.mode === SaveLoadMode.SAVE
                    ? "Save Composition"
                    : "Load Composition"
            Screen.print(title, -40, -50, 0x1)

            this.navigator.drawComponents()

            // Calculate which slots to show based on selected index
            let startIdx = Math.max(0, this.selectedIndex - 1)
            if (startIdx + NUM_SLOTS_SHOWN > NUM_SAVE_SLOTS) {
                startIdx = NUM_SAVE_SLOTS - NUM_SLOTS_SHOWN
            }

            // Draw save slots
            const startY = -20
            for (
                let i = 0;
                i < NUM_SLOTS_SHOWN && startIdx + i < NUM_SAVE_SLOTS;
                i++
            ) {
                const slotIndex = startIdx + i
                const y = startY + i * 15

                // Highlight the selected slot
                const color = slotIndex === this.selectedIndex ? 0x2 : 0

                // Show slot name and status
                let slotText = this.saveNames[slotIndex]
                if (this.saveExists[slotIndex]) {
                    slotText += " [Saved]"
                } else if (SaveLoadScreen.mode === SaveLoadMode.LOAD) {
                    slotText += " [Empty]"
                }

                if (slotIndex === this.selectedIndex) {
                    Screen.print(slotText, -36, y, color)
                } else {
                    Screen.print(slotText, -36, y, color)
                }
            }

            // TODO: update this
            // const instruction =
            //     this.mode === SaveLoadMode.SAVE
            //         ? "Press A to save"
            //         : "Press A to load"
            // Screen.print(instruction, -36, 40, 0)

            if (this.dataLoggerHeader) {
                Screen.print(this.dataLoggerHeader[0], 0, 0)
            }

            // Draw the cursor
            this.cursor.draw()
            super.draw()
        }
    }
}
