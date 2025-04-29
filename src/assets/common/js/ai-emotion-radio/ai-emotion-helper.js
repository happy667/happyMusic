/**
 * Personalization 组件辅助方法
 */
import { SENTIMENT_TYPES } from './config'

/**
 * 获取情感类型
 * @param {Object} sentiment 情感分析结果
 * @returns {string} 情感类型标签
 */
export function getSentimentType (sentiment) {
  const confidence = sentiment.confidence;

  // 根据置信度划分情感类型
  if (confidence >= 0.8) {
    return SENTIMENT_TYPES.POSITIVE.label;
  } else if (confidence <= 0.4) {
    return SENTIMENT_TYPES.NEGATIVE.label;
  } else {
    return SENTIMENT_TYPES.NEUTRAL.label;
  }
}
/**
 * 获取情感描述
 * @param {Object} sentimentResult - 情感分析结果
 * @returns {string} - 情感描述，更具互动性和亲和力
 */
export function getSentimentDescription (sentimentResult) {
  if (!sentimentResult) return '';

  const sentimentType = getSentimentType(sentimentResult);
  switch (sentimentType) {
    case SENTIMENT_TYPES.NEGATIVE.label:
      return SENTIMENT_TYPES.NEGATIVE.description;
    case SENTIMENT_TYPES.POSITIVE.label:
      return SENTIMENT_TYPES.POSITIVE.description;
    default:
      return SENTIMENT_TYPES.NEUTRAL.description;
  }
}

/**
 * 获取情感类型对应的颜色
 * @param {Object} sentiment 情感分析结果
 * @param {number} alpha 透明度
 * @returns {string} 颜色值
 */
export function getSentimentTypeColor (sentiment, alpha = 1) {
  if (!sentiment) return SENTIMENT_TYPES.NEUTRAL.color;

  // 获取情感类型
  const type = getSentimentType(sentiment);
  let color;

  // 根据情感类型获取颜色
  if (type === SENTIMENT_TYPES.POSITIVE.label) {
    color = SENTIMENT_TYPES.POSITIVE.color;
  } else if (type === SENTIMENT_TYPES.NEGATIVE.label) {
    color = SENTIMENT_TYPES.NEGATIVE.color;
  } else {
    color = SENTIMENT_TYPES.NEUTRAL.color;
  }

  if (alpha !== 1) {
    return adjustColorAlpha(color, alpha);
  }
  return color;
}

/**
 * 获取情感类型对应的文字颜色
 * @param {Object} sentiment 情感分析结果
 * @returns {string} 文字颜色值
 */
export function getSentimentTextColor (sentiment) {
  if (!sentiment) return SENTIMENT_TYPES.NEUTRAL.textColor;

  // 获取情感类型
  const type = getSentimentType(sentiment);

  // 根据情感类型获取文字颜色
  if (type === SENTIMENT_TYPES.POSITIVE.label) {
    return SENTIMENT_TYPES.POSITIVE.textColor;
  } else if (type === SENTIMENT_TYPES.NEGATIVE.label) {
    return SENTIMENT_TYPES.NEGATIVE.textColor;
  } else {
    return SENTIMENT_TYPES.NEUTRAL.textColor;
  }
}

/**
 * 获取情感强度百分比
 * @param {Object} sentiment 情感分析结果
 * @returns {number} 百分比值
 */
export function getSentimentPercentage (sentiment) {
  console.log('sentiment', sentiment);
  return Math.round(sentiment.confidence * 100);
}

/**
 * 调整颜色透明度
 * @param {string} color 颜色值
 * @param {number} alpha 透明度
 * @returns {string} 调整后的颜色值
 */
export function adjustColorAlpha (color, alpha) {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}