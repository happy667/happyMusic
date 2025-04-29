/**
 * 智能歌单推荐系统 - 整合AI情感分析和场景化推荐
 */

import searchApi from '@/api/search.js'
import { SEARCH_TYPE } from '@/assets/common/js/config.js'
import { ERR_OK } from '@/api/config.js'
import { SENTIMENT_TYPES } from './ai-emotion-radio/config.js'
import { getSentimentType } from './ai-emotion-radio/ai-emotion-helper.js'

// 通用评分权重配置
const SCORE_WEIGHTS = {
  playCount: 0.25, // 播放量权重
  emotion: {
    keywordMatch: 0.35,
    sentimentMatch: 0.40,
    exactMatch: 60,
    partialMatch: 40,
    moodMatch: 50,
    styleMatch: 50
  },
  scenario: {
    timeMatch: 0.25,
    weatherMatch: 0.30,
    areaMatch: 0.15,
    seasonBonus: 0.05
  }
};

// 常见虚词和助词
const COMMON_WORDS = ['的', '地', '得', '了', '和', '与', '或', '在', '有', '是', '啊', '吧', '呢'];

/**
 * 根据AI情感分析结果推荐歌单
 * @param {Object} aiAnalysisResult - AI分析结果对象
 * @returns {Promise<Object>} 推荐的歌单信息
 */
export async function recommendByEmotion (aiAnalysisResult) {
  try {
    if (!aiAnalysisResult) {
      throw new Error('AI分析结果无效');
    }

    // 确保推荐结果格式正确
    aiAnalysisResult = ensureValidAnalysisFormat(aiAnalysisResult);

    // 提取搜索关键词
    let searchKeyword = '';
    if (aiAnalysisResult.recommendation && aiAnalysisResult.recommendation.searchKeyword) {
      searchKeyword = aiAnalysisResult.recommendation.searchKeyword;
    } else if (aiAnalysisResult.searchKeyword) {
      searchKeyword = aiAnalysisResult.searchKeyword;
    }

    // 确保搜索关键词有效
    if (!searchKeyword || searchKeyword.trim() === '') {
      searchKeyword = getFallbackKeyword(aiAnalysisResult);
    }

    // 优化搜索关键词 - 移除特殊字符，统一空格格式
    const cleanedKeyword = searchKeyword.replace(/[^\w\s\u4e00-\u9fa5]/g, ' ').replace(/\s+/g, ' ').trim();

    // 搜索歌单
    const playlists = await searchPlaylists(cleanedKeyword);

    if (!playlists || playlists.length === 0) {
      // 使用备用关键词
      const fallbackKeyword = getFallbackKeyword(aiAnalysisResult);

      if (!fallbackKeyword || fallbackKeyword.trim() === '') {
        throw new Error('无法生成推荐关键词');
      }

      const fallbackPlaylists = await searchPlaylists(fallbackKeyword);

      if (!fallbackPlaylists || fallbackPlaylists.length === 0) {
        // 再尝试一次使用更通用的关键词
        const lastResortKeyword = '热门 推荐';
        const lastResortPlaylists = await searchPlaylists(lastResortKeyword);

        if (!lastResortPlaylists || lastResortPlaylists.length === 0) {
          throw new Error('未能找到匹配的歌单');
        }

        // 直接按播放量选择热门歌单
        const scoredPlaylists = scoreByPlayCount(lastResortPlaylists,
          Math.max(...lastResortPlaylists.map(p => p.playCount || 0)));
        const bestPlaylist = scoredPlaylists[0];

        return formatPlaylistResult(bestPlaylist, lastResortKeyword, true, aiAnalysisResult);
      }

      // 对备用歌单评分并排序
      const scoredPlaylists = scorePlaylistsByEmotion(fallbackPlaylists, aiAnalysisResult);
      const bestPlaylist = scoredPlaylists[0];

      return formatPlaylistResult(bestPlaylist, fallbackKeyword, true, aiAnalysisResult);
    }

    // 处理音乐实体歌单的特殊情况
    if (aiAnalysisResult.isMusicEntityBased) {
      const musicEntities = aiAnalysisResult.musicElements || {};
      const entityKeywords = [];

      // 收集所有实体关键词
      if (musicEntities.singer) entityKeywords.push(musicEntities.singer);
      if (musicEntities.song) entityKeywords.push(musicEntities.song);
      if (musicEntities.album) entityKeywords.push(musicEntities.album);

      if (entityKeywords.length > 0) {
        // 如果有直接匹配的歌单，按播放量排序返回
        const entityPlaylists = playlists.filter(playlist =>
          containsSpecificEntity(playlist, entityKeywords)
        );

        // 如果有匹配的歌单，直接按播放量排序返回
        if (entityPlaylists.length > 0) {
          const maxPlayCount = Math.max(...entityPlaylists.map(p => p.playCount || 0));
          const scoredEntityPlaylists = scoreByPlayCount(entityPlaylists, maxPlayCount);
          const bestPlaylist = scoredEntityPlaylists[0];
          return formatPlaylistResult(bestPlaylist, cleanedKeyword, false, aiAnalysisResult);
        }
      }
    }

    // 对歌单评分并排序
    const scoredPlaylists = scorePlaylistsByEmotion(playlists, aiAnalysisResult);
    const bestPlaylist = scoredPlaylists[0];

    return formatPlaylistResult(bestPlaylist, cleanedKeyword, false, aiAnalysisResult);
  } catch (error) {
    console.error('[情感推荐] 歌单推荐失败:', error);
    throw error;
  }
}

