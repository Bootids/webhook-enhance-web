import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import hash from 'hash.js';
import NProgress from 'nprogress';
import CommonUtil from "./CommonUtil";

const defaultCache: boolean = false;
const defaultExpiry: number = 60;
axios.defaults.timeout = 5000;

const CodeMessage: any = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    405: '请求方法与服务器不匹配。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

enum ContentType {
    formUrlencoded = "application/x-www-form-urlencoded;charset=UTF-8",
    formData = "multipart/form-data;charset=UTF-8",
    textPlain = "text/plain;charset=UTF-8",
    json = "application/json;charset=UTF-8",
    javascript = "application/javascript;charset=UTF-8",
    xml = "application/xml;charset=UTF-8"
}

/**
 * @param url 请求地址
 * @param method 请求方法 {@see HttpMethod}
 * @param data 请求参数
 * @param ContentType {@see ContentType}
 * @param timeout 超时时间(ms)
 * @param expiry 缓存过期时间(s)
 */
interface RequestOption<T, S> {
    url: string;
    method: "GET" | "POST" | "DELETE" | "PUT";
    data?: S;
    contentType?: ContentType;
    timeout?: number;
    cache?: boolean;
    expiry?: number;
}

axios.interceptors.request.use((config) => {
    NProgress.start();
    return config;
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
    NProgress.done();
    return response;
}, (error) => {
    NProgress.done();
    return Promise.reject(error);
});

const checkStatus = (response: AxiosResponse) => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const errorText = CodeMessage[response.status] || response.statusText;
    const error = new Error(errorText);
    error.name = response.status.toString(10);
    throw error;
};

/**
 *
 * @param response
 * @param hashcode
 */
const cachedSave = (response: AxiosResponse, hashcode: string) => {
    const contentType = response.headers['content-type'];
    if (contentType && contentType.match(/application\/json/i)) {
        try {
            sessionStorage.setItem(hashcode, JSON.stringify(CommonUtil.clone(response.data)));
            sessionStorage.setItem(`${hashcode}:timestamp`, Date.now().toString());
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                sessionStorage.clear();
                sessionStorage.setItem(hashcode, JSON.stringify(CommonUtil.clone(response.data)));
                sessionStorage.setItem(`${hashcode}:timestamp`, Date.now().toString());
            }
        }
    }
};

/**
 *
 * @param option {@see RequestOptions}
 */
function request<T, S>(option: RequestOption<T, S>): Promise<T> {
    const axiosRequestConfig: AxiosRequestConfig = {
        url: option.url,
        method: option.method,
        data: option.data,
        headers: {
            "Content-Type": option.contentType ? option.contentType : "application/json;charset=UTF-8"
        },
        timeout: option.timeout
    };
    const cache = option.cache !== undefined ? option.cache : defaultCache;
    const expiry = option.expiry ? option.expiry : defaultExpiry;
    const hashcode: string = hash
        .sha256()
        .update(JSON.stringify(axiosRequestConfig))
        .digest('hex');
    if (cache) {
        const cachedData = sessionStorage.getItem(`${hashcode}`);
        const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
        if (cachedData !== null && whenCached !== null) {
            const age = (Date.now() - new Date(parseInt(whenCached, 10)).getTime()) / 1000;
            if (age < expiry) {
                console.log(
                    `%c【${option.method} ${option.url}】命中Cache\n响应数据：%O`,
                    "color:#32CD32", JSON.parse(cachedData));
                return new Promise(((resolve: any) => {
                    resolve(JSON.parse(cachedData));
                }))
            }
            sessionStorage.removeItem(hashcode);
            sessionStorage.removeItem(`${hashcode}:timestamp`);
        }
    }
    return new Promise((resolve => {
        axios(axiosRequestConfig)
            .then((response: AxiosResponse<T>) => {
                if (cache) {
                    cachedSave(response, hashcode);
                }
                checkStatus(response);
                // >>>>>>>>>>>>>> 请求成功 <<<<<<<<<<<<<<
                if (option.data) {
                    console.log(
                        `%c【${option.method} ${option.url}】请求成功\n请求数据：%O\n响应数据：%O`,
                        "color:#32CD32", option.data, response.data);
                } else {
                    console.log(
                        `%c【${option.method} ${option.url}】请求成功\n响应数据：%O`,
                        "color:#32CD32", response.data);
                }
                resolve(response.data);
            })
            .catch((e: any) => {
                // >>>>>>>>>>>>>> 请求失败 <<<<<<<<<<<<<<
                if (option.data) {
                    console.log(
                        `%c【${option.method} ${option.url}】请求失败\n请求数据：%O\n响应数据：%O`,
                        "color:#B22222", option.data, e);
                } else {
                    console.log(
                        `%c【${option.method} ${option.url}】请求失败\n响应数据：%O`,
                        "color:#B22222", e);
                }
            })
    }))
}

export {ContentType, RequestOption, request}
