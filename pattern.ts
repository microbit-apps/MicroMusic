namespace micromusic {
    export type Note = [string, number]

    export class Pattern {
        private _channels: Channel[]

        constructor() {
            this._channels = [
                new Channel(),
                new Channel(),
                new Channel(),
                new Channel(),
            ]
        }

        public setChannel(channel: Channel, index: number) {
            this._channels[index] = channel
        }

        public get channels() {
            return this._channels
        }
    }
}
