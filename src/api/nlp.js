/**
 * NLP API 接口封装
 */
import request from '@/axios/request.js'
import { DEBUG_CONFIG } from '@/assets/common/js/ai-emotion-radio/config.js'
import { generateMusicKeywords as analyzeEmotion } from '@/assets/common/js/ai-emotion-radio/emotion-analyzer.js'

const AK = process.env.VUE_APP_AK
const SK = process.env.VUE_APP_SK

// 调试模式开关，从配置文件中获取
const DEBUG_MODE = DEBUG_CONFIG.useDebugData

/**
 * 获取百度AI平台的access_token
 * @returns {Promise<string>} access_token字符串
 */
function getAccessToken () {
  const options = {
    'method': 'POST',
    'url': 'baiduApi/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
  }
  return request(options).then(res => res.data.access_token);
}

export default {
  /**
   * 关键词提取API
   * @param {string} text 待分析的文本内容
   * @returns {Promise<Object>} 包含关键词的响应对象
   */
  async getKeyWords (text) {
    if (DEBUG_MODE) {
      return Promise.resolve({ data: DEBUG_CONFIG.mockData.keywords });
    }

    const url = 'baiduApi/rpc/2.0/nlp/v1/txt_keywords_extraction?access_token=' + await getAccessToken()
    return request.post(url, {
      'Content-Type': 'application/x-www-form-urlencoded',
      'text': [text]
    });
  },

  /**
   * 依存句法分析API
   * @param {string} text 待分析的文本内容
   * @returns {Promise<Object>} 包含依存句法分析结果的响应对象
   */
  async getDepParser (text) {
    if (DEBUG_MODE) {
      return Promise.resolve({ data: DEBUG_CONFIG.mockData.depparser });
    }

    const url = 'baiduApi/rpc/2.0/nlp/v1/depparser?access_token=' + await getAccessToken()
    return request.post(url, {
      'text': text,
      'mode': 1  // 使用依存句法分析模式
    });
  },

  /**
   * 情感分析API
   * @param {string} text 待分析的文本内容
   * @returns {Promise<Object>} 包含情感分析结果的响应对象
   */
  async getSentimentAnalysis (text) {
    if (DEBUG_MODE) {
      return Promise.resolve({ data: DEBUG_CONFIG.mockData.sentiment });
    }

    const url = 'baiduApi/rpc/2.0/nlp/v1/sentiment_classify?access_token=' + await getAccessToken()
    return request.post(url, {
      'text': text
    });
  },

  /**
   * 生成音乐推荐关键词
   * 
   * 根据NLP分析结果生成推荐的音乐关键词组合
   * @param {Object} sentimentResult 情感分析结果
   * @param {Object} depparserResult 依存句法分析结果
   * @returns {Promise<Object>} 包含推荐关键词和元数据的对象
   */
  async generateMusicKeywords (sentimentResult, depparserResult) {
    try {
      // 使用情感分析模块生成音乐推荐关键词
      return await analyzeEmotion(sentimentResult, depparserResult);
    } catch (error) {
      console.error('生成音乐关键词失败:', error);
      // 返回默认推荐结果
      return {
        searchKeyword: '流行 治愈 轻音乐',
        musicElements: {
          mood: '治愈',
          genre: '轻音乐',
          singer: '',
          topic: '流行'
        }
      };
    }
  }
}