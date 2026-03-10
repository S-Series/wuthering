import { useMemo, useState } from "react";
import { useCharacter } from "@/stores/characterDataStore"
import OcrSelectItem from "@/components/features/Card/OcrSelectItem"

import EchoSelect from "./EchoSelect";
import { createEmptyEchoRuntime, type EchoRuntime } from "@/runtime/echo.runtime";
import EchoDragSelect from "./EchoDragSelect";

import "./OcrSelect.css"

type EchoIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export default function OcrSelect() {
	const { characterData } = useCharacter();
	const [selectIdx, setSelectIdx] = useState(0);
	const [ocrEchoData, setocrEchoData] = useState<EchoRuntime>(createEmptyEchoRuntime(4));
	const handleSelect = (idx: number) => {
		setSelectIdx(idx);
	};

	return (
		<div className="ocr-select-body">
			<div className="select-item-slot">
				<span className="item-slot-title"> asdf </span>

				<div className="item-slot-container"><EchoDragSelect /></div>
			</div>

			<div className="select-item-slot">
				<span className="item-slot-title"> asdf </span>

				<div className="item-slot-container">
					<EchoSelect index={selectIdx as EchoIndex} />
				</div>
			</div>
		</div>
	)
}