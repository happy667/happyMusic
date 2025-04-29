/**
 * 情感分析与音乐推荐模块
 * 
 * 基于情感分析、关键词提取和文本分类的结果，生成智能音乐推荐关键词
 */

import { EMOTION_MUSIC_CONFIG, SENTIMENT_TYPES } from './config'
import { utils } from '@/assets/common/js/utils.js'
import { getSentimentType } from './ai-emotion-helper.js'

const randomList = utils.randomList

/**
 * 情绪音乐推荐
 * 
 * 根据NLP分析结果生成音乐推荐关键词组合
 * 
 * @param {Object} sentimentResult 情感分析结果
 * @param {Object} depparserResult 依存句法分析结果
 * @returns {Object} 包含推荐关键词和元数据的对象
 */
export async function generateMusicKeywords (sentimentResult, depparserResult) {
  try {
    // 处理依存句法分析数据，提取音乐实体（歌手/歌名/专辑）
    const musicEntities = extractMusicEntities(depparserResult.data?.items || []);

    // 创建搜索关键词 - 仅用于API调用
    const allEntities = [
      ...musicEntities.songs,
      ...musicEntities.singers,
      ...musicEntities.albums
    ];
    const searchKeyword = allEntities.length > 0 ? allEntities.join(' ') : '';

    // 直接返回识别结果
    return {
      searchKeyword,
      musicElements: {
        singer: musicEntities.singers.length > 0 ? musicEntities.singers.join(' ') : '',
        song: musicEntities.songs.length > 0 ? musicEntities.songs.join(' ') : '',
        album: musicEntities.albums.length > 0 ? musicEntities.albums.join(' ') : ''
      },
      // 原始实体列表
      entities: musicEntities
    };
  } catch (error) {
    console.error('[AI音乐关键词] 生成音乐关键词出错:', error);
    // 出错时返回空列表
    return {
      searchKeyword: '',
      musicElements: {
        singer: '',
        song: '',
        album: ''
      },
      entities: {
        singers: [],
        songs: [],
        albums: []
      }
    };
  }
}

/**
 * 调整推荐结果
 * @param {string} adjustment 调整类型
 * @param {Object} currentResult 当前推荐结果
 * @returns {Object} 调整后的推荐结果
 */
export function adjustRecommendation (adjustment, currentResult) {
  if (!adjustment || !currentResult) return null;

  const adjuster = EMOTION_MUSIC_CONFIG.moodAdjustments[adjustment];
  if (!adjuster) return currentResult;

  // 如果当前推荐是基于音乐实体的，保留这些实体
  if (currentResult.isMusicEntityBased) {
    const musicElements = currentResult.musicElements || {};
    const entityKeywords = [];

    if (musicElements.singer) entityKeywords.push(musicElements.singer);
    if (musicElements.song) entityKeywords.push(musicElements.song);
    if (musicElements.album) entityKeywords.push(musicElements.album);

    // 添加情感关键词
    const stylesList = randomList(adjuster.styles);
    if (stylesList && stylesList.length > 0) {
      entityKeywords.push(stylesList[0]);
    }

    const uniqueKeywords = [...new Set(entityKeywords)].filter(Boolean);
    const searchKeyword = uniqueKeywords.join(' ');

    return {
      searchKeyword,
      musicElements,
      isMusicEntityBased: true
    };
  }

  // 生成新的关键词
  const stylesList = randomList(adjuster.styles);
  let newKeywords = [
    adjuster.key,
    stylesList && stylesList.length > 0 ? stylesList[0] : ''
  ];

  // 保留歌手名，如果有的话
  const singer = currentResult.musicElements?.singer;
  if (singer) {
    newKeywords.push(singer);
  }

  // 确保不重复且不超过3个
  newKeywords = [...new Set(newKeywords)].slice(0, 3).filter(Boolean);
  const searchKeyword = newKeywords.join(' ');

  // 构建音乐元素对象
  const musicElements = {
    genre: newKeywords[1] || '',
    mood: newKeywords[0] || '',
    singer: singer || '',
    topic: newKeywords[2] || ''
  };

  return {
    searchKeyword,
    musicElements
  };
}

// 私有辅助函数

/**
 * 确定情感强度级别
 */
function determineIntensityLevel (sentiment) {
  if (!sentiment || !sentiment.confidence) {
    return 'midIntensity'; // 默认中等强度
  }

  // 直接根据置信度设置强度级别
  if (sentiment.confidence > 0.8) {
    return 'highIntensity';
  } else if (sentiment.confidence > 0.6) {
    return 'midIntensity';
  } else {
    return 'lowIntensity';
  }
}

/**
 * 从依存句法分析结果中提取音乐相关实体
 * @param {Array} depparser 依存句法分析结果
 * @returns {Object} 提取的音乐实体对象
 */
