namespace micromusic {
    export class Song {
        private _patterns: Pattern[]
        private _patternSequence: Pattern[]
        private patternsMade: number

        constructor() {
            this._patternSequence = []
            this._patterns = []
            this.patternsMade = 0

            // this._patternSequence[0] = new Pattern(0)
            // this._patternSequence[1] = new Pattern(1)
            // this._patternSequence[2] = new Pattern(2)
            // this._patternSequence[3] = new Pattern(3)
            // this._patternSequence[4] = new Pattern(4)
            // this._patternSequence[5] = new Pattern(5)
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
                p => p !== pattern
            )

            const patternIndex = this.patterns.indexOf(pattern)
            if (patternIndex !== -1) {
                this.patterns.splice(patternIndex, 1)
            }
        }
    }
}
