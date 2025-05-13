### TODO

## Things today (13/05/2025)

-   [ ] Fix all dialogue boxes
-   [x] Rename temp to pick
-   [ ] Pattern on top of screen to swap out in the pattern viewer - May include passing in song and pattern index instead of just passing in a pattern
-   [ ] Implement copy-paste
-   [ ] Arrow showing which pattern is being played currently
-   [ ] Ensure playing full song works on main, aka, test on microbit
-   [ ] Fix the way settings work on main

## Specs of song screen

-   [ ] Should be able to open up with a song
-   [ ] Song has a number of patterns, patterns are shown
-   [ ] Click on a pattern and should either be able to replace it or edit it
-   [ ] Replace gives the option to pick a pattern from all our patterns or to let us make a new one
-   [ ] Edit brings up patternComposer screen letting us edit it
-   [ ] Click on an empty pattern, brings up choice to use existing or new, existing brings up same page as replace for selection
-   [ ] Need a way to naturally scroll through if we have a lot of patterns
-   [ ] Limit song size to 12, that would be 3 minutes at 220bpm if all were full
-   [ ] Consider limit on number of patterns, max 12 we can swap out? Or maybe 24, would then need a natural way to scroll through
-   [ ] Copy-paste, select copying a channel or copying an entire pattern into a new one, since channels are now 64 rows i don't think I need further copying, maybe add a way to copy a certain amount but would take more [If I have the man hours I'll do it]
-   [ ] Need to add options to option buttons for removing patterns or sequence, on the boxes for seq but elsewhere on the screen for pattern..?

## Things by this week

Console.log over serial

-   [ ] More than 1 bank of track data important one, can have them playing after eachother
-   [ ] Want a nice strong evaluation, start thinking about that now
-   [ ] Intuitiveness, when selecting a note, A to come out of it and B to reset the note to "-"? Or A to reset, B to come out of it
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bf2d054f9a4278301f9858b61e2f46bb6c665d22
-   [ ] Scrolling over samples plays sample

## Tests

-   [ ] Different volumes
-   [ ] Confirm that changing samples plays a noise
-   [ ] Confirm that octave changing plays correctly
<<<<<<< HEAD
=======
-   [ ] Pattern at the top of the screen so you can swap straight in the patterns editor
-   [ ] Change size of invisible buttons on confirmation pages
>>>>>>> a2c7a471f0c0041e5ba1893016d84c032021aaea
=======
-   [ ] Pattern at the top of the screen so you can swap straight in the patterns editor
-   [ ] Change size of invisible buttons on confirmation pages
>>>>>>> bf2d054f9a4278301f9858b61e2f46bb6c665d22

## Bugs

-   [ ] Fix getting stuck scrolling (there may not be a fix rn)
-   [x] Pressing back while playing breaks things
-   [x] Change size of small sample selection box on soundtrackerscreen as it's slightly too small for the sample names to fit inside
-   [x] Crash when clicking on setting inside of setting button

## General

-   [ ] Song list page, make current main page a "pattern editor" can save patterns and order them on the song page
-   [ ] Song screen will have a number of pattern "blocks" and you can click into them to edit them
-   [ ] Each song has patterns; Each pattern has 4 channels; Each channel has a Sample, 64 rows of notes and octaves
-   [ ] Music that repeats notes, select multiple notes at once?
-   [ ] Copy paste feature, can copy 8 notes on screen and paste into another part of one sample or to another sample's track
-   [ ] Keyboard screen
-   [ ] Add saving fully with save names and then add Loading
-   [ ] Enable playing sample sound when it's changed
-   [ ] Sample groupings - Should have small groups of sample types, inside the grid then another column that has a number and that plays different sounds based on the set picked
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
