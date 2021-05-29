export default {

  __status__ : false,
  __use_alternative__ : false,
  __version_files__: false,

  sha(texto){
    
    let crypto = require('crypto');
    let iv = crypto.randomBytes(16);
    let key = crypto.createHash('sha256').update(String("BackPack_key")).digest('base64').substr(0, 32);

    let cipher = crypto.createCipheriv(
      'aes-256-cbc', Buffer.from(key), iv);
    
    let encrypted = cipher.update(texto);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
    
  },
  
  install(Vue) {
    
    if (typeof __status__ == "boolean") {
      this.__status__ = "production";
    } 

    if (typeof __use_alternative__ == "boolean") {
      this.__use_alternative__ = true;
    } 

    if(this.__status__ != 'production'){
      document.head.innerHTML = document.head.innerHTML.toString().replace('{__title__}', '')
      document.body.innerHTML = document.body.innerHTML.toString().replace('{__metas__}', '')
    }

    Vue.prototype.__URL__ = 
      this.__status__ == 'production' &&  this.__use_alternative__ ?
      process.env.VUE_APP_URL_ALTERNATIVE : 
        this.__status__ == 'production' &&  !this.__use_alternative__?
          process.env.VUE_APP_URL_PRODUCTION : 
          process.env.VUE_APP_URL_DEVELOPMENT ;

    Vue.prototype.__version_files__ = process.env.VUE_APP_VERSION_FILES;

    Vue.prototype.GET = (route, callback) => {
        route = Vue.prototype.__URL__ + "api/"+ route;
    
        fetch(route)
        .then(function(response) {
          return response.json()
        })
        .then(function(json){
          callback(json, false)
        })
        .catch(function(error) {
          callback(error.message, true);
        });
    }

    Vue.prototype.POST = (route, callback, data) => {
      
      var init = { 
        method: 'POST',
        body: JSON.stringify(data)
      };
      route = Vue.prototype.__URL__ + "api/"+ route;
      console.log(route);
      fetch(new Request(route, init))
      .then(function(response) {
        return response.json()
      })
      .then(function(json){
        callback(json, false)
      })
      .catch(function(error) {
        callback(error.message, true);
      });
    }

    Vue.prototype.file = file  => {
      return this.__status__ != "production" ? Vue.prototype.__URL__ + file + "?v=" + this.sha(new Date().toString()): Vue.prototype.__URL__ + file + "?v="+Vue.prototype.__version_files__;
    }

    Vue.prototype.link = (uri = "") => {
      return Vue.prototype.__URL__ + uri;
    }

    Vue.prototype.setCookie = (name,value,days) => {
      var expires = "";
      if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days*24*60*60*1000));
          expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    Vue.prototype.getCookie = name =>  {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
    }
    
    Vue.prototype.removeCookie = (name) => {   
      document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    Vue.prototype.dateToBr = date => {
      let parts = date.split('-');
      return parts[2]+'/'+parts[1]+'/'+parts[0];
    }

  }
  
};