# ChessCheat Pro

ChessCheat Pro is a small browser extension for experimenting with live chess-board reading, Stockfish analysis, and a floating in-page analysis panel on Chess.com.

I built this as a learning project. It is not made to support cheating, fair-play abuse, or use in rated/competitive games.

## Showcase

Watch the showcase video here:

[Download or view the showcase video](assets/showcase-video.mp4)

## Features

- Floating analysis panel on Chess.com
- Stockfish-powered best-move suggestions
- Adjustable analysis depth, defaulting to depth 11
- Automatic board orientation detection for white or black
- Move display in a simple `from -> to` format
- Board highlights for the suggested move
- Evaluation bar shown from White's point of view
- Draggable overlay panel, so you can move it out of the way
- Start/stop button for quickly restarting analysis
- Clean dark UI with a compact layout

## Installation

### Chrome or Edge

1. Clone this repository:

   ```bash
   git clone https://github.com/Ferdian-99/chesscheat-pro.git
   ```

2. Open your browser extension page:

   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`

3. Enable Developer Mode.

4. Click Load unpacked.

5. Select the project folder you just cloned.

6. Open Chess.com and start a game or board page.

7. Use the floating ChessCheat Pro panel to start analysis.

### Firefox

1. Open `about:debugging#/runtime/this-firefox`.

2. Click Load Temporary Add-on.

3. Select the `manifest.json` file from this project.

4. Open Chess.com and use the floating panel.

Temporary Firefox add-ons are removed when the browser closes, so you may need to load it again next time.

## How To Use

1. Open a Chess.com board.

2. Click Start Analysis.

3. Adjust the depth slider if needed.

4. Read the suggested move in the panel.

5. The board highlights show the suggested start and target squares.

6. Drag the panel by its header if it covers something important.

7. Click Stop Analysis when you are done.

## Troubleshooting

If the extension gives an illegal or weird move, stop the analysis and start it again. In most cases this refreshes the board state and the next suggestion is correct.

If the panel does not appear:

- Refresh the Chess.com page.
- Make sure the extension is enabled.
- Make sure you loaded the project folder, not only one file.

If the board highlights look flipped:

- Stop analysis.
- Refresh the page.
- Start analysis again after the board is fully loaded.

## Notes

- This extension reads the board directly from the Chess.com page.
- It works best when the board is fully loaded and not mid-animation.
- The evaluation bar is shown from White's point of view.
- Very high analysis depth can be slow, especially in the browser.

## Disclaimer

This project is for learning, experimenting, and understanding how browser extensions, board detection, and chess engines work together.

I do not support cheating, fair-play violations, or using this tool in rated or competitive games. Use it responsibly and respect the rules of the platform you are on.

## License

MIT License. See the project files for details.

