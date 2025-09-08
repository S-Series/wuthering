import { useMemo } from "react";
import { useProfile } from "../hooks/useProfile";
import { useStyleHelper } from "../hooks/useStyleHelpers";

function EchoStatDrop({ index = 0 }) {

  const {echoList, EditEchoList} = useProfile();
  const echoData = useMemo(() => {
    return echoList[index];
  }, [echoList]);

  return (
    <div>
      {echoData.stats.map((data, idx) => {
        <div>

        </div>;
      })}
    </div>
  );
}
export default EchoStatDrop;
