namespace micromusic {
    import AppInterface = user_interface_base.AppInterface
    import Scene = user_interface_base.Scene
    import SceneManager = user_interface_base.SceneManager

    // Auto-save slot
    export const SAVESLOT_AUTO = "sa"

    export interface SavedState {
        progdef: any
        version?: string
    }

    // application configuration
    user_interface_base.getIcon = id => icons.get(id)
    user_interface_base.resolveTooltip = (ariaId: string) => ariaId

    /**
     * If an Arcade Shield is not present when starting MicroData that Microbit will enter DistributedLoggingProtocol.
     *      It will show a :) on its LEDs and try to become a Target - where it will receive radio commands from a Commander Microbit (one with an Arcade Shield)
     */
    export class App implements AppInterface {
        sceneManager: SceneManager

        constructor() {
            // One interval delay to ensure all static constructors have executed.
            basic.pause(10)

            this.sceneManager = new SceneManager()
            datalogger.includeTimestamp(FlashLogTimeStampFormat.None)

            // if (shieldhelpers.shieldPresent())
            this.pushScene(SongComposerScreen.getInstance(this))
        }

        public save(slot: string, buffer: Buffer): boolean {
            return true
        }

        public load(slot: string): Buffer {
            return Buffer.create(0)
        }

        public pushScene(scene: Scene) {
            this.sceneManager.pushScene(scene)
        }

        public popScene() {
            this.sceneManager.popScene()
        }
    }
}
