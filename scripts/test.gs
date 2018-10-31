function test (e) {
  function assertok (ob,comment,expect, verbose) {
    verbose = cUseful.Utils.fixDef (verbose, false);
    if (verbose || ob.ok !== expect) {
      Logger.log ((ob.ok === expect ? "passed:" : "failed:") + comment + ":" + JSON.stringify (ob));
    }
    return ob;
  } 
  
  // sort out the params
  var params = makeParameters(e);
  var response;
  
  var ex = new Eex ();
  
  response = assertok ( ex.initResponse (params) , "initialize" , true);
  
  // now try with an invalid coupon
  params.apikey="ubbush";
  response = assertok ( ex.initResponse (params) , "invalid coupon expected" , false);
  
  // now try with an expired coupon
  params.apikey="cex-m7s-19rdteadj";
  response = assertok ( ex.initResponse (params) , "expired coupon expected" , false);
  
  // now try with an good coupon 
  params.apikey="cex-rna-11fq0gb47";
  response = assertok ( ex.initResponse (params) , "good coupon expected" , true);
  
  
  // now write some data, - shoud fail
  params.data = "some rubbish";
  response = assertok ( ex.put (params) , "putting data" , false);
  
  // try again, this time registering
  params.register ="";
  response = assertok ( ex.put (params) , "putting data after register" , true);
  
  
  // now am i able to read that with no other params ,, should fail
  var p = {id:response.id};
  var r = assertok ( ex.get (p) , "getting data with just id" , false);
  
  // try again using the key from the write .. should be ok
  var p =  {id:response.id,reader:response.writer};
  r = assertok ( ex.get (p) , "getting data with id + the key it was written with" , true);
  
  // now try to rewrite with a dodgy id .. should fail
  var p =  {id:response.id,writer:"zzz",data:"xxx"};
  r = assertok ( ex.put (p) , "writing with the wrong id and no apikey" , false);
  
  // rewrite with a good id, but no apikey .. should fail
  var p = {id:response.id,writer:response.writer,data:"xxx"};
  r = assertok ( ex.put (p) , "writing with the right id and no apikey" , false );
  
  // rewrite with an apikey, but the wrong id .. should fail
  var p = {id:response.id,register:"",data:"xxx",apikey:params.apikey};
  r = assertok ( ex.put (p) , "writing with the wrong id and an apikey" , false );
  
  // rewrite with an apikey, and the right wrong id .. should work
  var p = {id:response.id,writer:response.writer,data:"xxx",apikey:params.apikey};
  r = assertok ( ex.put (p) , "writing with the right id and an apikey" , true );
  
  // now lets try varying the readers 
  
  // should work
  var p = {id:response.id,writer:response.writer,data:"xxx",apikey:params.apikey, readers:"a,b,c"};
  r = assertok ( ex.put (p) , "writing with some readers specified" , true );
  
  // now lets access with one of the given readers
  var p = {id:response.id,reader:"b"};
  r = assertok ( ex.get (p) , "reading with a specific reader" , true );
  
  // and an unknown reader
  var p = {id:response.id,reader:"xxx"};
  r = assertok ( ex.get (p) , "reading with a specific reader" , false );
  
  // and an unknown id
  var p = {id:"rubbish",reader:"xxx"};
  r = assertok ( ex.get (p) , "reading with an unknown id" , false  );
  
  // and no reader
  var p = {id:response.id};
  r = assertok ( ex.get (p) , "reading with a specific reader" , false );
  
  // vary the writers
  var p = {id:response.id,writer:response.writer,data:"xxx",apikey:params.apikey, readers:"a,b,c", writers:"x,y,z"};
  r = assertok ( ex.put (p) , "writing with some writers specified" , true );
  
  // shoudll work
  var p = {id:response.id,writer:"z",data:"zzz",apikey:params.apikey, readers:"a,b,c", writers:"mary,john,tom"};
  r = assertok ( ex.put (p) , "writing as another writer" , true );
  
  // should fail
  var p = {id:response.id,writer:"jerry",data:"zzz",apikey:params.apikey, readers:"a,b,c", writers:"mary,john,tom"};
  r = assertok ( ex.put (p) , "writing as another writer should fail" , false );
  
  // should fail
  var p = {id:response.id,writer:"a",data:"aaa",apikey:params.apikey, readers:"a,b,c", writers:"mary,john,tom"};
  r = assertok ( ex.put (p) , "writing as a readershould fail" , false, true );
  
  
}
function getCoupon() {
  var ex = new Eex();
  var code = cCoupon.Coupon.generateDays (ex.settings.seed ,90, ex.settings.plan);
  Logger.log(ex.decodeCoupon (code));
  
  var code = cCoupon.Coupon.generateDays (ex.settings.seed ,-90, ex.settings.plan);
  Logger.log(ex.decodeCoupon (code));
}