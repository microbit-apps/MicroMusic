namespace micromusic {
    let extraImage: Bitmap = null

    //% shim=TD_NOOP
    function extraSamples(name: string) {}

    // All unused assets have been cut since the flash storage limit has been approached

    export class icons {
        public static get(name: string, nullIfMissing = false): Bitmap {
            // editor icons
            if (name == "edit_program") return icondb.largeEditIcon
            if (name == "MISSING") return icondb.MISSING
            if (name == "largeDisk") return icondb.largeDisk

            if (name == "volume") return icondb.volumeLogo

            if (name == "placeholder") return icondb.invisibleButtonPlaceholder
            if (name == "sample_button") return icondb.sampleSelectBtn
            if (name == "sample_button_small")
                return icondb.sampleSectionSelectSmall
            if (name == "section_select") return icondb.sectionSelector1
            if (name == "sample_section_select")
                return icondb.sampleSectionSelect

            if (name == "play") return icondb.play
            if (name == "stop") return icondb.stop
            if (name == "pause") return icondb.pause
            if (name == "fast_forward") return icondb.fast_forward
            if (name == "rewind") return icondb.rewind

            if (name == "green_tick") return icondb.green_tick

            // if (name == "pin_0") return icondb.pin_0
            // if (name == "pin_1") return icondb.pin_1
            // if (name == "pin_2") return icondb.pin_2

            if (name == "right_turn") return icondb.car_right_turn
            if (name == "right_spin") return icondb.car_right_spin

            if (name == "microphone") return icondb.microphone

            if (name == "tile_button_a") return icondb.tile_button_a
            if (name == "tile_button_b") return icondb.tile_button_b
            // if (name == "compass") return icondb.compass

            if (name == "radio_set_group") return icondb.radio_set_group
            if (name == "largeSettingsGear") return icondb.largeSettingsGear
            if (name == "microbitLogoWhiteBackground")
                return icondb.microbitLogoWhiteBackground

            extraImage = null
            extraSamples(name) // only for web app
            if (extraImage) return extraImage
            if (nullIfMissing) return null
            return icondb.MISSING
        }
    }

    export const wordLogo = bmp`
        ..111111.......111111...1111.................................................111111.......111111..............................1111...................
        .11bbbbbb.....11bbbbbb.11bbbb...............................................11bbbbbb.....11bbbbbb............................11bbbb..................
        .1bbbbbbbb...11bbbbbbbf1bbbbbf..............................................1bbbbbbbb...11bbbbbbbf...........................1bbbbbf.................
        .1bbbbbbbbb.11bbbbbbbbf1bbbbbf..............................................1bbbbbbbbb.11bbbbbbbbf...........................1bbbbbf.................
        .1bbbbbbbbbb1bbbbbbbbbf1bbbbbf..............................................1bbbbbbbbbb1bbbbbbbbbf...........................1bbbbbf.................
        .1bbbbbbbbbbbbbbbbbbbbf.bbbbff..............................................1bbbbbbbbbbbbbbbbbbbbf............................bbbbff.................
        .1bbbbbbbbbbbbbbbbbbbbf..ffff.....1111111......1111...111.......1111111.....1bbbbbbbbbbbbbbbbbbbbf.............................ffff.....1111111......
        .1bbbbbbbbbbbbbbbbbbbbf.1111....111bbbbbbb1...11bbbb.11bbb....111bbbbbbb1...1bbbbbbbbbbbbbbbbbbbbf.111.......111b...111111....1111....111bbbbbbb1....
        .1bbbbbbbbbbbbbbbbbbbbf11bbbb..11bbbbbbbbbbb..1bbbbbb1bbbbb..11bbbbbbbbbbb..1bbbbbbbbbbbbbbbbbbbbf1bbbbf....1bbbbf.11bbbbbbf.11bbbb..11bbbbbbbbbbb...
        .1bbbbbbfbbbbbfbbbbbbbf1bbbbbf.1bbbbbbbbbbbbf.1bbbbbbbbbbbbf.1bbbbbbbbbbbbf.1bbbbbbfbbbbbfbbbbbbbf1bbbbf....1bbbbf11bbbbbbbbf1bbbbbf.1bbbbbbbbbbbbf..
        .1bbbbbbf.bbbff1bbbbbbf1bbbbbf11bbbbbbbbbbbbb.1bbbbbbbbbbbbf11bbbbbbbbbbbbb.1bbbbbbf.bbbff1bbbbbbf1bbbbf....1bbbbf1bbbbfbbbbf1bbbbbf11bbbbbbbbbbbbb..
        .1bbbbbbf..fff.1bbbbbbf1bbbbbf1bbbbbfffbbbbbbf1bbbbbfffbbbff1bbbbbfffbbbbbbf1bbbbbbf..fff.1bbbbbbf1bbbbf....1bbbbf1bbbf..bbbf1bbbbbf1bbbbbfffbbbbbbf.
        .1bbbbbbf......1bbbbbbf1bbbbbf1bbbbff...bbbbff1bbbbbf...fff.1bbbbff...bbbbbf1bbbbbbf......1bbbbbbf1bbbbf....1bbbbf1bbbb...fff1bbbbbf1bbbbff...bbbbff.
        .1bbbbbbf......1bbbbbbf1bbbbbf1bbbbf.....ffff.1bbbbbf.......1bbbbf....1bbbbf1bbbbbbf......1bbbbbbf1bbbbf....1bbbbf1bbbbb.....1bbbbbf1bbbbf.....ffff..
        .1bbbbbbf......1bbbbbbf1bbbbbf1bbbbf....1111..1bbbbbf.......1bbbbf....1bbbbf1bbbbbbf......1bbbbbbf1bbbbf....1bbbbf.fbbbbbb...1bbbbbf1bbbbf....1111...
        .1bbbbbbf......1bbbbbbf1bbbbbf1bbbbb...11bbbb.1bbbbbf.......1bbbbb...11bbbbf1bbbbbbf......1bbbbbbf1bbbbb...11bbbbf....fbbbbb.1bbbbbf1bbbbb...11bbbb..
        .1bbbbbbf......1bbbbbbf1bbbbbf1bbbbbb111bbbbbf1bbbbbf.......1bbbbbb111bbbbbf1bbbbbbf......1bbbbbbf1bbbbbb111bbbbbf.11...bbbbf1bbbbbf1bbbbbb111bbbbbf.
        .1bbbbbbf......1bbbbbbf1bbbbbf.bbbbbbbbbbbbbff1bbbbbf........bbbbbbbbbbbbbff1bbbbbbf......1bbbbbbf.bbbbbbbbbbbbbff1bbb..1bbbf1bbbbbf.bbbbbbbbbbbbbff.
        .1bbbbbbf......1bbbbbbf1bbbbbf.1bbbbbbbbbbbbf.1bbbbbf........1bbbbbbbbbbbbf.1bbbbbbf......1bbbbbbf.1bbbbbbbbbbbbf.1bbbb1bbbbf1bbbbbf.1bbbbbbbbbbbbf..
        .1bbbbbbf......1bbbbbbf1bbbbbf..bbbbbbbbbbbff.1bbbbbf.........bbbbbbbbbbbff.1bbbbbbf......1bbbbbbf..bbbbbbbbbbbff.1bbbbbbbbbf1bbbbbf..bbbbbbbbbbbff..
        ..bbbbbff.......bbbbbff.bbbbff...fbbbbbbbfff...bbbbff..........fbbbbbbbfff..bbbbbbff.......bbbbbff...fbbbbbbbfff...1bbbbbbbff.bbbbff...fbbbbbbbfff....
        ...fffff.........fffff...ffff......fffffff......ffff.............fffffff....fffffff.........fffff......fffffff......ffffffff...ffff......fffffff......
    `

    export const microbitLogo = bmp`
    ............................
    ......5555555555555555......
    ....55555555555555555555....
    ...5554444444444444444555...
    ..5554.................555..
    ..554...................554.
    .554....55........55.....554
    .55....5555......5555....554
    .55....55554.....55554...554
    .55.....5544......5544...554
    ..55.....44........44...5544
    ..555..................5554.
    ...555................55544.
    ....5555555555555555555544..
    .....45555555555555555444...
    .......4444444444444444.....
`

    export const editorBackground = bmp`
    8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888188888881888888888881888888888888888888888888888888888888888888888888888888888885888888888888888888881888888888888888888818888888888888188
    8818888888881888888888888888818188888888888888888818888888881888888888818888888888881888888888588888888888888888888888888888888888888858888888888888888888888888
    8888888888888888888888888888881888888888888888888181888888888888888888888888888888888888888888888881888881888888888188888888888888888888888888888888888888888888
    8888588888888818888888888888888888888888888888888818888888888888888888888888888888888888888888888888888888888888881818888888888881888888818888888888818888888888
    8888888888888888888858888888888888188888888888888888888888888888818888888888888188888888888888888888888888888888888188888888888888888888888888888888888888888888
    8888888888888888188888888888888888888881888885888888888888888888888888885888888888888888881888888588888888888888888888888888888888888888888888888588888888888888
    8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8886888688868886888688868886888688868886888688868886888688868886888688868886888688868886888688868886888688868886888688868886888688868886888688868886888688868886
    8686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686
    6666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666
    6666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666
    6666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666
    6666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666
`
}

