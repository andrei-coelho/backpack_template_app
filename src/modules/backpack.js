export default {

    __status__ : false,
    __use_alternative__ : false,

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
        route = Vue.prototype.URL_FIXED + "api/"+ route;

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
        return this.__status__ != "production" ? Vue.prototype.__URL__ + file + "?v=" + this.sha(new Date().toString()): Vue.prototype.__URL__ + file;
      }

      Vue.prototype.link = uri => {
        return Vue.prototype.__URL__ + uri;
      } 

    }
};