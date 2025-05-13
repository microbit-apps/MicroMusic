namespace micromusic {
    export const MAX_NOTES = 64 // Max number of notes per channel

    export class Channel {
        private _notes: string[]
        private _octaves: number[]
        private _sample: Sample
        private _id: number

        constructor(id: number) {
            this._notes = []
            this._octaves = []

            for (let i = 0; i < MAX_NOTES; i++) {
                this._notes[i] = "-"
                this._octaves[i] = 3
            }
            this._sample = new Sample("ShortB")
        }

        public get id() {
            return this._id
        }

        public get notes() {
            return this._notes
        }

        public setNote(note: string, index: number, octave?: number): void {
            if (index > MAX_NOTES) {
                console.error(`Max index for a channel is: ${MAX_NOTES - 1}`)
                return
            }
            this._notes[index] = note
        }

        public get octaves() {
            return this._octaves
        }

        public setOctave(octave: number, index: number): void {
            if (index > MAX_NOTES) {
                console.error(`Max index for a channel is: ${MAX_NOTES - 1}`)
                return
            }
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
            if (index > MAX_NOTES) {
                console.error(`Max index for a channel is: ${MAX_NOTES - 1}`)
                return
            }
            this._notes[index] = note
            this._octaves[index] = octave
        }
    }
}
