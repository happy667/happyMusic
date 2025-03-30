/**
 * 场景推荐系统优化模块
 * 
 * 该模块负责对搜索出的歌单进行评分和排序
 * 基于场景匹配度、播放量等因素为每个歌单计算综合得分
 */
import config from './config.js';

// 从配置中导入评分权重及场景配置
const { SCORE_WEIGHTS, SCENE_CONFIG } = config;

/**
 * 根据当前场景对歌单进行评分并排序
 * 
 * 综合考虑以下因素评分:
 * 1. 播放量 - 更受欢迎的歌单得分更高
 * 2. 时间匹配度 - 歌单名称与当前时间段的匹配程度
 * 3. 天气匹配度 - 歌单名称与当前天气的匹配程度
 * 4. 区域匹配度 - 歌单名称与当前区域类型的匹配程度
 * 5. 季节匹配加成 - 符合当前季节特征的额外得分
 * 
 * @param {Array} playlists - 候选歌单数组
 * @param {Object} recommendation - 包含场景元数据的推荐对象
 * @returns {Array} 评分后并排序的歌单数组
 */
export function scorePlaylists (playlists, recommendation) {
  if (!playlists || !playlists.length) {
    console.warn('没有歌单可供评分');
    return [];
  }

  // 提取元数据中的各种场景信息
  const metadata = recommendation.metadata;

  // 记录起始时间 - 性能监控
  const startTime = Date.now();

  // 最大播放量 - 用于归一化处理
  const maxPlayCount = Math.max(...playlists.map(p => p.playCount || 0));

  // 对每个歌单计算综合得分
  const scoredPlaylists = playlists.map(playlist => {
    // 创建可变的歌单副本进行评分
    const scoredPlaylist = { ...playlist, matchDetails: {} };

    // 获取歌单评分所需的文本字段
    const playlistName = playlist.name || '';
    const playlistTags = (playlist.tags || []).join(' ');
    const playlistDescription = playlist.description || '';

    // 构建包含所有可能匹配文本的综合文本
    const combinedText = `${playlistName} ${playlistTags} ${playlistDescription}`.toLowerCase();

    // =============== 1. 播放量得分 ===============
    // 播放量得分 - 根据歌单流行度评分(0-100)
    const playCountScore = maxPlayCount > 0
      ? (playlist.playCount || 0) / maxPlayCount * 100
      : 50; // 如果没有播放量数据，给予中等分数

    scoredPlaylist.matchDetails.playCountScore = playCountScore;

    // =============== 2. 时间匹配得分 ===============
    // 时间匹配得分 - 检查歌单是否包含当前时间段相关关键词
    const timeMatch = {
      // 直接匹配时间段名称
      exactTimeMatch: combinedText.includes(metadata.time),

      // 匹配时间相关情绪
      moodMatch: combinedText.includes(metadata.timeOfDayMood),

      // 匹配相关情绪关键词
      relatedMoodsMatch: metadata.timeRelatedMoods.some(mood =>
        combinedText.includes(mood)
      )
    };

    // 计算时间匹配总得分
    let timeMatchScore = 0;
    if (timeMatch.exactTimeMatch) timeMatchScore += SCORE_WEIGHTS.timeMatch.exactMatch;
    if (timeMatch.moodMatch) timeMatchScore += SCORE_WEIGHTS.timeMatch.moodMatch;
    if (timeMatch.relatedMoodsMatch) timeMatchScore += SCORE_WEIGHTS.timeMatch.relatedMoodMatch;

    // 记录详细匹配信息
    scoredPlaylist.matchDetails.timeMatch = timeMatch;
    scoredPlaylist.matchDetails.timeMatchScore = timeMatchScore;

    // =============== 3. 天气匹配得分 ===============
    // 天气匹配得分 - 检查歌单是否包含当前天气相关关键词
    const weatherMatch = {
      // 直接匹配天气类型
      exactWeatherMatch: combinedText.includes(metadata.weather),

      // 匹配天气相关情绪
      moodMatch: combinedText.includes(metadata.weatherMood),

      // 匹配相关情绪关键词
      relatedMoodsMatch: metadata.weatherRelatedMoods.some(mood =>
        combinedText.includes(mood)
      ),

      // 匹配音乐风格关键词
      musicStyleMatch: metadata.weatherMusicStyles.some(style =>
        combinedText.includes(style)
      )
    };

    // 计算天气匹配总得分
    let weatherMatchScore = 0;
    if (weatherMatch.exactWeatherMatch) weatherMatchScore += SCORE_WEIGHTS.weatherMatch.exactMatch;
    if (weatherMatch.moodMatch) weatherMatchScore += SCORE_WEIGHTS.weatherMatch.moodMatch;
    if (weatherMatch.relatedMoodsMatch) weatherMatchScore += SCORE_WEIGHTS.weatherMatch.relatedMoodMatch;
    if (weatherMatch.musicStyleMatch) weatherMatchScore += SCORE_WEIGHTS.weatherMatch.musicStyleMatch;

    // 记录详细匹配信息
    scoredPlaylist.matchDetails.weatherMatch = weatherMatch;
    scoredPlaylist.matchDetails.weatherMatchScore = weatherMatchScore;

    // =============== 4. 区域匹配得分 ===============
    // 区域匹配得分 - 检查歌单是否包含当前区域相关关键词
    const areaMatch = {
      // 直接匹配区域类型
      exactAreaMatch: combinedText.includes(metadata.areaTypeInChinese),

      // 匹配区域相关关键词
      keywordMatch: combinedText.includes(metadata.areaMood),

      // 匹配音乐风格关键词
      musicStyleMatch: metadata.areaMusicStyles.some(style =>
        combinedText.includes(style)
      )
    };

    // 计算区域匹配总得分
    let areaMatchScore = 0;
    if (areaMatch.exactAreaMatch) areaMatchScore += SCORE_WEIGHTS.areaMatch.exactMatch;
    if (areaMatch.keywordMatch) areaMatchScore += SCORE_WEIGHTS.areaMatch.keywordMatch;
    if (areaMatch.musicStyleMatch) areaMatchScore += SCORE_WEIGHTS.areaMatch.musicStyleMatch;

    // 记录详细匹配信息
    scoredPlaylist.matchDetails.areaMatch = areaMatch;
    scoredPlaylist.matchDetails.areaMatchScore = areaMatchScore;

    // =============== 5. 季节匹配加成 ===============
    // 季节匹配加成 - 检查歌单是否包含当前季节相关关键词
    const seasonMatch = {
      // 直接匹配季节名称
      exactSeasonMatch: combinedText.includes(metadata.season),

      // 匹配季节相关情绪
      moodMatch: combinedText.includes(metadata.seasonMood),

      // 匹配相关情绪关键词
      relatedMoodsMatch: metadata.seasonRelatedMoods.some(mood =>
        combinedText.includes(mood)
      ),

      // 匹配音乐风格关键词
      musicStyleMatch: metadata.seasonMusicStyles.some(style =>
        combinedText.includes(style)
      )
    };

    // 计算季节匹配加成得分
    let seasonBonusScore = 0;
    if (seasonMatch.exactSeasonMatch) seasonBonusScore += 3;
    if (seasonMatch.moodMatch) seasonBonusScore += 2;
    if (seasonMatch.relatedMoodsMatch) seasonBonusScore += 2;
    if (seasonMatch.musicStyleMatch) seasonBonusScore += 3;

    // 记录详细匹配信息
    scoredPlaylist.matchDetails.seasonMatch = seasonMatch;
    scoredPlaylist.matchDetails.seasonBonusScore = seasonBonusScore;

    // =============== 计算综合得分 ===============
    // 计算最终加权得分 - 各分项乘以相应权重
    const weightedScore =
      playCountScore * SCORE_WEIGHTS.playCount +
      timeMatchScore * SCORE_WEIGHTS.timeMatch.weight +
      weatherMatchScore * SCORE_WEIGHTS.weatherMatch.weight +
      areaMatchScore * SCORE_WEIGHTS.areaMatch.weight;

    // 添加季节加成(不参与权重分配)
    const finalScore = Math.min(weightedScore + seasonBonusScore, 100);

    // 保存四舍五入后的最终得分
    scoredPlaylist.score = Math.round(finalScore);

    return scoredPlaylist;
  });

  // 记录评分耗时
  const endTime = Date.now();
  console.log(`歌单评分耗时: ${endTime - startTime}ms, 处理了${playlists.length}个歌单`);

  // 按得分降序排序
  return scoredPlaylists.sort((a, b) => b.score - a.score);
}