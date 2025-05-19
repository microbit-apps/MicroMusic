namespace micromusic {
    export type Note = [string, number]

    export const NUM_CHANNELS = 4

    export class Pattern {
        private _channels: Channel[]
        private _id: number

        constructor(id: number) {
            this._channels = [
                new Channel(),
                new Channel(),
                new Channel(),
                new Channel(),
            ]

            this._id = id
        }

        public get id() {
            return this._id
        }

        public setChannel(channel: Channel, index: number) {
            this._channels[index] = channel
        }

        public get channels() {
            return this._channels
        }

        public getChannel(index: number) {
            return this._channels[index]
        }

        public playAsync() {
            // starts playing on all channels, each one has their own control.inbackground?
        }

        toJSON() {
            return {
                id: this._id,
                channels: this._channels.map(c => c.toJSON()),
            }
        }

        static fromJSON(data: any): Pattern {
            const pattern = new Pattern(data.id)
            pattern._channels = (<Array<Channel>>data.channels).map((c: any) =>
                Channel.fromJSON(c)
            )
            return pattern
        }
    }
}
