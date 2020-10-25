import {
  BillModel
} from '../../models/bill.js'

import {
  Util
} from '../../utils/utils.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_status_page: false,
    show_loadmore: false,
    show_loading: true,
    show_popup: false,
    currentDate: new Date().getTime(),
    maxDate: new Date().getTime(),
    showDate: Util.dateFormat("YYYY-mm", new Date()),
    dataList: [],

    page: 0,
    count: 10,

    recordAmount: {
      income: 0.00,
      consume: 0.00
    }
  },

  onGoTally() {
    wx.navigateTo({
      url: '/pages/tally/tally',
    })
  },

  onSelectDate(event) {
    this.setData({
      show_popup: true
    })
  },
  onConfirm(event) {
    this.setData({
      currentDate: new Date(event.detail).getTime(),
      showDate: Util.dateFormat("YYYY-mm", new Date(event.detail)),
      show_popup: false
    })
    this._initAllData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this._initAllData()
  },

  async _initAllData() {
    let recordAmount = await BillModel.getRecordAmount(this.data.showDate);
    this.setData({
      recordAmount
    })
    this._getRecordList(0, this.data.count, this.data.showDate)
  },



  async _getRecordList(page, count, date) {
    let dataList = this.data.dataList;
    let data = await BillModel.getRecordList(page, count, date).catch(err => {
      console.log(err)
    })
    console.log(data)
    let items = data.items;
    if (page == 0) {
      dataList = items
    } else {
      //下拉刷新时，如果当前最后一条数据与新数据的日期相同，进行合并，不然会出现重复日期的问题
      for (let i in items) {
        if (items[i].date == dataList[dataList.length - 1].date) {
          dataList[dataList.length - 1].items = dataList[dataList.length - 1].items.concat(items[i].items)
        } else {
          dataList.push(items[i])
        }
      }
    }
    this.setData({
      dataList: dataList,
      page: data.page,
      totalPages: data.total_pages,
      show_loading: false,
      show_loadmore: false,
      show_status_page: dataList.length == 0 ? true : false
    })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.show_loadmore = true;
    let page = this.data.page + 1;
    let totalPages = this.data.totalPages;
    if (page == totalPages) {
      return;
    }
    this._getRecordList(page, this.data.count, this.data.showDate)
  },

})