/**
 * 根据场景数据推荐歌单
 * @param {Object} sceneData - 场景数据对象
 * @returns {Promise<Object>} 推荐的歌单信息
 */
export async function recommendByScenario (sceneData) {
  try {
    // 确保sceneData是一个有效对象
    if (!sceneData) {
      sceneData = {
        searchKeyword: '热门 推荐',
        usingDefaultSettings: true
      };
    }

    // 确保必要的属性存在
    if (sceneData.usingDefaultSettings === undefined) {
      sceneData.usingDefaultSettings = false;
    }

    sceneData.locationError = sceneData.locationError || null;
    sceneData.sceneDescription = sceneData.sceneDescription || '';

    // 提取搜索关键词
    const searchKeyword = sceneData.searchKeyword || '热门 推荐';

    // 搜索歌单
    const playlists = await searchPlaylists(searchKeyword, 100);

    if (!playlists || playlists.length === 0) {
      // 使用备用关键词
      const fallbackKeyword = getScenarioFallbackKeyword(sceneData.metadata || {});
      const fallbackPlaylists = await searchPlaylists(fallbackKeyword);

      if (!fallbackPlaylists || fallbackPlaylists.length === 0) {
        throw new Error('未能找到匹配的歌单');
      }

      const scoredPlaylists = scorePlaylistsByScenario(fallbackPlaylists, sceneData);
      const bestPlaylist = scoredPlaylists[0];
      return formatPlaylistResult(bestPlaylist, fallbackKeyword, true, sceneData);
    }

    const scoredPlaylists = scorePlaylistsByScenario(playlists, sceneData);
    const bestPlaylist = scoredPlaylists[0];
    return formatPlaylistResult(bestPlaylist, searchKeyword, false, sceneData);
  } catch (error) {
    console.error('[场景推荐] 歌单推荐失败:', error);
    throw error;
  }
}

/**
 * 通用歌单评分函数
 * 
 * 可同时处理情感推荐和场景推荐的评分逻辑
 * 
 * @param {Array} playlists - 候选歌单列表 
 * @param {Object} data - 推荐数据(可以是情感分析结果或场景数据)
 * @param {String} type - 评分类型: 'emotion'(情感) 或 'scenario'(场景)
 * @returns {Array} 评分后并排序的歌单列表
 */
export function scorePlaylists (playlists, data, type = 'emotion') {
  if (!playlists || playlists.length === 0) {
    return [];
  }

  // 根据评分类型选择相应的评分函数
  if (type === 'emotion') {
    return scorePlaylistsByEmotion(playlists, data);
  } else if (type === 'scenario') {
    return scorePlaylistsByScenario(playlists, data);
  } else {
    console.error(`不支持的评分类型: ${type}`);
    return [];
  }
}

/**
 * 搜索歌单
 * @param {string} searchKeyword - 搜索关键词
 * @param {number} maxResults - 最大结果数
 * @returns {Promise<Array>} 歌单列表
 */
