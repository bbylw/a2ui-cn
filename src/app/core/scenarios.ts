export const BASIC_CATALOG_ID = 'https://a2ui.org/specification/v1_0/catalogs/basic/catalog.json';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  messages: Record<string, unknown>[];
}

const flight: Scenario = {
  id: 'flight',
  name: '航班预订',
  description: '智能体查询航班后，流式构建预订界面；乘客人数本地绑定，确认时回传 action。',
  messages: [
    {
      version: '1.0',
      createSurface: {surfaceId: 'flight-demo', catalogId: BASIC_CATALOG_ID},
    },
    {
      version: '1.0',
      updateComponents: {
        surfaceId: 'flight-demo',
        components: [
          {id: 'root', component: 'Column', children: ['head', 'route_card', 'pax_card', 'confirm']},
          {id: 'head', component: 'Text', text: '预订你的航班', weight: 700},
        ],
      },
    },
    {
      version: '1.0',
      updateComponents: {
        surfaceId: 'flight-demo',
        components: [
          {id: 'route_card', component: 'Card', child: 'route_col'},
          {id: 'route_col', component: 'Column', children: ['out_row', 'route_div', 'ret_row']},
          {id: 'out_row', component: 'Row', justify: 'spaceBetween', align: 'center', children: ['out_info', 'out_price']},
          {id: 'out_info', component: 'Column', children: ['out_flight', 'out_route']},
          {id: 'out_flight', component: 'Text', text: 'LH 454 · 直飞', weight: 600},
          {id: 'out_route', component: 'Text', text: '柏林 BER → 旧金山 SFO', variant: 'caption'},
          {id: 'out_price', component: 'Text', text: {'@path': '/outbound/price'}, weight: 700},
          {id: 'route_div', component: 'Divider'},
          {id: 'ret_row', component: 'Row', justify: 'spaceBetween', align: 'center', children: ['ret_info', 'ret_price']},
          {id: 'ret_info', component: 'Column', children: ['ret_flight', 'ret_route']},
          {id: 'ret_flight', component: 'Text', text: 'UA 901 · 直飞', weight: 600},
          {id: 'ret_route', component: 'Text', text: '旧金山 SFO → 柏林 BER', variant: 'caption'},
          {id: 'ret_price', component: 'Text', text: {'@path': '/return/price'}, weight: 700},
        ],
      },
    },
    {
      version: '1.0',
      updateDataModel: {
        surfaceId: 'flight-demo',
        path: '/',
        value: {outbound: {pax: 1, price: '$455'}, return: {pax: 2, price: '$970'}},
      },
    },
    {
      version: '1.0',
      updateComponents: {
        surfaceId: 'flight-demo',
        components: [
          {id: 'pax_card', component: 'Card', child: 'pax_col'},
          {id: 'pax_col', component: 'Column', children: ['pax_title', 'out_slider', 'ret_slider']},
          {id: 'pax_title', component: 'Text', text: '乘客人数', variant: 'caption'},
          {id: 'out_slider', component: 'Slider', label: '去程', min: 1, max: 6, value: {'@path': '/outbound/pax'}},
          {id: 'ret_slider', component: 'Slider', label: '返程', min: 1, max: 6, value: {'@path': '/return/pax'}},
        ],
      },
    },
    {
      version: '1.0',
      updateComponents: {
        surfaceId: 'flight-demo',
        components: [
          {id: 'confirm_label', component: 'Text', text: '确认预订'},
          {
            id: 'confirm',
            component: 'Button',
            variant: 'primary',
            child: 'confirm_label',
            action: {
              event: {
                name: 'confirm_booking',
                userMessage: '确认预订航班',
                context: {outboundPax: {'@path': '/outbound/pax'}, returnPax: {'@path': '/return/pax'}},
              },
            },
          },
        ],
      },
    },
    {
      version: '1.0',
      updateDataModel: {surfaceId: 'flight-demo', path: '/outbound/price', value: '$428'},
    },
  ],
};

const restaurant: Scenario = {
  id: 'restaurant',
  name: '餐厅订位',
  description: '表单控件全部绑定本地数据模型，提交时一次性解析上下文回传智能体。',
  messages: [
    {
      version: '1.0',
      createSurface: {surfaceId: 'restaurant-demo', catalogId: BASIC_CATALOG_ID},
    },
    {
      version: '1.0',
      updateComponents: {
        surfaceId: 'restaurant-demo',
        components: [
          {id: 'root', component: 'Column', children: ['head', 'name_field', 'time_field', 'party_picker', 'highchair', 'submit']},
          {id: 'head', component: 'Text', text: '预订今晚的餐位', weight: 700},
          {id: 'name_field', component: 'TextField', label: '预订人姓名', placeholder: '例如：林致远', variant: 'shortText', value: {'@path': '/name'}},
          {id: 'time_field', component: 'DateTimeInput', label: '到店时间', enableDate: true, enableTime: true, value: {'@path': '/time'}},
        ],
      },
    },
    {
      version: '1.0',
      updateDataModel: {
        surfaceId: 'restaurant-demo',
        path: '/',
        value: {name: '', time: '2026-11-12T19:00', party: ['2'], highChair: false},
      },
    },
    {
      version: '1.0',
      updateComponents: {
        surfaceId: 'restaurant-demo',
        components: [
          {
            id: 'party_picker',
            component: 'ChoicePicker',
            label: '用餐人数',
            variant: 'mutuallyExclusive',
            displayStyle: 'chips',
            options: [
              {label: '2 位', value: '2'},
              {label: '4 位', value: '4'},
              {label: '6 位', value: '6'},
              {label: '8 位', value: '8'},
            ],
            value: {'@path': '/party'},
          },
          {id: 'highchair', component: 'CheckBox', label: '需要儿童座椅', value: {'@path': '/highChair'}},
        ],
      },
    },
    {
      version: '1.0',
      updateComponents: {
        surfaceId: 'restaurant-demo',
        components: [
          {id: 'submit_label', component: 'Text', text: '提交订位'},
          {
            id: 'submit',
            component: 'Button',
            variant: 'primary',
            child: 'submit_label',
            action: {
              event: {
                name: 'reserve_table',
                userMessage: '提交餐厅订位',
                context: {
                  name: {'@path': '/name'},
                  time: {'@path': '/time'},
                  party: {'@path': '/party'},
                  highChair: {'@path': '/highChair'},
                },
              },
            },
          },
        ],
      },
    },
  ],
};

