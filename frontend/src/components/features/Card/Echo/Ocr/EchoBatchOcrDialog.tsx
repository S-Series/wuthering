import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, useDraggable, useDroppable, rectIntersection, type DragEndEvent } from "@dnd-kit/core";
import { useElevatedOverlay } from "@/contexts/useElevatedOverlay";
import { useAppStore, type LangType } from "@/stores/appStore";
import { useCharacter } from "@/stores/characterDataStore";
import { locale } from "@/locales/locale";
import { ECHO_CANDIDATES } from "@/datas/echos";
import type { EchoRuntime } from "@/runtime/echo.runtime";
import { calcAllEchoScore, patchEchoAt } from "@/runtime/characterData.helpers";
import { getEquipmentRank } from "@/types/character.type";
import EchoOcrResultEditor from "./EchoOcrResultEditor";
import type { EchoOcrResult } from "./EchoOcrPanel";
import { recognizeEchoImage, echoOcrResultToRuntime } from "./echoOcr.helpers";
import { placeBatchEntry, type BatchLayout } from "./echoBatch.layout";
import "./EchoBatchOcrDialog.css";

type Outcome = { result: EchoOcrResult | null; error: string | null };
type Props = { files: File[]; first: Outcome; startIndex: number; requestLang: LangType };
type Entry = { id: string; echo: EchoRuntime; fresh: boolean };

function BatchTile({ entry, position, selected, name, rank, onSelect }: {
  entry: Entry; position?: number; selected: boolean; name: string; rank: string; onSelect: () => void;
}) {
  const drag = useDraggable({ id: entry.id });
  const drop = useDroppable({ id: position === undefined ? `pool:${entry.id}` : `target:${position}`, disabled: position === undefined });
  return <button type="button" ref={node => { drag.setNodeRef(node); drop.setNodeRef(node); }}
    className={`echo-batch-tile ${entry.fresh ? "fresh" : "existing"} ${selected ? "selected" : ""} ${drop.isOver ? "over" : ""}`}
    style={{ opacity: drag.isDragging ? 0.45 : 1 }} {...drag.attributes} {...drag.listeners}
    aria-label={name} title={name} aria-pressed={selected} onClick={onSelect}>
    <span>{position === undefined ? "OCR" : `Slot ${position + 1}`}</span>
    <img src={entry.echo.echoId ? `${import.meta.env.VITE_IMAGE_BASE}/ico/echos/${entry.echo.echoId}.webp` : "/default.webp"} alt=""
      onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = "/default.webp"; }} />
    <img className="echo-batch-tile__rank" src={`/ico/rank/${rank}.png`} alt={rank} />
  </button>;
}

