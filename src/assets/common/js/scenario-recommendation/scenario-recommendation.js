/**
 * 场景推荐系统主文件
 * 
 * 该文件实现了基于位置、时间、天气、区域特征的智能音乐推荐
 * 通过获取用户的当前环境，生成最适合的音乐歌单推荐
 */
import request from '@/axios/request.js'
import { ERR_OK } from '@/api/config.js'
import searchApi from '@/api/search.js'
import { SEARCH_TYPE } from '@/assets/common/js/config.js'
import { scorePlaylists } from './scenario-recommendation-optimized.js'
import config from './config.js'
import baiduMapApi from '@/api/baiduMap.js'

// 从配置中导入所需常量
const {
  DEFAULT_SETTINGS,
  SCENE_CONFIG,
  WEATHER_CODE_RANGES,
  TIME_RANGES,
  MONTH_TO_SEASON
} = config;

// ================ 通用辅助函数 ================
/**
 * 通用的范围查找函数 - 用于各类数值映射
 */
function findInRanges (value, ranges, defaultValue) {
  const range = ranges.find(range => value >= range.min && value <= range.max);
  return range ? range.type : defaultValue;
}

/**
 * 随机选择数组中的一个元素
 */
function getRandomFromArray (arr) {
  if (!arr || !arr.length) return '';
  return arr[Math.floor(Math.random() * arr.length)];
}

// ================ 环境信息获取模块 ================
/**
 * 环境信息获取管理类
 * 负责获取位置、天气、时间等环境信息
 */
const EnvironmentManager = {
  /**
   * 获取用户当前位置
   */
  async getCurrentPosition () {
    try {
      return await baiduMapApi.getLocation();
    } catch (error) {
      console.error('位置获取失败:', error);
      throw error;
    }
  },

  /**
   * 获取当前天气信息
   */
  async getWeather (latitude, longitude) {
    try {
      const response = await request({
        url: '/weather/v1/forecast',
        params: {
          latitude,
          longitude,
          current_weather: true,
          temperature_unit: 'celsius',
          noCookie: true
        }
      });

      if (response.data && response.data.current_weather) {
        const weatherCode = response.data.current_weather.weathercode;
        const weatherType = findInRanges(weatherCode, WEATHER_CODE_RANGES, DEFAULT_SETTINGS.WEATHER.type);
        return { type: weatherType };
      }

      console.warn('无法获取有效的天气数据，使用默认值');
      return DEFAULT_SETTINGS.WEATHER;
    } catch (err) {
      console.error('天气API调用失败:', err);
      return DEFAULT_SETTINGS.WEATHER;
    }
  },

  /**
   * 获取当前时段描述词
   */
  getTimeOfDay () {
    const now = new Date();
    const hour = now.getHours();
    return findInRanges(hour, TIME_RANGES, '早晨');
  },

  /**
   * 获取当前季节描述词
   */
  getSeason () {
    const now = new Date();
    const month = now.getMonth();
    return findInRanges(month, MONTH_TO_SEASON, '春');
  },

  /**
   * 判断用户所在区域类型（城市/乡村）
   */
  async determineAreaType (latitude, longitude, isDefaultLocation) {
    console.log(`开始判断区域类型，坐标: 纬度=${latitude}, 经度=${longitude}, 是否默认位置=${isDefaultLocation}`);

    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      console.warn('无效的坐标参数，使用默认区域类型');
      return DEFAULT_SETTINGS.AREA_TYPE;
    }

    try {
      const areaType = await baiduMapApi.getAreaType(latitude, longitude, isDefaultLocation);
      console.log(`区域类型判断结果: ${areaType}`);
      return areaType;
    } catch (error) {
      console.warn('区域类型判断失败:', error);
      return DEFAULT_SETTINGS.AREA_TYPE;
    }
  }
};

// ================ 关键词生成模块 ================
/**
 * 搜索关键词生成器
 * 负责根据环境信息构建搜索关键词
 */