async function searchPlaylists (searchKeyword, maxResults = 30) {
  if (!searchKeyword) {
    console.error('搜索关键词不能为空');
    return null;
  }

  try {
    const { data: res } = await searchApi.getSearchResult(
      searchKeyword,
      SEARCH_TYPE.songSheet,
      0,
      maxResults
    );

    if (res.code !== ERR_OK || !res.result || !res.result.playlists || res.result.playlists.length === 0) {
      return null;
    }

    return res.result.playlists;
  } catch (error) {
    console.error('[搜索歌单] 搜索失败:', error);
    return null;
  }
}

// ================ 情感推荐相关函数 ================

/**
 * 根据情感分析结果评分歌单
 * @param {Array} playlists - 候选歌单列表
 * @param {Object} aiAnalysisResult - AI情感分析结果
 * @returns {Array} 评分后并排序的歌单列表
 */
function scorePlaylistsByEmotion (playlists, aiAnalysisResult) {
  // 提取关键词和情感数据
  let searchKeyword = '';
  if (aiAnalysisResult.recommendation && aiAnalysisResult.recommendation.searchKeyword) {
    searchKeyword = aiAnalysisResult.recommendation.searchKeyword;
  } else if (aiAnalysisResult.searchKeyword) {
    searchKeyword = aiAnalysisResult.searchKeyword;
  }

  const searchKeywords = searchKeyword.toLowerCase().split(' ');
  const sentimentType = getSentimentType(aiAnalysisResult.sentiment);
  const sentimentConfig = SENTIMENT_TYPES[sentimentType] || SENTIMENT_TYPES.NEUTRAL;
  const maxPlayCount = Math.max(...playlists.map(p => p.playCount || 0));

  // 对每个歌单计算综合得分
  const scoredPlaylists = playlists.map(playlist => {
    const scoredPlaylist = { ...playlist, matchDetails: {} };
    const playlistText = getPlaylistText(playlist);

    // 1. 播放量得分
    const playCountScore = maxPlayCount > 0
      ? (playlist.playCount || 0) / maxPlayCount * 100
      : 50;
    scoredPlaylist.matchDetails.playCountScore = playCountScore;

    // 2. 关键词匹配得分
    let keywordMatchScore = 0;
    const keywordMatches = searchKeywords.map(keyword => {
      const isExactMatch = playlistText.combined.includes(keyword);
      const isPartialMatch = !isExactMatch && playlistText.combined.split(/\s+/).some(word =>
        word.includes(keyword) || keyword.includes(word)
      );

      return { keyword, isExactMatch, isPartialMatch };
    });

    keywordMatches.forEach(match => {
      if (match.isExactMatch) {
        keywordMatchScore += SCORE_WEIGHTS.emotion.exactMatch / searchKeywords.length;
      } else if (match.isPartialMatch) {
        keywordMatchScore += SCORE_WEIGHTS.emotion.partialMatch / searchKeywords.length;
      }
    });

    scoredPlaylist.matchDetails.keywordMatchScore = keywordMatchScore;
    scoredPlaylist.matchDetails.keywordMatches = keywordMatches;

    // 3. 情感匹配得分
    let sentimentMatchScore = 0;
    const label = sentimentConfig.label.toLowerCase();
    const description = sentimentConfig.description.toLowerCase();

    // 情绪匹配检查
    const hasMoodMatch = playlistText.combined.includes(label);
    // 音乐风格匹配检查
    const hasStyleMatch = playlistText.combined.includes(description);

    if (hasMoodMatch) {
      sentimentMatchScore += SCORE_WEIGHTS.emotion.moodMatch;
    }

    if (hasStyleMatch) {
      sentimentMatchScore += SCORE_WEIGHTS.emotion.styleMatch;
    }

    scoredPlaylist.matchDetails.sentimentMatchScore = sentimentMatchScore;
    scoredPlaylist.matchDetails.hasMoodMatch = hasMoodMatch;
    scoredPlaylist.matchDetails.hasStyleMatch = hasStyleMatch;

    // 计算最终加权得分
    const weightedScore =
      playCountScore * SCORE_WEIGHTS.playCount +
      keywordMatchScore * SCORE_WEIGHTS.emotion.keywordMatch +
      sentimentMatchScore * SCORE_WEIGHTS.emotion.sentimentMatch;

    // 最终得分不超过100
    scoredPlaylist.score = Math.min(Math.round(weightedScore), 100);

    return scoredPlaylist;
  });

  // 按得分降序排序
  return scoredPlaylists.sort((a, b) => b.score - a.score);
}