export default function EchoBatchOcrDialog({ files, first, startIndex, requestLang }: Props) {
  const { lang } = useAppStore();
  const { characterData, patchCharacterData } = useCharacter();
  const text = locale(lang).ocr;
  const { closeElevatedOverlay } = useElevatedOverlay();
  const [initial] = useState(() => ({ order: [...characterData.echoDataIndex], echoes: structuredClone(characterData.echoData) }));
  const [entries, setEntries] = useState<Record<string, Entry>>(() => {
    const existing: Record<string, Entry> = Object.fromEntries(initial.echoes.map((echo, i) => [`existing:${i}`, { id: `existing:${i}`, echo, fresh: false }]));
    if (first.result) existing["new:0"] = { id: "new:0", echo: echoOcrResultToRuntime(first.result), fresh: true };
    return existing;
  });
  const [layout, setLayout] = useState<BatchLayout>(() => ({ slots: initial.order.map(i => `existing:${i}`), pool: first.result ? ["new:0"] : [] }));
  const [outcomes, setOutcomes] = useState<(Outcome | null)[]>(() => files.map((_, i) => i === 0 ? first : null));
  const [selection, setSelection] = useState(() => ({ id: `existing:${startIndex}`, seed: initial.echoes[startIndex] }));
  const [retrying, setRetrying] = useState<number | null>(null);
  const retryRef = useRef<AbortController | null>(null);
  const pending = outcomes.some(outcome => outcome === null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor));

  const storeOutcome = useCallback((index: number, outcome: Outcome) => {
    setOutcomes(previous => previous.map((item, i) => i === index ? outcome : item));
    if (!outcome.result) return;
    const id = `new:${index}`, echo = echoOcrResultToRuntime(outcome.result);
    setEntries(previous => ({ ...previous, [id]: { id, echo, fresh: true } }));
    setLayout(previous => previous.slots.includes(id) || previous.pool.includes(id) ? previous : { ...previous, pool: [...previous.pool, id] });
  }, [setLayout]);

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      for (let i = 1; i < files.length; i++) {
        try {
          const result = await recognizeEchoImage(files[i], requestLang, controller.signal);
          if (controller.signal.aborted) return;
          storeOutcome(i, { result, error: null });
        } catch (error) {
          if (controller.signal.aborted) return;
          storeOutcome(i, { result: null, error: error instanceof Error ? error.message : "OCR failed" });
        }
      }
    })();
    return () => { controller.abort(); retryRef.current?.abort(); };
  }, [files, requestLang, storeOutcome]);

  const edit = useCallback((echo: EchoRuntime) => {
    setEntries(previous => ({ ...previous, [selection.id]: { ...previous[selection.id], echo } }));
  }, [selection.id]);
  const data = useMemo(() => ({ cost: selection.seed.cost, echoId: selection.seed.echoId, setId: selection.seed.setId,
    stats: [[selection.seed.mainOption.statId, selection.seed.mainOption.statValue], ["dummy", 0],
      ...selection.seed.subOptions.map(option => [option.statId, option.statValue])] as EchoOcrResult["echoStats"] }), [selection.seed]);
  const select = (id: string) => setSelection({ id, seed: entries[id].echo });
  const onDrop = ({ active, over }: DragEndEvent) => {
    if (!over || !String(over.id).startsWith("target:")) return;
    const id = String(active.id), target = Number(String(over.id).split(":")[1]);
    setLayout(previous => placeBatchEntry(previous, id, target));
    select(id);
  };
  const finish = () => {
    let updated = characterData;
    layout.slots.forEach((id, position) => {
      const index = initial.order[position], echo = entries[id].echo;
      if (JSON.stringify(echo) !== JSON.stringify(initial.echoes[index])) {
        updated = { ...updated, ...patchEchoAt(updated, index as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, echo) };
      }
    });
    patchCharacterData({ echoData: updated.echoData });
    closeElevatedOverlay();
  };
  const retry = async (index: number) => {
    if (retryRef.current) return;
    const controller = new AbortController(); retryRef.current = controller; setRetrying(index);
    try {
      const result = await recognizeEchoImage(files[index], requestLang, controller.signal);
      if (!controller.signal.aborted) storeOutcome(index, { result, error: null });
    } catch (error) {
      if (!controller.signal.aborted) storeOutcome(index, { result: null, error: error instanceof Error ? error.message : "OCR failed" });
    } finally { retryRef.current = null; if (!controller.signal.aborted) setRetrying(null); }
  };
  const name = (entry: Entry) => ECHO_CANDIDATES[lang].find(item => item.echoId === entry.echo.echoId)?.text ?? text.batchEmptySlot;
  const ranks = useMemo(() => Object.fromEntries(Object.values(entries).map(entry => [entry.id,
    getEquipmentRank(calcAllEchoScore({ ...characterData, echoData: characterData.echoData.map((echo, index) => index === 0 ? entry.echo : echo) as typeof characterData.echoData })[0][1])
  ])), [entries, characterData]);

  return <div className="echo-batch-review">
    <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={onDrop}>
      <div className="echo-batch-review__layout">
        <section className="echo-batch-review__inventory">
          <header><h3>{text.echoList}</h3><span aria-live="polite">{pending ? text.batchProgress : text.batchComplete} {outcomes.filter(Boolean).length} / {files.length}</span></header>
          <div className="echo-batch-review__slots">{layout.slots.map((id, position) => <BatchTile key={`target:${position}`} entry={entries[id]} position={position}
            selected={selection.id === id} name={name(entries[id])} rank={ranks[id]} onSelect={() => select(id)} />)}</div>
          <h3>{text.batchNewResults}</h3>
          <div className="echo-batch-review__pool">{layout.pool.map(id => <BatchTile key={id} entry={entries[id]} selected={selection.id === id}
            name={name(entries[id])} rank={ranks[id]} onSelect={() => select(id)} />)}
            {outcomes.map((outcome, i) => outcome?.result ? null : <div className="echo-batch-review__pending" key={i}>
              <span>{files[i].name}</span><small role={outcome?.error ? "alert" : "status"}>{outcome?.error ?? text.loading}</small>
              {outcome?.error && <button type="button" disabled={pending || retrying !== null} onClick={() => void retry(i)}>{retrying === i ? text.loading : text.batchRetry}</button>}
            </div>)}
          </div>
        </section>
        <aside className="echo-batch-review__editor"><h3>{text.echoData}</h3>
          <EchoOcrResultEditor key={selection.id} datas={data} selectIdx={startIndex} resetAction={() => {}} draftOnly onDraftChange={edit} />
          {layout.pool.includes(selection.id) && <label className="echo-batch-review__place">{text.batchChooseSlot}
            <select value="" onChange={event => { setLayout(previous => placeBatchEntry(previous, selection.id, Number(event.target.value))); }}>
              <option value="" disabled>{text.batchChooseSlot}</option>{initial.order.map((_, i) => <option key={i} value={i}>Slot {i + 1}</option>)}
            </select></label>}
        </aside>
      </div>
    </DndContext>
    <footer><button type="button" className="echo-batch-review__finish" disabled={pending || retrying !== null} onClick={finish}>{text.batchFinish}</button></footer>
  </div>;
}
