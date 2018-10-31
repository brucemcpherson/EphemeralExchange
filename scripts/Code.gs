/**
*/

function doGet(e) {
  
  // get an instance
  var ex = new Eex();
  
  // clean up parameters
  var params = makeParameters(e);
  
  // do whatever
  return addCallback (params, params.data ? ex.put (params) : ex.get (params));
  
}

function doPost() {
  // get an instance
  var ex = new Eex();
  
  // clean up parameters
  var params = makeParameters(e);
  
  // do whatever
  return addCallback (params, params.data ? ex.put (params) : ex.get (params));
}

function addCallback (params , response) {

  var s = JSON.stringify(response);
  // publish result
  return ContentService
    .createTextOutput(params.callback ? params.callback + "(" + s + ");" : s )
    .setMimeType(params.callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON); 

}

function makeParameters (e) {
  e = e || {};
  e.parameter = e.parameter || {};
  return e.parameter;
}

/**
 * you need an api key to be able to write
 * @param {object} params
 * @return {response}
 */




function Eex () {
  
  var self = this, expiry_;
  self.settings = {
    maxSize:5*1000*1024,
    seed:PropertiesService.getScriptProperties().getProperty("seed"),
    plan:"cex",
    expiry:60*60,
  };
  
  
  /**
   * decode a coupon code
   * @param {string} code the code
   * @return {object} the decoded coupon
   */
  self.decodeCoupon = function (code) {
    return cCoupon.Coupon.decode (self.settings.seed, code);
  };
  
  /**
   * read the thing
   * @param {object} response the response so far
   * @return {object} the package
   */
  self.read = function (response) {
    return self.cacheCrusher.getBigProperty (response.id);
  };
  
  /**
   * get the thing
   * @param {object} params the params
   * @return {object} the updated response
   */
  self.get = function (params) {
    
    var response = self.initResponse (params);
    var register = params.hasOwnProperty ("register");
    
    if (response.ok) {
      if (!response.id && !register) {
        response.ok = false;
        response.error = "you need to specify an id";
      }
      
      else if (register) {
        // nothing to do
      }
      
      else  {
        var pack = self.read (response);

        if (pack && pack.readers.indexOf(response.reader) === -1) {
          response.ok = false;
          response.error = response.reader + " is not allowed to access " + response.id;
        }
        else if (pack) {
          response.data = pack.data;
          response.created = pack.created;
        }
        else {
          response.ok = false;
          response.error = response.id + " was not found";
          
        }
      }
    }
    return response;
  };
  
  /**
   * write the thing
   * @param {object} params the params
   * @param {number} [expiry=3600] expire time in seconds
   * @return {object} response the updated response
   */
  self.put = function (params,expiry) {
    
    var now = new Date().getTime();
    var response = self.initResponse(params);
    expiry_ = expiry || self.settings.expiry;
    
    if (response.ok) {
      // so far things are ok
      if (response.writer && params.apikey) {
        // Im allowed to write ?
        if (response.id) {
          // im overwriting, so check im allowed
          var pack = self.read (params);
          if (pack && pack.writers.indexOf (response.writer) === -1) {
            response.ok = false;
            response.error = response.writer + " is not allowed to write to id " + response.id;
            return response;
          }
        }
        // now I can write
        var writers = params.writers ? params.writers.split(",") : [];
        var readers = params.readers ? params.readers.split(",") : [];
        writers.push (response.writer);
        writers.forEach(function (d) {
          readers.push (d);
        });
        
        var data = {
          data:params.data,
          created:now,
          writer:response.writer,
          writers:writers,
          readers:readers,
          id:response.id || self.makeKey()
        }
        self.cacheCrusher.setBigProperty (data.id , data);
        response.id = data.id;
        response.readers = readers;
        response.writers = writers;
        
      }
      else {
        response.ok = false;
        response.error = "you need to specify an apikey & a writer - to generate a writer use a register parameter"
      }
    }
    return response;
  
  };

  /**
  * check that we have a valid api key and set up a write key if ok
  * @param {object} params the params
  * @return {object} the response
  */
  self.initResponse = function (params) {
    
    var response = {ok:false};
    var decode = params.apikey ? self.decodeCoupon (params.apikey) : decode;
    
    
    if (decode && !decode.valid) {
      response.error = "apikey " + params.apikey + " is invalid";
    }
    
    else if (decode && decode.expired) {
      response.error = "apikey " + params.apikey + " has expired on " + new Date(decode.expiry);
    }
    
    else {

      response.id = params.id || "";
      response.reader = params.reader || "";
      response.writer = params.writer || "";
      
      if (params.hasOwnProperty("register")) {
        if (decode) {
          response.writer = params.writer || self.makeKey();
        }
        response.reader = params.reader || self.makeKey();
      }
      
      response.ok = true;
    }
   
    return response;
                                
  };
  /**
   * make a key
   * this is actually a shuffled key
   * when its used, it should be unshuffled
   */
  self.makeKey = function () {
    return cLucky.Lucky.shuffle(cUseful.generateUniqueString(12));
  };
  
  /**
   * set up a cache crusher to be able to defeat the cache max size
   * and also to zip stuff
   */
  self.cacheCrusher = new cUseful.Squeeze.Chunking ()
  .setStore (CacheService.getUserCache())
  .setChunkSize(100000)   // actually this can be 100k in real life
  .funcWriteToStore(function (store, key , str) {
    return cUseful.Utils.expBackoff(function () { 
      return store.put (key , str , expiry_ ); 
    });
  })
  .funcReadFromStore(function (store, key) {
    return cUseful.Utils.expBackoff(function () { 
      return store.get (key); 
    });
  })
  .funcRemoveObject(function (store, key) {
    return cUseful.Utils.expBackoff(function () { 
      return store.remove (key); 
    })
  });
    

}