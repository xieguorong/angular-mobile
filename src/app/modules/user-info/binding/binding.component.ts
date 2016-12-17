import {Component, OnInit} from "@angular/core";
import any = jasmine.any;
import {ActivatedRoute,  Router} from "@angular/router";
import {UserInfoService} from "../user-info.service";
import {isUndefined} from "util";
import {isNull} from "util";

@Component({
  selector: 'binding',
  templateUrl: 'binding.component.html',
  styleUrls: ['binding.component.css'],
  providers:[UserInfoService]
})
export class BindingComponent  implements OnInit{

  private user:any = {}

  private codeInner:boolean = false

  private isShowTip: boolean = false
  private message:string

  private errMsg: string
  private toShowErr:boolean = false

  /**
   * 构造函数
   * @param rawService
   */
  constructor(private userInfoService: UserInfoService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  /**
   * 初始化事件
   */
  ngOnInit(): void {
    this.user.sex = 1
  }

  mobileBlur(){
    if(!(isUndefined(this.user.mobile)||isNull(this.user.mobile))){
      this.codeInner = true
    }else {
      this.codeInner = false
    }
  }

  updateUserInfo(){
    if(this.validated()) {
      this.user.email="@"//只是为了满足不为空，后台未使用此内容
      this.userInfoService.bindingByMobile(this.user).then((resp: any) => {
        //保存成功。。。
        debugger
        console.log(resp)
        this.message = resp.msg
        this.isShowTip = true
        this.codeInner = false
      })
    }else{
      setTimeout((resp:any)=>{
        this.toShowErr = false
      }, 3000)
    }
  }

  validated(){
    //姓名验证
    if (isUndefined(this.user.name)||this.user.name.trim().length < 1) {
      this.errMsg = "姓名不能为空"
      this.toShowErr = true
      return false
    }
    //手机验证
    if(isUndefined(this.user.mobile)||isNull(this.user.mobile)||this.user.mobile.trim().length<1){
      this.errMsg = "手机号码不能为空"
      this.toShowErr = true
      return false
    }else if (!/^1[34578]\d{9}$/.test(this.user.mobile) || this.user.mobile.trim().length != 11) {
      this.errMsg = "手机号码格式不正确"
      this.toShowErr = true
      return false
    }
    //验证码非空验证
    if (this.codeInner){
      if (isUndefined(this.user.code)||this.user.code.trim().length < 1) {
        this.errMsg = "验证码不能为空"
        this.toShowErr = true
        return false
      } else if (this.user.code.length != 6 || !/^\d+$/.test(this.user.code)) {
        this.errMsg = "验证码错误"
        this.toShowErr = true
        return false
      }
    }
    return true
  }

  onCloseTip(){
    this.isShowTip = false
  }
  getCode(){
    if(isUndefined(this.user.mobile)||isNull(this.user.mobile)||this.user.mobile.trim().length<1){
      this.errMsg = "手机号码不能为空"
      this.toShowErr = true
      return false
    }else if (!/^1[34578]\d{9}$/.test(this.user.mobile) || this.user.mobile.trim().length != 11) {
      this.errMsg = "手机号码格式不正确"
      this.toShowErr = true
      return false
    }
    this.settime(document.getElementById('getCode'))
    this.userInfoService.getCodeByMobile(this.user.mobile).then((resp:any)=>{
     console.log("获取验证码成功，reap[()}=>"+resp)
    })
  }

  //获取验证倒计时
  private  countdown:number = 60;
  settime(obj) {
    if (this.countdown == 0) {
      obj.disabled = false
      obj.innerHTML="获取验证码"
      this.countdown = 60;
      return;
    } else {
      obj.disabled = true
      obj.innerHTML="重新发送(" + this.countdown + ")"
      this.countdown--;
    }
    setTimeout((resp:any)=>{
      this.settime(obj)
    }, 1000)
  }

}