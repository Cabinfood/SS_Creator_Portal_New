import { CEApiClient } from "@cabineat/utilities/api-client";
import { keys } from "lodash";
import * as moment from "moment";
import { FB_APP } from "../config";


export default class FacebookApiClient {
  static initializedSdk = false;
  static apiClient = new CEApiClient({
    host: FB_APP.GRAPH_API_HOST,
    log: true,
  });

  /**
   *
   * @param {*} options: { appId: string, version: string }
   * @returns boolean
   */
  static initializeSdkOnClient(options) {
    if (typeof FB === "undefined") {
      return false;
    }

    FB.init({
      appId: options.appId,
      status: true,
      xfbml: true,
      version: options.version,
    });
    this.initializedSdk = true;
    return true;
  }

  /**
   *
   * @param {*} options: { scope?: string }
   * @returns Promise<{ data: { accessToken: string, userID: string, profile: any } | null, error: { code: string, msg: string } | null}>
   */
  static async loginOnClient(options) {
    return new Promise(async (resolve) => {
      if (!this.initializedSdk) {
        return resolve({
          data: null,
          error: {
            code: "SDK_NOT_INIT",
            msg: "SDK is not inited",
          },
        });
      }

      FB.login(
        (res) => {
          if (res?.status !== "connected") {
            resolve({
              data: null,
              error: {
                code: "LOGIN_FAILED",
                msg: "Login failed",
              },
            });
          }

          const { accessToken, userID } = res?.authResponse || {};
          FB.api("/me", (meRes) => {
            resolve({
              data: {
                accessToken,
                userID,
                profile: meRes,
              },
              error: null,
            });
          });
        },
        {
          ...(options?.scope ? { scope: options.scope } : {}),
        }
      );
    });
  }

  /**
   *
   * @param {*} options: { accessToken: string }
   * @returns Promise<{ data: { longLiveAccessToken: string, expiresIn?: number } | null, error: { code: string, msg: string } | null}>
   */
  static getLongLiveUserAccessToken(options) {
    return this.apiClient
      .wrapResponse(
        this.apiClient.asyncGet(
          `/${FB_APP.GRAPH_API_VERSION}/oauth/access_token`,
          {
            grant_type: "fb_exchange_token",
            client_id: FB_APP.ID,
            client_secret: FB_APP.SECRET,
            fb_exchange_token: options?.accessToken,
          }
        )
      )
      .then(({ success, data, error }) => {
        if (success) {
          return {
            data: {
              longLiveAccessToken: data?.access_token,
              expiresIn: data?.expires_in,
            },
            error: null,
          };
        }

        console.error(error);
        return {
          data: null,
          error: {
            code: "ERROR",
            msg: "Error",
          },
        };
      });
  }

  /**
   *
   * @param {*} options: { accessToken: string, pageId: string }
   * @returns Promise<{ data: any | null, error: { code: string, msg: string } | null}>
   */
  static async getPageDetail(options) {
    const fields = [
      "access_token",
      "name",
      "username",
      "cover",
      "picture",
      "verification_status",
      "description",
      "is_published",
      "about",
      "website",
      "link",
      "category_list",
      "fan_count",
      "followers_count",      
    ].join(",");

    return this.apiClient
      .wrapResponse(
        this.apiClient.asyncGet(`/${options?.pageId}`, {
          fields,
          access_token: options?.accessToken,
        })
      )
      .then(({ success, data, error }) => {
        if (success) {
          return {
            data,
            error: null,
          };
        }

        console.error(error);
        return {
          data: null,
          error: true,
        };
      });
  }

  /**
   *
   * @param {*} options: { accessToken: string, pageId: string }
   * @returns Promise<{ data: { longLiveAccessToken: string } | null, error: { code: string, msg: string } | null}>
   */
  static getLongLivePageAccessToken(options) {
    return this.getPageDetail(options).then(({ data, error }) => {
      if (data && !error) {
        return {
          data: {
            longLiveAccessToken: data?.access_token,
          },
          error,
        };
      }
    });
  }