/**
 * 获取备用搜索关键词 (情感推荐)
 * @param {Object} aiAnalysisResult - AI分析结果
 * @returns {string} 备用关键词
 */
function getFallbackKeyword (aiAnalysisResult) {
  // 检查是否存在音乐实体关键词
  let musicEntityKeyword = '';
  if (aiAnalysisResult.musicElements) {
    const elements = aiAnalysisResult.musicElements;
    if (elements.singer) musicEntityKeyword = elements.singer;
    else if (elements.song) musicEntityKeyword = elements.song;
    else if (elements.album) musicEntityKeyword = elements.album;
  }

  // 提取情感类型
  const sentimentType = getSentimentType(aiAnalysisResult.sentiment);

  // 备用关键词选项
  const backupKeywords = {
    'NEGATIVE': ['治愈 轻音乐', '钢琴 安静', '轻松 古典', '放松 纯音乐', '温暖 民谣', '安静 抒情'],
    'POSITIVE': ['流行 欢快', '动感 电子', '活力 流行', '热门 舞曲', '欢乐 节奏', '动感 摇滚'],
    'NEUTRAL': ['轻音乐 纯音乐', '钢琴 轻柔', '民谣 自然', '平静 放松', '舒适 轻快', '清新 日常']
  };

  // 如果有音乐实体关键词，尝试组合使用
  if (musicEntityKeyword) {
    const options = backupKeywords[sentimentType] || backupKeywords['NEUTRAL'];
    const randomIndex = Math.floor(Math.random() * 3); // 只用前3个选项
    return `${musicEntityKeyword} ${options[randomIndex].split(' ')[0]}`;
  }

  // 随机选择一个备用关键词
  const options = backupKeywords[sentimentType] || backupKeywords['NEUTRAL'];
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}

// ================ 场景推荐相关函数 ================

/**
 * 根据场景信息评分歌单
 * @param {Array} playlists - 候选歌单列表
 * @param {Object} sceneData - 场景数据信息
 * @returns {Array} 评分后并排序的歌单列表
 */
