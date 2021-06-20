import {BaseProcessor} from "./BaseProcessor";

/**
 * 塞壬唱片(官网)处理器。
 * <p>
 */
export class MonsterSirenProcessor extends BaseProcessor {
  process(opt, kazeLocalData, kazeFun) {
    let list = [];
    let data = JSON.parse(opt.responseText);
    if (data && data.data && data.data.list) {
      data.data.list.forEach(x => {
        let time = Math.floor(new Date(`${x.date} ${kazeLocalData.setting.isTop ? '23:59:59' : '00:00:00'}`).getTime() / 1000);
        list.push({
          time: time,
          id: x.cid,
          judgment: parseInt(x.cid) || time,
          dynamicInfo: x.title,
          source: opt.source,
          url: `https://monster-siren.hypergryph.com/info/${x.cid}`,
        })
      });
      return list.sort((x, y) => y.time - x.time);
    }
  }
}
