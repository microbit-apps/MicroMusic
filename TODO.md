### TODO

Console.log over serial

-   More than 1 bank of track data important one, can have them playing after eachother
-   Want a nice strong evaluation, start thinking about that now
-   Playing at different octaves
-   Switch through octaves on same number
-   Pressing back while playing makes it stuck

## Bugs

-   [x] Change size of small sample selection box on soundtrackerscreen as it's slightly too small for the sample names to fit inside
-   [ ] Fix getting stuck scrolling (there may not be a fix rn)
-   [x] Crash when clicking on setting inside of setting button

## General

-   [x] Split grid into note sections
-   [x] Grid current note highlighting instead of constant scrolling
-   [x] Sample selection screen
-   [x] BPM calculation for tick speed
-   [x] Moving over and selecting last 2 samples
-   [x] Way to go through the sounds
-   [ ] Keyboard screen
-   [ ] Add saving fully with save names and then add Loading
-   [x] Need to create a screen for the save loading from flash. Checkout datalogger for saving and loading
-   [x] IMPORTANT - Reloading a screen with state, need to get back or store the state somehow
-   [ ] Octave stuff - Semitones done, for octaves it would be just halving or doubling
-   [x] Need to sort sample selection
-   [ ] Music that repeats notes, select multiple notes at once?
-   [ ] Copy paste feature, can copy 8 notes on screen and paste into another part of one sample or to another sample's track
-   [x] Navigate D-Pad to go down and then new page, up and down to increment through scale
-   [x] Kind of like select a row, using the cursor, select with a button, then up and down buttons could change the pitch of the note being played
-   [ ] Enable playing the current note as it is changed
-   [ ] Enable playing sample sound when it's changed
-   [ ] Sample groupings

## Note Scrolling

-   [ ] Any adjustments needed for the visual effect, such as when it shows/when it doesn't
-   [x] Make padding visible, add some indicator as to how far down the song it is currently and have it then sit in the middle while it continues to scroll down
-   [x] Add indicator to when the song is playing instead of just note selection. As part of this, limit the cursor to the control buttons whilst it is playing.
-   [x] Implement the scrolling to the note selection
-   [x] Flesh out note selection with highlighting and making it actually change the notes that you want it to
-   [x] Add smooth scrolling via ticks seen in microdata

## Settings

-   [x] Settings screen (Made but need to make more assets and pick settings)
-   [x] Settings functionality - BPM

## Saving

-   [ ] Saving functionality
-   [ ] Loading functionality
-   [ ] If not saved before load, confirmation on load
-   [ ] Confirmation on save slot to use
-   [x] Load screen and Save screen -> Composite "saves" screen

## Assets

-   [x] Create back button asset
-   [x] Create small settings cog asset
-   [x] Create small save button asset
-   [x] Sample selection arrow
-   [x] Change back button asset to be black (0xf)
-   [x] Change cog button to be black

## Other

-   [ ] Sample/simpleEffect (echo or something, decay, holding a note for longer)
-   [ ] Sample sets instead of just 4 samples
-   [x] Play stops using other buttons
-   [x] Musical notation
-   [ ] 128-block length, can extend songs with different blocks/repeat blocks
-   [ ] Continuing on - multiple screens of data, song structure view and defining samples
