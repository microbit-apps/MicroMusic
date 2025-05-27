namespace micromusic {
    export const MAX_NOTES = 64 // Max number of notes per channel

    // Note mapping for compression (4 bits each)
    const NOTE_MAP: { [key: string]: number } = {
        "-": 0,
        C: 1,
        "C#": 2,
        Db: 2,
        D: 3,
        "D#": 4,
        Eb: 4,
        E: 5,
        F: 6,
        "F#": 7,
        Gb: 7,
        G: 8,
        "G#": 9,
        Ab: 9,
        A: 10,
        "A#": 11,
        Bb: 11,
        B: 12,
    }

    const REVERSE_NOTE_MAP = [
        "-",
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B",
    ]

    // Common sample names mapping
    const SAMPLE_MAP: { [key: string]: number } = {
        acpiano1: 0,
        guitar1: 1,
        bass1: 2,
        drums1: 3,
        synth1: 4,
        violin1: 5,
        flute1: 6,
        trumpet1: 7,
    }

    const REVERSE_SAMPLE_MAP: { [key: number]: string } = {
        0: "acpiano1",
        1: "guitar1",
        2: "bass1",
        3: "drums1",
        4: "synth1",
        5: "violin1",
        6: "flute1",
        7: "trumpet1",
    }

    export class Channel {
        // Store all note+octave pairs in a regular number array (micro:bit compatible)
        private _data: number[]
        private _sampleIndex: number
        private _customSample: string

        constructor() {
            // Each number stores: note(4 bits) + octave(4 bits)
            this._data = []
            for (let i = 0; i < MAX_NOTES; i++) {
                this._data[i] = 0x03 // 0000(note="-") + 0011(octave=3)
            }
            this._sampleIndex = 0 // Default to "acpiano1"
            this._customSample = ""
        }

        // Getter that returns notes array on-demand (virtual array)
        public get notes(): string[] {
            const result: string[] = []
            for (let i = 0; i < MAX_NOTES; i++) {
                const noteIndex = (this._data[i] >> 4) & 0xf
                result[i] = REVERSE_NOTE_MAP[noteIndex] || "-"
            }
            return result
        }

        // Getter that returns octaves array on-demand (virtual array)
        public get octaves(): number[] {
            const result: number[] = []
            for (let i = 0; i < MAX_NOTES; i++) {
                result[i] = this._data[i] & 0xf
            }
            return result
        }

        public copy(channel: Channel): void {
            for (let i = 0; i < MAX_NOTES; i++) {
                this._data[i] = channel._data[i]
            }
            this._sampleIndex = channel._sampleIndex
            this._customSample = channel._customSample
        }

        public setNote(note: string, index: number, octave?: number): void {
            if (index >= MAX_NOTES) {
                console.log(`Max index for a channel is: ${MAX_NOTES - 1}`)
                return
            }

            const noteIndex = NOTE_MAP[note] !== undefined ? NOTE_MAP[note] : 0
            const currentOctave =
                octave !== undefined ? octave : this._data[index] & 0xf
            this._data[index] = (noteIndex << 4) | (currentOctave & 0xf)
        }

        public getNote(index: number): string {
            if (index >= MAX_NOTES) return "-"
            const noteIndex = (this._data[index] >> 4) & 0xf
            return REVERSE_NOTE_MAP[noteIndex] || "-"
        }

        public setOctave(octave: number, index: number): void {
            if (index >= MAX_NOTES) {
                console.log(`Max index for a channel is: ${MAX_NOTES - 1}`)
                return
            }

            const noteIndex = (this._data[index] >> 4) & 0xf
            const clampedOctave = Math.max(0, Math.min(15, octave))
            this._data[index] = (noteIndex << 4) | (clampedOctave & 0xf)
        }

        public getOctave(index: number): number {
            if (index >= MAX_NOTES) return 3
            return this._data[index] & 0xf
        }

        public get sample(): string {
            if (this._customSample !== "") {
                return this._customSample
            }
            return REVERSE_SAMPLE_MAP[this._sampleIndex] || "acpiano1"
        }

        public set sample(sample: string) {
            if (SAMPLE_MAP[sample] !== undefined) {
                this._sampleIndex = SAMPLE_MAP[sample]
                this._customSample = ""
            } else {
                this._sampleIndex = 255 // Special value for custom samples
                this._customSample = sample
            }
        }

        public setNoteAndOctave(
            note: string,
            octave: number,
            index: number,
        ): void {
            if (index >= MAX_NOTES) {
                console.log(`Max index for a channel is: ${MAX_NOTES - 1}`)
                return
            }

            const noteIndex = NOTE_MAP[note] !== undefined ? NOTE_MAP[note] : 0
            const clampedOctave = Math.max(0, Math.min(15, octave))
            this._data[index] = (noteIndex << 4) | (clampedOctave & 0xf)
        }

        public getNoteAndOctave(index: number): {
            note: string
            octave: number
        } {
            if (index >= MAX_NOTES) {
                return { note: "-", octave: 3 }
            }

            const byte = this._data[index]
            const noteIndex = (byte >> 4) & 0xf
            const octave = byte & 0xf

            return {
                note: REVERSE_NOTE_MAP[noteIndex] || "-",
                octave: octave,
            }
        }

        // Simple hex serialization (micro:bit compatible)
        public serialize(): string {
            let result = ""

            // Serialize note data as hex string
            for (let i = 0; i < MAX_NOTES; i++) {
                const hex = this._data[i].toString(16).toUpperCase()
                result += hex.length === 1 ? "0" + hex : hex
            }

            // Add sample index
            const sampleHex = this._sampleIndex.toString(16).toUpperCase()
            result += sampleHex.length === 1 ? "0" + sampleHex : sampleHex

            // Add custom sample if present (simple encoding)
            if (this._customSample !== "") {
                result += "|" + this._customSample
            }

            return result
        }

        public static deserialize(data: string): Channel {
            const channel = new Channel()

            try {
                // Split custom sample if present
                const parts = data.split("|")
                const hexData = parts[0]

                // Parse note data (2 hex chars per byte)
                for (
                    let i = 0;
                    i < MAX_NOTES && i * 2 + 1 < hexData.length;
                    i++
                ) {
                    const hexByte = hexData.substr(i * 2, 2)
                    channel._data[i] = parseInt(hexByte, 16)
                }

                // Parse sample index
                if (hexData.length >= MAX_NOTES * 2 + 2) {
                    const sampleHex = hexData.substr(MAX_NOTES * 2, 2)
                    channel._sampleIndex = parseInt(sampleHex, 16)
                }

                // Parse custom sample
                if (parts.length > 1) {
                    channel._customSample = parts[1]
                }
            } catch (error) {
                console.log("Failed to deserialize channel")
            }

            return channel
        }

        // Legacy JSON methods for compatibility
        toJSON(): any {
            return {
                notes: this.notes,
                octaves: this.octaves,
                sampleName: this.sample,
            }
        }

        static fromJSON(data: any): Channel {
            const channel = new Channel()

            if (data.notes && data.octaves) {
                const noteCount = Math.min(data.notes.length, MAX_NOTES)
                for (let i = 0; i < noteCount; i++) {
                    if (
                        data.notes[i] !== undefined &&
                        data.octaves[i] !== undefined
                    ) {
                        channel.setNoteAndOctave(
                            data.notes[i],
                            data.octaves[i],
                            i,
                        )
                    }
                }
            }

            if (data.sampleName) {
                channel.sample = data.sampleName
            }

            return channel
        }

        // Memory usage comparison (estimated for micro:bit)
        public getMemoryUsage(): {
            current: number
            original: number
            savings: number
        } {
            // Current: number[64] + number + string
            const current = 64 * 4 + 4 + this._customSample.length * 2

            // Original: string[64] + number[64] + string
            const original = 64 * 2 * 8 + 64 * 4 + 20 // Estimated

            const savings = original - current

            return { current, original, savings }
        }

        // Utility methods
        public clear(): void {
            for (let i = 0; i < MAX_NOTES; i++) {
                this._data[i] = 0x03 // Reset to "-" note, octave 3
            }
        }

        public isEmpty(): boolean {
            for (let i = 0; i < MAX_NOTES; i++) {
                if (this._data[i] >> 4 !== 0) {
                    // If note is not "-"
                    return false
                }
            }
            return true
        }

        public clone(): Channel {
            const channel = new Channel()
            channel.copy(this)
            return channel
        }

        // Debugging helper
        public debugPrint(): void {
            console.log("Channel Data:")
            for (let i = 0; i < MAX_NOTES; i++) {
                if (this.getNote(i) !== "-") {
                    console.log(`${i}: ${this.getNote(i)}${this.getOctave(i)}`)
                }
            }
            console.log(`Sample: ${this.sample}`)
        }

        // Get active note count (for optimization)
        public getActiveNoteCount(): number {
            let count = 0
            for (let i = 0; i < MAX_NOTES; i++) {
                if (this._data[i] >> 4 !== 0) {
                    count++
                }
            }
            return count
        }
    }
}
