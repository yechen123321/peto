// 触摸反馈工具类
export const TouchFeedback = {
  // 添加触摸反馈效果
  addTouchFeedback(element, options = {}) {
    const defaultOptions = {
      scale: 0.95,
      duration: 150,
      opacity: 0.8,
      ...options
    }

    element.addEventListener('touchstart', function() {
      this.style.transform = `scale(${defaultOptions.scale})`
      this.style.opacity = defaultOptions.opacity
      this.style.transition = `all ${defaultOptions.duration}ms ease`
    })

    element.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)'
      this.style.opacity = '1'
    })

    element.addEventListener('touchcancel', function() {
      this.style.transform = 'scale(1)'
      this.style.opacity = '1'
    })
  },

  // 添加点击波纹效果
  addRippleEffect(element, options = {}) {
    const defaultOptions = {
      color: 'rgba(255, 255, 255, 0.3)',
      duration: 600,
      ...options
    }

    element.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      const ripple = document.createElement('div')
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: ${defaultOptions.color};
        transform: translate(${x}px, ${y}px) scale(0);
        width: ${size}px;
        height: ${size}px;
        animation: ripple ${defaultOptions.duration}ms ease-out;
        pointer-events: none;
      `

      this.style.position = 'relative'
      this.style.overflow = 'hidden'
      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, defaultOptions.duration)
    })
  }
}

// 添加波纹动画样式
const rippleStyle = document.createElement('style')
rippleStyle.textContent = `
  @keyframes ripple {
    to {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }
`
document.head.appendChild(rippleStyle)

// 触摸手势工具类
export const TouchGesture = {
  // 滑动检测
  detectSwipe(element, callbacks) {
    let startX, startY, startTime
    const minSwipeDistance = 50
    const maxSwipeTime = 300

    element.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      startTime = Date.now()
    })

    element.addEventListener('touchend', function(e) {
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const endTime = Date.now()
      
      const deltaX = endX - startX
      const deltaY = endY - startY
      const deltaTime = endTime - startTime

      if (Math.abs(deltaX) > minSwipeDistance && deltaTime < maxSwipeTime) {
        if (deltaX > 0 && callbacks.onSwipeRight) {
          callbacks.onSwipeRight()
        } else if (deltaX < 0 && callbacks.onSwipeLeft) {
          callbacks.onSwipeLeft()
        }
      }

      if (Math.abs(deltaY) > minSwipeDistance && deltaTime < maxSwipeTime) {
        if (deltaY > 0 && callbacks.onSwipeDown) {
          callbacks.onSwipeDown()
        } else if (deltaY < 0 && callbacks.onSwipeUp) {
          callbacks.onSwipeUp()
        }
      }
    })
  },

  // 长按检测
  detectLongPress(element, callback, duration = 500) {
    let pressTimer
    let isLongPress = false

    element.addEventListener('touchstart', function(e) {
      isLongPress = false
      pressTimer = setTimeout(() => {
        isLongPress = true
        if (callback) {
          callback(e)
        }
      }, duration)
    })

    element.addEventListener('touchend', function() {
      clearTimeout(pressTimer)
    })

    element.addEventListener('touchcancel', function() {
      clearTimeout(pressTimer)
    })

    element.addEventListener('touchmove', function() {
      clearTimeout(pressTimer)
    })

    return () => isLongPress
  }
}

// 动画工具类
export const AnimationUtils = {
  // 淡入动画
  fadeIn(element, duration = 300) {
    element.style.opacity = '0'
    element.style.display = 'block'
    
    let start = null
    const animate = (timestamp) => {
      if (!start) start = timestamp
      const progress = timestamp - start
      const opacity = Math.min(progress / duration, 1)
      
      element.style.opacity = opacity
      
      if (progress < duration) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  },

  // 淡出动画
  fadeOut(element, duration = 300) {
    let start = null
    const animate = (timestamp) => {
      if (!start) start = timestamp
      const progress = timestamp - start
      const opacity = Math.max(1 - (progress / duration), 0)
      
      element.style.opacity = opacity
      
      if (progress < duration) {
        requestAnimationFrame(animate)
      } else {
        element.style.display = 'none'
      }
    }
    
    requestAnimationFrame(animate)
  },

  // 滑动动画
  slideIn(element, direction = 'left', duration = 300) {
    const directions = {
      left: { transform: 'translateX(-100%)', finalTransform: 'translateX(0)' },
      right: { transform: 'translateX(100%)', finalTransform: 'translateX(0)' },
      up: { transform: 'translateY(-100%)', finalTransform: 'translateY(0)' },
      down: { transform: 'translateY(100%)', finalTransform: 'translateY(0)' }
    }

    const config = directions[direction] || directions.left
    element.style.transform = config.transform
    element.style.transition = `transform ${duration}ms ease-out`
    
    setTimeout(() => {
      element.style.transform = config.finalTransform
    }, 10)
  }
}

export default {
  TouchFeedback,
  TouchGesture,
  AnimationUtils
}