function extractMusicEntities (depparser) {
  if (!Array.isArray(depparser) || depparser.length === 0) {
    return { singers: [], songs: [], albums: [] };
  }

  const singers = [];
  const songs = [];
  const albums = [];
  const potentialSingers = [];

  // 需要过滤的通用词和停用词
  const stopWords = ['的', '了', '是', '我', '你', '他', '她', '它', '们', '这', '那', '和', '与',
    '或', '但', '并', '等', '等等', '歌', '歌曲', '听', '听听', '一下', '想', '不好', '好', '这个', '那个', '一首',
    '地', '得', '着', '过', '吧', '呢', '啊', '啦', '喜欢', '播放', '放', '放一下', '一点', '点'];

  // 识别歌曲名的前缀词
  const songPrefixes = ['歌', '歌曲', '歌名', '那首', '这首', '听', '播放', '放', '首', '放一首'];

  // 识别歌手名的前缀词
  const singerPrefixes = ['歌手', '唱', '唱的', '演唱', '唱歌', '歌星', '歌者', '艺人', '唱片'];

  // 识别专辑名的前缀词
  const albumPrefixes = ['专辑', '唱片', 'CD', '碟', '集'];

  // 获取完整文本用于模式匹配
  const fullText = depparser.map(item => item.word).join('');

  // 1. 文本模式提取 - 提取《》和""中的实体
  const songTitlePattern = /[《""]([^》""]{2,})[》""]/g;
  let songMatch;
  while ((songMatch = songTitlePattern.exec(fullText)) !== null) {
    const songTitle = songMatch[1].trim();
    if (!stopWords.includes(songTitle) && !songs.includes(songTitle)) {
      songs.push(songTitle);

      // 检查歌曲前面是否有歌手名+"的"结构
      const beforeText = fullText.substring(0, songMatch.index);
      const singerPattern = /([^\s,.，。！？]{2,})的$/;
      const singerMatch = beforeText.match(singerPattern);

      if (singerMatch && singerMatch[1]) {
        const possibleSinger = singerMatch[1];
        if (!stopWords.includes(possibleSinger) && possibleSinger.length >= 2 && !singers.includes(possibleSinger)) {
          singers.push(possibleSinger);
        }
      }
    }
  }

  // 检查"听xxx"模式
  const listenPatterns = [
    /听([^\s,.，。！？]{2,})/, // 简单"听xxx"模式
    /听(.+?)(?:的歌|歌曲|的音乐|的作品|的专辑|$)/ // 复杂"听xxx的歌"模式
  ];

  for (const pattern of listenPatterns) {
    const listenMatch = fullText.match(pattern);
    if (listenMatch && listenMatch[1] && listenMatch[1].length >= 2) {
      const potentialEntity = listenMatch[1].replace(/[的了吧啊呢]/g, '').trim();

      // 确认不是停用词且长度合适
      if (potentialEntity.length >= 2 && !stopWords.includes(potentialEntity)) {
        // 判断实体类型 - 人名为歌手，其他可能为歌曲
        let isSinger = false;

        // 检查是否是人名词性
        for (const item of depparser) {
          if (item.word === potentialEntity && (item.postag === 'nr' || item.postag === 'PER')) {
            isSinger = true;
            break;
          }
        }

        // 检查上下文是否有歌手相关词
        const context = fullText.substring(
          Math.max(0, fullText.indexOf(potentialEntity) - 10),
          Math.min(fullText.length, fullText.indexOf(potentialEntity) + potentialEntity.length + 10)
        );

        if (singerPrefixes.some(prefix => context.includes(prefix))) {
          isSinger = true;
        }

        if (isSinger && !singers.includes(potentialEntity)) {
          singers.push(potentialEntity);
        } else if (!songs.includes(potentialEntity) && !singers.includes(potentialEntity)) {
          songs.push(potentialEntity);
        }
      }
    }
  }

  // 2. 句法分析提取 - 基于词性和上下文
  for (let i = 0; i < depparser.length; i++) {
    const item = depparser[i];
    const word = item.word.trim();

    // 忽略停用词和短词
    if (stopWords.includes(word) || (word.length < 2 && item.postag !== 'nr' && item.postag !== 'PER')) {
      continue;
    }

    // 获取周围3个词的上下文
    const contextStart = Math.max(0, i - 3);
    const contextEnd = Math.min(depparser.length - 1, i + 3);
    const context = [];
    for (let j = contextStart; j <= contextEnd; j++) {
      if (j !== i) context.push(depparser[j].word);
    }
    const contextText = context.join('');

    // 检查上下文是否包含特定前缀词
    const hasSingerContext = singerPrefixes.some(prefix => contextText.includes(prefix));
    const hasSongContext = songPrefixes.some(prefix => contextText.includes(prefix));
    const hasAlbumContext = albumPrefixes.some(prefix => contextText.includes(prefix));

    // 根据词性和上下文分类
    if (item.postag === 'nr' || item.postag === 'PER') {
      if (hasSingerContext || contextText.includes('的歌')) {
        if (!singers.includes(word)) singers.push(word);
      } else {
        potentialSingers.push({ word, index: i });
      }
    } else if (item.postag === 'n' || item.postag === 'nz') {
      if (hasSongContext && !songs.includes(word)) {
        songs.push(word);
      } else if (hasAlbumContext && !albums.includes(word)) {
        albums.push(word);
      }
    }

    // "xxx的歌"结构检查
    if (i < depparser.length - 2 &&
      depparser[i + 1].word === '的' &&
      (depparser[i + 2].word === '歌' || depparser[i + 2].word === '歌曲')) {
      if (!singers.includes(word)) {
        singers.push(word);
      }
    }
  }

  // 如果没有明确识别的歌手但有潜在歌手，使用首个潜在歌手
  if (singers.length === 0 && potentialSingers.length > 0) {
    singers.push(potentialSingers[0].word);
  }

  return {
    singers,
    songs,
    albums
  };
}

