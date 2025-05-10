namespace micromusic {
    import CursorSceneWithPriorPage = user_interface_base.CursorSceneWithPriorPage
    import GridNavigator = user_interface_base.GridNavigator
    import CursorDir = user_interface_base.CursorDir
    import AppInterface = user_interface_base.AppInterface
    import Screen = user_interface_base.Screen
    import getIcon = user_interface_base.getIcon
    import Button = user_interface_base.Button
    import ButtonStyles = user_interface_base.ButtonStyles
    import font = user_interface_base.font

    /**
     * PLAN FOR SONG PATTERNS
     *
     * Screen will open up for song
     * By default, one block and a plus sign somewhere called "add block" or such
     * Clicking add block visually adds a block and sets it up
     * Perhaps some class to hold all our info
     * Can click onto blocks
     *
     * For copy paste:
     * Click copy, asks whether you want to copy a single channel from a pattern or a number of rows
     * Paste into existing or new block, then which channel it should be pasted onto
     *
     */

    export class SongComposerScreen extends CursorSceneWithPriorPage {}
}