  /**
   *
   * @param {*} options: { after?: string, limit?: number }
   * @returns Promise<{data: { pages: any[], nextCursor?: string | null } | null, error: { code: string, msg: string } | null}>
   */
  static getPagesManagedByUserOnClient(options = {}) {
    return new Promise(async (resolve) => {
      if (!this.initializedSdk) {
        return resolve({
          data: null,
          error: {
            code: "SDK_NOT_INIT",
            msg: "SDK is not inited",
          },
        });
      }

      FB.api(
        "/me/accounts",
        "get",
        {
          fields:
            "name,username,tasks,fan_count,about,cover,picture,verification_status,description,is_published,access_token",
          ...(options?.after
            ? {
                after: options.after,
              }
            : {}),
          ...(options?.limit
            ? {
                limit: options.limit,
              }
            : {}),
        },
        (res) => {
          resolve({
            data: {
              pages: res?.data || [],
              nextCursor: res?.paging?.next
                ? res?.paging?.cursors?.after
                : null,
            },
            error: null,
          });
        }
      );
    });
  }

  /**
   *
   * @returns Promise<{data: { pages: any[] } | null, error: { code: string, msg: string } | null}>
   */
  static async getAllPagesManagedByUserOnClient() {
    const pages = [];
    const nextCursor = null;

    while (1) {
      const { data, error } = await this.getPagesManagedByUserOnClient({
        after: nextCursor,
      });

      if (error) {
        return {
          data: null,
          error,
        };
      }

      pages.push(...(data?.pages || []));

      if (data?.nextCursor) {
        nextCursor = data?.nextCursor;
      } else {
        break;
      }
    }

    return {
      data: {
        pages,
      },
      error: null,
    };
  }

