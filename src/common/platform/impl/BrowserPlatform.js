import { AbstractPlatform, RequestError } from '../AbstractPlatform';
import $ from 'jquery';
import { CURRENT_VERSION, TOOL_QR_URL } from '../../Constants';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';

const IGNORE_MESSAGE_ERROR_1 = 'Could not establish connection. Receiving end does not exist.';
const IGNORE_MESSAGE_ERROR_2 = 'The message port closed before a response was received.';

let _isBackground;
let _isMobile;

const imageCache = {};
const qrcodeCache = {};

const CORS_AVAILABLE_DOMAINS = { 'penguin-stats.io': true, 'penguin-stats.cn': true };
// 正常浏览器在给权限后跨域视为basic请求 无视cors相关设定，脑子有毛病的QQ浏览器在mode: no-cors跨域时直接用CORB策略拒绝读取响应(正常浏览器好像只会在contentScript里有这种设定)
// 事实上正常浏览器和QQ浏览器在加权限后mode: no-cors跨域的Response.type都是basic，但是QQ浏览器就是不让你读取 诶就是玩
const ALWAYS_ENABLE_CORS = typeof navigator != 'undefined' && navigator.userAgent.includes('QQBrowser');

/**
 * 浏览器平台，放置与具体浏览器无关的通用逻辑
 */
export default class BrowserPlatform extends AbstractPlatform {
  constructor() {
    super();
    // 这部分放在类里面的原因是放在外面会被意外执行导致报错
    // 判断当前url中是否包含background(已知的其它方法都是Promise，都不能保证在isBackground被使用之前完成判断)
    _isBackground = window.document.URL.indexOf('background') !== -1;
    console.log(`Current isBackground: ${_isBackground}`);

    const head = navigator.userAgent;
    _isMobile = head.indexOf('Android') > 1 || head.indexOf('iPhone') > 1;
  }

  get isBackground() {
    return _isBackground;
  }

  get isMobile() {
    return _isMobile;
  }

  get PlatformType() {
    return 'Browser';
  }

  async generateShareImage(dataItem, iconUrl, dataSource, imageUrl) {
    if (typeof imageUrl !== 'string') {
      imageUrl = dataItem.coverImage;
    }
    let image;
    if (imageUrl) {
      try {
        image = await this.__loadImage(imageUrl);
      } catch (err) {
        image = undefined;
      }
    }
    // 整体宽度以图片宽度为准，无图片680，有图片1080，左右再各加10的边距
    const canvasWidth = Math.max(680, image ? 960 : 0) + 20;

    // 减掉左右边距
    const headerCanvasPromise = this.__generateImageHeader(canvasWidth - 20, dataItem, iconUrl, dataSource);
    const textCanvasPromise = this.__generateImageTextContent(canvasWidth - 20, dataItem);

    const [headerCanvas, textCanvas] = await Promise.all([headerCanvasPromise, textCanvasPromise]);
    const textHeight = textCanvas ? textCanvas.height : 0;
    let canvasHeight = headerCanvas.height + 10 + textHeight + 10;
    if (image) {
      canvasHeight += ((canvasWidth - 20) / image.width) * image.height;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let heightOffset = 0;
    ctx.drawImage(headerCanvas, 10, heightOffset);
    heightOffset += headerCanvas.height + 10;
    if (textHeight > 0) {
      ctx.drawImage(textCanvas, 10, heightOffset);
      heightOffset += textHeight + 10;
    }
    if (image) {
      ctx.drawImage(image, 10, heightOffset, canvasWidth - 20, ((canvasWidth - 20) / image.width) * image.height);
    }
    return canvas;
  }

  /**
   * 生成分享图片的头部，不考虑边距
   *
   * @param width {number}
   * @param dataItem {DataItem}
   * @param iconUrl {string}
   * @param dataSource {DataSourceMeta}
   * @return {Promise<HTMLCanvasElement>}
   * @private
   */
  async __generateImageHeader(width, dataItem, iconUrl, dataSource) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = 120;
    const iconPromise = this.__loadImage(iconUrl);
    const sourceIconPromise = this.__loadImage(dataSource.icon);
    const jumpQrCodePromise = this.__generateQrcode(dataItem.jumpUrl);
    const toolQrCodePromise = this.__generateQrcode(TOOL_QR_URL);
    /**
     * 这个类型提示用来避免ide的类型不匹配警告
     * @type {(HTMLImageElement|HTMLCanvasElement)[]}
     */
    const promiseResult = await Promise.all([iconPromise, sourceIconPromise, jumpQrCodePromise, toolQrCodePromise]);
    const [icon, sourceIcon, jumpQrCode, toolQrCode] = promiseResult;

    // 小刻食堂信息
    ctx.fillStyle = '#ffba4b';
    ctx.font = '36px Microsoft Yahei';
    ctx.fillText(`小刻食堂 V${CURRENT_VERSION}`, 120, 50);
    ctx.drawImage(icon, 10, 10, 100, 100);

    // 数据源信息
    ctx.fillStyle = '#848488';
    ctx.font = '20px Microsoft Yahei';
    ctx.fillText(`${dataSource.name}`, 170, 90);
    ctx.drawImage(sourceIcon, 120, 70, 40, 40);

    ctx.fillStyle = '#909399';
    ctx.font = '14px Microsoft Yahei';
    ctx.fillText(`${dataItem.timeForDisplay}`, 170, 110);

    // 二维码
    const qrcodeSize = 90;
    ctx.fillStyle = '#ffba4b';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    const toolQrCodeOffset = canvas.width - qrcodeSize;
    const jumpQrCodeOffset = toolQrCodeOffset - 20 - qrcodeSize;
    ctx.drawImage(jumpQrCode, jumpQrCodeOffset, 10, qrcodeSize, qrcodeSize);
    ctx.fillText(`数据来源`, jumpQrCodeOffset + qrcodeSize / 2, 10 + qrcodeSize + 5);
    ctx.drawImage(toolQrCode, toolQrCodeOffset, 10, qrcodeSize, qrcodeSize);
    ctx.fillText(`食堂介绍`, toolQrCodeOffset + qrcodeSize / 2, 10 + qrcodeSize + 5);

    return canvas;
  }

