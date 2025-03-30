import axios from 'axios';

// 从环境变量获取百度地图API密钥
const BAIDU_MAP_AK = process.env.VUE_APP_BAIDU_MAP_AK;

// 创建百度地图专用的axios实例
const baiduMapRequest = axios.create({
  timeout: 5000,
  method: 'get'
});

// 检查API密钥是否存在
if (!BAIDU_MAP_AK) {
  console.error('百度地图API密钥未设置，请在.env文件中设置VUE_APP_BAIDU_MAP_AK环境变量');
}

// 保存百度地图API加载状态的Promise
let loadBMapPromise = null;

/**
 * 加载百度地图API
 * 使用直接加载方式，避免CORS问题
 * @returns {Promise<void>} 百度地图API加载完成的Promise
 */
function loadBaiduMapAPI () {
  console.log('开始加载百度地图API...');

  // 如果已经在加载中，直接返回之前的Promise
  if (loadBMapPromise) {
    return loadBMapPromise;
  }

  // 如果已经加载完成，直接返回resolved Promise
  if (typeof BMap !== 'undefined') {
    console.log('百度地图API已加载，直接使用');
    return Promise.resolve();
  }

  // 创建新的加载Promise
  loadBMapPromise = new Promise((resolve, reject) => {
    // 设置加载超时
    const timeout = setTimeout(() => {
      loadBMapPromise = null;
      reject(new Error('百度地图API加载超时'));
    }, 10000);

    try {
      // 直接加载Baidu地图API (使用环境变量提供的API密钥)
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://api.map.baidu.com/api?v=3.0&ak=${BAIDU_MAP_AK}&callback=BMapCallback&s=1`;
      script.async = true;

      script.onerror = (error) => {
        clearTimeout(timeout);
        console.error('百度地图API加载出错:', error);
        loadBMapPromise = null;
        reject(new Error('百度地图API脚本加载失败，请检查网络连接和API密钥'));
      };

      // 确保全局回调函数已定义
      window.BMapCallback = function () {
        clearTimeout(timeout);

        if (typeof BMap !== 'undefined') {
          console.log('百度地图API成功加载');
          resolve();
        } else {
          loadBMapPromise = null;
          reject(new Error('百度地图API加载失败'));
        }
      };

      document.head.appendChild(script);
      console.log('百度地图API脚本标签已添加');
    } catch (error) {
      clearTimeout(timeout);
      loadBMapPromise = null;
      reject(error);
    }
  });

  return loadBMapPromise;
}

/**
 * 使用百度地图API获取用户当前位置
 * @returns {Promise<Object>} 包含经纬度的位置对象
 */
async function getCurrentLocation () {
  // 先检查API密钥
  if (!BAIDU_MAP_AK) {
    throw new Error('百度地图API密钥未设置');
  }

  try {
    // 加载百度地图API
    await loadBaiduMapAPI();

    return new Promise((resolve, reject) => {
      try {
        console.log('使用百度地图API进行定位...');

        // 创建一个简单的本地城市搜索实例进行IP定位
        const myCity = new BMap.LocalCity();

        // 使用IP定位获取城市级别位置
        myCity.get(result => {
          console.log('百度地图LocalCity API返回结果:', result);

          if (result && result.center) {
            resolve({
              latitude: result.center.lat,
              longitude: result.center.lng,
              city: result.name,
              isIPLocation: true  // 标记这是IP定位结果
            });
          } else {
            console.warn('LocalCity API未返回有效结果');
            // 返回默认位置（北京）
            resolve({
              latitude: 39.9042,
              longitude: 116.4074,
              isDefaultLocation: true
            });
          }
        });
      } catch (error) {
        console.error('百度地图定位过程发生错误:', error);
        // 出错时返回默认位置
        resolve({
          latitude: 39.9042,
          longitude: 116.4074,
          isDefaultLocation: true
        });
      }
    });
  } catch (loadError) {
    console.error('百度地图API加载失败:', loadError);
    return {
      latitude: 39.9042,
      longitude: 116.4074,
      isDefaultLocation: true
    };
  }
}

/**
 * 根据坐标获取位置信息
 * @param {number} latitude - 纬度
 * @param {number} longitude - 经度
 * @returns {Promise<Object>} 位置信息对象
 */
async function getLocationInfo (latitude, longitude) {
  try {
    // 使用百度地图逆地理编码API获取位置信息，需要添加ak参数
    const url = `/api/baiduMap/reverse_geocoding/v3/?ak=${BAIDU_MAP_AK}&output=json&location=${latitude},${longitude}`;
    console.log(`请求位置信息: ${url}`);

    const response = await baiduMapRequest.get(url);

    if (response.data && response.data.status === 0) {
      return response.data.result;
    } else {
      console.warn('逆地理编码失败:', response.data);
      throw new Error('获取位置信息失败');
    }
  } catch (error) {
    console.error('获取位置信息请求失败:', error);
    throw error;
  }
}

/**
 * 判断位置是城市还是乡村
 * @param {Object} locationInfo - 百度地图API返回的位置信息
 * @returns {string} 区域类型，'urban'表示城市，'rural'表示乡村
 */
