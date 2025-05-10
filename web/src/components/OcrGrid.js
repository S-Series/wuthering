import './OcrGrid.css'
import OCRSlot from "./OcrSlot";

function OCRGrid(){
    return(
        <div className='ocr-grid'>
            <OCRSlot isMain={false}/>
            <OCRSlot isMain={false}/>
            <OCRSlot isMain={true} />
            <OCRSlot isMain={false}/>
            <OCRSlot isMain={false}/>
        </div>
    );
}
export default OCRGrid;