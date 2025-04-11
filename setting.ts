namespace micromusic {
    export class Setting {
        private _value: number

        constructor(value: number) {
            this._value = value
        }

        get value() {
            return this._value
        }

        set value(value: number) {
            this._value = value
        }
    }
}