const KeywordGenerator = {
  /**
   * 生成场景推荐搜索关键词
   */
  async generateSmartRecommendation (timeOfDay, weatherInfo, areaType) {
    // 提取场景信息
    const weatherType = weatherInfo.type;
    const season = EnvironmentManager.getSeason();

    // 获取各维度的情绪关键词和音乐风格
    const sceneData = this._extractSceneData(weatherType, timeOfDay, season, areaType);

    // 动态生成搜索关键词组合
    const { searchKeywords, usedKeywords } = this._generateKeywords(sceneData);

    // 转换为搜索字符串
    const uniqueKeywords = [...new Set(searchKeywords)].filter(Boolean);
    const searchKeyword = uniqueKeywords.join(' ').trim();

    // 搜索词不能为空，确保有保底方案
    if (!searchKeyword.trim()) {
      console.log('生成搜索关键词失败，使用保底搜索词');
      return this._createFallbackRecommendation(sceneData);
    }

    console.log(`生成搜索关键词: "${searchKeyword}" (基于${weatherType}天气和${timeOfDay}时段)`);

    // 返回完整推荐数据
    return {
      searchKeyword,
      metadata: this._buildMetadata(sceneData, usedKeywords)
    };
  },

  /**
   * 提取场景数据
   */
  _extractSceneData (weatherType, timeOfDay, season, areaType) {
    // 获取各维度配置
    const weatherConfig = SCENE_CONFIG.weather[weatherType] || SCENE_CONFIG.weather[DEFAULT_SETTINGS.WEATHER.type];
    const timeConfig = SCENE_CONFIG.time[timeOfDay] || { mood: timeOfDay };
    const seasonConfig = SCENE_CONFIG.season[season] || { mood: season };
    const areaConfig = SCENE_CONFIG.area[areaType] || {};

    // 提取关键情绪和风格
    return {
      // 基础信息
      weatherType,
      timeOfDay,
      season,
      areaType,

      // 情绪关键词
      weatherMood: weatherConfig.mood,
      timeOfDayMood: timeConfig.mood,
      seasonMood: seasonConfig.mood,
      areaMood: areaConfig.searchKeyword || (areaType === 'urban' ? '都市' : '自然'),

      // 相关情绪
      weatherRelatedMoods: weatherConfig.relatedMoods || [],
      timeRelatedMoods: timeConfig.relatedMoods || [],
      seasonRelatedMoods: seasonConfig.relatedMoods || [],
      areaRelatedMoods: areaConfig.relatedMoods || [],

      // 音乐风格
      weatherMusicStyles: weatherConfig.musicStyles || [],
      areaMusicStyles: areaConfig.musicStyles || [],
      seasonMusicStyles: seasonConfig.musicStyles || []
    };
  },

  /**
   * 生成搜索关键词组合
   */
  _generateKeywords (sceneData) {
    const {
      weatherType, timeOfDay, season, areaType,
      weatherMood, timeOfDayMood, seasonMood, areaMood,
      weatherRelatedMoods, timeRelatedMoods,
      weatherMusicStyles, areaMusicStyles, seasonMusicStyles
    } = sceneData;

    // 从相关情绪中随机选择
    const randomTimeRelatedMood = getRandomFromArray(timeRelatedMoods);
    const randomWeatherRelatedMood = getRandomFromArray(weatherRelatedMoods);

    // 准备各维度的候选关键词
    const timeDimension = [timeOfDayMood, timeOfDay, randomTimeRelatedMood].filter(Boolean);
    const areaDimension = [areaMood].filter(Boolean);
    const weatherDimension = [weatherMood, weatherType, randomWeatherRelatedMood].filter(Boolean);
    const seasonDimension = [seasonMood, season].filter(Boolean);

    // 可供选择的音乐风格
    const musicStyles = [
      ...weatherMusicStyles,
      ...areaMusicStyles,
      ...seasonMusicStyles
    ].filter(Boolean);

    // 获取搭配组合
    let searchKeywords = [];
    const combo = this._compatibilityCheck(weatherType, timeOfDay, season, seasonMood, timeOfDayMood, areaMood, weatherMood, musicStyles);
    searchKeywords = combo.priority.filter(Boolean);

    // 如果主要搭配不足三个关键词，尝试备用搭配
    if (searchKeywords.length < 3 && combo.fallback) {
      searchKeywords = combo.fallback.filter(Boolean);
    }

    // 如果仍不足三个关键词，补充其他维度
    if (searchKeywords.length < 3) {
      searchKeywords = this._fillMissingKeywords(searchKeywords, musicStyles, seasonMood);
    }

    // 标记关键词的维度信息（供评分使用）
    const usedKeywords = {
      time: searchKeywords.find(keyword => timeDimension.includes(keyword)),
      area: searchKeywords.find(keyword => areaDimension.includes(keyword)),
      weather: searchKeywords.find(keyword => weatherDimension.includes(keyword)),
      season: searchKeywords.find(keyword => seasonDimension.includes(keyword))
    };

    return { searchKeywords, usedKeywords };
  },

  /**
   * 检查搭配组合是否合理
   */
  _compatibilityCheck (weatherType, timeOfDay, season, seasonMood, timeOfDayMood, areaMood, weatherMood, musicStyles) {
    // 特殊天气优先考虑天气+情绪组合
    if (weatherType === '雨天' || weatherType === '雪天') {
      return {
        priority: [weatherType, weatherMood, areaMood],
        fallback: [weatherType, areaMood, timeOfDayMood]
      };
    }

    // 清晨/夜晚时段优先考虑时间+区域组合
    if (timeOfDay === '清晨' || timeOfDay === '夜晚' || timeOfDay === '深夜') {
      return {
        priority: [timeOfDay, areaMood, weatherMood],
        fallback: [timeOfDay, weatherMood, getRandomFromArray(musicStyles)]
      };
    }

    // 季节明显时（春/夏/秋/冬），使用季节相关搭配
    if (seasonMood && (season === '春' || season === '夏' || season === '秋' || season === '冬')) {
      return {
        priority: [seasonMood, areaMood, timeOfDayMood || timeOfDay],
        fallback: [seasonMood, timeOfDayMood || timeOfDay, weatherMood || weatherType]
      };
    }

    // 默认使用三维度标准组合
    return {
      priority: [timeOfDayMood || timeOfDay, areaMood, weatherMood || weatherType],
      fallback: null
    };
  },

  /**
   * 填充缺失的关键词
   */
  _fillMissingKeywords (keywords, musicStyles, seasonMood) {
    let result = [...keywords];

    // 补充音乐风格
    if (result.length < 3) {
      const styleKeyword = getRandomFromArray(musicStyles);
      if (styleKeyword && !result.includes(styleKeyword)) {
        result.push(styleKeyword);
      }
    }

    // 补充季节情绪
    if (result.length < 3 && seasonMood && !result.includes(seasonMood)) {
      result.push(seasonMood);
    }

    return result;
  },

  /**
   * 构建完整元数据
   */
  _buildMetadata (sceneData, usedKeywords) {
    const {
      weatherType, timeOfDay, season, areaType,
      weatherMood, timeOfDayMood, seasonMood, areaMood,
      weatherRelatedMoods, timeRelatedMoods, seasonRelatedMoods, areaRelatedMoods,
      weatherMusicStyles, areaMusicStyles, seasonMusicStyles
    } = sceneData;

    return {
      // 时间相关
      time: timeOfDay,
      timeOfDayMood,
      timeRelatedMoods,

      // 天气相关
      weather: weatherType,
      weatherMood,
      weatherRelatedMoods,
      weatherMusicStyles,

      // 区域相关
      area: areaType,
      areaTypeInChinese: areaType === 'urban' ? '城市' : '乡村',
      areaMood,
      areaMusicStyles,
      areaRelatedMoods,

      // 季节相关
      season,
      seasonMood,
      seasonRelatedMoods,
      seasonMusicStyles,

      // 搜索词相关
      usedKeywords
    };
  },

  /**
   * 创建备用推荐
   */
  _createFallbackRecommendation (sceneData) {
    const { weatherMood, timeOfDay, areaMood } = sceneData;
    const fallbackKeyword = `${weatherMood} ${timeOfDay} ${areaMood}`.trim();
    console.log(`使用保底搜索词: "${fallbackKeyword}"`);

    return {
      searchKeyword: fallbackKeyword,
      metadata: this._buildMetadata(sceneData, {
        time: timeOfDay,
        area: areaMood,
        weather: weatherMood
      })
    };
  }
};

