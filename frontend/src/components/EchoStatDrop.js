import { useMemo, useState } from "react";
import Select, { components } from "react-select";
import { useProfile } from "../hooks/useProfile";
import { useStyleHelper } from "../hooks/useStyleHelpers";

import { FixedStatsMain4, FixedStatsMain3, FixedStatsMain1 } from "../data/Stats";

function EchoStatDrop({ index = 0, sizeValue = 1 }) {

  const setSlotSize = useStyleHelper(sizeValue);
  const {echoList, EditEchoList} = useProfile();
  const echoData = useMemo(() => {
    return echoList[index];
  }, [echoList]);

  console.log(echoData);
  const dataIndex = useMemo(() => {
    if (echoData.cost === 1) return 2;
    else if (echoData.cost === 3) return 1;
    else return 0; 
  }, [echoData])

  return (
    <div>
      <div/>
      {[...Array(5)].map((_, i) => 
        <div key={i}>
          <Select
            options={{}}
            />
        </div>
      )}
    </div>
  );
}
export default EchoStatDrop;