namespace icondb {
    const note4x3 = bmp`
        . f f .
        f c c .
        f c c .
    `

    // - upscale 5x5 image to 16 x 16, add halo
    export function renderMicrobitLEDs(led55: Bitmap) {
        const ret = bitmaps.create(16, 16)
        ret.fill(15)
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const on = led55.getPixel(row, col)
                if (!on) continue

                const color = 0x2
                const halo = 0xe
                const nrow = 1 + row * 3,
                    ncol = 1 + col * 3
                ret.setPixel(nrow, ncol, color)
                ret.setPixel(nrow + 1, ncol, color)
                ret.setPixel(nrow, ncol + 1, color)
                ret.setPixel(nrow + 1, ncol + 1, color)

                /*
                ret.setPixel(nrow - 1, ncol, halo)
                ret.setPixel(nrow - 1, ncol + 1, halo)
                ret.setPixel(nrow + 2, ncol, halo)
                ret.setPixel(nrow + 2, ncol + 1, halo)
                ret.setPixel(nrow, ncol - 1, halo)
                ret.setPixel(nrow + 1, ncol - 1, halo)
                ret.setPixel(nrow, ncol + 2, halo)
                ret.setPixel(nrow + 1, ncol + 2, halo)
                */
            }
        }
        return ret
    }

    function renderImg(i: Bitmap) {
        let r = ""
        for (let y = 0; y < i.height; ++y) {
            let line = ""
            for (let x = 0; x < i.width; ++x)
                line += "0123456789abcdef"[i.getPixel(x, y)] + " "
            r += line + "\n"
        }
        console.log(`\nimg\`\n${r}\``)
    }

    //------------------------
    // "ICONLESS" BUTTON ICONS
    //------------------------
    export const invisibleButtonPlaceholder = bmp`
        . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . .
    `

    export const sampleSelectBtn = bmp`
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    `

    export const sampleSectionSelect = bmp`
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    `

    export const sampleSectionSelectSmall = bmp`
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
        `

    export const sectionSelector1 = bmp`
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    `

    //----------------
    // SETTINGS ICONS
    //----------------

    export const volumeLogo = bmp`
        ...............................................................................
        ...11..........11..............................................................
        ..11bb........11bb.............................................................
        ..1bbbf.......1bbbf............................................................
        ..1bbbf.......1bbbf.............11.............................................
        ...1bbbf.....11bbf.............11bb............................................
        ...1bbbf.....1bbbf.............1bbbf...........................................
        ...11bbf.....1bbbf...11111.....1bbbf..11......11....11.......11......1111......
        ....1bbbf...11bbf...11bbbbbf...1bbbf.1bbbf...1bbb..1bbbf....1bbb....1bbbbbf....
        ....1bbbf...1bbbf..11bbbbbbbf..1bbbf.1bbbf...1bbbf.1bbbbf..11bbbf..11bbbbbbf...
        ....11bbf...1bbbf.11bbfffbbbbf.1bbbf.1bbbf...1bbbf.1bbbbbf.1bbbbf.11bbfffbbbf..
        .....1bbbf.11bbf..1bbff...bbbf.1bbbf.1bbbf...1bbbf.1bbbbbbbbbbbbf.1bbbf..bbbf..
        .....1bbbf.1bbbf..1bbf....1bbf.1bbbf.1bbbf...1bbbf.1bbbfbbbbfbbbf.1bbbbbbbbbf..
        .....11bbf.1bbbf..1bbf....1bbf.1bbbf.1bbbb..11bbbf.1bbbf.bbf.bbbf.1bbbbbbbbff..
        ......1bbbfbbbf...1bbb...11bbf.1bbbf..bbbbb11bbbbf.1bbbf.bbf.bbbf.1bbbffffff...
        ......1bbbbbbbf....bbbb111bbff.1bbbf..1bbbbbbbbbff.1bbbf..ff.bbbf..bbbf........
        .......fbbbbbf......bbbbbbbff..1bbbf...bbbbbbbbbf..1bbbf.....bbbf...bbbbbbbf...
        ........fbbbf........bbbbbff....bbff...fbbbbbbbff...bbbf.....bbbf....bbbbbff...
        .........fff..........fffff......ff......fffffff.....fff......fff.....fffff....
        ...............................................................................
        `

    //-------------
    // SMALL ICONS:
    //-------------

    // export const microbitLogoWhiteBackground = bmp`
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 5 5 5 5 5 5 5 5 5 1 1 1 1
    //     1 1 1 5 5 5 5 5 5 5 5 5 5 5 1 1 1
    //     1 1 5 4 4 4 4 4 4 4 4 4 4 4 1 1 1
    //     1 5 5 4 1 1 1 1 1 1 1 1 1 4 5 1 1
    //     1 5 5 1 1 1 1 1 1 1 1 1 1 1 5 4 1
    //     5 5 4 1 5 5 1 1 1 1 5 5 1 1 5 5 4
    //     5 5 1 5 5 5 5 1 1 5 5 5 5 1 5 5 4
    //     5 5 1 5 5 5 5 4 1 5 5 5 5 4 5 5 4
    //     5 5 1 1 5 5 4 4 1 1 5 5 4 4 5 5 4
    //     1 5 5 1 1 4 4 1 1 1 1 4 4 1 5 4 4
    //     1 5 5 1 1 1 1 1 1 1 1 1 1 1 5 4 1
    //     1 1 5 5 1 1 1 1 1 1 1 1 1 4 4 4 1
    //     1 1 1 5 5 5 5 5 5 5 5 5 5 5 4 1 1
    //     1 1 1 5 5 5 5 5 5 5 5 5 5 5 1 1 1
    //     1 1 1 1 1 4 4 4 4 4 4 4 4 1 1 1 1
    // `

    // export const MISSING = bmp`
    //     . . . . . . . . . . . . . . . .
    //     . . . . . . . . . . . . . . . .
    //     . . . . . . . . . . . . . . . .
    //     . . . 2 2 2 2 2 2 2 2 2 2 . . .
    //     . . . 2 2 . . . . . . 2 2 . . .
    //     . . . 2 . 2 . . . . 2 . 2 . . .
    //     . . . 2 . . 2 . . 2 . . 2 . . .
    //     . . . 2 . . . 2 2 . . . 2 . . .
    //     . . . 2 . . . 2 2 . . . 2 . . .
    //     . . . 2 . . 2 . . 2 . . 2 . . .
    //     . . . 2 . 2 . . . . 2 . 2 . . .
    //     . . . 2 2 . . . . . . 2 2 . . .
    //     . . . 2 2 2 2 2 2 2 2 2 2 . . .
    //     . . . . . . . . . . . . . . . .
    //     . . . . . . . . . . . . . . . .
    //     . . . . . . . . . . . . . . . .
    // `

    // export const green_tick = bmp`
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 6 6 1
    //     1 1 1 1 1 1 1 1 1 1 1 1 6 6 6 1
    //     1 1 1 1 1 1 1 1 1 1 1 6 6 6 6 1
    //     1 1 1 1 1 1 1 1 1 1 6 6 6 6 6 1
    //     1 1 1 1 1 1 1 1 1 6 6 6 6 6 1 1
    //     1 6 1 1 1 1 1 1 6 6 6 6 6 1 1 1
    //     1 6 6 1 1 1 1 6 6 6 6 6 1 1 1 1
    //     1 6 6 6 1 1 6 6 6 6 6 1 1 1 1 1
    //     1 6 6 6 6 6 6 6 6 6 1 1 1 1 1 1
    //     1 6 6 6 6 6 6 6 6 1 1 1 1 1 1 1
    //     1 6 6 6 6 6 6 6 1 1 1 1 1 1 1 1
    //     1 1 6 6 6 6 6 1 1 1 1 1 1 1 1 1
    //     1 1 1 6 6 6 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    // `

    // ///
    // /// HARDWARE-SPECIFIC LANGUAGE TILES
    // ///
    // export const tile_button_a = bmp`
    //     . . . . . . . . . . . . . . . .
    //     . . . . . . . . . . . . . . . .
    //     . . . . . . . . . . . . 8 . . .
    //     . . . . . . . . . . . 8 8 d . .
    //     . . . . . . . . . . 8 8 8 d . .
    //     . . . . . . . . . 8 8 8 8 d . .
    //     . . . . . . . . 8 8 8 8 8 d . .
    //     . . . . . . . 8 8 8 1 8 8 d . .
    //     . . . . . . 8 8 8 1 8 1 8 d . .
    //     . . . . . 8 8 8 8 1 1 1 8 d . .
    //     . . . . 8 8 8 8 8 1 8 1 8 d . .
    //     . . . 8 8 8 8 8 8 1 8 1 8 d . .
    //     . . 8 8 8 8 8 8 8 8 8 8 8 d . .
    //     . . . d d d d d d d d d d d . .
    //     . . . . . . . . . . . . . . . .
    //     . . . . . . . . . . . . . . . .
    // `

    // export const tile_button_b = bmp`
    //     . . . . . . . . . . . . . . . .
    //     . . . . . . . . . . . . . . . .
    //     . . 8 8 8 8 8 8 8 8 8 8 8 . . .
    //     . . 8 1 1 8 8 8 8 8 8 8 d d . .
    //     . . 8 1 8 1 8 8 8 8 8 d d . . .
    //     . . 8 1 1 8 8 8 8 8 d d . . . .
    //     . . 8 1 8 1 8 8 8 d d . . . . .
    //     . . 8 1 1 8 8 8 d d . . . . . .
    //     . . 8 8 8 8 8 d d . . . . . . .
    //     . . 8 8 8 8 d d . . . . . . . .
    //     . . 8 8 8 d d . . . . . . . . .
    //     . . 8 8 d d . . . . . . . . . .
    //     . . 8 d d . . . . . . . . . . .
    //     . . . d . . . . . . . . . . . .
    //     . . . . . . . . . . . . . . . .
    //     . . . . . . . . . . . . . . . .
    // `

    // export const pin_0 = bmp`
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 4 4 4 4 4 1 1 1 4 4 1 1 1
    //     1 4 4 4 1 1 4 4 1 4 4 4 4 1 1
    //     1 4 4 4 1 1 1 4 4 4 1 1 4 4 1
    //     1 4 4 4 1 1 4 4 4 4 1 1 4 4 1
    //     1 4 4 4 4 4 4 1 4 4 1 1 4 4 1
    //     1 4 4 4 1 1 1 1 4 4 1 1 4 4 1
    //     1 4 4 4 1 1 1 1 4 4 1 1 4 4 1
    //     1 4 4 4 1 1 1 1 4 4 1 1 4 4 1
    //     1 4 4 4 1 1 1 1 4 4 1 1 4 4 1
    //     1 4 4 4 1 1 1 1 4 4 1 1 4 4 1
    //     1 4 4 4 1 1 1 1 1 4 4 4 4 1 1
    //     1 1 4 1 1 1 1 1 1 1 4 4 1 1 1
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    // `

    // export const pin_1 = bmp`
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 4 4 4 4 4 1 1 4 4 4 4 1 1
    //     1 4 4 4 1 1 4 4 4 4 4 4 4 1 1
    //     1 4 4 4 1 1 1 4 4 4 4 4 4 1 1
    //     1 4 4 4 1 1 4 4 1 1 4 4 4 1 1
    //     1 4 4 4 4 4 4 1 1 1 4 4 4 1 1
    //     1 4 4 4 1 1 1 1 1 1 4 4 4 1 1
    //     1 4 4 4 1 1 1 1 1 1 4 4 4 1 1
    //     1 4 4 4 1 1 1 1 1 1 4 4 4 1 1
    //     1 4 4 4 1 1 1 1 1 1 4 4 4 1 1
    //     1 4 4 4 1 1 1 1 1 1 4 4 4 1 1
    //     1 4 4 4 1 1 1 1 4 4 4 4 4 4 1
    //     1 1 4 1 1 1 1 4 4 4 4 4 4 4 4
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    // `

    // export const pin_2 = bmp`
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 4 4 4 4 4 1 1 4 4 4 4 1 1
    //     1 4 4 4 1 1 4 4 4 4 4 4 4 4 1
    //     1 4 4 4 1 1 1 4 4 4 1 1 4 4 4
    //     1 4 4 4 1 1 4 4 4 1 1 1 4 4 4
    //     1 4 4 4 4 4 4 1 1 1 1 1 4 4 4
    //     1 4 4 4 1 1 1 1 1 1 1 4 4 4 1
    //     1 4 4 4 1 1 1 1 1 1 1 4 4 4 1
    //     1 4 4 4 1 1 1 1 1 1 4 4 4 1 1
    //     1 4 4 4 1 1 1 1 1 4 4 4 4 1 1
    //     1 4 4 4 1 1 1 1 4 4 4 4 1 1 1
    //     1 4 4 4 1 1 1 4 4 4 4 4 4 4 4
    //     1 1 4 1 1 1 1 4 4 4 4 4 4 4 4
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    // `

    // export const compass = bmp`
    //     1 1 1 1 5 5 5 5 5 5 5 1 1 1 1
    //     1 1 1 5 5 5 5 5 5 5 5 5 1 1 1
    //     1 1 5 5 5 f f f f f 5 5 5 1 1
    //     1 5 5 5 f f f f f f 2 5 5 5 1
    //     5 5 5 f f f f f f 2 2 2 5 5 5
    //     5 5 f f f f f f 2 2 2 f f 5 5
    //     5 f f f f f f 2 2 2 f f f f 5
    //     5 f f f f f 1 1 1 2 f f f f 5
    //     5 f f f f 8 1 1 1 f f f f f 5
    //     5 f f f 8 8 1 1 1 f f f f f 5
    //     5 5 f 8 8 8 8 f f f f f f 5 5
    //     5 5 5 8 8 8 f f f f f f 5 5 5
    //     1 5 5 5 8 f f f f f f 5 5 5 1
    //     1 1 5 5 5 f f f f f 5 5 5 1 1
    //     1 1 1 5 5 5 5 5 5 5 5 5 1 1 1
    //     1 1 1 1 5 5 5 5 5 5 5 1 1 1 1
    // `

    export const stop = bmp`
        f f f f f f f f f
        f f f f f f f f f
        f f f f f f f f f
        f f f f f f f f f
        f f f f f f f f f
        f f f f f f f f f
        f f f f f f f f f
        f f f f f f f f f
        f f f f f f f f f
    `

    export const play = bmp`
        c c f f c c c c c
        c c f f f c c c c
        c c f f f f c c c
        c c f f f f f c c
        c c f f f f f f c
        c c f f f f f c c
        c c f f f f c c c
        c c f f f c c c c
        c c f f c c c c c
    `

    export const pause = bmp`
        f f f c c f f f
        f f f c c f f f
        f f f c c f f f
        f f f c c f f f
        f f f c c f f f
        f f f c c f f f
        f f f c c f f f
        f f f c c f f f
        f f f c c f f f
    `
    export const fast_forward = bmp`
        f f c c f f c c c c
        f f f c f f f c c c
        f f f f f f f f c c
        f f f f f f f f f c
        f f f f f f f f f f
        f f f f f f f f f c
        f f f f f f f f c c
        f f f c f f f c c c
        f f c c f f c c c c
    `

    export const rewind = bmp`
        c c c c f f c c f f
        c c c f f f c f f f
        c c f f f f f f f f
        c f f f f f f f f f
        f f f f f f f f f f
        c f f f f f f f f f
        c c f f f f f f f f
        c c c f f f c f f f
        c c c c f f c c f f
    `
    // export const car_right_turn = bmp`
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 1 c c c 1 1 1 1 1
    //     1 1 1 1 1 1 1 1 c 7 7 c 1 1 1 1
    //     1 1 1 1 1 c c c c 7 7 7 c 1 1 1
    //     1 1 1 1 c 7 7 7 7 7 7 7 7 c 1 1
    //     1 1 1 c 7 7 7 7 7 7 7 7 7 7 c 1
    //     1 1 c 7 7 7 7 7 7 7 7 7 7 c 1 1
    //     1 c 7 7 7 7 7 c c 7 7 7 c 1 1 1
    //     1 c 7 7 7 7 c 1 c 7 7 c 1 1 1 1
    //     1 c 7 7 7 c d 1 c c c 1 1 1 1 1
    //     1 c 7 7 7 c d 1 1 1 1 1 1 1 1 1
    //     1 c 7 7 7 c d 1 1 1 1 1 1 1 1 1
    //     1 c 7 7 7 c d 1 1 1 1 1 1 1 1 1
    //     1 c 7 7 7 c d 1 1 1 1 1 1 1 1 1
    //     1 c c c c c 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    // `

    // export const car_right_spin = bmp`
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 1 c c c c c 1 1 1 1 1 1
    //     1 1 1 1 c 7 7 7 7 7 c 1 1 1 1 1
    //     1 1 1 c 7 7 7 7 7 7 7 c 1 1 1 1
    //     1 1 c 7 7 7 7 7 7 7 7 7 c 1 1 1
    //     1 c 7 7 7 7 7 c c 7 7 7 c 1 1 1
    //     c 7 7 7 7 7 c c c 7 7 7 c c c 1
    //     c 7 7 7 7 c c 7 7 7 7 7 7 7 c d
    //     c 7 7 7 c d c 7 7 7 7 7 7 7 c d
    //     c 7 7 7 c d 1 c 7 7 7 7 7 c d 1
    //     c 7 7 7 c d 1 1 c 7 7 7 c d 1 1
    //     c 7 7 7 c d 1 1 1 c 7 c d 1 1 1
    //     c 7 7 7 c 1 1 1 1 1 c d 1 1 1 1
    //     c c c c c 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    // `

    // // export const microbit_logo = bmp`
    // //     . . . . . . . . . . . . . . . .
    // //     . . . . . . . . . . . . . . . .
    // //     . . . . . . . . . . . . . . . .
    // //     . . . . . . . . . . . . . . . .
    // //     . . . . 4 4 4 4 4 4 4 4 d . . .
    // //     . . . 4 d 5 5 5 5 5 5 5 4 d . .
    // //     . . 4 d . . . . . . . . 5 4 d .
    // //     . . 4 d 4 4 d . . . 4 4 d 4 d .
    // //     . . 4 d 4 4 d . . . 4 4 d 4 d .
    // //     . . 4 d . 5 5 . . . . 5 5 4 d .
    // //     . . . 4 d . . . . . . . 4 d . .
    // //     . . . . 4 4 4 4 4 4 4 4 d . . .
    // //     . . . . . 5 5 5 5 5 5 5 . . . .
    // //     . . . . . . . . . . . . . . . .
    // //     . . . . . . . . . . . . . . . .
    // //     . . . . . . . . . . . . . . . .
    // // `

    // export const microphone = bmp`
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 b c 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 b c c c 1 1 1 1 1 1
    //     1 1 1 1 1 1 b c c c 1 1 1 1 1 1
    //     1 1 1 1 1 1 b c c c 1 1 1 1 1 1
    //     1 1 1 1 1 1 b c c c 1 1 1 1 1 1
    //     1 1 1 1 f 1 c c c c 1 f 1 1 1 1
    //     1 1 1 1 f 1 c c c c 1 f 1 1 1 1
    //     1 1 1 1 f 1 1 c c 1 1 f 1 1 1 1
    //     1 1 1 1 1 f 1 1 1 1 f 1 1 1 1 1
    //     1 1 1 1 1 1 f f f f 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 f f 1 1 1 1 1 1 1
    //     1 1 1 1 1 1 1 f f 1 1 1 1 1 1 1
    //     1 1 1 1 1 f f f f f f 1 1 1 1 1
    //     1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
    // `
    //
    // export const settingsGear = bmp``

    //-------------
    // Large Icons:
    //-------------

    // export const largeEditIcon = bmp`
    //     .666666666666666666666666666666.
    //     66666666666666666666666666666666
    //     66666666666666666666666666666666
    //     666666666666666666666666ee666666
    //     66666666666666666666666e44e66666
    //     6666666666666666666666ee442e6666
    //     666666666666666666666e15e222e666
    //     66666666666666666666e155ee2ee666
    //     6666666666666666666e155e44eee666
    //     666666666666666666e155e44eee6666
    //     ccccccccccccccccce155e44eeeccccc
    //     bbbbbbbbbbbbbbbbe155e44eeebbbbbb
    //     bbbbbbbbbbbbbbbe155e44eeebbbbbbb
    //     111111bbb11111e155e44eeebcbcbcbb
    //     1111111b11111e155e44eeebbbbbbbcb
    //     1111111b1111ede5e44eeebbbbbbbbbb
    //     1111111b1111edde44eeebbbbbbbbbcb
    //     1111111b1111edddeeeebbbbb1bbbbbb
    //     1111111b1111eedddeebcbbb111bbbcb
    //     1111111b1111eeeeee1bbbbbc1cbbbbb
    //     1111111b11111111111bcbbbbcbbbbcb
    //     1111111b11111111111bbbbbbbbbbbbb
    //     111111cbc111111111cbcbbbbbbbbbcb
    //     ccccccbbbcccccccccbbbcbcbcbcbcbb
    //     bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    //     bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    //     cccccccccccccccccccccccccccccccc
    //     66666666666666666666666666666666
    //     66666666666666666666666666666666
    //     66666666666666666666666666666666
    //     66666666666666666666666666666666
    //     b666666666666666666666666666666b
    //     .bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.
    // `

    // export const largeSettingsGear = bmp`
    //     66666666666666666666666666666666
    //     66666666666666666666666666666666
    //     666666666666666dd666666666666666
    //     66666666666666dddd66666666666666
    //     66666dddd666ddbbbbcc666dddd66666
    //     66666dddd666ddbbbbcc666dddd66666
    //     666dddbbbb66ddbbbbcc66dbbbccc666
    //     666dddbbbbccddbbbbccdddbbbccc666
    //     6666ddbbbbbbbbbbbbbbbbbbbbcc6666
    //     66666dbbbbbbbbbbbbbbbbbbbbc66666
    //     666666ccbbddbbccccbbddbbcc666666
    //     666666ccbbddbbc66cbbddbbcc666666
    //     66666dddbbbbcc6666ccbbbbdddd6666
    //     6666ddddbbbbc666666cbbbbdddd6666
    //     666dbbbbbbcc66666666ccbbbbbbc666
    //     6dddbbbbbbc6666666666cbbbbbbccc6
    //     6dddbbbbbbc6666666666cbbbbbbccc6
    //     6dddbbbbbbcc66666666ccbbbbbbccc6
    //     666cccccbbbbc6666666cbbbbcccc666
    //     6666ccccbbbbcc66666ccbbbbccc6666
    //     666666ddbbddbbc66cbbddbbcc666666
    //     666666ddbbddbbccccbbddbbcc666666
    //     66666dbbbbbbbbbbbbbbbbbbbbc66666
    //     6666ddbbbbbbbbbbbbbbbbbbbbcc6666
    //     6666ddbbbbccccbbbbccccbbbbcc6666
    //     6666ddbbbb66ccbbbbcc66bbbbcc6666
    //     66666cccc666ccbbbbcc666cccc66666
    //     66666cccc666ccbbbbcc666cccc66666
    //     66666666666666cccc66666666666666
    //     666666666666666cc666666666666666
    //     66666666666666666666666666666666
    //     66666666666666666666666666666666
    // `

    // export const radio_set_group = bmp`
    //     .666666666666666666666666666666.
    //     66666666666666666666666666666666
    //     66666666666666666666666666666666
    //     66666666688888888888888666666666
    //     66666666688888888888888666666666
    //     66666668866666666666666886666666
    //     66666668866666666666666886666666
    //     66666886666888888888866668866666
    //     66666886666888888888866668866666
    //     66688666688666666666688666688666
    //     66688666688666666666688666688666
    //     66666668866668888886666886666666
    //     66666668866668888886666886666666
    //     66666666666886666668866666666666
    //     66666666666886666668866666666666
    //     66666666666666644666666666666666
    //     66666666666666644666666666666666
    //     66666666666664455446666666666666
    //     66666666666664455446666666666666
    //     66666666666445555554466666666666
    //     66666666666445555554466666666666
    //     66666666644555555555544666666666
    //     66666666644555555555544666666666
    //     66666666666664455446666666666666
    //     66666666666664455446666666666666
    //     66666666666664455446666666666666
    //     66666666666664455446666666666666
    //     66666666666664455446666666666666
    //     66666666666664455446666666666666
    //     66666666666664455446666666666666
    //     66666666666664455446666666666666
    //     66666666666664455446666666666666
    //     .666666666666666666666666666666.
    // `

    // export const largeDisk = bmp`
    //     .666666666666666666666666666666.
    //     66666666666666666666666666666666
    //     66666666666666666666666666666666
    //     66666bbbbbbbbbbbbbbbbbbbb6666666
    //     6666bb8cdddddddddddd888c8b666666
    //     6666b88cdddddddc88dd888c88b66666
    //     6666b88cddddddd888dd888c888b6666
    //     6666b88cddddddd888dd888c888b6666
    //     6666b88cddddddd888dd888c888b6666
    //     6666b88cddddddd888dd888c888b6666
    //     6666b88cdddddddddddd888c888b6666
    //     6666b88ccccccccccccccccc888b6666
    //     6666b8888888888888888888888b6666
    //     6666b8888888888888888888888b6666
    //     6666b8833333333333333333888b6666
    //     6666b8833333333333333333888b6666
    //     6666b8811111111111111111888b6666
    //     6666b8811111111111111111888b6666
    //     6666b8811ccccc1111111111888b6666
    //     6666b8811111111111111111888b6666
    //     6666b8811ccc111111111111888b6666
    //     6666b8811111111111111111888b6666
    //     6666b8811ccccccc11111111888b6666
    //     6666b8811111111111111111888b6666
    //     6666b8811111111111111111888b6666
    //     6666b88111111111111111118f8b6666
    //     6666b88111111111111111118f8b6666
    //     6666bb811111111111111111888b6666
    //     66666bbbbbbbbbbbbbbbbbbbbbbb6666
    //     66666666666666666666666666666666
    //     66666666666666666666666666666666
    //     b666666666666666666666666666666b
    //     .bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.
    // `
}
