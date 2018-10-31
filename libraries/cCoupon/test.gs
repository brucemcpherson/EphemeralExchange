
function soak () {

  // this is the private ncrpt key
  var privateKey = "bigmacwithcheese";
  var couponCode = Coupon.generate(privateKey, new Date(2016,11,25).getTime(),'xmas');
  Logger.log(couponCode);
  if (!Coupon.decode(privateKey, couponCode).valid) {
    throw couponCode;
  }
  var couponCode = Coupon.generateMonths(privateKey, 3,'xmas');
  Logger.log(couponCode);
  if (!Coupon.decode(privateKey, couponCode).valid) {
    throw couponCode;
  }
  var couponCode = Coupon.generateDays(privateKey, 28,'xmas');
  Logger.log(couponCode);
  if (!Coupon.decode(privateKey, couponCode).valid) {
    throw couponCode;
  }
  
  var couponCode = Coupon.generateMonths(privateKey, 12,'xmas',28);
  Logger.log(couponCode);
  if (!Coupon.decode(privateKey, couponCode).valid) {
    throw couponCode;
  }

  var couponCode = Coupon.generateMonths(privateKey + "bruce@mcpher.com", 1,'xmas');
  Logger.log(couponCode);
  if (!Coupon.decode(privateKey + "bruce@mcpher.com", couponCode).valid) {
    throw couponCode;
  }
  

  

  
  var  nt = 100, ns = 60*60*9.97, now = new Date().getTime(), then = now + ns *nt;
  for (var i=0,nd = now - ns*nt ; nd < then ; nd += ns,i++) {
    var coupon = Coupon.generate(privateKey, nd,'xmas',i % 3);
    var decode = Coupon.decode (privateKey,coupon);
    if (!decode.valid) {
      throw 'invalid' + JSON.stringify(decode);
    }
    if (nd <= now && !decode.expired) {
      throw 'should be expired'  + JSON.stringify(decode);
    }
    if (nd > now && decode.expired) {
      throw 'should notbe expired'  + JSON.stringify(decode);
    }
    //Logger.log(coupon);
  }
    
  
}
function testCoupon() {

  
  // this is the private ncrpt key
  var salt = 'my private key';
  
  // generate a 2 month token
  var coupon = Coupon.generateMonths(salt, 2, 'gas');
  var decode = Coupon.decode(salt,coupon);
  Logger.log(decode);
  if (decode.valid) {
    Logger.log(new Date(decode.expiry).toLocaleString());
  }

  
  // generate a 10 day token
  var coupon = Coupon.generateDays(salt,10, 'gas');
  var decode = Coupon.decode(salt,coupon);
  Logger.log(decode);
  if (decode.valid) {
    Logger.log(new Date(decode.expiry).toLocaleString());
  }
  
  // generate a specific date token
  var coupon = Coupon.generate(salt,new Date(2019,11,25).getTime(), 'gas');
  var decode = Coupon.decode(salt,coupon);
  Logger.log(decode);
  if (decode.valid) {
    Logger.log(new Date(decode.expiry).toLocaleString());
  }

  
  // generate an expired token
  var coupon = Coupon.generateDays(salt,-10, 'gas');
  var decode = Coupon.decode(salt,coupon);
  Logger.log(decode);
  if (decode.valid) {
    Logger.log(new Date(decode.expiry).toLocaleString());
  }
  
  // decode an invalid token
  var decode = Coupon.decode(salt,"gas-abc-a34234501");
  Logger.log(decode);
  if (decode.valid) {
    Logger.log(new Date(decode.expiry).toLocaleString());
  }
  
  // generate token
  var coupon = Coupon.generateDays(salt,100, 'gas');
  var decode = Coupon.decode('an invalid salt',coupon);
  Logger.log(decode);
  if (decode.valid) {
    Logger.log(new Date(decode.expiry).toLocaleString());
  }
  
  // generate an extended token
  var coupon = Coupon.generateDays(salt,100, 'gas',28);
  Logger.log(coupon);
  var decode = Coupon.decode(salt,coupon);
  Logger.log(decode);
  if (decode.valid) {
    Logger.log(new Date(decode.expiry).toLocaleString());
    Logger.log(new Date(decode.extendedExpiry).toLocaleString());
  }
  
}