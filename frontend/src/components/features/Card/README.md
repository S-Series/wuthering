# Card Components

## Echo

- `EchoManager`: entry point opened by the Manage Echo Data action; owns selection and OCR result state.
- `EchoManagerLayout`: composes the inventory and manual editor.
- `EchoInventoryBoard` / `EchoInventoryItem`: equipped and spare echo ordering, scores, and the embedded OCR panel slot.
- `EchoEditor`: manual echo data editing.
- `EchoSlot`: echo display on the generated card.
- `EchoListItem`: standalone list entry (currently unused).
- `echoOptions.helpers` / `echoOptions.types`: option rendering and types shared by manual and OCR editors.

### Echo/Ocr

OCR is a subfeature of echo management and lives inside the `Echo` folder.

- `EchoOcrPanel`: image input, request lifecycle, and recognition results.
- `EchoOcrResultEditor`: reviews and applies recognized echo data.
- `EchoOcrTargetPreview`: displays the currently selected echo and its scores.
- `EchoOcrSubstatItem`: one reorderable substat in the result editor.

`EchoManager` passes `EchoOcrPanel` through the layout into the inventory board.
The OCR panel is embedded; it does not open another overlay.
`EchoManager.css` owns manager layout styles. `EchoOcrPanel.css` owns image input,
request status, loading, and panel theme styles. `EchoOcrResultEditor.css` owns
result editor styles. `EchoInventoryBoard.css` controls the embedded panel's size.
