namespace micromusic {
    import CursorSceneWithPriorPage = user_interface_base.CursorSceneWithPriorPage
    import CursorScene = user_interface_base.CursorScene
    import AppInterface = user_interface_base.AppInterface
    import GridNavigator = user_interface_base.GridNavigator
    import Button = user_interface_base.Button
    import ButtonStyles = user_interface_base.ButtonStyles
    import Screen = user_interface_base.Screen
    import ColumnValue = datalogger.ColumnValue

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
        private songs: Song[]
        private static instance: SaveLoadScreen | null = null
        private currentRowOffset: number
        private dataLoggerHeader: string[]

        private constructor(
            app: AppInterface,
            previousScene: SongComposerScreen,
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

            this.loadSaves()
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
                    <SongComposerScreen>previousScene,
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
            this.loadSaves()
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
                this.save(
                    (<SongComposerScreen>this.previousScene).getSong(),
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

        private save(song: Song, saveSlot: number) {
            let cv: ColumnValue[]

            for (let i = 0; i < this.songs.length; i++) {
                if (i == saveSlot) {
                    cv[i] = datalogger.createCV(
                        "save" + i,
                        JSON.stringify(song.toJSON())
                    )
                } else if (this.songs[i] == null) {
                    cv[i] = datalogger.createCV("save" + i, null)
                } else {
                    cv[i] = datalogger.createCV(
                        "save" + i,
                        JSON.stringify(this.songs[i].toJSON())
                    )
                }
            }
        }

        private loadSave(saveIndex: number) {
            ;(<SongComposerScreen>this.previousScene).setSong(
                this.songs[saveIndex]
            )
        }

        private loadSaves() {
            this.dataLoggerHeader = datalogger
                .getRows(0, 1)
                .split("\n")[0]
                .split(",")

            if (this.dataLoggerHeader.length < 1) {
                datalogger.log(
                    datalogger.createCV("save1", null),
                    datalogger.createCV("save2", null),
                    datalogger.createCV("save3", null)
                )
                return
            }

            let rawData = datalogger.getRows(1, 1)

            let data = rawData.split(",")

            for (let i = 0; i < data.length; i++) {
                if (data[i] == null) {
                    continue
                }
                const fixedDataStr = data[i].split("_").join(",")

                this.songs[0] = Song.fromJSON(JSON.parse(fixedDataStr))
                this.saveExists[i] = true
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