// ================ 歌单搜索模块 ================
/**
 * 歌单搜索器
 * 负责根据关键词搜索和筛选歌单
 */
const PlaylistSearcher = {
  /**
   * 搜索匹配歌单
   */
  async searchPlaylists (searchKeyword, maxResults = 100) {
    console.log(`使用搜索关键词: "${searchKeyword}" 查找歌单`);

    try {
      const { data: res } = await searchApi.getSearchResult(
        searchKeyword,
        SEARCH_TYPE.songSheet,
        0,
        maxResults
      );

      console.log(`搜索结果: 状态=${res.code}, 返回歌单数=${res.result?.playlists?.length || 0}`);

      if (res.code !== ERR_OK || !res.result?.playlists || res.result.playlists.length === 0) {
        return null;
      }

      return res.result.playlists;
    } catch (error) {
      console.error('搜索歌单失败:', error);
      return null;
    }
  },

  /**
   * 使用备用关键词搜索
   */
  async searchWithFallbackKeyword (metadata) {
    // 备用搜索词策略 - 使用单一维度的核心情绪关键词
    const fallbackKeywords = [
      metadata.timeOfDayMood, // 时间情绪
      metadata.weatherMood,   // 天气情绪
      metadata.areaMood,      // 区域关键词
      '音乐'                 // 最后的保底词
    ].filter(Boolean);

    // 使用第一个非空关键词作为备用
    const fallbackKeyword = fallbackKeywords[0];
    console.log(`使用备用搜索关键词: "${fallbackKeyword}"`);

    return await this.searchPlaylists(fallbackKeyword);
  }
};

