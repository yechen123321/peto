// 测试数据生成工具
import { PetModel, HealthModel, EventModel, ReminderModel, DataManager } from './dataModels.js'

export const TestDataGenerator = {
  // 生成测试宠物数据
  generateTestPets(userId) {
    const testPets = [
      {
        name: '小白',
        breed: '金毛寻回犬',
        gender: 'male',
        birthday: new Date(2020, 5, 15).getTime(),
        weight: 28.5,
        height: 55,
        features: ['毛色纯白', '性格温顺', '喜欢游泳', '对儿童友好'],
        habits: [
          { name: '晨练', description: '每天早上7点散步30分钟' },
          { name: '晚餐', description: '晚上6点进食，喜欢狗粮配鸡肉' }
        ]
      },
      {
        name: '花花',
        breed: '英国短毛猫',
        gender: 'female',
        birthday: new Date(2021, 2, 8).getTime(),
        weight: 4.2,
        height: 25,
        features: ['毛色斑斓', '眼睛蓝色', '性格独立', '喜欢高处'],
        habits: [
          { name: '午睡', description: '下午2-4点在阳台晒太阳' },
          { name: '玩耍', description: '晚上8点玩逗猫棒15分钟' }
        ]
      },
      {
        name: '豆豆',
        breed: '泰迪犬',
        gender: 'male',
        birthday: new Date(2022, 8, 20).getTime(),
        weight: 8.5,
        height: 30,
        features: ['毛色棕红', '卷毛', '活泼好动', '聪明易训练'],
        habits: [
          { name: '训练', description: '每天下午3点进行基础训练' },
          { name: '美容', description: '每周一次毛发护理' }
        ]
      }
    ]

    return testPets.map(petData => PetModel.createPet(petData))
  },

  // 生成测试健康数据
  generateTestHealthData(userId, pets) {
    const healthData = {
      weightRecords: [],
      vaccinations: [],
      checkups: []
    }

    pets.forEach(pet => {
      // 生成体重记录
      for (let i = 0; i < 5; i++) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        healthData.weightRecords.push(HealthModel.createWeightRecord({
          petId: pet.id,
          weight: pet.weight + (Math.random() - 0.5) * 2,
          date: date.getTime(),
          notes: `第${5-i}次称重记录`
        }))
      }

      // 生成疫苗记录
      const vaccines = ['狂犬病疫苗', '三联疫苗', '五联疫苗', '犬瘟疫苗']
      vaccines.forEach((vaccine, index) => {
        const date = new Date()
        date.setFullYear(date.getFullYear() - index)
        healthData.vaccinations.push(HealthModel.createVaccinationRecord({
          petId: pet.id,
          name: vaccine,
          type: index === 0 ? '狂犬疫苗' : '联合疫苗',
          date: date.getTime(),
          nextDue: date.getTime() + (index === 0 ? 365 : 180) * 24 * 3600 * 1000,
          notes: `${pet.name}接种${vaccine}`
        }))
      })

      // 生成检查记录
      for (let i = 0; i < 3; i++) {
        const date = new Date()
        date.setMonth(date.getMonth() - i * 2)
        healthData.checkups.push(HealthModel.createCheckupRecord({
          petId: pet.id,
          type: i === 0 ? '常规体检' : '专项检查',
          date: date.getTime(),
          notes: `${pet.name}健康状况良好，各项指标正常`,
          results: '体温正常，心率稳定，呼吸正常',
          vetName: '李医生'
        }))
      }
    })

    return healthData
  },

  // 生成测试事件数据
  generateTestEvents(userId, pets) {
    const events = []
    const eventTypes = ['喂食', '散步', '洗澡', '美容', '训练', '医疗', '玩耍', '休息']
    
    for (let i = 0; i < 20; i++) {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 30))
      
      const petIndex = Math.floor(Math.random() * pets.length)
      const pet = pets[petIndex]
      
      events.push(EventModel.createEvent({
        title: `${pet.name}${eventTypes[Math.floor(Math.random() * eventTypes.length)]}`,
        description: `这是${pet.name}的日常护理记录，状态良好`,
        petId: pet.id,
        petName: pet.name,
        date: this.formatDate(date),
        time: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        hasReminder: Math.random() > 0.5,
        reminderTime: '09:00',
        eventType: 'custom'
      }))
    }

    return events
  },

  // 生成测试提醒数据
  generateTestReminders(userId, pets) {
    const reminders = []
    const reminderTypes = [
      { title: '体内驱虫', cycleDays: 30 },
      { title: '体外驱虫', cycleDays: 30 },
      { title: '疫苗接种', cycleDays: 365 },
      { title: '洗澡护理', cycleDays: 14 },
      { title: '指甲修剪', cycleDays: 21 }
    ]

    pets.forEach(pet => {
      reminderTypes.forEach(type => {
        if (Math.random() > 0.3) { // 70%概率生成提醒
          const nextDue = new Date()
          nextDue.setDate(nextDue.getDate() + Math.floor(Math.random() * type.cycleDays))
          
          reminders.push(ReminderModel.createReminder({
            title: `${pet.name}${type.title}`,
            cycleDays: type.cycleDays,
            note: `${pet.name}的${type.title}提醒`,
            petId: pet.id,
            nextDueAt: nextDue.getTime()
          }))
        }
      })
    })

    return reminders
  },

  // 格式化日期
  formatDate(date) {
    const y = date.getFullYear()
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    const d = date.getDate().toString().padStart(2, '0')
    return `${y}-${m}-${d}`
  },

  // 安装所有测试数据
  installTestData(userId) {
    console.log('开始安装测试数据...')
    
    // 生成宠物数据
    const pets = this.generateTestPets(userId)
    DataManager.saveData(userId, 'pets', pets)
    console.log(`已生成 ${pets.length} 个宠物数据`)
    
    // 生成健康数据
    const healthData = this.generateTestHealthData(userId, pets)
    DataManager.saveData(userId, 'weightRecords', healthData.weightRecords)
    DataManager.saveData(userId, 'vaccinations', healthData.vaccinations)
    DataManager.saveData(userId, 'checkups', healthData.checkups)
    console.log('已生成健康数据')
    
    // 生成事件数据
    const events = this.generateTestEvents(userId, pets)
    DataManager.saveData(userId, 'events', events)
    console.log(`已生成 ${events.length} 个事件数据`)
    
    // 生成提醒数据
    const reminders = this.generateTestReminders(userId, pets)
    DataManager.saveData(userId, 'reminders', reminders)
    console.log(`已生成 ${reminders.length} 个提醒数据`)
    
    // 生成历史记录
    const history = []
    events.slice(0, 10).forEach(event => {
      history.push({
        id: Date.now() + Math.random(),
        reminderId: null,
        title: event.title,
        petId: event.petId,
        petName: event.petName,
        completedAt: new Date(event.date + ' ' + event.time).getTime()
      })
    })
    DataManager.saveData(userId, 'history', history)
    console.log(`已生成 ${history.length} 条历史记录`)
    
    console.log('测试数据安装完成！')
    return {
      pets,
      healthData,
      events,
      reminders,
      history
    }
  },

  // 清除所有测试数据
  clearTestData(userId) {
    const dataTypes = ['pets', 'weightRecords', 'vaccinations', 'checkups', 'events', 'reminders', 'history']
    dataTypes.forEach(type => {
      DataManager.saveData(userId, type, [])
    })
    console.log('测试数据已清除')
  }
}

export default TestDataGenerator