/**
 * 基于提取的音乐实体生成搜索关键词
 * @param {Object} entities 提取的音乐实体
 * @returns {string} 搜索关键词
 */
function generateSearchKeywordFromEntities (entities) {
  const keywords = [];

  // 优先添加歌曲名 - 因为歌曲的优先级应该高于歌手
  if (entities.songs.length > 0) {
    keywords.push(entities.songs[0]);
  }

  // 其次添加歌手
  if (entities.singers.length > 0 && keywords.length < 2) {
    keywords.push(entities.singers[0]);
  }

  // 再添加专辑名
  if (entities.albums.length > 0 && keywords.length < 2) {
    keywords.push(entities.albums[0]);
  }

  // 如果没有找到任何实体关键词，返回空字符串
  if (keywords.length === 0) {
    return '';
  }

  return unique(keywords).join(' ');
}

function unique (arr) {
  return Array.from(new Set(arr))
}

/**
 * 生成最终的音乐关键词
 */
function generateFinalKeywords (sentiment, singers) {
  // 获取情感类型的标签值
  const sentimentTypeLabel = getSentimentType(sentiment);

  // 将标签值映射回键名
  let sentimentType = 'NEUTRAL'; // 默认值

  // 根据标签值查找对应的键名
  if (sentimentTypeLabel === SENTIMENT_TYPES.POSITIVE.label) {
    sentimentType = 'POSITIVE';
  } else if (sentimentTypeLabel === SENTIMENT_TYPES.NEGATIVE.label) {
    sentimentType = 'NEGATIVE';
  } else if (sentimentTypeLabel === SENTIMENT_TYPES.NEUTRAL.label) {
    sentimentType = 'NEUTRAL';
  }

  console.log('[generateFinalKeywords] 情感类型标签:', sentimentTypeLabel);
  console.log('[generateFinalKeywords] 映射后的情感类型键:', sentimentType);

  const config = EMOTION_MUSIC_CONFIG.recommendedMusic[sentimentType];

  let finalKeywords = [];

  // 添加情感相关的关键词 - 使用直接从情感类型推断的关键词
  if (sentimentType === 'POSITIVE') {
    finalKeywords.push('欢快');
  } else if (sentimentType === 'NEGATIVE') {
    finalKeywords.push('治愈');
  } else {
    finalKeywords.push('轻松');
  }

  // 添加音乐风格关键词
  const stylesList = randomList(config.styles);
  finalKeywords.push(stylesList && stylesList.length > 0 ? stylesList[0] : '');

  // 添加歌手名，如果有的话
  if (singers && singers.length > 0) {
    finalKeywords.push(singers[0]);
  }

  // 确保不重复且不为空
  const uniqueKeywords = [...new Set(finalKeywords)].filter(Boolean);

  // 构建音乐元素对象
  const musicElements = {
    genre: finalKeywords[1] || '',
    mood: finalKeywords[0] || '',
    singer: singers && singers.length > 0 ? singers[0] : '',
    topic: ''
  };

  // 对searchKeyword进行进一步确认，确保不会有重复关键词
  return {
    searchKeyword: uniqueKeywords.join(' '),
    musicElements
  };
}

/**
 * 生成默认的音乐推荐
 */
function generateDefaultRecommendation () {
  return {
    searchKeyword: '流行 热门',
    musicElements: {
      mood: '热门',
      genre: '流行',
      singer: '',
      topic: ''
    }
  };
} 