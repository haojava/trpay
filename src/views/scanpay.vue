<template>

  <div class='main'>
    <!--<div class='header' style='margin-top:1.5rem'>
      <img bindtap='back' src='../images/close.png'>
      <div>收银台</div>
    </div>-->
    <div class="w" >
      <div>
        <div class='ord-left'>
          <div class="ord-title">订单提交成功，请尽快付款！订单号：{{orderNo}}</div>
        </div>
        <div class='ord-right'>
          <div class="ord-title">订单金额：<strong>{{amount}}</strong>元</div>
        </div>
      </div>
      <!--<p class="ord-tips"></p>-->
      <!-- payment 支付方式选择 -->
      <div class="payment">
        <!-- 微信支付 -->
        <div class="pay-weixin">
          <div class="wx-left">微信支付</div>
          <div class="wx-mid">
            <div v-show="!show">距离二维码过期还剩<span style="color: #e31613">{{timeCount}}</span>秒，过期后请刷新页面重新获取二维码。</div>
            <div v-show="show">二维码已过期，<a style="color:#013a6e;cursor:pointer;" @click="payConfirm">刷新</a>页面重新获取二维码。</div>
            <div class="wx-qrimg">
              <img v-show="show" src="../images/qr_invalid.png">
              <img v-show="!show" :src="codeUrl">
            </div>
            <div class="wx-scan-icon">
              <div class="scan-left"></div>
              <div class="scan-right">请使用微信扫一扫<br/>扫描二维码支付</div>
            </div>
          </div>
          <div class="wx-right">
            <img src="../images/pc_scan_pay.png">
          </div>
        </div>

      </div>


    </div>
  </div>
</template>

