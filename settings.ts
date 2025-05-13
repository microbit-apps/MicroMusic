namespace micromusic {
    export class Settings {
        private static _volume: Setting = new Setting(100)
        private static _bpm: Setting = new Setting(120)

        public static get volume(): Setting {
            return this._volume
        }

        public static setVolume(vol: number) {
            this._volume.value = vol
        }

        public static get bpm(): Setting {
            return this._bpm
        }

        public static setBpm(bpm: number) {
            this._bpm.value = bpm
        }
    }
}