function scorePlaylistsByScenario (playlists, sceneData) {
  // 提取元数据中的各种场景信息
  const metadata = sceneData.metadata;
  const searchKeywords = (sceneData.searchKeyword || '').toLowerCase().split(' ');

  // 最大播放量 - 用于归一化处理
  const maxPlayCount = Math.max(...playlists.map(p => p.playCount || 0));


  // 对每个歌单计算综合得分
  const scoredPlaylists = playlists.map(playlist => {
    // 创建可变的歌单副本进行评分
    const scoredPlaylist = { ...playlist, matchDetails: {} };
    const playlistText = getPlaylistText(playlist);

    // =============== 1. 播放量得分 ===============
    // 播放量得分 - 根据歌单流行度评分(0-100)
    const playCountScore = maxPlayCount > 0
      ? (playlist.playCount || 0) / maxPlayCount * 100
      : 50; // 如果没有播放量数据，给予中等分数

    scoredPlaylist.matchDetails.playCountScore = playCountScore;

    // =============== 2. 时间匹配得分 ===============
    // 检查歌单是否包含当前时间段相关关键词
    let timeMatchScore = 0;

    // 时间段匹配检查
    if (metadata.time && playlistText.combined.includes(metadata.time)) {
      timeMatchScore += 40;
    }

    // 时间情绪匹配检查
    if (metadata.timeOfDayMood && playlistText.combined.includes(metadata.timeOfDayMood)) {
      timeMatchScore += 30;
    }

    // 相关情绪检查
    if (metadata.timeRelatedMoods && metadata.timeRelatedMoods.some(mood =>
      playlistText.combined.includes(mood))) {
      timeMatchScore += 30;
    }

    scoredPlaylist.matchDetails.timeMatchScore = timeMatchScore;

    // =============== 3. 天气匹配得分 ===============
    // 检查歌单是否包含当前天气相关关键词
    let weatherMatchScore = 0;

    // 天气类型匹配检查
    if (metadata.weather && playlistText.combined.includes(metadata.weather)) {
      weatherMatchScore += 30;
    }

    // 天气情绪匹配检查
    if (metadata.weatherMood && playlistText.combined.includes(metadata.weatherMood)) {
      weatherMatchScore += 30;
    }

    // 相关情绪检查
    if (metadata.weatherRelatedMoods && metadata.weatherRelatedMoods.some(mood =>
      playlistText.combined.includes(mood))) {
      weatherMatchScore += 20;
    }

    // 音乐风格匹配检查
    if (metadata.weatherMusicStyles && metadata.weatherMusicStyles.some(style =>
      playlistText.combined.includes(style))) {
      weatherMatchScore += 20;
    }

    scoredPlaylist.matchDetails.weatherMatchScore = weatherMatchScore;

    // =============== 4. 区域匹配得分 ===============
    // 检查歌单是否包含当前区域相关关键词
    let areaMatchScore = 0;

    // 区域类型匹配检查
    if (metadata.areaTypeInChinese && playlistText.combined.includes(metadata.areaTypeInChinese)) {
      areaMatchScore += 40;
    }

    // 区域关键词匹配检查
    if (metadata.areaMood && playlistText.combined.includes(metadata.areaMood)) {
      areaMatchScore += 30;
    }

    // 音乐风格匹配检查
    if (metadata.areaMusicStyles && metadata.areaMusicStyles.some(style =>
      playlistText.combined.includes(style))) {
      areaMatchScore += 30;
    }

    scoredPlaylist.matchDetails.areaMatchScore = areaMatchScore;

    // =============== 5. 季节匹配加成 ===============
    // 季节匹配得分
    let seasonBonusScore = 0;

    // 季节匹配检查
    if (metadata.season && playlistText.combined.includes(metadata.season)) {
      seasonBonusScore += 3;
    }

    // 季节情绪匹配检查
    if (metadata.seasonMood && playlistText.combined.includes(metadata.seasonMood)) {
      seasonBonusScore += 3;
    }

    // 相关情绪检查
    if (metadata.seasonRelatedMoods && metadata.seasonRelatedMoods.some(mood =>
      playlistText.combined.includes(mood))) {
      seasonBonusScore += 2;
    }

    // 音乐风格匹配检查
    if (metadata.seasonMusicStyles && metadata.seasonMusicStyles.some(style =>
      playlistText.combined.includes(style))) {
      seasonBonusScore += 2;
    }

    scoredPlaylist.matchDetails.seasonBonusScore = seasonBonusScore;

    // =============== 计算综合得分 ===============
    // 计算最终加权得分
    const weightedScore =
      playCountScore * SCORE_WEIGHTS.playCount +
      timeMatchScore * SCORE_WEIGHTS.scenario.timeMatch +
      weatherMatchScore * SCORE_WEIGHTS.scenario.weatherMatch +
      areaMatchScore * SCORE_WEIGHTS.scenario.areaMatch;

    // 添加季节加成
    const finalScore = Math.min(weightedScore + (seasonBonusScore * SCORE_WEIGHTS.scenario.seasonBonus), 100);

    // 保存四舍五入后的最终得分
    scoredPlaylist.score = Math.round(finalScore);

    return scoredPlaylist;
  });

  // 按得分降序排序
  return scoredPlaylists.sort((a, b) => b.score - a.score);
}

/**
 * 获取场景备用搜索关键词
 * @param {Object} metadata - 场景元数据
 * @returns {string} 备用关键词
 */
function getScenarioFallbackKeyword (metadata = {}) {
  // 确保metadata是一个有效对象
  metadata = metadata || {};

  console.log('[备用关键词] 元数据:', JSON.stringify(metadata));

  // 优先使用天气情绪加上时间段
  if (metadata.weatherMood && metadata.time) {
    return `${metadata.weatherMood} ${metadata.time}`;
  }

  // 其次使用时间情绪加上区域类型
  if (metadata.timeOfDayMood && metadata.areaTypeInChinese) {
    return `${metadata.timeOfDayMood} ${metadata.areaTypeInChinese}`;
  }

  // 再次使用季节加上天气类型
  if (metadata.season && metadata.weather) {
    return `${metadata.season} ${metadata.weather}`;
  }

  // 最后使用时间段加音乐风格
  if (metadata.time && metadata.weatherMusicStyles && metadata.weatherMusicStyles.length > 0) {
    return `${metadata.time} ${metadata.weatherMusicStyles[0]}`;
  }

  // 如果有任何单个有效属性，尝试组合使用
  const terms = [];
  if (metadata.time) terms.push(metadata.time);
  if (metadata.weatherMood) terms.push(metadata.weatherMood);
  if (metadata.timeOfDayMood) terms.push(metadata.timeOfDayMood);
  if (metadata.areaMood) terms.push(metadata.areaMood);

  if (terms.length > 0) {
    // 最多使用2个关键词，避免过于具体导致没有匹配结果
    const selectedTerms = terms.slice(0, 2);
    console.log('[备用关键词] 使用单个属性组合:', selectedTerms.join(' '));
    return selectedTerms.join(' ');
  }

  // 保底返回一个通用搜索词
  console.log('[备用关键词] 使用通用关键词');
  return '流行 热门 歌单';
}

