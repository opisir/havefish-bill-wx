import {
  Http
}
from '../utils/http.js'
import {
  Paging
} from '../utils/paging.js'
class BillModel {

  /** */
  static async getBillAmount(recordTime) {
    return await Http.request({
      url: "bill/total_amount",
      method: "GET",
      data: {
        recordTime
      }
    })
  }

  /**
   * 获取账单列表
   */
  static async getRecordList(page, count, date) {
    return await Http.request({
      url: "bill/all",
      method: "GET",
      data: {
        page,
        count,
        recordTime: date
      }
    })
  }

  /**
   * 
   */
  static getBillPaging(date) {
    return new Paging({
      url: "bill/all?recordTime=" + date
    })
  }

  /**
   * 添加记录
   */
  static async saveRecord(data) {
    return await Http.request({
      url: "bill/save",
      method: "POST",
      data
    })
  }

}

export {
  BillModel
}