### TODO

Console.log over serial

-   [ ] More than 1 bank of track data important one, can have them playing after eachother
-   [ ] Want a nice strong evaluation, start thinking about that now
-   [ ] Intuitiveness, when selecting a note, A to come out of it and B to reset the note to "-"? Or A to reset, B to come out of it

## Bugs

-   [x] Pressing back while playing breaks things
-   [x] Change size of small sample selection box on soundtrackerscreen as it's slightly too small for the sample names to fit inside
-   [ ] Fix getting stuck scrolling (there may not be a fix rn)
-   [x] Crash when clicking on setting inside of setting button

## General

-   [ ] Music that repeats notes, select multiple notes at once?
-   [ ] Copy paste feature, can copy 8 notes on screen and paste into another part of one sample or to another sample's track
-   [ ] Keyboard screen
-   [ ] Add saving fully with save names and then add Loading
-   [ ] Enable playing sample sound when it's changed
-   [ ] Sample groupings
-   [x] Enable playing the current note as it is changed
-   [x] Playing at different octaves
-   [x] Switch through octaves on same number
-   [x] Split grid into note sections
-   [x] Grid current note highlighting instead of constant scrolling
-   [x] Sample selection screen
-   [x] BPM calculation for tick speed
-   [x] Moving over and selecting last 2 samples
-   [x] Way to go through the sounds
-   [x] Need to create a screen for the save loading from flash. Checkout datalogger for saving and loading
-   [x] IMPORTANT - Reloading a screen with state, need to get back or store the state somehow
-   [x] Octave stuff - Semitones done, for octaves it would be just halving or doubling
-   [x] Need to sort sample selection
-   [x] Navigate D-Pad to go down and then new page, up and down to increment through scale
-   [x] Kind of like select a row, using the cursor, select with a button, then up and down buttons could change the pitch of the note being played

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

-   [ ] Had some saving and loading functionality written, application seemed to freeze randomly with those screens included even without implementation in, need to debug but finish other features first
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

-   [ ] 128-block length, can extend songs with different blocks/repeat blocks
-   [ ] Continuing on - multiple screens of data, song structure view and defining samples - Possibly bigger than time left
-   [ ] Sample/simpleEffect (echo or something, decay, holding a note for longer) - Scrapped for now as I don't know how I'd implement this
-   [x] Play stops using other buttons
-   [x] Musical notation