const dashboard: Scenario = {
  id: 'dashboard',
  name: '增长看板',
  description: 'Tabs 组织多组指标，数据模型增量更新，绑定文本原地刷新。',
  messages: [
    {
      version: '1.0',
      createSurface: {surfaceId: 'dashboard-demo', catalogId: BASIC_CATALOG_ID},
    },
    {
      version: '1.0',
      updateComponents: {
        surfaceId: 'dashboard-demo',
        components: [
          {id: 'root', component: 'Column', children: ['head', 'tabs']},
          {id: 'head', component: 'Text', text: '增长看板 · 11 月', weight: 700},
          {
            id: 'tabs',
            component: 'Tabs',
            tabs: [
              {title: '核心指标', child: 'metrics_col'},
              {title: '渠道明细', child: 'channel_list'},
            ],
          },
        ],
      },
    },
    {
      version: '1.0',
      updateComponents: {
        surfaceId: 'dashboard-demo',
        components: [
          {id: 'metrics_col', component: 'Column', children: ['m_row1', 'm_row2', 'goal_slider']},
          {id: 'm_row1', component: 'Row', children: ['card_users', 'card_orders']},
          {id: 'card_users', component: 'Card', child: 'cu_col'},
          {id: 'cu_col', component: 'Column', children: ['cu_label', 'cu_value']},
          {id: 'cu_label', component: 'Text', text: '活跃用户', variant: 'caption'},
          {id: 'cu_value', component: 'Text', text: {'@path': '/users'}, weight: 700},
          {id: 'card_orders', component: 'Card', child: 'co_col'},
          {id: 'co_col', component: 'Column', children: ['co_label', 'co_value']},
          {id: 'co_label', component: 'Text', text: '今日订单', variant: 'caption'},
          {id: 'co_value', component: 'Text', text: {'@path': '/orders'}, weight: 700},
          {id: 'm_row2', component: 'Row', children: ['card_conv', 'card_gmv']},
          {id: 'card_conv', component: 'Card', child: 'cv_col'},
          {id: 'cv_col', component: 'Column', children: ['cv_label', 'cv_value']},
          {id: 'cv_label', component: 'Text', text: '转化率', variant: 'caption'},
          {id: 'cv_value', component: 'Text', text: {'@path': '/conversion'}, weight: 700},
          {id: 'card_gmv', component: 'Card', child: 'gm_col'},
          {id: 'gm_col', component: 'Column', children: ['gm_label', 'gm_value']},
          {id: 'gm_label', component: 'Text', text: '成交额', variant: 'caption'},
          {id: 'gm_value', component: 'Text', text: {'@path': '/gmv'}, weight: 700},
          {id: 'goal_slider', component: 'Slider', label: '月度目标完成度 (%)', min: 0, max: 100, value: {'@path': '/progress'}},
        ],
      },
    },
    {
      version: '1.0',
      updateComponents: {
        surfaceId: 'dashboard-demo',
        components: [
          {id: 'channel_list', component: 'List', direction: 'vertical', children: ['ch1', 'ch2', 'ch3']},
          {id: 'ch1', component: 'Row', justify: 'spaceBetween', children: ['ch1_label', 'ch1_value']},
          {id: 'ch1_label', component: 'Text', text: '自然搜索'},
          {id: 'ch1_value', component: 'Text', text: {'@path': '/channels/search'}, weight: 600},
          {id: 'ch2', component: 'Row', justify: 'spaceBetween', children: ['ch2_label', 'ch2_value']},
          {id: 'ch2_label', component: 'Text', text: '社交媒体'},
          {id: 'ch2_value', component: 'Text', text: {'@path': '/channels/social'}, weight: 600},
          {id: 'ch3', component: 'Row', justify: 'spaceBetween', children: ['ch3_label', 'ch3_value']},
          {id: 'ch3_label', component: 'Text', text: '直接访问'},
          {id: 'ch3_value', component: 'Text', text: {'@path': '/channels/direct'}, weight: 600},
        ],
      },
    },
    {
      version: '1.0',
      updateDataModel: {
        surfaceId: 'dashboard-demo',
        path: '/',
        value: {
          users: '12,480',
          orders: '1,842',
          conversion: '3.6%',
          gmv: '¥286,400',
          progress: 68,
          channels: {search: '5,230', social: '3,910', direct: '3,340'},
        },
      },
    },
    {
      version: '1.0',
      updateDataModel: {surfaceId: 'dashboard-demo', path: '/orders', value: '1,907'},
    },
    {
      version: '1.0',
      updateDataModel: {surfaceId: 'dashboard-demo', path: '/progress', value: 72},
    },
  ],
};

export const SCENARIOS: Scenario[] = [flight, restaurant, dashboard];

export function scenarioById(id: string): Scenario {
  return SCENARIOS.find(s => s.id === id) ?? SCENARIOS[0];
}

export {messageType} from './message-type';