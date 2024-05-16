import { Route } from '@/types';
import ofetch from '@/utils/ofetch'; // 统一使用的请求库
import { parseDate } from '@/utils/parse-date'; // 解析日期的工具函数

export const route: Route = {
    path: '/serv/v3/product/list',
    categories: ['programming'],
    example: '/geekbang/serv/v3/product/list',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    radar: [
        {
            source: ['time.geekbang.org/dailylesson/videolist', 'time.geekbang.org/dailylesson', 'time.geekbang.org/'],
        },
    ],
    name: 'Daily Lesson',
    maintainers: ['lyling'],
    handler: async () => {
        const data = await ofetch('https://time.geekbang.org/serv/v3/product/list', {
            headers: {
                accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: {
                type: 'd',
                size: 20,
                prev: 0,
                orderby: 'new', // new:最新， hot:最热
            },
        });

        const items = data.data.list.map((item) => ({
            // 文章标题
            title: item.title,
            // 文章链接
            link: `https://time.geekbang.org/dailylesson/detail/${item.id}`,
            // 文章正文
            description: item.intro_html,
            // 文章发布日期
            pubDate: parseDate(item.ctime * 1000),
            // 如果有的话，文章作者
            author: item.author.name,
            // 如果有的话，文章分类
            category: item.column_type,
        }));

        return {
            // 源标题
            title: `极客时间 - 每日一课`,
            // 源链接
            link: `https://time.geekbang.org/dailylesson/videolist`,
            // 源文章
            item: items,
        };
    },
};
