import './OcrGrid.css'
import OCRSlot from "./OcrSlot";

function OCRGrid(){
    return(
        <div className='ocr-grid'>
            <OCRSlot/>
            <OCRSlot/>
            <OCRSlot/>
            <OCRSlot/>
            <OCRSlot/>
        </div>
    );
}
export default OCRGrid;