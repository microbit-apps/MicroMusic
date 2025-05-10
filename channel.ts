namespace micromusic {
    export const NUM_NOTES = 64

    export class Channel {
        private _notes: string[]
        private _octaves: number[]
        private _sample: Sample

        public get notes() {
            return this._notes
        }

        public setNote(note: string, index: number, octave?: number): void {
            this._notes[index] = note
        }

        public get octaves() {
            return this._octaves
        }

        public setOctave(octave: number, index: number): void {
            this._octaves[index] = octave
        }

        public get sample() {
            return this._sample
        }

        public set sample(sample: Sample) {
            this._sample = sample
        }

        public setNoteAndOctave(
            note: string,
            octave: number,
            index: number
        ): void {
            this._notes[index] = note
            this._octaves[index] = octave
        }
    }
}
