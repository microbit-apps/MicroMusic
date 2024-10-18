# MicroMusic

# Building

### Via MakeCode CLI (recommended)

1. Install the [MakeCode CLI](https://microsoft.github.io/pxt-mkc/).
2. Attach a micro:bit to your computer using USB cable.
3. Clone this repo and cd to it
4. invoke `mkc -d`, which will produce the MicroData hex file (in built/mbcodal-binary.hex) and copy it to the micro:bit drive.

#### Via Web App

You need to use https://makecode.microbit.org/beta currently to build MicroMusic. You can load this repo into MakeCode using the Import button in the home page and selecting "Import URL". Please note that there is currently no simulator support for the arcade shield extension (https://github.com/microsoft/pxt-arcadeshield) that MicroData depends on.