<style lang="css">
  .main {background-color: #fff;}
  .w {width: 990px;margin: 0 auto; position: relative}
  .w div{display: block;font-family: "Microsoft Yahei"}
  .ord-left{ position:absolute;width: 640px;padding-top: 32px;}
  .ord-title{line-height: 26px;height: 26px;color: #333;font-size: 14px;
    margin-block-start: 1em;margin-block-end: 1em;
    margin-inline-start: 0px;margin-inline-end: 0px;
  }
  .ord-tips{line-height: 5px;height: 5px;}
  .ord-right {margin-left:85%;padding-top: 32px;padding-right: 10px;}
  .ord-title strong{font-size: 18px;vertical-align: bottom;color: #e31613;margin: 0 3px;}
  .payment {
    background-color: #fff;
    padding: 12px 30px;
    box-shadow: 0 6px 32px rgba(0,0,0,.13);
  }
  .wx-left{position:absolute;width: 130px;padding-top: 32px;font-size: 18px}
  .wx-left img{width:36px;height:34px}
  .wx-mid{position:absolute;margin-left:130px;width:400px;padding-top: 32px;font-size: 14px}
  .wx-right{margin-left:520px;padding-top: 18px;}
  .wx-right img{height: 410px;}
  .wx-qrimg{margin-top: 15px;margin-bottom:10px;width:260px;}
  .wx-qrimg img { width: 246px;height: 246px;border:1px solid #f2f2f2;padding: 5px;
    background: url(../images/pc_scan_loading.gif) center center no-repeat;
  }
  .wx-scan-icon{height: 44px;width: 133px;padding: 6px 0 6px 125px;
    background: #013a6e url(../images/pc_scan_icon_red.png) 40px 6px no-repeat;}
  .wx-scan-icon .scan-left{position:absolute;}
  .wx-scan-icon .scan-right{margin-left:0px; font-weight: bold;color: white}
</style>

<script>
  import apiPathObj from '../config'
  export default {
    name: "pay",
    data() {
      return {
        amount: 0,//订单金额
        description: "",//订单描述
        orderNo: "",//业务订单号
        applyDate: "",//支付开始时间
        invalidDate: "",//支付失效日期
        openId: "",//微信用户opentid
        payNo: "",//支付订单号
        payMode: "1",//支付方式，1微信
        payType: "25",//支付类型，25微信扫码支付
        wxOpenId:"",//微信openId，订单查询返回
        successUrl:"",//支付成功跳转地址
        backUrl:"",//收银台点击返回按钮会返回的地址
        clientid: "",//授权渠道号
        wxcode:"",//微信授权code
        payStatus:"",//支付状态
        backUrl:"",//收银台返回地址
        tradeState:"",//微信支付状态
        accessToken:"",//微信授权token
        refreshToken:"",//微信刷新token
        codeUrl:"../images/pc_scan_loading.gif",//二维码
        sideLength: 350,//二维码边长
        timeCount:60,//倒计时秒数
        show:false,
        timer:null,
        intervalId:null,
        returnCode:""
      }
    },
    created() {
      console.log(location.href)
      this.queryPayOrder();
    },
    methods: {
      //倒计时
      countDown(){
        const TIME_COUNT = 60;
        if (!this.timer) {
          this.timeCount = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.timeCount > 0 && this.timeCount <= TIME_COUNT) {
              this.timeCount--;
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000)
        }
      },

      //支付状态查询接口
      queryPayStatus() {
        let _this = this;
        _this.payNo = _this.$route.query.payNo;
        _this.backUrl = _this.$route.query.backUrl;
        let timsTamp = _this.$commonFunction.getDateTime(new Date(), 'yymmddhhmmss');
        let headers = {'Content-Type': 'application/json'}
        let data = {
          "header": {
            "transCode": "ACT1006",//交易代码，必填
            "transTime": timsTamp,//交易时间，必填，格式：yyyyMMddHHmmss
            "clientid": _this.clientid//授权渠道号
          },
          "payNo": _this.payNo
        };
        _this.axios({
          method: 'post',
          url: apiPathObj.ApiUrl+`/pay/wxOrder`,
          data: data,
          headers: headers
        }).then(res => {
          if (res.data.code === '0000') {
            _this.successUrl = res.data.data.successUrl;
            _this.returnCode = res.data.data.returnCode;
            _this.tradeState = res.data.data.tradeState;
            if(_this.returnCode=='SUCCESS'){
              if(_this.tradeState=='SUCCESS'){
                console.log(_this.tradeState+':'+res)
                clearInterval(_this.intervalId); //销毁定时器
                _this.$toast({message: "支付成功", timeout: 1500});
                if(_this.backUrl){
                  console.log('backUrl: '+_this.backUrl)
                  this.successUrl = decodeURIComponent(_this.backUrl);
                }
                setTimeout(function () {
                  console.log('successUrl: '+_this.successUrl)
                  window.location.href = _this.successUrl;
                },3000);
              }
              if(_this.tradeState=='PAYERROR'){
                this.$toast({message: "支付失败", timeout: 1500});
              }
              if(_this.tradeState=='CLOSED'){
                clearInterval(_this.intervalId); //销毁定时器
                _this.$toast({message: "支付订单已关闭", timeout: 1500});
                window.history.go(-1)
              }
            }else{
              clearInterval(_this.intervalId); //销毁定时器
              _this.$toast({message: "支付异常", timeout: 1500});
            }
          }else{
            _this.$toast(res.data.message);
          }
        }), err => {
          _this.$toast({
            message: "出错了~", timeout: 1500
          });
        };
      },
      //支付订单查询接口
      queryPayOrder() {
        this.payNo = this.$route.query.payNo;
        let timsTamp = this.$commonFunction.getDateTime(new Date(), 'yymmddhhmmss');
        let headers = {'Content-Type': 'application/json'}
        let data = {
          "header": {
            "transCode": "ACT1002",//交易代码，必填
            "transTime": timsTamp,//交易时间，必填，格式：yyyyMMddHHmmss
            "clientid": this.clientid//授权渠道号
          },
          "payNo": this.payNo
        };
        console.log(data);
        this.axios({
          method: 'post',
          url: apiPathObj.ApiUrl+`/pay/queryOrder`,
          data: data,
          headers: headers
        }).then(res => {
          console.log(res);
          if (res.data.code === '0000') {
            this.orderNo = res.data.data.busiOrderId;
            this.amount = res.data.data.amount;
            this.applyDate = res.data.data.applyDate;
            this.invalidDate = res.data.data.invalidDate;
            this.description = res.data.data.description;
            this.wxOpenId = res.data.data.wxOpenId;
            this.successUrl = res.data.data.successUrl;
            this.backUrl = res.data.data.backUrl;
            this.clientid = res.data.data.clientid;
            this.payStatus = res.data.data.payStatus;
            this.payConfirm();
          }else{
            this.$toast(res.data.message);
          }
        }), err => {
          this.$toast({
            message: "出错了~", timeout: 1500
          });
        };
      },
      //支付确认接口
      payConfirm() {
        let _this = this;
        let timsTamp = this.$commonFunction.getDateTime(new Date(), 'yymmddhhmmss');
        let headers = {'Content-Type': 'application/json'}
        let data = {
          "header": {
            "transCode": "ACT1003",//交易代码，必填
            "transTime": timsTamp,//交易时间，必填，格式：yyyyMMddHHmmss
            "clientid": _this.clientid//授权渠道号
          },
          "payNo": _this.payNo,
          "payMode": _this.payMode,//支付方式，必填（1微信，2支付宝）
          "payType": _this.payType,//支付类型，必填（19微信小程序，24微信公众号，25微信扫码，23微信APP）
          "outOpenId": _this.openId,
          "sideLength": _this.sideLength
        };
        this.axios({
          method: 'post',
          url: apiPathObj.ApiUrl+`/pay/confirm`,
          data: data,
          headers: headers
        }).then(res => {
          console.log(res);
          if (res.data.code === '0000') {
            _this.codeUrl = "data:image/jpeg;base64,"+res.data.data.codeUrl;
            _this.countDown();//倒计时
            _this.intervalId = setInterval(function(){_this.queryPayStatus()},1000);//轮询查询支付状态
          }else{
            this.$toast(res.data.message);
          }
        }), err => {
          this.$toast({
            message: "出错了~", timeout: 1500
          });
        };
      }
    }
  }
</script>
