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
        private previousScene: SoundTrackerScreen
        private mode: SaveLoadMode
        private selectedIndex: number
        private saveNames: string[]
        private saveExists: boolean[]

        constructor(
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
            this.mode = mode
            this.selectedIndex = 0
            this.saveNames = []
            this.saveExists = []

            // Initialize save names and check if saves exist
            for (let i = 0; i < NUM_SAVE_SLOTS; i++) {
                this.saveNames[i] = `Save ${i + 1}`
                this.saveExists[i] = false
                // Check datalogger for saves
            }
        }

        /* override */ startup() {
            super.startup()
            this.resetNavigator()
            this.setControllerEvents()
        }

        private resetNavigator() {
            this.navigator.setBtns([
                [
                    new Button({
                        parent: null,
                        style: ButtonStyles.Transparent,
                        icon: "back_arrow",
                        x: -40,
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
                        x: 40,
                        y: -50,
                        onClick: () => {
                            this.processSlotAction()
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
                        this.selectedIndex = NUM_SAVE_SLOTS - 1
                }
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => {
                    this.selectedIndex += 1
                    if (this.selectedIndex >= NUM_SAVE_SLOTS)
                        this.selectedIndex = 0
                }
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id,
                () => {
                    this.processSlotAction()
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

        private processSlotAction() {
            if (this.mode === SaveLoadMode.SAVE) {
                // Save the current track data to the selected slot
                this.previousScene.save(this.selectedIndex)
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

        // In a real implementation, we would check if the save exists
        // For now, this always returns false since we haven't implemented storage
        private checkSaveExists(slot: number): boolean {
            return false // Placeholder
        }

        private loadSave(slot: number) {
            try {
                // This is a simplified placeholder implementation
                // In a real implementation, we would load the saved data
                console.log("Loading save from slot: " + slot)

                // For now, just create some default data
                const defaultTrackData: string[][] = []
                for (let i = 0; i < 4; i++) {
                    // 4 tracks
                    defaultTrackData[i] = []
                    for (let j = 0; j < 128; j++) {
                        // 128 notes
                        defaultTrackData[i][j] = j % 2 === 0 ? "-" : "C"
                    }
                }

                // OVERWRITE THIS
                const samples = [
                    new Sample("bass", 1),
                    new Sample("piano", 2),
                    new Sample("drum", 3),
                    new Sample("guitar", 4),
                ]

                // Load the data into the SoundTrackerScreen
                this.previousScene.loadFromSave(defaultTrackData, samples)
            } catch (e) {
                console.log("Error loading save: " + e)
            }
        }

        draw() {
            // Clear screen with background color
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                0xc
            )

            // Draw title at top of screen
            const title =
                this.mode === SaveLoadMode.SAVE
                    ? "Save Composition"
                    : "Load Composition"
            Screen.print(title, -40, -50, 0x1)

            // Draw navigator components (back and confirm buttons)
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
                } else if (this.mode === SaveLoadMode.LOAD) {
                    slotText += " [Empty]"
                }

                // Draw slot text with an indicator for the selected item
                if (slotIndex === this.selectedIndex) {
                    // Draw the arrow icon next to the selected item
                    const arrow = icons.get("sample_selection_arrow")
                    // You could draw the arrow here if needed
                    Screen.print(slotText, -36, y, color)
                } else {
                    Screen.print(slotText, -36, y, color)
                }
            }

            // Draw instructions at the bottom
            const instruction =
                this.mode === SaveLoadMode.SAVE
                    ? "Press A to save"
                    : "Press A to load"
            Screen.print(instruction, -36, 40, 0)

            // Draw the cursor
            this.cursor.draw()
        }
    }
}
