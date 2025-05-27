namespace micromusic {
    // const NOTE_TO_INT: { [note: string]: number } = {
    //     "-": 255,
    //     C: 0,
    //     "C#": 1,
    //     D: 2,
    //     "D#": 3,
    //     E: 4,
    //     F: 5,
    //     "F#": 6,
    //     G: 7,
    //     "G#": 8,
    //     A: 9,
    //     "A#": 10,
    //     B: 11,
    // }

    // const INT_TO_NOTE: string[] = [
    //     "C",
    //     "C#",
    //     "D",
    //     "D#",
    //     "E",
    //     "F",
    //     "F#",
    //     "G",
    //     "G#",
    //     "A",
    //     "A#",
    //     "B",
    // ]

    // export function noteToInt(note: string): number {
    //     return NOTE_TO_INT[note] ?? 255
    // }

    // export function intToNote(i: number): string {
    //     if (i === 255) return "-"
    //     return INT_TO_NOTE[i] ?? "-"
    // }

    export class Song {
        private _patterns: Pattern[]
        private _patternSequence: Pattern[]
        public patternsMade: number

        constructor() {
            this._patternSequence = []
            this._patterns = []
            this.patternsMade = 0
        }

        get patterns(): Pattern[] {
            return this._patterns
        }

        get patternSequence(): Pattern[] {
            return this._patternSequence
        }

        public newPattern(): Pattern {
            this.patterns[this.patterns.length] = new Pattern(this.patternsMade)

            this.patternsMade += 1

            return this.patterns[this.patterns.length - 1]
        }

        /**
         * Remove a pattern from the sequence,
         * does not delete the pattern
         * */
        public removeSequenceItem(index: number) {
            this.patternSequence.splice(index, 1)
        }

        /**
         * Fully deletes a pattern and removes parts of sequence that include it
         * @param pattern the pattern that should be removed entirely
         */
        public deletePattern(pattern: Pattern) {
            this._patternSequence = this.patternSequence.filter(
                p => p !== pattern,
            )

            const patternIndex = this.patterns.indexOf(pattern)
            if (patternIndex !== -1) {
                this.patterns.splice(patternIndex, 1)
            }
        }

        toJSON() {
            return {
                patterns: this._patterns.map(p => p.toJSON()),
                patternSequence: this._patternSequence.map(p => p.id), // sequence as array of ids
                patternsMade: this.patternsMade,
            }
        }

        static fromJSON(data: any): Song {
            const song = new Song()
            song.patternsMade = data.patternsMade
            song._patterns = (<Array<Pattern>>data.patterns).map((p: any) =>
                Pattern.fromJSON(p),
            )
            song._patternSequence = (<Array<number>>data.patternSequence).map(
                (id: number) => song._patterns.find(p => p.id === id),
            )
            return song
        }
    }
}
