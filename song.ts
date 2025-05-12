namespace micromusic {
    export class Song {
        private _patterns: Pattern[]
        private _patternSequence: Pattern[]
        public name: string

        constructor() {
            this._patternSequence = []
            this._patterns = []

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
            this.patterns[this.patterns.length] = new Pattern(
                this.patterns.length
            )
            console.log(this.patterns.length)
            return this.patterns[this.patterns.length - 1]
        }

        public removePattern(pattern: Pattern) {
            this.patterns.removeElement(pattern)
        }
    }
}