function determineAreaTypeFromLocation (locationInfo) {
  // 如果位置信息不存在或缺少必要组件，默认为城市
  if (!locationInfo || !locationInfo.addressComponent) {
    console.warn('位置信息不完整，使用默认区域类型(urban)');
    return 'urban';
  }

  const addressComponent = locationInfo.addressComponent;

  // 判断区域类型的规则:

  // 规则1：明确的乡村标识 - 如果地址中包含"乡"、"村"等明显的乡村标识
  if ((addressComponent.town && /乡|镇|村/.test(addressComponent.town)) ||
    (addressComponent.village && addressComponent.village.length > 0)) {
    console.log('区域判定为乡村(rural): 存在乡/镇/村标识');
    return 'rural';
  }

  // 规则2：县级行政区 - 通常县域为乡村
  if (addressComponent.district && addressComponent.district.includes('县')) {
    // 但如果是县城（县政府所在地），通常更接近城市环境
    if (addressComponent.town && (
      addressComponent.town.includes('县城') ||
      addressComponent.town.includes('政府') ||
      addressComponent.town.includes('行政') ||
      addressComponent.business && addressComponent.business.includes('中心'))) {
      console.log('区域判定为城市(urban): 县城或行政中心区域');
      return 'urban';
    }
    console.log('区域判定为乡村(rural): 县域区域');
    return 'rural';
  }

  // 规则3：明确的城市标识 - 市区、商业区等
  if ((addressComponent.city && addressComponent.city.length > 0) &&
    (!addressComponent.town || !addressComponent.village)) {
    // 如果有商业区信息，更可能是城市
    if (addressComponent.business && addressComponent.business.length > 0) {
      console.log('区域判定为城市(urban): 市区+商业区');
      return 'urban';
    }
    console.log('区域判定为城市(urban): 市区无乡镇或村庄标识');
    return 'urban';
  }

  // 默认情况：如无法确定，默认为城市
  console.log('无法明确判断区域类型，使用默认值(urban)');
  return 'urban';
}

export default {
  /**
   * 获取用户位置
   * @returns {Promise<Object>} 包含经纬度的位置对象
   */
  async getLocation () {
    try {
      // 尝试使用百度地图API获取位置
      const location = await getCurrentLocation();

      // 记录位置来源
      if (location.isIPLocation) {
        console.info(`使用IP定位获取到位置: 城市=${location.city}, 坐标=(${location.latitude}, ${location.longitude})`);
      } else if (location.isDefaultLocation) {
        console.info('使用默认位置（北京市中心）');
      } else {
        console.info(`获取到位置坐标: (${location.latitude}, ${location.longitude})`);
      }

      return location;
    } catch (error) {
      console.error('所有定位方法都失败:', error);

      // 当所有定位方法都失败时，返回默认位置
      console.info('使用默认位置（北京市中心）');
      return {
        latitude: 39.9042,
        longitude: 116.4074,
        isDefaultLocation: true
      };
    }
  },

  /**
   * 获取区域类型（城市或乡村）
   * @param {number} latitude - 纬度
   * @param {number} longitude - 经度
   * @param {boolean} isDefaultLocation - 是否为默认位置
   * @returns {Promise<string>} 区域类型 ('urban'或'rural')
   */
  async getAreaType (latitude, longitude, isDefaultLocation) {
    // 参数验证
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      console.error('getAreaType参数错误: 纬度和经度必须是数字类型', { latitude, longitude });
      return 'urban'; // 出错时默认返回城市类型
    }

    // 如果是默认位置（北京市中心），直接返回urban
    if (isDefaultLocation) {
      console.log('使用默认位置的区域类型: urban（城市）');
      return 'urban';
    }

    try {
      // 如果API密钥缺失，直接返回默认值
      if (!BAIDU_MAP_AK) {
        console.warn('百度地图API密钥未设置，使用默认区域类型');
        return 'urban';
      }

      console.log(`开始获取位置信息，坐标：纬度=${latitude}, 经度=${longitude}`);

      // 添加性能计时
      const startTime = Date.now();

      // 获取位置详细信息
      const locationInfo = await getLocationInfo(latitude, longitude);

      // 计算API调用耗时
      const apiTime = Date.now() - startTime;
      console.log(`获取位置信息成功，耗时：${apiTime}ms`);

      // 记录获取到的位置概要信息
      if (locationInfo && locationInfo.formatted_address) {
        console.log(`位置地址: ${locationInfo.formatted_address}`);
      }

      // 判断区域类型
      const areaType = determineAreaTypeFromLocation(locationInfo);
      console.log(`最终确定区域类型: ${areaType} (${areaType === 'urban' ? '城市' : '乡村'})`);

      return areaType;
    } catch (error) {
      console.warn('获取区域类型失败:', error);

      // 记录更详细的错误信息
      if (error.response) {
        console.error('百度地图API响应错误:', {
          status: error.response.status,
          data: error.response.data
        });
      } else if (error.request) {
        console.error('百度地图API请求错误:', error.request);
      } else {
        console.error('百度地图API错误:', error.message);
      }

      return 'urban'; // 出错时默认返回城市类型
    }
  }
}; 