/**
 * 格式化歌单推荐结果
 * @param {Object} playlist - 歌单对象
 * @param {String} searchKeyword - 搜索关键词
 * @param {Boolean} isFallback - 是否是备用推荐
 * @returns {Object} 格式化后的歌单结果
 */
function formatPlaylistResult (playlist, searchKeyword, isFallback, originalData = {}) {
  if (!playlist) {
    throw new Error('歌单对象不能为空');
  }

  const safeOriginalData = originalData || {};
  const usingDefaultSettings = safeOriginalData.usingDefaultSettings === undefined ?
    false : safeOriginalData.usingDefaultSettings;
  const locationError = safeOriginalData.locationError || null;
  const sceneDescription = safeOriginalData.sceneDescription || '';

  const result = {
    id: playlist.id,
    name: playlist.name,
    coverImgUrl: playlist.coverImgUrl,
    playCount: playlist.playCount || 0,
    trackCount: playlist.trackCount || 0,
    creator: playlist.creator ? {
      userId: playlist.creator.userId,
      nickname: playlist.creator.nickname
    } : null,
    tags: playlist.tags || [],
    score: playlist.score || 0,
    searchKeyword,
    isFallback,
    matchDetails: playlist.matchDetails || {},
    bookCount: playlist.bookCount || 0,
    description: playlist.description && playlist.description.length > 100 ?
      playlist.description.substring(0, 100) + '...' : (playlist.description || ''),
    usingDefaultSettings,
    locationError,
    sceneDescription
  };

  return result;
}

/**
 * 判断一个关键词是否可能是音乐实体名称
 * @param {string} keyword - 关键词
 * @returns {boolean} - 是否可能是音乐实体
 */
function isLikelyEntityName (keyword) {
  if (!keyword || keyword.length < 2) return false;

  // 通用词汇(这些更可能是类别词而非具体实体)
  const generalWords = [
    '流行', '古典', '摇滚', '爵士', '说唱', '民谣', '电子', '轻音乐',
    '开心', '伤心', '快乐', '悲伤', '平静', '舒缓', '激动', '兴奋',
    '睡前', '工作', '运动', '学习', '放松', '开车', '聚会'
  ];

  // 如果关键词是这些通用词汇，它可能不是一个具体的音乐实体
  return !generalWords.includes(keyword);
}

/**
 * 检查歌单是否包含特定实体关键词(歌手/歌曲/专辑/人名)
 * @param {Object} playlist - 歌单对象 
 * @param {Array} keywords - 搜索关键词数组
 * @returns {Boolean} 是否包含特定实体
 */
