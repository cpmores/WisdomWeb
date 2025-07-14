/**
 * jQuery 辅助工具
 * 展示如何在 Vue 3 项目中使用 jQuery
 * 注意：需要先安装 jQuery: npm install jquery
 */

import $ from 'jquery'

/**
 * jQuery 动画效果工具类
 */
export class JQueryAnimations {
  /**
   * 淡入效果
   * @param {string} selector - 选择器
   * @param {number} duration - 动画持续时间
   * @param {Function} callback - 动画完成后的回调函数
   */
  static fadeIn(selector, duration = 300, callback = null) {
    $(selector).fadeIn(duration, callback)
  }

  /**
   * 淡出效果
   * @param {string} selector - 选择器
   * @param {number} duration - 动画持续时间
   * @param {Function} callback - 动画完成后的回调函数
   */
  static fadeOut(selector, duration = 300, callback = null) {
    $(selector).fadeOut(duration, callback)
  }

  /**
   * 滑动显示效果
   * @param {string} selector - 选择器
   * @param {number} duration - 动画持续时间
   * @param {Function} callback - 动画完成后的回调函数
   */
  static slideDown(selector, duration = 300, callback = null) {
    $(selector).slideDown(duration, callback)
  }

  /**
   * 滑动隐藏效果
   * @param {string} selector - 选择器
   * @param {number} duration - 动画持续时间
   * @param {Function} callback - 动画完成后的回调函数
   */
  static slideUp(selector, duration = 300, callback = null) {
    $(selector).slideUp(duration, callback)
  }

  /**
   * 自定义动画效果
   * @param {string} selector - 选择器
   * @param {Object} properties - 动画属性
   * @param {number} duration - 动画持续时间
   * @param {Function} callback - 动画完成后的回调函数
   */
  static animate(selector, properties, duration = 300, callback = null) {
    $(selector).animate(properties, duration, callback)
  }
}

/**
 * jQuery DOM 操作工具类
 */
export class JQueryDOM {
  /**
   * 添加CSS类
   * @param {string} selector - 选择器
   * @param {string} className - CSS类名
   */
  static addClass(selector, className) {
    $(selector).addClass(className)
  }

  /**
   * 移除CSS类
   * @param {string} selector - 选择器
   * @param {string} className - CSS类名
   */
  static removeClass(selector, className) {
    $(selector).removeClass(className)
  }

  /**
   * 切换CSS类
   * @param {string} selector - 选择器
   * @param {string} className - CSS类名
   */
  static toggleClass(selector, className) {
    $(selector).toggleClass(className)
  }

  /**
   * 设置元素内容
   * @param {string} selector - 选择器
   * @param {string} content - 内容
   */
  static setText(selector, content) {
    $(selector).text(content)
  }

  /**
   * 设置HTML内容
   * @param {string} selector - 选择器
   * @param {string} content - HTML内容
   */
  static setHTML(selector, content) {
    $(selector).html(content)
  }

  /**
   * 获取元素内容
   * @param {string} selector - 选择器
   * @returns {string} 元素内容
   */
  static getText(selector) {
    return $(selector).text()
  }

  /**
   * 设置元素属性
   * @param {string} selector - 选择器
   * @param {string} attribute - 属性名
   * @param {string} value - 属性值
   */
  static setAttr(selector, attribute, value) {
    $(selector).attr(attribute, value)
  }

  /**
   * 获取元素属性
   * @param {string} selector - 选择器
   * @param {string} attribute - 属性名
   * @returns {string} 属性值
   */
  static getAttr(selector, attribute) {
    return $(selector).attr(attribute)
  }
}

/**
 * jQuery 事件处理工具类
 */
export class JQueryEvents {
  /**
   * 绑定点击事件
   * @param {string} selector - 选择器
   * @param {Function} handler - 事件处理函数
   */
  static onClick(selector, handler) {
    $(selector).on('click', handler)
  }

  /**
   * 绑定输入事件
   * @param {string} selector - 选择器
   * @param {Function} handler - 事件处理函数
   */
  static onInput(selector, handler) {
    $(selector).on('input', handler)
  }

  /**
   * 绑定焦点事件
   * @param {string} selector - 选择器
   * @param {Function} handler - 事件处理函数
   */
  static onFocus(selector, handler) {
    $(selector).on('focus', handler)
  }

  /**
   * 绑定失焦事件
   * @param {string} selector - 选择器
   * @param {Function} handler - 事件处理函数
   */
  static onBlur(selector, handler) {
    $(selector).on('blur', handler)
  }

