import {FixedStats as FixedStats} from "../Datas/Stats";

export function OcrRetouch({text, lang}) {
  if (!text) return [];
  if (!lang) lang = "en";

  var datas = text;

    for (var i = 0; i < datas.length; i++){
        console.log(datas[i]);
        try {
            FixedStats.find((e) => e[lang] === datas[i])
        }
        catch{ continue; }
    }
}
