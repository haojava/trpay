<template>

</template>

<script>
  import apiPathObj from '../config'
  export default {
    name: 'cashier',
    data() {
      return {
        wxcode: "",
        openId: ""//微信用户opentid
      }
    },
    created() {
      this.openId=localStorage.getItem("OPENID_"+this.payNo);
      console.log("OPENID_"+this.payNo+"==="+this.openId)
      if(!this.openId) {
        this.wxcode = this.$route.query.code;
        if (!this.wxcode) {
          this.getAccessCode();
        } else {
          this.getOpenId();
        }
      }
    },
    methods: {
      //获取微信授权code
      getAccessCode() {
        let payNo = this.$route.query.payNo;
        let redirectUri = apiPathObj.PayUrl+'/mp/pay?payNo='+payNo;
        let accessUri = 'https://open.weixin.qq.com/connect/oauth2/authorize' +
          '?appid='+apiPathObj.WxmpAppId+
          '&redirect_uri=' + encodeURIComponent(redirectUri) +
          '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
        /*let accessUri = 'http://pay.e-tianrong.com/get_wxcode.html' +
          '?appid='+apiPathObj.WxmpAppId+
          '&redirect_uri='+encodeURIComponent(redirectUri)+
          '&scope=snsapi_base&state=123';*/
        window.location.href = accessUri;
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
            localStorage.setItem("OPENID_"+this.payNo,_this.openId);
          }else{
            this.$toast(res.data.message);
          }
        }).catch((error) => {
          this.$dialog(error);
        });
      },
    }
  }

</script>
