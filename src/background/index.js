import {settings} from '../common/Settings';
import BrowserUtil from '../common/util/BrowserUtil';
import NotificationUtil from '../common/util/NotificationUtil';
import DunInfo from '../common/sync/DunInfo';
import SanInfo from '../common/sync/SanInfo';
import {
    IS_TEST,
    MESSAGE_CARD_LIST_GET,
    MESSAGE_CARD_LIST_UPDATE,
    MESSAGE_DUN_INFO_GET,
    MESSAGE_FORCE_REFRESH,
    MESSAGE_SAN_GET,
    MESSAGE_SETTINGS_UPDATE,
    TEST_DATA_REFRESH_TIME
} from '../common/Constants';
import {defaultDataSources} from '../common/datasource/DefaultDataSources';

// 重构完成后的其它优化：
// TODO 多个提取出来的类要考虑能否合并(指互相通信的那部分)
// TODO vue数据更新相关的问题，要确认各个页面的数据能正常更新，并且尽量提高更新相关的可读性


// 开启弹出菜单窗口化时的窗口ID
let popupWindowId = null;

// 缓存获取到的饼
const cardListCache = {};

/**
 * 蹲饼！
 */
function tryDun(settings) {
    DunInfo.lastDunTime = new Date().getTime();
    const promiseList = [];
    // 由于删除也算更新，所以用一个flag标记来判断是否有更新，而不能只用promise返回值判断
    let hasUpdated = false;
    for (const key in cardListCache) {
        if (cardListCache.hasOwnProperty(key)) {
            // 如果缓存的key不在启用列表中则删除缓存
            if (!settings.enableDataSources.includes(key)) {
                delete cardListCache[key];
                hasUpdated = true;
            }
        }
    }
    for (const dataName of settings.enableDataSources) {
        const source = defaultDataSources[dataName];
        DunInfo.counter++;
        promiseList.push(source.fetchData().then(newCardList => {
            let oldCardList = cardListCache[dataName];
            let isNew = kazeFun.JudgmentNew(oldCardList, newCardList, source.title);
            if (isNew) {
                cardListCache[dataName] = newCardList;
                hasUpdated = true;
            }
        }));
    }
    Promise.all(promiseList).then(() => {
        if (hasUpdated) {
            BrowserUtil.sendMessage(MESSAGE_CARD_LIST_UPDATE, cardListCache);
        }
    }).finally(() => DunInfo.saveUpdate());
}

let dunTimeoutId = null;
/**
 * 启动蹲饼timer，会立刻请求一次然后按settings.dun.intervalTime的值进行延时轮询
 */
function startDunTimer() {
    tryDun(settings);

    let delay = IS_TEST ? TEST_DATA_REFRESH_TIME : settings.dun.intervalTime;
    // 低频模式
    if (settings.checkLowFrequency()) {
        delay *= 2;
    }
    dunTimeoutId = setTimeout(() => {
        startDunTimer();
    }, delay * 1000);
}

// 通用方法
const kazeFun = {
    //判断是否为最新 并且在此推送
    JudgmentNew(oldList, newList, title) {
        //判断方法 取每条的第一个判定字段  如果新的字段不等于旧的且大于旧的 判定为新条目
        if (oldList
            && newList
            && oldList.length > 0
            && newList.length > 0
            && oldList[0].judgment != newList[0].judgment
        ) {
            let newInfo = newList[0];
            let timeNow = new Date()
            let notice = newInfo.dynamicInfo.replace(/\n/g, "");
            console.log(title, `${timeNow.getFullYear()}-${timeNow.getMonth() + 1}-${timeNow.getDate()} ${timeNow.getHours()}：${timeNow.getMinutes()}：${timeNow.getSeconds()}`, newInfo, oldList[0]);
            // 是否推送
            if (settings.dun.enableNotice) {
                NotificationUtil.SendNotice(`小刻在【${title}】里面找到了一个饼！`, notice, newInfo.image, newInfo.id)
            }
            return true;
        }
        else if (!oldList) {
            return true;
        }
        return false
    },

    // 初始化
    Init() {
        // chrome.browserAction.setBadgeText({ text: 'Beta' });
        // chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        // 开始蹲饼！
        settings.doAfterInit(() => {
            startDunTimer();
        });

        // 监听前台事件
        BrowserUtil.addMessageListener('background', null, (message) => {
            if (message.type) {
                switch (message.type) {
                    case MESSAGE_FORCE_REFRESH:
                        tryDun(settings);
                        return;
                    case MESSAGE_DUN_INFO_GET:
                        return DunInfo;
                    case MESSAGE_CARD_LIST_GET:
                        return cardListCache;
                    case MESSAGE_SAN_GET:
                        return SanInfo;
                    case MESSAGE_SETTINGS_UPDATE: {
                        // 由于更新配置后数据源/蹲饼频率可能改变，所以重启蹲饼timer
                        // TODO 最好能判断配置更新的情况，只有更新了数据源/蹲饼频率的时候才刷新，避免无意义的网络请求
                        if (dunTimeoutId) {
                            clearTimeout(dunTimeoutId);
                            dunTimeoutId = null;
                        }
                        startDunTimer();
                        return;
                    }
                    default:
                        return;
                }
            }
        });

        // 监听标签
        BrowserUtil.addNotificationClickListener(id => {
            let cardlist = Object.values(cardListCache)
                .reduce((acc, cur) => [...acc, ...cur], [])
                .filter(x => x.id + "_" == id);
            if (cardlist != null && cardlist.length > 0) {
                BrowserUtil.createTab(cardlist[0].url);
            } else {
                alert('o(╥﹏╥)o 时间过于久远...最近列表内没有找到该网站');
            }
        });

        // 监听安装更新
        BrowserUtil.addInstallListener(details => {
            if (details.reason === 'install') {
                BrowserUtil.createTab(BrowserUtil.getExtensionURL("welcome.html"));
            }
        });

        // 监听扩展图标被点击，用于打开窗口化的弹出页面
        BrowserUtil.addIconClickListener(() => {
            if (settings.display.windowMode) {
                if (popupWindowId != null) {
                    BrowserUtil.removeWindow(popupWindowId);
                }
                BrowserUtil.createWindow({ url: BrowserUtil.getExtensionURL("windowPopup.html"), type: "panel", width: 1100, height: 750 })
                  .then(tab => popupWindowId = tab.id);
            }
        });
    }
}

kazeFun.Init();
