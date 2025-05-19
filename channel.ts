namespace micromusic {
    export const MAX_NOTES = 64 // Max number of notes per channel

    export class Channel {
        private _notes: string[]
        private _octaves: number[]
        private _sample: Sample

        constructor() {
            this._notes = []
            this._octaves = []

            for (let i = 0; i < MAX_NOTES; i++) {
                this._notes[i] = "-"
                this._octaves[i] = 3
            }
            this._sample = new Sample("ShortB")
        }

        public get notes() {
            return this._notes
        }

        public copy(channel: Channel) {
            this._notes = channel.notes
            this._octaves = channel.octaves
            this._sample = channel.sample
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

        toJSON() {
            return {
                notes: this._notes, // flatten array to string
                octaves: this._octaves, // flatten array to string
                sampleName: this._sample.name, // flatten object to string
            }
        }

        static fromJSON(data: any): Channel {
            const channel = new Channel()
            channel._notes = <Array<string>>data.notes
            channel._octaves = <Array<number>>data.octaves
            channel._sample = new Sample(data.sampleName)
            return channel
        }
    }
}