// ================ 主推荐模块 ================
export default {
  /**
   * 场景化推荐主函数
   */
  async recommend () {
    try {
      const MIN_ACCEPTABLE_SCORE = 70; // 最低可接受分数
      let locationError = null;
      let isUsingDefaultLocation = false;

      console.log('开始场景推荐流程...');

      // 1. 获取基础时间信息
      const timeOfDay = EnvironmentManager.getTimeOfDay();

      // 2. 获取位置信息
      console.log('正在获取位置信息...');
      let location;
      try {
        location = await EnvironmentManager.getCurrentPosition();
        console.log('位置获取成功:', location);
      } catch (error) {
        console.warn('位置获取失败，使用默认坐标:', error);
        locationError = error.message || '位置获取失败';
        // 使用北京坐标作为默认位置
        location = {
          latitude: 39.9042,
          longitude: 116.4074,
          isDefaultLocation: true
        };
        isUsingDefaultLocation = true;
      }

      // 3. 并行获取天气和区域类型(提高响应速度)
      console.log('并行获取环境信息...');
      const [weatherInfo, areaType] = await Promise.all([
        EnvironmentManager.getWeather(location.latitude, location.longitude)
          .catch(error => {
            console.warn('天气获取失败，使用默认值:', error);
            return DEFAULT_SETTINGS.WEATHER;
          }),
        EnvironmentManager.determineAreaType(location.latitude, location.longitude, location.isDefaultLocation)
          .catch(error => {
            console.warn('区域类型判断失败，使用默认值:', error);
            return DEFAULT_SETTINGS.AREA_TYPE;
          })
      ]);

      console.log('环境数据汇总:', {
        timeOfDay,
        areaType,
        weatherType: weatherInfo.type,
        isUsingDefaultLocation
      });

      // 4. 生成推荐关键词
      const recommendation = await KeywordGenerator.generateSmartRecommendation(
        timeOfDay,
        weatherInfo,
        areaType
      );

      // 输出每个维度的关键词
      console.log('搜索关键词维度分布:',
        `时间维度: "${recommendation.metadata.usedKeywords.time || '无'}"`,
        `区域维度: "${recommendation.metadata.usedKeywords.area || '无'}"`,
        `天气维度: "${recommendation.metadata.usedKeywords.weather || '无'}"`,
        `季节维度: "${recommendation.metadata.usedKeywords.season || '无'}"`
      );

      // 5. 搜索匹配歌单
      let playlists = await PlaylistSearcher.searchPlaylists(recommendation.searchKeyword);

      // 检查搜索结果，如果为空则使用备用关键词
      if (!playlists) {
        console.log('主搜索关键词未返回结果，尝试备用搜索词...');
        playlists = await PlaylistSearcher.searchWithFallbackKeyword(recommendation.metadata);

        if (!playlists) {
          throw new Error('未能找到匹配的歌单，即使使用备用关键词也没有结果');
        }
      }

      // 6. 评分排序
      console.log(`开始对${playlists.length}个候选歌单进行评分...`);
      const scoredPlaylists = scorePlaylists(playlists, recommendation);
      const bestPlaylist = scoredPlaylists[0]; // 评分最高的歌单

      console.log(`评分完成，最佳推荐: "${bestPlaylist.name}", 得分: ${bestPlaylist.score}`);

      // 7. 返回最终推荐结果
      return {
        data: {
          // 场景元数据
          metadata: recommendation.metadata,
          searchKeyword: recommendation.searchKeyword,

          // 匹配质量信息
          matchScore: bestPlaylist.score,
          matchQuality: bestPlaylist.score >= MIN_ACCEPTABLE_SCORE ? 'high' : 'medium',

          // 位置相关信息
          locationError,
          usingDefaultSettings: isUsingDefaultLocation,

          // 推荐歌单信息
          recommendedPlaylist: {
            id: bestPlaylist.id,
            name: bestPlaylist.name,
            coverImgUrl: bestPlaylist.coverImgUrl
          }
        }
      };
    } catch (error) {
      console.error('场景推荐生成失败:', error);
      throw error;
    }
  }
}; 