  /**
   * 生成分享图片的文字内容，不考虑边距
   *
   * @param width {number}
   * @param dataItem {DataItem}
   * @return {Promise<HTMLCanvasElement|null>}
   * @private
   */
  async __generateImageTextContent(width, dataItem) {
    if (!dataItem.content && !dataItem.retweeted) {
      return null;
    }
    const textWidth = width;
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.minWidth = textWidth + 'px';
    wrapper.style.maxWidth = textWidth + 'px';
    wrapper.style.whiteSpace = 'break-spaces';
    wrapper.style.wordBreak = 'break-all';
    wrapper.style.font = '18px Microsoft Yahei';
    wrapper.style.color = '#848488';
    let html = dataItem.content;
    if (dataItem.retweeted) {
      const retweeted = `<div style="
font-family: 'Segoe UI', Arial, 'Microsoft Yahei', sans-serif;
list-style: none;
font-size: 1rem;
background-color: #fff;
border: #e4e7ed solid 1px;
color: #848488;
margin: 10px 0 0 0;
padding: 10px;
border-radius: 3px;
width: auto;">转发自 @${dataItem.retweeted.name}:<br/><span>${dataItem.retweeted.content}</span></div>`;
      html += retweeted;
    }
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    const textCanvasPromise = html2canvas(wrapper, {
      useCORS: true,
      backgroundColor: null,
      width: textWidth,
      scale: 1,
    });
    textCanvasPromise.finally(() => {
      document.body.removeChild(wrapper);
    });
    return await textCanvasPromise;
  }

  /**
   * @return {Promise<HTMLImageElement>}
   */
  __loadImage(src) {
    if (imageCache[src]) {
      return Promise.resolve(imageCache[src]);
    }
    const icon = document.createElement('img');
    icon.crossOrigin = 'anonymous';
    icon.src = src;
    return new Promise((resolve, reject) => {
      icon.onload = () => {
        imageCache[src] = icon;
        resolve(icon);
      };
      icon.onerror = reject;
    });
  }

  /**
   * @return {Promise<HTMLImageElement>}
   */
  __generateQrcode(text) {
    if (qrcodeCache[text]) {
      return Promise.resolve(qrcodeCache[text]);
    }
    // eslint-disable-next-line new-cap
    const qrcode = new QRCode.toCanvas(text, { margin: 0 });
    return qrcode.then((canvas) => {
      qrcodeCache[text] = canvas;
      return canvas;
    });
  }

  sendHttpRequest(url, method, timeout) {
    if (typeof url === 'string') {
      url = new URL(url);
    }
    /**
     * @type {RequestInit}
     */
    const options = {
      method: method,
      mode: ALWAYS_ENABLE_CORS || CORS_AVAILABLE_DOMAINS[url.host] ? 'cors' : 'no-cors',
    };
    let timeoutId = 0;
    if (timeout && timeout > 0) {
      const controller = new AbortController();
      options.signal = controller.signal;
      timeoutId = setTimeout(() => {
        controller.abort();
      }, timeout);
    }
    return fetch(url, options)
      .then((response) => {
        if (response.type === 'opaque') {
          throw new RequestError('获取响应失败，可能是插件权限中未允许访问目标网站：' + url.origin, response);
        }
        if (!response.ok) {
          throw new RequestError('获取响应失败，可能是临时网络波动，如果长时间失败请联系开发者', response);
        }
        return response.text();
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          throw new RequestError(`web request timeout(${timeout}ms)`);
        }
        throw new RequestError(`请求时发生异常：${String(err)}`, undefined, err);
      })
      .finally(() => {
        if (timeoutId > 0) {
          clearTimeout(timeoutId);
        }
      });
  }

  getHtmlParser() {
    return $;
  }

  __shouldIgnoreMessageError(errMsg) {
    return errMsg === IGNORE_MESSAGE_ERROR_1 || errMsg === IGNORE_MESSAGE_ERROR_2;
  }
}