  /**
   * 绑定键盘事件
   * @param {string} selector - 选择器
   * @param {Function} handler - 事件处理函数
   */
  static onKeyup(selector, handler) {
    $(selector).on('keyup', handler)
  }

  /**
   * 解绑事件
   * @param {string} selector - 选择器
   * @param {string} eventType - 事件类型
   */
  static off(selector, eventType) {
    $(selector).off(eventType)
  }
}

/**
 * jQuery AJAX 工具类
 */
export class JQueryAJAX {
  /**
   * GET 请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求参数
   * @param {Function} success - 成功回调
   * @param {Function} error - 错误回调
   */
  static get(url, data = {}, success = null, error = null) {
    $.ajax({
      url: url,
      method: 'GET',
      data: data,
      success: success,
      error: error,
    })
  }

  /**
   * POST 请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Function} success - 成功回调
   * @param {Function} error - 错误回调
   */
  static post(url, data = {}, success = null, error = null) {
    $.ajax({
      url: url,
      method: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: success,
      error: error,
    })
  }

  /**
   * PUT 请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Function} success - 成功回调
   * @param {Function} error - 错误回调
   */
  static put(url, data = {}, success = null, error = null) {
    $.ajax({
      url: url,
      method: 'PUT',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: success,
      error: error,
    })
  }

  /**
   * DELETE 请求
   * @param {string} url - 请求URL
   * @param {Function} success - 成功回调
   * @param {Function} error - 错误回调
   */
  static delete(url, success = null, error = null) {
    $.ajax({
      url: url,
      method: 'DELETE',
      success: success,
      error: error,
    })
  }
}

/**
 * jQuery 工具函数
 */
export class JQueryUtils {
  /**
   * 检查元素是否存在
   * @param {string} selector - 选择器
   * @returns {boolean} 是否存在
   */
  static exists(selector) {
    return $(selector).length > 0
  }

  /**
   * 获取元素数量
   * @param {string} selector - 选择器
   * @returns {number} 元素数量
   */
  static count(selector) {
    return $(selector).length
  }

  /**
   * 滚动到元素位置
   * @param {string} selector - 选择器
   * @param {number} offset - 偏移量
   */
  static scrollTo(selector, offset = 0) {
    const element = $(selector)
    if (element.length) {
      $('html, body').animate(
        {
          scrollTop: element.offset().top + offset,
        },
        500,
      )
    }
  }

  /**
   * 复制文本到剪贴板
   * @param {string} text - 要复制的文本
   * @param {Function} callback - 复制完成回调
   */
  static copyToClipboard(text, callback = null) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()

    try {
      document.execCommand('copy')
      if (callback) callback(true)
    } catch (err) {
      if (callback) callback(false)
    }

    document.body.removeChild(textArea)
  }

  /**
   * 显示加载动画
   * @param {string} selector - 选择器
   */
  static showLoading(selector) {
    $(selector).html('<div class="loading">加载中...</div>')
  }

  /**
   * 隐藏加载动画
   * @param {string} selector - 选择器
   */
  static hideLoading(selector) {
    $(selector).find('.loading').remove()
  }
}

/**
 * 在 Vue 组件中使用 jQuery 的示例
 */
export class VueJQueryMixin {
  /**
   * 在 Vue 组件挂载后初始化 jQuery 功能
   * @param {Object} vm - Vue 组件实例
   */
  static mounted(vm) {
    // 示例：为搜索框添加自动完成功能
    JQueryEvents.onInput('#search-input', function () {
      const query = $(this).val()
      if (query.length > 0) {
        // 触发搜索建议
        vm.handleSearchInput()
      }
    })

    // 示例：为收藏按钮添加点击动画
    JQueryEvents.onClick('.bookmark-btn', function () {
      JQueryAnimations.animate(
        $(this),
        {
          scale: 0.9,
        },
        100,
      )

      setTimeout(() => {
        JQueryAnimations.animate(
          $(this),
          {
            scale: 1,
          },
          100,
        )
      }, 100)
    })

    // 示例：为标签按钮添加悬停效果
    JQueryEvents.onClick('.tag-btn', function () {
      $('.tag-btn').removeClass('active')
      $(this).addClass('active')
    })
  }

  /**
   * 在 Vue 组件销毁前清理 jQuery 事件
   */
  static beforeDestroy() {
    // 清理所有绑定的事件
    $('*').off()
  }
}

// 导出 jQuery 实例供直接使用
export { $ }
