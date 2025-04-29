/**
 * AI 情感分析配置文件
 */
// 情感音乐推荐配置
export const EMOTION_MUSIC_CONFIG = {
  // 不同情感类型对应的音乐推荐
  recommendedMusic: {
    NEGATIVE: {
      styles: ['治愈系', '轻音乐', '钢琴曲', '古典音乐', '抒情歌曲']
    },
    NEUTRAL: {
      styles: ['轻音乐', '民谣', '古典', '爵士', '轻电子']
    },
    POSITIVE: {
      styles: ['流行', '电子', '舞曲', '说唱', '欧美流行']
    }
  },

  // 音乐风格调节
  moodAdjustments: {
    happier: {
      key: '阳光',
      styles: ['流行歌曲', '电音', '舞曲', '欧美流行', 'K-POP']
    },
    calmer: {
      key: '轻松',
      styles: ['轻音乐', '古典', '钢琴曲', '纯音乐', '自然声音']
    },
    sadder: {
      key: '温柔',
      styles: ['民谣', '抒情歌曲', '华语流行', '伤感音乐', '钢琴曲']
    },
    energetic: {
      key: '动感',
      styles: ['电音', '摇滚', '说唱', 'EDM', '健身歌单']
    }
  }
};

// 情感类型配置
export const SENTIMENT_TYPES = {
  NEGATIVE: {
    value: 0,
    label: '消极情绪',
    color: '#778ca3',
    textColor: '#ffffff',
    description: '为您精心挑选了治愈系音乐，让心情慢慢好起来～'
  },
  NEUTRAL: {
    value: 1,
    label: '平静情绪',
    color: '#63cdda',
    textColor: '#ffffff',
    description: '为您带来轻松惬意的曲调，让美好继续延续～'
  },
  POSITIVE: {
    value: 2,
    label: '积极情绪',
    color: '#FD4979',
    textColor: '#ffffff',
    description: '为您送上动感十足的旋律，一起享受音乐的美妙～'
  }
};

// 情感调节按钮配置
export const MOOD_ADJUSTERS = [
  {
    key: 'happier',
    label: '😊 阳光开朗',
    description: '调整为更欢快的音乐',
    styles: ['流行歌曲', '电音', '舞曲', '欧美流行', 'K-POP']
  },
  {
    key: 'calmer',
    label: '😌 轻松舒缓',
    description: '调整为更舒缓的音乐',
    styles: ['轻音乐', '古典', '钢琴曲', '纯音乐', '自然声音']
  },
  {
    key: 'sadder',
    label: '😢 温柔抒情',
    description: '调整为更抒情的音乐',
    styles: ['民谣', '抒情歌曲', '华语流行', '伤感音乐', '钢琴曲']
  },
  {
    key: 'energetic',
    label: '💪 热血沸腾',
    description: '调整为更有动感的音乐',
    styles: ['电音', '摇滚', '说唱', 'EDM', '健身歌单']
  }
];

// 调试模式配置
export const DEBUG_CONFIG = {
  // 调试模式开关，设为false以禁用模拟数据并使用实际API
  useDebugData: true,
  // 模拟数据，与后台API格式保持一致
  mockData: {
    sentiment: {
      "text": "今天心情不好，我想听钢琴曲",
      "items": [
        {
          "confidence": 0.38,
          "negative_prob": 0.00857611,
          "positive_prob": 0.991424,
          "sentiment": 2
        }
      ],
      "log_id": "1911463307352468561"
    },
    // 依存句法分析模拟数据
    depparser: {
      "items": [
        {
          "id": 1,
          "postag": "TIME",
          "head": 2,
          "word": "今天",
          "deprel": "ADV"
        },
        {
          "id": 2,
          "postag": "a",
          "head": 5,
          "word": "心情不好",
          "deprel": "IC"
        },
        {
          "id": 3,
          "postag": "w",
          "head": 2,
          "word": "，",
          "deprel": "MT"
        },
        {
          "id": 4,
          "postag": "r",
          "head": 5,
          "word": "我",
          "deprel": "SBV"
        },
        {
          "id": 5,
          "postag": "v",
          "head": 0,
          "word": "想",
          "deprel": "HED"
        },
        {
          "id": 6,
          "postag": "v",
          "head": 5,
          "word": "听",
          "deprel": "VOB"
        },
        {
          "id": 7,
          "postag": "nr",
          "head": 6,
          "word": "钢琴曲",
          "deprel": "VOB"
        }
      ],
      "text": "今天心情不好，我想听钢琴曲",
      "log_id": "1911463175593116819"
    }
  }
}; 