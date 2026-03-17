import EchoSelect from "./EchoSelect";
import EchoDragSelect from "./EchoDragSelect";

import "./OcrSelect.css"

type EchoIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Props = {
	selectIdx: EchoIndex;
	setSelectIdx: React.Dispatch<React.SetStateAction<EchoIndex>>;
}
export default function OcrSelect({selectIdx, setSelectIdx}: Props) {

	return (
		<div className="ocr-select-body">
			<div className="select-item-slot">
				<span className="item-slot-title"> 에코 목록 </span>

				<div className="item-slot-container">
					<EchoDragSelect num={selectIdx} onClick={setSelectIdx} />
				</div>
			</div>

			<div className="select-item-slot">
				<span className="item-slot-title"> 에코 데이터 </span>

				<div className="item-slot-container">
					<EchoSelect index={selectIdx as EchoIndex} />
				</div>
			</div>
		</div>
	)
}