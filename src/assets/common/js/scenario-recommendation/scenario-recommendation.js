/**
 * 场景推荐系统主文件
 * 
 * 该文件实现了基于位置、时间、天气、区域特征的智能音乐推荐
 * 通过获取用户的当前环境，生成最适合的音乐歌单推荐
 */
import request from '@/axios/request.js'
import { ERR_OK } from '@/api/config.js'
import { recommendByScenario } from '@/assets/common/js/playlist-recommender.js'
import config from './config.js'
import baiduMapApi from '@/api/baiduMap.js'

// 从配置中导入所需常量
const {
  DEFAULT_SETTINGS,
  SCENE_CONFIG
} = config;

// 从配置中构建天气代码范围、时间范围和月份到季节的映射
const WEATHER_CODE_RANGES = Object.entries(SCENE_CONFIG.weather).map(([type, settings]) => {
  if (Array.isArray(settings.codeRange)) {
    // 多个范围，展开为多个范围对象
    return settings.codeRange.map(range => ({
      ...range,
      type
    }));
  } else {
    // 单个范围
    return {
      min: settings.codeRange.min,
      max: settings.codeRange.max,
      type
    };
  }
}).flat();

const TIME_RANGES = Object.entries(SCENE_CONFIG.time).map(([type, settings]) => ({
  min: settings.hourRange.min,
  max: settings.hourRange.max,
  type
}));

const MONTH_TO_SEASON = Object.entries(SCENE_CONFIG.season).map(([type, settings]) => {
  if (Array.isArray(settings.monthRange)) {
    // 多个范围，展开为多个范围对象
    return settings.monthRange.map(range => ({
      ...range,
      type
    }));
  } else {
    // 单个范围
    return {
      min: settings.monthRange.min,
      max: settings.monthRange.max,
      type
    };
  }
}).flat();

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

// ================ 主推荐模块 ================
/**
 * 场景推荐主函数
 * 
 * 根据当前环境信息生成歌单推荐
 * 
 * @returns {Promise<Object>} 推荐结果对象
 */
export async function recommend () {
  console.log('开始进行场景化推荐...');

  let locationData;
  let locationError = null;
  let isDefaultLocation = false;
  let weatherInfo = DEFAULT_SETTINGS.WEATHER;
  let timeOfDay = '早晨';
  let areaType = DEFAULT_SETTINGS.AREA_TYPE;

  try {
    // 获取位置信息
    try {
      locationData = await EnvironmentManager.getCurrentPosition();
      console.log('获取位置成功:', locationData);
      } catch (error) {
      console.warn('位置获取失败，使用默认位置:', error);
      locationData = { latitude: 39.9042, longitude: 116.4074 }; // 北京默认坐标
      locationError = '无法获取您的位置';
      isDefaultLocation = true;
    }

    // 开始并行获取各种场景信息
    const weatherPromise = EnvironmentManager.getWeather(locationData.latitude, locationData.longitude);
    const areaTypePromise = EnvironmentManager.determineAreaType(
      locationData.latitude,
      locationData.longitude,
      isDefaultLocation
    );

    // 获取当前时段
    timeOfDay = EnvironmentManager.getTimeOfDay();
    console.log('当前时段:', timeOfDay);

    // 等待并行请求完成
    const [weatherResult, areaTypeResult] = await Promise.all([weatherPromise, areaTypePromise]);
    weatherInfo = weatherResult;
    areaType = areaTypeResult;
    console.log('天气信息:', weatherInfo, '区域类型:', areaType);

    // 生成推荐搜索关键词
    const sceneRecommendation = await KeywordGenerator.generateSmartRecommendation(
      timeOfDay,
      weatherInfo,
      areaType
    );
    console.log('生成的场景推荐关键词:', sceneRecommendation);

    // 记录是否使用了默认设置
    sceneRecommendation.usingDefaultSettings = isDefaultLocation;
    if (locationError) {
      sceneRecommendation.locationError = locationError;
    }

    // 添加场景描述
    sceneRecommendation.sceneDescription = `${weatherInfo.type}的${timeOfDay}`;

    // 使用统一的歌单推荐系统进行推荐
    try {
      console.log('调用歌单推荐系统, 参数:', JSON.stringify(sceneRecommendation));
      const recommendedPlaylist = await recommendByScenario(sceneRecommendation);
      console.log('歌单推荐返回结果:', recommendedPlaylist);

      if (!recommendedPlaylist || !recommendedPlaylist.id) {
        throw new Error('推荐系统未返回有效歌单');
      }

      // 返回最终推荐结果
      const result = {
        ...sceneRecommendation,
        recommendedPlaylist,
        timestamp: Date.now()
      };

      console.log('场景推荐完成，返回结果:', JSON.stringify(result));
      return result;
    } catch (recommenderError) {
      console.error('歌单推荐系统错误:', recommenderError);
      // 如果推荐系统出错，仍然返回场景数据，但标记推荐失败
      const result = {
        ...sceneRecommendation,
        recommendationFailed: true,
        errorMessage: recommenderError.message || '歌单推荐失败',
        usingDefaultSettings: isDefaultLocation,
        locationError: locationError,
        timestamp: Date.now()
      };

      console.log('场景推荐失败，返回错误结果:', JSON.stringify(result));
      return result;
    }

    } catch (error) {
    console.error('场景推荐处理失败:', error);

    // 出错时返回基本信息，确保前端能够正常处理
    const result = {
      usingDefaultSettings: true,
      locationError: locationError || '场景推荐系统错误',
      sceneDescription: `${weatherInfo.type || '未知天气'}的${timeOfDay}`,
      searchKeyword: '热门 推荐',
      errorMessage: error.message || '场景推荐系统错误',
      timestamp: Date.now()
    };

    console.log('场景推荐出错，返回基本信息:', JSON.stringify(result));
    return result;
  }
}

// 导出主要函数
export default {
  recommend
};