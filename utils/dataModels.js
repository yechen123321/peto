// 宠物数据模型
export const PetModel = {
  // 基础宠物信息
  createPet(data = {}) {
    return {
      id: data.id || Date.now().toString(),
      name: data.name || '',
      breed: data.breed || '',
      gender: data.gender || 'male',
      birthday: data.birthday || '',
      weight: data.weight || 0,
      height: data.height || 0,
      photo: data.photo || '',
      avatar: data.avatar || '',
      photoUrl: data.photoUrl || '',
      features: data.features || [], // 特征描述数组
      habits: data.habits || [], // 生活习惯数组
      createdAt: data.createdAt || Date.now(),
      updatedAt: data.updatedAt || Date.now()
    }
  },

  // 更新宠物信息
  updatePet(pet, updates) {
    return {
      ...pet,
      ...updates,
      updatedAt: Date.now()
    }
  }
}

// 健康数据模型
export const HealthModel = {
  // 体重记录
  createWeightRecord(data = {}) {
    return {
      id: data.id || Date.now().toString(),
      petId: data.petId || '',
      weight: data.weight || 0,
      date: data.date || Date.now(),
      notes: data.notes || '',
      createdAt: data.createdAt || Date.now()
    }
  },

  // 疫苗记录
  createVaccinationRecord(data = {}) {
    return {
      id: data.id || Date.now().toString(),
      petId: data.petId || '',
      name: data.name || '',
      type: data.type || '',
      date: data.date || Date.now(),
      nextDue: data.nextDue || Date.now() + 365 * 24 * 3600 * 1000, // 默认一年后
      notes: data.notes || '',
      createdAt: data.createdAt || Date.now()
    }
  },

  // 检查记录
  createCheckupRecord(data = {}) {
    return {
      id: data.id || Date.now().toString(),
      petId: data.petId || '',
      type: data.type || '常规检查',
      date: data.date || Date.now(),
      notes: data.notes || '',
      results: data.results || '',
      vetName: data.vetName || '',
      createdAt: data.createdAt || Date.now()
    }
  }
}

// 事件数据模型
export const EventModel = {
  // 创建事件
  createEvent(data = {}) {
    return {
      id: data.id || Date.now().toString(),
      title: data.title || '',
      description: data.description || '',
      petId: data.petId || null,
      petName: data.petName || '全部宠物',
      date: data.date || '', // YYYY-MM-DD 格式
      time: data.time || '09:00',
      hasReminder: data.hasReminder || false,
      reminderTime: data.reminderTime || '09:00',
      eventType: data.eventType || 'custom', // custom, feeding, walk, medical, etc.
      completed: data.completed || false,
      completedAt: data.completedAt || null,
      createdAt: data.createdAt || Date.now()
    }
  },

  // 创建提醒事件
  createReminder(data = {}) {
    return {
      ...this.createEvent(data),
      hasReminder: true,
      reminderTime: data.reminderTime || data.time || '09:00',
      eventType: 'reminder'
    }
  },

  // 完成事件
  completeEvent(event) {
    return {
      ...event,
      completed: true,
      completedAt: Date.now()
    }
  }
}

// 提醒数据模型（与首页提醒功能兼容）
export const ReminderModel = {
  createReminder(data = {}) {
    return {
      id: data.id || Date.now().toString(),
      title: data.title || '',
      cycleDays: data.cycleDays || 30,
      note: data.note || '',
      petId: data.petId || '',
      lastDoneAt: data.lastDoneAt || null,
      nextDueAt: data.nextDueAt || Date.now() + (data.cycleDays || 30) * 24 * 3600 * 1000,
      preset: data.preset || false,
      createdAt: data.createdAt || Date.now()
    }
  },

  // 标记完成并更新下次到期时间
  markDone(reminder) {
    const now = Date.now()
    return {
      ...reminder,
      lastDoneAt: now,
      nextDueAt: now + reminder.cycleDays * 24 * 3600 * 1000
    }
  }
}

// 数据管理工具类
export const DataManager = {
  // 获取用户数据存储键名
  getStorageKey(userId, type) {
    return `${type}_${userId}`
  },

  // 保存数据
  saveData(userId, type, data) {
    const key = this.getStorageKey(userId, type)
    try {
      uni.setStorageSync(key, data)
      return true
    } catch (error) {
      console.error(`保存${type}数据失败:`, error)
      return false
    }
  },

  // 加载数据
  loadData(userId, type) {
    const key = this.getStorageKey(userId, type)
    try {
      return uni.getStorageSync(key) || []
    } catch (error) {
      console.error(`加载${type}数据失败:`, error)
      return []
    }
  },

  // 添加数据项
  addItem(userId, type, item) {
    const data = this.loadData(userId, type)
    data.push(item)
    return this.saveData(userId, type, data)
  },

  // 更新数据项
  updateItem(userId, type, itemId, updates) {
    const data = this.loadData(userId, type)
    const index = data.findIndex(item => item.id === itemId)
    if (index !== -1) {
      data[index] = { ...data[index], ...updates }
      return this.saveData(userId, type, data)
    }
    return false
  },

  // 删除数据项
  deleteItem(userId, type, itemId) {
    const data = this.loadData(userId, type)
    const filteredData = data.filter(item => item.id !== itemId)
    return this.saveData(userId, type, filteredData)
  },

  // 根据ID查找数据项
  findItem(userId, type, itemId) {
    const data = this.loadData(userId, type)
    return data.find(item => item.id === itemId)
  },

  // 根据条件筛选数据
  filterData(userId, type, filterFn) {
    const data = this.loadData(userId, type)
    return data.filter(filterFn)
  }
}

// 数据验证工具
export const DataValidator = {
  // 验证宠物数据
  validatePet(pet) {
    const errors = []
    if (!pet.name || pet.name.trim() === '') {
      errors.push('宠物名称不能为空')
    }
    if (pet.weight && (isNaN(pet.weight) || pet.weight < 0)) {
      errors.push('体重必须是有效数字')
    }
    if (pet.height && (isNaN(pet.height) || pet.height < 0)) {
      errors.push('身高必须是有效数字')
    }
    return errors
  },

  // 验证事件数据
  validateEvent(event) {
    const errors = []
    if (!event.title || event.title.trim() === '') {
      errors.push('事件标题不能为空')
    }
    if (!event.date || !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
      errors.push('日期格式不正确')
    }
    return errors
  },

  // 验证健康记录数据
  validateHealthRecord(record) {
    const errors = []
    if (!record.petId) {
      errors.push('必须关联宠物')
    }
    return errors
  }
}

export default {
  PetModel,
  HealthModel,
  EventModel,
  ReminderModel,
  DataManager,
  DataValidator
}