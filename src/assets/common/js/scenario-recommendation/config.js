/**
 * 场景推荐系统配置文件
 * 
 * 本文件管理场景推荐系统的各项设置，包括：
 * - 默认设置：用于API调用失败时的后备值
 * - 评分权重：控制不同因素对推荐结果的影响程度
 * - 场景映射：定义天气、时间、区域、季节相关的属性
 * - 范围映射：定义数值到类型的映射关系
 */

const config = {
  /**
   * 默认设置
   * 
   * 当无法获取真实数据时使用的后备值
   */
  DEFAULT_SETTINGS: {
    // 默认天气设置
    WEATHER: {
      type: '晴天' // 默认天气类型
    },

    // 默认区域类型
    AREA_TYPE: 'urban', // 默认为城市环境

    // 超时设置
    TIMEOUT: 10000 // API调用的超时时间(毫秒)
  },

  /**
   * 评分权重
   * 
   * 控制各种因素对最终得分的贡献百分比
   * 所有主要权重(playCount、timeMatch.weight等)之和应为1
   */
  SCORE_WEIGHTS: {
    // 播放量权重 - 占总分30%
    playCount: 0.3,

    // 时间匹配权重 - 占总分25%
    timeMatch: {
      weight: 0.25, // 整体权重
      exactMatch: 50, // 精确匹配分数
      moodMatch: 30, // 情绪匹配分数
      relatedMoodMatch: 20 // 相关情绪匹配分数
    },

    // 天气匹配权重 - 占总分30%
    weatherMatch: {
      weight: 0.3, // 整体权重
      exactMatch: 40, // 精确匹配分数
      moodMatch: 30, // 情绪匹配分数
      relatedMoodMatch: 15, // 相关情绪匹配分数
      musicStyleMatch: 15 // 音乐风格匹配分数
    },

    // 区域匹配权重 - 占总分15%
    areaMatch: {
      weight: 0.15, // 整体权重
      exactMatch: 40, // 精确匹配分数
      keywordMatch: 35, // 关键词匹配分数
      musicStyleMatch: 25 // 音乐风格匹配分数
    }

    // 注意：季节匹配作为额外加分，不参与主权重分配
  },

  /**
   * 场景配置
   * 
   * 定义各种场景元素及其相关属性
   * 包括情绪关键词、音乐风格和搜索优化
   */
  SCENE_CONFIG: {
    /**
     * 天气配置
     * 
     * 定义不同天气状况对应的情绪、风格和相关关键词
     */
    weather: {
      // 晴天配置
      '晴天': {
        mood: '阳光', // 核心情绪关键词
        musicStyles: ['欢快', '励志', '活力'], // 相关音乐风格
        relatedMoods: ['温暖', '愉悦', '积极'] // 相关情绪
      },

      // 多云配置
      '多云': {
        mood: '温柔',
        musicStyles: ['轻音乐', '民谣', '流行'],
        relatedMoods: ['柔和', '舒适', '平静']
      },

      // 雨天配置
      '雨天': {
        mood: '伤感',
        musicStyles: ['钢琴', '慢歌', '治愈'],
        relatedMoods: ['安静', '思念', '感伤']
      },

      // 雪天配置
      '雪天': {
        mood: '浪漫',
        musicStyles: ['轻音乐', '古典', '爵士'],
        relatedMoods: ['温馨', '纯净', '梦幻']
      },

      // 雾天配置
      '雾天': {
        mood: '迷幻',
        musicStyles: ['电子', '氛围', '后摇'],
        relatedMoods: ['神秘', '朦胧', '空灵']
      }
    },

    /**
     * 时间配置
     * 
     * 定义不同时段对应的情绪、相关情绪关键词
     */
    time: {
      // 清晨配置(5-7点)
      '清晨': {
        mood: '治愈',
        relatedMoods: ['轻松', '舒缓', '宁静']
      },

      // 早晨配置(8-11点)
      '早晨': {
        mood: '活力',
        relatedMoods: ['阳光', '积极', '充满能量']
      },

      // 中午配置(12-13点)
      '中午': {
        mood: '轻快',
        relatedMoods: ['明亮', '悠闲', '舒适']
      },

      // 下午配置(14-17点)
      '下午': {
        mood: '慵懒',
        relatedMoods: ['平和', '温暖', '柔和']
      },

      // 傍晚配置(18-19点)
      '傍晚': {
        mood: '温柔',
        relatedMoods: ['浪漫', '柔和', '感性']
      },

      // 夜晚配置(20-23点)
      '夜晚': {
        mood: '沉静',
        relatedMoods: ['深沉', '迷人', '放松']
      },

      // 深夜配置(0-4点)
      '深夜': {
        mood: '睡眠',
        relatedMoods: ['安眠', '舒缓', '催眠']
      }
    },

    /**
     * 区域配置
     * 
     * 定义不同区域类型对应的搜索关键词和音乐风格
     */
    area: {
      // 城市区域
      'urban': {
        searchKeyword: '都市', // 主搜索关键词
        musicStyles: ['流行', '电子', '说唱', '爵士'], // 相关音乐风格
        relatedMoods: ['现代', '繁华', '快节奏', '潮流'] // 相关情绪
      },

      // 乡村区域
      'rural': {
        searchKeyword: '乡村',  // 修改为更直接的关键词
        musicStyles: ['民谣', '轻音乐', '古风', '纯音乐', '乡村'], // 优化音乐风格顺序
        relatedMoods: ['宁静', '田园', '悠闲', '自然', '清新'] // 添加相关情绪
      }
    },

    /**
     * 季节配置
     * 
     * 定义不同季节对应的情绪、相关情绪和音乐风格
     */
    season: {
      // 春季配置
      '春': {
        mood: '清新',
        relatedMoods: ['活力', '温暖', '明亮'],
        musicStyles: ['流行', '轻音乐', '民谣']
      },

      // 夏季配置
      '夏': {
        mood: '激情',
        relatedMoods: ['活力', '热烈', '青春'],
        musicStyles: ['电子', '摇滚', '说唱']
      },

      // 秋季配置
      '秋': {
        mood: '感伤',
        relatedMoods: ['思念', '温柔', '怀旧'],
        musicStyles: ['民谣', '爵士', '流行']
      },

      // 冬季配置
      '冬': {
        mood: '温暖',
        relatedMoods: ['浪漫', '安静', '舒适'],
        musicStyles: ['轻音乐', '民谣', '古典']
      }
    }
  },

  /**
   * 天气代码范围映射
   * 
   * 将天气API返回的数值代码映射到易于理解的天气类型
   * 参考：https://open-meteo.com/en/docs/weather-codes
   */
  WEATHER_CODE_RANGES: [
    { min: 0, max: 3, type: '晴天' }, // 晴天、少云
    { min: 4, max: 65, type: '多云' }, // 多云、雾
    { min: 66, max: 79, type: '雨天' }, // 冻雨
    { min: 80, max: 82, type: '雨天' }, // 小雨
    { min: 83, max: 94, type: '雨天' }, // 中到大雨
    { min: 95, max: 99, type: '雷雨' }, // 雷暴
    { min: 71, max: 77, type: '雪天' } // 雪
  ],

  /**
   * 时间范围映射
   * 
   * 将一天24小时映射到不同的时间段
   */
  TIME_RANGES: [
    { min: 5, max: 7, type: '清晨' },
    { min: 8, max: 11, type: '早晨' },
    { min: 12, max: 13, type: '中午' },
    { min: 14, max: 17, type: '下午' },
    { min: 18, max: 19, type: '傍晚' },
    { min: 20, max: 23, type: '夜晚' },
    { min: 0, max: 4, type: '深夜' }
  ],

  /**
   * 月份到季节的映射
   * 
   * 将月份(0-11)映射到对应的季节
   * 注意：月份从0开始，0表示1月
   */
  MONTH_TO_SEASON: [
    { min: 2, max: 4, type: '春' }, // 3-5月为春季
    { min: 5, max: 7, type: '夏' }, // 6-8月为夏季
    { min: 8, max: 10, type: '秋' }, // 9-11月为秋季
    { min: 11, max: 11, type: '冬' }, // 12月为冬季
    { min: 0, max: 1, type: '冬' }  // 1-2月为冬季
  ]
};

export default config; 