  static getPostIdFromUrl(url) {
    if (!url) return null;

    const matched = (url.match(/(posts|videos)\/[0-9]+/) || [])[0];

    if (!matched) {
      return null;
    }

    return matched.replace(/(posts|videos)\//, "");
  }

  static standardInsights(data) {
    const ret = {};

    for (const item of data || []) {
      switch (item?.name) {
        case "post_video_views":
          ret.postVideoViews = item?.values?.[0]?.value || 0;
          break;
        case "post_activity_by_action_type":
          ret.postActivityByActionType = {
            share: item?.values?.[0]?.value?.share || 0,
            comment: item?.values?.[0]?.value?.comment || 0,
            reaction: item?.values?.[0]?.value?.like || 0,
          };
          break;
        case "post_impressions_unique":
          ret.postImpressionsUnique = item?.values?.[0]?.value || 0;
          break;
        case "post_reactions_by_type_total":
          ret.postReactionsByTypeTotal = {
            like: item?.values?.[0]?.value?.like || 0,
            love: item?.values?.[0]?.value?.love || 0,
            wow: item?.values?.[0]?.value?.wow || 0,
            sorry: item?.values?.[0]?.value?.sorry || 0,
          };
          break;
        case "post_activity":
          ret.postActivity = item?.values?.[0]?.value || 0;
      }
    }
  }

  /**
   *
   * @param {*} objectId : string
   * @param {*} accessToken : string
   * @param {*} options : {
   *    metric: string,
   *    period?: 'day' | 'week' | 'days_28' | 'month' | 'lifetime',
   *    since?: Date,
   *    until?: Date
   *    data_preset?: string
   * }
   */
  static async getInsights(objectId, accessToken, options) {
    const { success, data, error } = await this.apiClient.wrapResponse(
      this.apiClient.asyncGet(
        `/${FB_APP.GRAPH_API_VERSION}/${objectId}/insights`,
        {
          access_token: accessToken,
          metric: options.metric,
          ...(options?.period ? { period: options.period } : {}),
          ...(options?.since ? { since: options.since } : {}),
          ...(options?.until ? { until: options.until } : {}),
        }
      )
    );

    if (!success) {
      console.error(error, data?.error);
      return null;
    }

    return data?.data || {};
  }

  static async getPostInsightWithLifetimePeriod(pageId, postId, accessToken) {
    const ret = {
      reaction_quantity: null,
      comment_quantity: null,
      share_quantity: null,
      impression_quantity: null,
      unique_impression_quantity: null,
      engaged_user_quantity: null,
      click_quantity: null,
      unique_click_quantity: null,
      post_video_views: null,
      post_video_ad_break_earnings: null,
      post_video_ad_break_ad_cpm: null,
      post_video_ad_break_ad_impressions: null,
    };
    const metric = [
      "post_engaged_users",
      "post_clicks",
      "post_clicks_unique",
      "post_impressions",
      "post_impressions_unique",
      // "post_reactions_by_type_total",
      "post_activity_by_action_type",
      "post_video_views",
      "post_video_ad_break_earnings",
      "post_video_ad_break_ad_cpm",
      "post_video_ad_break_ad_impressions"
    ].join(",");
    const metricToFieldMapping = {
      post_engaged_users: "engaged_user_quantity",
      post_clicks: "click_quantity",
      post_clicks_unique: "unique_click_quantity",
      post_impressions: "impression_quantity",
      post_impressions_unique: "unique_impression_quantity",
      post_video_views: "post_video_views",
      post_video_ad_break_earnings: "post_video_ad_break_earnings",
      post_video_ad_break_ad_cpm: "post_video_ad_break_ad_cpm",
      post_video_ad_break_ad_impressions: "post_video_ad_break_ad_impressions"
    };

    const data = await this.getInsights(`${pageId}_${postId}`, accessToken, {
      metric,
      period: "lifetime",
    });

    if (!data) {
      return {
        error: true,
        data: null,
      };
    }
    for (const item of data || []) {
      switch (item?.name) {
        case "post_engaged_users":
        case "post_impressions":
        case "post_impressions_unique":
        case "post_video_views":
        case "post_video_ad_break_earnings":
        case "post_video_ad_break_ad_cpm":
        case "post_video_ad_break_ad_impressions":
          ret[metricToFieldMapping[item?.name]] = item?.values?.[0]?.value || null;
          break;
        case "post_activity_by_action_type":
          ret.reaction_quantity = item?.values?.[0]?.value?.like || null;
          ret.comment_quantity = item?.values?.[0]?.value?.comment || null;
          ret.share_quantity = item?.values?.[0]?.value?.share || null;
          break;
      }
    }

    return {
      error: false,
      data: ret,
    };
  }

  static async getPageInsightByDay(pageId, accessToken) {
    const ret = {
      latest_page_follows_quantity: 0,
      total_engaged_user_quantity: 0,
      total_page_post_engagements_quantity: 0,
      total_page_impressions_quantity: 0,
      total_page_impressions_unique_quantity: 0,
      total_page_post_impressions_quantity: 0,
      total_page_post_impressions_unique_quantity: 0,
      total_page_post_reactions_quantity: 0,
      latest_page_fans_quantity: 0,
      total_page_fan_adds_quantity: 0,
      total_page_fan_adds_unique_quantity: 0,
      latest_fans_by_cities: {},
      latest_fans_by_ages: {},
      total_page_views_quantity: 0,
      since: 0,
      until: 0,
    };
    const metric = [
      "page_follows",
      "page_engaged_users",
      "page_post_engagements",
      "page_impressions",
      "page_impressions_unique",
      "page_posts_impressions",
      "page_posts_impressions_unique",
      "page_actions_post_reactions_total",
      "page_fans",
      "page_fan_adds",
      "page_fan_adds_unique",
      "page_fans_city",
      "page_fans_gender_age",
      "page_views_total",
    ].join(",");
    const metricToFieldMapping = {
      page_follows: "latest_page_follows_quantity",
      page_engaged_users: "total_engaged_user_quantity",
      page_post_engagements: "total_page_post_engagements_quantity",
      page_impressions: "total_page_impressions_quantity",
      page_impressions_unique: "total_page_impressions_unique_quantity",
      page_posts_impressions: "total_page_post_impressions_quantity",
      page_posts_impressions_unique:
        "total_page_post_impressions_unique_quantity",
      page_actions_post_reactions_total: "total_page_post_reactions_quantity",
      page_fans: "latest_page_fans_quantity",
      page_fan_adds: "total_page_fan_adds_quantity",
      page_fan_adds_unique: "total_page_fan_adds_unique_quantity",
      page_fans_city: "latest_fans_by_cities",
      page_fans_gender_age: "latest_fans_by_ages",
      page_views_total: "total_page_views_quantity",
    };
    const mNow = moment();
    const until = Math.round(mNow.toDate().getTime() / 1000);
    const since = Math.round(
      mNow
        .set("dates", mNow.get("dates") - 30)
        .set("hours", 0)
        .set("minutes", 0)
        .set("seconds", 0)
        .toDate()
        .getTime() / 1000
    );
    const data = await this.getInsights(pageId, accessToken, {
      metric,
      period: "day",
      since,
      until,
    });

    for (const item of data) {
      switch (item?.name) {
        case "page_follows":
        case "page_fans":
          ret[metricToFieldMapping[item.name]] =
            item?.values?.pop()?.value || 0;
          break;
        case "page_engaged_users":
        case "page_post_engagements":
        case "page_impressions":
        case "page_impressions_unique":
        case "page_post_impressions":
        case "page_post_impressions_unique":
        case "page_fan_adds":
        case "page_fan_adds_unique":
        case "page_views_total":
          ret[metricToFieldMapping[item.name]] = (item?.values || []).reduce(
            (prev, val) => {
              return prev + (val?.value || 0);
            },
            0
          );
          break;
        case "page_actions_post_reactions_total":
          ret[metricToFieldMapping[item.name]] = (item?.values || []).reduce(
            (prev, val) => {
              const itemValue = val?.value || {};
              return (
                prev +
                keys(itemValue).reduce((prev, field) => {
                  return (prev + itemValue[field]) | 0;
                }, 0)
              );
            },
            0
          );

          break;

        case "page_fans_city":
        case "page_fans_gender_age":
          ret[metricToFieldMapping[item.name]] =
            item?.values?.pop()?.value || {};
          break;
      }
    }

    ret.since = since;
    ret.until = until;

    return ret;
  }

  static async getPageInsightByDateRangeCount(pageId, accessToken, dateCount) {
    const ret = {
      latest_page_follows_quantity: 0,
      total_engaged_user_quantity: 0,
      total_page_post_engagements_quantity: 0,
      total_page_impressions_quantity: 0,
      total_page_impressions_unique_quantity: 0,
      total_page_post_impressions_quantity: 0,
      total_page_post_impressions_unique_quantity: 0,
      total_page_post_reactions_quantity: 0,
      latest_page_fans_quantity: 0,
      total_page_fan_adds_quantity: 0,
      total_page_fan_adds_unique_quantity: 0,
      latest_fans_by_cities: {},
      latest_fans_by_ages: {},
      total_page_views_quantity: 0,
      since: 0,
      until: 0,
      dateCount,
    };
    const metric = [
      "page_follows",
      "page_engaged_users",
      "page_post_engagements",
      "page_impressions",
      "page_impressions_unique",
      "page_posts_impressions",
      "page_posts_impressions_unique",
      "page_actions_post_reactions_total",
      "page_fans",
      "page_fan_adds",
      "page_fan_adds_unique",
      "page_fans_city",
      "page_fans_gender_age",
      "page_views_total",
    ].join(",");
    const metricToFieldMapping = {
      page_follows: "latest_page_follows_quantity",
      page_engaged_users: "total_engaged_user_quantity",
      page_post_engagements: "total_page_post_engagements_quantity",
      page_impressions: "total_page_impressions_quantity",
      page_impressions_unique: "total_page_impressions_unique_quantity",
      page_posts_impressions: "total_page_post_impressions_quantity",
      page_posts_impressions_unique:
        "total_page_post_impressions_unique_quantity",
      page_actions_post_reactions_total: "total_page_post_reactions_quantity",
      page_fans: "latest_page_fans_quantity",
      page_fan_adds: "total_page_fan_adds_quantity",
      page_fan_adds_unique: "total_page_fan_adds_unique_quantity",
      page_fans_city: "latest_fans_by_cities",
      page_fans_gender_age: "latest_fans_by_ages",
      page_views_total: "total_page_views_quantity",
    };
    const mNow = moment();
    const until = Math.round(mNow.toDate().getTime() / 1000);
    const since = Math.round(
      mNow
        .set("dates", mNow.get("dates") - dateCount)
        .set("hours", 0)
        .set("minutes", 0)
        .set("seconds", 0)
        .toDate()
        .getTime() / 1000
    );
    const data = await this.getInsights(pageId, accessToken, {
      metric,
      period: "day",
      since,
      until,
    });

    if (!data || !(data instanceof Array)) {
      {
        return {
          error: true,
          data: null,
        };
      }
    }

    for (const item of data) {
      switch (item?.name) {
        case "page_follows":
        case "page_fans":
          ret[metricToFieldMapping[item.name]] =
            item?.values?.pop()?.value || 0;
          break;
        case "page_engaged_users":
        case "page_post_engagements":
        case "page_impressions":
        case "page_impressions_unique":
        case "page_post_impressions":
        case "page_post_impressions_unique":
        case "page_fan_adds":
        case "page_fan_adds_unique":
        case "page_views_total":
          ret[metricToFieldMapping[item.name]] = (item?.values || []).reduce(
            (prev, val) => {
              return prev + (val?.value || 0);
            },
            0
          );
          break;
        case "page_actions_post_reactions_total":
          ret[metricToFieldMapping[item.name]] = (item?.values || []).reduce(
            (prev, val) => {
              const itemValue = val?.value || {};
              return (
                prev +
                keys(itemValue).reduce((prev, field) => {
                  return (prev + itemValue[field]) | 0;
                }, 0)
              );
            },
            0
          );

          break;

        case "page_fans_city":
        case "page_fans_gender_age":
          ret[metricToFieldMapping[item.name]] =
            item?.values?.pop()?.value || {};
          break;
      }
    }

    ret.since = since;
    ret.until = until;

    return {
      error: false,
      data: ret,
    };
  }

  static async getPostDetail(pageId, postId, accessToken) {
    const ret = {
      created_time: null,
      length: null,
      published: null,
      scheduled_publish_time: null,
      title : null,
      message: null,
      thumbnails: null
    };

    const metrics = [
      "created_time",
      "properties",
      "is_published",
      "scheduled_publish_time",
      "message",
      "full_picture"
    ].join(",");

    const metricToFieldMapping = {
      created_time: "created_time",
      properties: "length",
      is_published: "published",
      scheduled_publish_time: "scheduled_publish_time",   
      message: "title",
      full_picture: "thumbnails",
      // thumbnails: "full_picture"
    };
    
    const { success, data, error } = await this.apiClient.wrapResponse(
      this.apiClient.asyncGet(
        `/${FB_APP.GRAPH_API_VERSION}/${pageId}_${postId}`,
        {
          // metrics,
          fields: metrics,
          access_token: accessToken,
        }
      )
    );

    if (!success) {
      return {
        error: true,
        data: error,
      };
    }
    // console.log("post data: ", data)
    let objectKeys = Object.keys(data)

    for (const key of objectKeys || []) {
      switch (key) {
        case "created_time":        
        case "is_published":
        case "scheduled_publish_time":
        case "title":
        case "message":
        case "full_picture":
          ret[metricToFieldMapping[key]] = data[key] || null;
          break;
        case "properties":
          ret[metricToFieldMapping[key]] = data[key][0].text || null;
          break;
      }
    }

    // return data || {};
    return {
      error: false,
      data: ret,
    };
  }
  
  static async getVideoDetail (videoID, accessToken, options) {    
    const ret = {
      created_time: null,
      length: null,
      published: null,
      scheduled_publish_time: null,
      title : null,
      message: null,
      thumbnails: null
    };

    const metrics = [
      "created_time",
      "length",
      "published",
      "scheduled_publish_time",
      "title",
      "description",
      "thumbnails"
    ].join(",");

    const metricToFieldMapping = {
      created_time: "created_time",
      length: "length",
      published: "published",
      scheduled_publish_time: "scheduled_publish_time",   
      title: "title",
      description: "message",   
      thumbnails: "thumbnails"
    };

    const { success, data, error } = await this.apiClient.wrapResponse(
      this.apiClient.asyncGet(
        `/${FB_APP.GRAPH_API_VERSION}/${videoID}`,
        {
          access_token: accessToken,
          fields: metrics
        }
      )
    );

    if (!success) {
      return {
        error: true,
        data: error,
      };
    }
    // console.log("data: ", data["thumbnails"]?.data?.[0]?.uri)
    let objectKeys = Object.keys(data)
    
    for (const key of objectKeys || []) {
      switch (key) {
        case "created_time":
        case "length":
        case "published":
        case "scheduled_publish_time":
        case "title":
        case "description":
          ret[metricToFieldMapping[key]] = data[key] || false
          break;
        case "thumbnails":
          ret[metricToFieldMapping[key]] = data[key]?.data?.[0]?.uri
      }
    }

    // return data || {};
    return {
      error: false,
      data: ret,
    };
  }

  static async getVideoInsight (videoID, accessToken, options) {
    const { success, data, error } = await this.apiClient.wrapResponse(
      this.apiClient.asyncGet(
        `/${FB_APP.GRAPH_API_VERSION}/${videoID}/video_insights`,
        {
          access_token: accessToken,
          metric: options.metric,
          ...(options?.period ? { period: options.period } : {}),
          ...(options?.since ? { since: options.since } : {}),
          ...(options?.until ? { until: options.until } : {}),
        }
      )
    );

    if (!success) {
      console.error(error, data?.error);
      return null;
    }

    return data?.data || {};
  }

  static async getVideoInsightByLifetime (videoID, accessToken) {
    const ret = {
      total_video_views: null,
      total_video_impressions: null,
      total_video_impressions_unique: null,
      total_video_ad_break_earnings: null,
      total_video_reactions_by_type_total : null,
      total_video_ad_break_ad_cpm: null,
      total_video_ad_break_ad_impressions: null
    };
    const metric = [
      "total_video_views",
      "total_video_impressions",
      "total_video_impressions_unique",
      "total_video_ad_break_earnings",
      "total_video_reactions_by_type_total",
      "total_video_ad_break_ad_cpm",
      "total_video_ad_break_ad_impressions",
      "total_video_stories_by_action_type",
    ].join(",");

    const metricToFieldMapping = {
      total_video_views: "total_video_views",
      total_video_impressions: "total_video_impressions",
      total_video_impressions_unique: "total_video_impressions_unique",
      total_video_ad_break_earnings: "total_video_ad_break_earnings",   
      total_video_reactions_by_type_total: "total_video_reactions_by_type_total",
      total_video_stories_by_action_type: "total_video_stories_by_action_type",
      total_video_ad_break_ad_cpm: "total_video_ad_break_ad_cpm",
      total_video_ad_break_ad_impressions: "total_video_ad_break_ad_impressions"
    };

    const data = await this.getVideoInsight(`${videoID}`, accessToken, {
      metric,
      period: "lifetime",
    });    

    if (!data) {
      return {
        error: true,
        data: null,
      };
    }
    
    

    for (const item of data || []) {
      switch (item?.name) {
        case "total_video_views":
        case "total_video_impressions":
        case "total_video_impressions_unique":
        case "total_video_ad_break_earnings":
        case "total_video_ad_break_ad_cpm":
        case "total_video_ad_break_ad_impressions":
          ret[metricToFieldMapping[item?.name]] = item?.values?.[0]?.value || null;
          break;        
        case "total_video_stories_by_action_type":
          console.log("total_video_reactions_by_type_total: ", item?.values?.[0])
          ret.reaction_quantity = item?.values?.[0]?.value?.like || null;
          ret.comment_quantity = item?.values?.[0]?.value?.comment || null;
          ret.share_quantity = item?.values?.[0]?.value?.share || null;
          break;
      }
    }

    return {
      error: false,
      data: ret,
    };
  }
}