<template>
  <div class='cashier'>
    <!--<div class='header' style='margin-top:1.5rem'>
      <img bindtap='back' src='../images/close.png'>
      <div>收银台</div>
    </div>-->
    <div>
      <!--<div class='mt20'></div>-->
      <div class='order'>
        <div>订单号：{{orderNo}}</div>
      </div>
      <div class='order'>
        <div>订单金额：{{amount}}元</div>
      </div>
      <div class='order' style='border-bottom:0px'>
        <div>产品名称：{{description}}</div>
      </div>
    </div>
    <div>
      <div class='mt20'></div>
      <div class='info'>选择支付方式</div>
      <div class='info payMethod' @click='payConfirm'>
        <img src='../images/icon_wx.png'>
        <span style="margin-left: 0.3rem">微信支付</span>
        <span class="rightArrow">></span>
      </div>
    </div>
  </div>
</template>

<style lang="css">
  .cashier{padding-top: 1px;}
  .cashier .mt20{height:0.58rem;background-color: #f2f2f2;}
  .cashier .header{position: relative;height: 2.67rem;font-size: 1rem;}
  .cashier .header div{line-height: 2.23rem;text-align:center;font-size: 1rem;}
  .cashier .header img{position:absolute;top:0.5rem;left:4%;width:1.5rem;height:1.5rem;}
  .cashier .order{line-height: 3.5rem;border-bottom:1px solid #EEEEEE;padding-left: 0.8rem}
  .cashier div{font-size: 1rem;}
  .info{line-height: 3.5rem;border-bottom:1px solid #EEEEEE;padding-left: 0.8rem}
  .payMethod .rightArrow{float:right;padding-right: 1rem;font-size: 1.3rem}
  .payMethod img{width:1.55rem;height:1.55rem;vertical-align:middle}
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
        payType: "24",//支付类型，24微信公众号
        wxOpenId:"",//微信openId，订单查询返回
        successUrl:"",//支付成功跳转地址
        backUrl:"",//收银台点击返回按钮会返回的地址
        clientid: "",//授权渠道号
        wxcode:"",//微信授权code
        accessToken:"",//微信授权token
        refreshToken:""//微信刷新token
      }
    },
    created() {
      console.log(location.href);
      this.queryPayOrder();
    },
    methods: {
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

            if(this.$commonFunction.isWeixin()){
              if(!this.wxOpenId){
                this.openId=localStorage.getItem("OPENID_"+this.payNo);
                if(!this.openId){
                  this.wxcode = this.$route.query.code;
                  if(!this.wxcode){
                    this.getAccessCode();
                  }else{
                    this.getOpenId();
                  }
                }
              }else{
                this.openId=this.wxOpenId;
                localStorage.setItem("OPENID_"+this.payNo,this.wxOpenId);
              }
            }
          }else{
            this.$toast(res.data.message);
          }
        }), err => {
          this.$toast({
            message: "出错了~", timeout: 1500
          });
        };
      },
      //获取微信授权code
      getAccessCode() {
        this.payNo = this.$route.query.payNo;
        let redirectUri = apiPathObj.PayUrl+'/mp/pay?payNo='+this.payNo;
        let accessUri = 'https://open.weixin.qq.com/connect/oauth2/authorize' +
          '?appid='+apiPathObj.WxmpAppId+
          '&redirect_uri=' + encodeURIComponent(redirectUri) +
          '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
        /*let accessUri = 'http://pay.e-tianrong.com/get_wxcode.html' +
          '?appid='+apiPathObj.WxmpAppId+
          '&redirect_uri='+encodeURIComponent(redirectUri)+
          '&scope=snsapi_userinfo&state=123';*/
        window.location.href = accessUri;
        //window.history.pushState({},0, accessUri);
      },
      //通过微信授权code获取openId
      getOpenId() {
        /*this.$toast.loading({
          forbidClick: true, // 禁用背景点击
          mask: true,
          message: '加载中...'
        })*/
        let _this = this;
        let headers = {'Content-Type': 'application/json'}
        let data = {'appid':apiPathObj.WxmpAppId,'code':this.wxcode};
        console.log('this.wxcode：'+this.wxcode);
        _this.axios({
          method: 'post',
          url: apiPathObj.ApiUrl+'/wx/mp/accesstoken',
          data: data,
          headers: headers
        }).then((res) => {
          console.log(res);
          if (res.data.code === '0000') {
            _this.openId = res.data.data.openId;
            _this.accessToken = res.data.data.accessToken;
            _this.refreshToken = res.data.data.refreshToken;
            localStorage.setItem("OPENID_"+this.payNo,_this.openId);
          }else{
            this.$toast(res.data.message);
          }
        }).catch((error) => {
          this.$dialog(error);
        });
      },
      //支付确认接口
      payConfirm() {
        let _this = this;
        //this.openId = localStorage.getItem("OPENID_"+this.payNo);
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
          "outOpenId": _this.openId
        };
        this.axios({
          method: 'post',
          url: apiPathObj.ApiUrl+`/pay/confirm`,
          data: data,
          headers: headers
        }).then(res => {
          console.log(res);
          if (res.data.code === '0000') {
            this.wxpay(res.data.data);
          }else{
            this.$toast(res.data.message);
          }
        }), err => {
          this.$toast({
            message: "出错了~", timeout: 1500
          });
        };
      },
      //换起微信支付
      wxpay(params) {
        let _this = this;
        if (typeof window.WeixinJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', function () { onBridgeReady(params) }, false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', function () { onBridgeReady(params) })
            document.attachEvent('onWeixinJSBridgeReady', function () { onBridgeReady(params) })
          }
        } else {
          window.WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
              'appId': params.payInfo.appId,
              'timeStamp': params.payInfo.timeStamp, // 时间戳，
              'nonceStr': params.payInfo.nonceStr, // 随机串
              'package': params.payInfo.package,
              'signType': params.payInfo.signType, // 微信签名方式：
              'paySign': params.payInfo.paySign // 微信签名
            },
            function (res) {
              if (res.err_msg=="get_brand_wcpay_request:ok") {
                window.location.href=_this.successUrl;
              } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                _this.$toast("取消支付");
              }else{
                _this.$toast("支付失败");
              }
              localStorage.removeItem("OPENID_"+_this.payNo);
            }
          )
        }
      }
    }
  }
</script>