function containsSpecificEntity (playlist, keywords) {
  if (!playlist || !keywords || keywords.length === 0) {
    return false;
  }

  const playlistName = (playlist.name || '').toLowerCase();
  const playlistTags = (playlist.tags || []).join(' ').toLowerCase();
  const playlistDescription = (playlist.description || '').toLowerCase();
  const combinedText = `${playlistName} ${playlistTags} ${playlistDescription}`;

  // 音乐风格词 - 这些词可能出现在歌单中但不一定表示是特定实体匹配
  const musicStyleKeywords = ['钢琴曲', '古典', '摇滚', '流行', '电子', '爵士', '民谣', '轻音乐'];

  // 检查是否专门的音乐风格歌单
  const isStylePlaylist = musicStyleKeywords.some(style => {
    return keywords.includes(style) && (
      playlistName.includes(style) ||
      playlistTags.includes(style) ||
      combinedText.includes(`${style}歌单`) ||
      combinedText.includes(`${style}音乐`) ||
      combinedText.includes(`${style}专辑`)
    );
  });

  if (isStylePlaylist) {
    return true;
  }

  // 基本匹配模式
  for (const keyword of keywords) {
    // 跳过不太可能是实体的关键词
    if (!isLikelyEntityName(keyword)) {
      continue;
    }

    // 直接匹配检查
    if (playlistName.includes(keyword) || playlistTags.includes(keyword)) {
      return true;
    }

    // 扩展匹配检查
    if (
      combinedText.includes(`歌手${keyword}`) ||
      combinedText.includes(`${keyword}的歌`) ||
      combinedText.includes(`${keyword}的专辑`) ||
      combinedText.includes(`${keyword}的音乐`) ||
      combinedText.includes(`${keyword}演唱`) ||
      combinedText.includes(`演唱者${keyword}`) ||
      combinedText.includes(`歌手是${keyword}`) ||
      combinedText.includes(`${keyword}的作品`) ||
      combinedText.includes(`歌曲${keyword}`) ||
      combinedText.includes(`听${keyword}`) ||
      combinedText.includes(`《${keyword}》`)
    ) {
      return true;
    }

    // 简化的模式匹配检查
    const patterns = [
      new RegExp(`歌手[是为:：]\\s*([^,，。；;!！?？\\s]+)`, 'g'),
      new RegExp(`([^,，。；;!！?？\\s]+)\\s*[的唱演]歌`, 'g'),
      new RegExp(`[《""]([^》""]+)[》""]`, 'g')
    ];

    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      const matches = [...combinedText.matchAll(pattern)];
      for (const match of matches) {
        if (match[1] && match[1].includes(keyword)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * 根据播放量为歌单评分并排序
 * @param {Array} playlists - 歌单列表
 * @param {Number} maxPlayCount - 最大播放量值
 * @returns {Array} 评分后的歌单列表
 */
function scoreByPlayCount (playlists, maxPlayCount) {
  if (!playlists || playlists.length === 0) {
    return [];
  }

  // 创建带有播放量评分的歌单列表
  const scoredPlaylists = playlists.map(playlist => {
    const scoredPlaylist = {
      ...playlist,
      matchDetails: {
        ...(playlist.matchDetails || {})
      },
      isSpecificMatch: true
    };

    const playCount = playlist.playCount || 0;
    const playCountScore = maxPlayCount > 0
      ? (playCount / maxPlayCount) * 100
      : 50;

    scoredPlaylist.score = Math.min(Math.round(playCountScore), 100);
    scoredPlaylist.matchDetails.playCountScore = playCountScore;

    return scoredPlaylist;
  });

  // 按得分降序排序
  return scoredPlaylists.sort((a, b) => b.score - a.score);
}

/**
 * 获取歌单的关键文本信息
 * @param {Object} playlist - 歌单对象
 * @returns {Object} 包含名称、标签和描述的文本对象
 */
function getPlaylistText (playlist) {
  const name = (playlist.name || '').toLowerCase();
  const tags = (playlist.tags || []).map(tag => tag.toLowerCase()).join(' ');
  const description = (playlist.description || '').toLowerCase();
  const combined = `${name} ${tags} ${description}`;

  return { name, tags, description, combined };
}

/**
 * 确保分析结果格式正确
 * @param {Object} result - 原始分析结果
 * @returns {Object} - 修正格式后的分析结果
 */
function ensureValidAnalysisFormat (result) {
  if (!result) return null;

  const validResult = { ...result };

  // 如果musicElements存在但isMusicEntityBased不存在或为false
  if (validResult.musicElements &&
    (validResult.isMusicEntityBased === undefined || validResult.isMusicEntityBased === false)) {

    // 检查是否有歌手实体
    const hasSinger = validResult.musicElements.singer && validResult.musicElements.singer.trim() !== '';

    if (hasSinger) {
      validResult.isMusicEntityBased = true;
    }
  }

  // 如果没有searchKeyword但有musicElements
  if ((!validResult.searchKeyword || validResult.searchKeyword.trim() === '') && validResult.musicElements) {
    const elements = validResult.musicElements;
    const keywords = [];

    if (elements.singer) keywords.push(elements.singer);
    if (elements.song) keywords.push(elements.song);
    if (elements.album) keywords.push(elements.album);
    if (elements.genre) keywords.push(elements.genre);
    if (elements.mood) keywords.push(elements.mood);

    if (keywords.length > 0) {
      validResult.searchKeyword = keywords.join(' ');
    }
  }

  return validResult;
}

// 导出主要函数
export default {
  recommendByEmotion,
  recommendByScenario
}; 