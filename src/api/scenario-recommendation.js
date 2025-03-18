import request from '@/axios/request.js' // 场景三元组生成器（简化版）
async function getSceneTriad() {
    // 时间维度（4时段）
    const hour = new Date().getHours();
    const timePhase = ["深夜", "早晨", "白天", "傍晚"][Math.floor(hour / 6)];

    // 地点维度（逆地理编码免费方案）
    const pos = await getPosition(); // 封装定位函数
    const address = await (await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.lat}&lon=${pos.lon}&format=json`)).json();
    const locationType = address.address.office ? "办公区" :
        address.address.residential ? "住宅区" :
        address.address.road ? "街道区" : "其他";

    // 天气维度（兼容API失效的降级方案）
    let weatherType = "晴";
    try {
        const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.lat}&longitude=${pos.lon}&current_weather=true`);
        weatherType = parseWeatherCode(weather.current_weather.weathercode);
    } catch {
        weatherType = new Date().getMonth() < 6 ? "晴" : "雨";
    }

    return { timePhase, locationType, weatherType };
}

// 智能推荐策略库（示例）
const strategyMap = {
    // 通勤场景
    "早晨|街道区|晴": {
        params: { type: "playlist", keyword: "通勤正能量" },
        fallback: "/toplist?id=3" // 网易云飙升榜
    },

    // 办公场景
    "白天|办公区|阴": {
        params: { cat: "轻音乐", order: "hot" },
        filter: song => song.duration < 300 // 过滤长于5分钟的歌曲
    },

    // 宅家场景
    "傍晚|住宅区|雨": {
        params: { type: "dj", radio: "助眠" },
        special: "mix_rain=true" // 混合雨声音效
    }
};

// 执行推荐逻辑
export default {
    async recommend() {
        const scene = await getSceneTriad();
        const strategy = strategyMap[`${scene.timePhase}|${scene.locationType}|${scene.weatherType}`];

        try {
            const data = await fetchNetEaseAPI(strategy.params);
            return strategy.filter ? data.filter(strategy.filter) : data;
        } catch {
            return await fetchFallback(strategy.fallback);
        }
    }
}