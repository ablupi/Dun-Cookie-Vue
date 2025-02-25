/**
 * 这里放不方便分类的公共方法
 */

/**
 * 递归合并对象
 * <p>
 * <strong>注意：子元素是数组的会直接复制而不会递归合并</strong>
 *
 * @param target 目标对象
 * @param obj 源对象
 * @param changed {object?} 改变的属性
 */
function deepAssign(target, obj, changed) {
  if (!target) target = Array.isArray(obj) ? [] : {};
  if (!changed) changed = {};
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        //判断obj子元素是否为对象，如果是则递归复制，否则简单复制
        const val = obj[key];
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          if (target.hasOwnProperty(key)) {
            const subChanged = {};
            target[key] = deepAssign(target[key], obj[key], subChanged);
            if (Object.keys(subChanged).length > 0) {
              changed[key] = subChanged;
            }
          } else {
            target[key] = deepAssign(target[key], obj[key]);
            const changedKeys = Object.keys(target[key]);
            changed[key] = changedKeys.length > 0 ? changedKeys : ['newEmptyObj'];
          }
        } else {
          if (!deepEquals(target[key], val)) {
            changed[key] = Array.isArray(val) ? [true] : true;
          }
          target[key] = val;
        }
      }
    }
  }
  return target;
}

const scalarTypes = ['string', 'number', 'bigint', 'boolean', 'undefined', 'symbol'];

/**
 * 深度递归比较对象
 *
 * @param a 对象1
 * @param b 对象2
 * @return {boolean}
 */
function deepEquals(a, b) {
  if (a === b) return true;
  if (!!a !== !!b) return false;
  if (typeof a !== typeof b) return false;
  if (scalarTypes.indexOf(typeof a) !== -1) return a === b;
  if (typeof a === 'object') {
    if (a.constructor !== b.constructor) return false;
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!deepEquals(a[i], b[i])) return false;
      }
      return true;
    } else {
      const aKeys = Object.keys(a).sort();
      const bKeys = Object.keys(b).sort();
      if (!deepEquals(aKeys, bKeys)) return false;
      for (const key in a) {
        if (a.hasOwnProperty(key)) {
          if (!deepEquals(a[key], b[key])) return false;
        }
      }
      return true;
    }
  } else if (typeof a === 'function') {
    return a === b;
  } else {
    console.log('不支持的deepEquals类型：' + typeof a);
    return false;
  }
}

function animateCSS(element, animation, callback) {
  let prefix = 'animate__';
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);
    if (!node) {
      return;
    }
    node.classList.add(`${prefix}animated`, animationName);

    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {
      once: true,
    });
  }).then(() => {
    if (callback) {
      callback();
    }
  });
}

export { deepAssign, deepEquals, animateCSS };
