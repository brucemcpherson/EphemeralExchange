function test() {
  
  //some arrays
  var options = {
    min: 1,
    max: 100,
    size: 10
  };
  for (var i = 0; i < 2; i++) {
    show('Array ' + i, Lucky.get(options));
  }
  
  // variable lengths
  var options = {
    min: 1,
    max: 5,
    maxSize: 10,
    size: 3
  };
  for (var i = 0; i < 2; i++) {
    show('Array random size ' + i, Lucky.get(options));
  }
  
  // shuffle 
  show('Array shuffled', Lucky.shuffle([1, 2, 3, 4, 5]));
  
  // try with seeds
  var options = {
    min: 1,
    max: 100,
    seed: 90,
    size: 10
  };
  for (var i = 0; i < 2; i++) {
    show('Array seeded ' + i, Lucky.get(options));
  }
  // try with seeds variable length
  var options = {
    min: 1,
    max: 100,
    maxSize: 15,
    seed: 90,
    size: 6
  };
  for (var i = 0; i < 2; i++) {
    show('Array seeded random size ' + i, Lucky.get(options));
  }
  
  // shuffle arrays
  var arr = ["barney", "fred", "wilma", "betty", "bambam", "pebbles"];
  show('Shuffling arrays with seeds', arr);
  var seed = 123.456;
  var shuffled = Lucky.shuffle(arr, seed);
  show("Shuffled array with seed", shuffled);
  show("Unshuffled array with seed", Lucky.unShuffle(shuffled, seed));
  
  //some strings
  var options = {
    min: 'a',
    max: 'z',
    size: 10
  };
  
  for (var i = 0; i < 2; i++) {
    show('String ' + i, Lucky.getString(options));
  }
  
  // random size
  var options = {
    min: 'A',
    max: 'S',
    maxSize: 18,
    size: 7
  };
  
  for (var i = 0; i < 2; i++) {
    show('String random size ' + i, Lucky.getString(options));
  }
  
  show('string shuffle', Lucky.shuffle('abcdefghijklmnopqrstuvwxyz'));
  var options = {
    min: 'a',
    max: 'q',
    size: 10,
    seed: 90
  };
  for (var i = 0; i < 2; i++) {
    show('String seeded ' + i, Lucky.getString(options));
  }
  // try with seeds variable length
  var options = {
    min: 'd',
    max: 'v',
    maxSize: 15,
    seed: 90,
    size: 6
  };
  for (var i = 0; i < 2; i++) {
    show('String seeded random size ' + i, Lucky.getString(options));
  }
  
  var str = "democracy is a device that ensures we shall be governed no better than we deserve";
  show('Shuffling strings with seeds', str);
  var seed = 1.67;
  var shuffled = Lucky.shuffle(str, seed);
  show("Shuffled string with seed", shuffled);
  show("Unshuffled string with seed", Lucky.unShuffle(shuffled, seed));
  
  var str = "Using a string as a seed";
  show('strings as seeds', str);
  var seed = str;
  var shuffled = Lucky.shuffle(str, seed);
  show("Shuffled string with string seed", shuffled);
  show("Unshuffled string with string seed", Lucky.unShuffle(shuffled, seed));
  
  // use regex
  var options = {
    size: 30,
    rx: /[\w]/
  };
  
  for (var i = 0; i < 2; i++) {
    show('String with regex ' + i, Lucky.getString(options));
  }
  var options = {
    maxSize: 13,
    size: 1,
    rx: /[A-Gb#]/
  };
  
  for (var i = 0; i < 2; i++) {
    show('String random size with regex ' + i, Lucky.getString(options));
  }
  
  var options = {
    maxSize: 13,
    size: 12,
    list: 'abcdef'
  };
  
  for (var i = 0; i < 2; i++) {
    show('String random size with list ' + i, Lucky.getString(options));
  }
  // scrabble distribution
  var scrabble = "aaaaaaaaabbccddddeeeeeeeeeeeeffggghhiiiiiiiiijkllllmmnnnnnnooooooooppqrrrrrrssssttttttuuuuvvwwxyyz";
  var spaces = scrabble.split("").slice(0, Math.round(scrabble.length / 5.1) + 1).join(" ");
  
  var options = {
    maxSize: 300,
    size: 200,
    list: spaces + scrabble
  };
  for (var i = 0; i < 2; i++) {
    show('string random size with scrabble list ' + i, Lucky.getString(options));
  }
  
  var options = {
    maxSize: 10,
    size: 5,
    list: ['george', 'john', 'paul', 'ringo']
  };
  for (var i = 0; i < 2; i++) {
    show('an array with a list ' + i, Lucky.get(options));
  }
  var options = {
    size: 6,
    list: ['george', 'john', 'paul', 'ringo'],
    seed: 'my passphrase'
  };
  for (var i = 0; i < 2; i++) {
    show('an array with a list seeded ' + i, Lucky.get(options));
  }
  
  // other stuff
  show('getRandBetween', Lucky.getRandBetween(200, 399));
  show('getUniqueString', Lucky.getUniqueString());
  show('getUniqueString shorter', Lucky.getUniqueString(9));
  show('getUniqueString longer', Lucky.getUniqueString(20));
  //----------------------------------------------
  var options = {
    size: 6,
    width: 3
  };
  var options = {
    size: 6,
    width: 3,
    list: ["number", "string"]
  };
  var options = {
    size: 8,
    list: ["number", "string", "string"],
    fixed: true
  };
  var options = {
    size: 12,
    fixed: true,
    list: ["number", "string", "date"],
    number: {
      max: 100,
      min: 20,
    },
    date: {
      max: new Date(2017, 3, 1),
      min: new Date(2016, 1, 2)
    },
    string: {
      size: 10,
      maxSize: 20,
      rx: /[a-k0-9]/
    }
  };
  
  show('getting grid 0', Lucky.getGrid(options));
  
  var options = {
    size: 4,
    seed: 'a seed',
    fixed: true,
    list: ["number", "string", "date"],
    number: {
      max: 100,
      min: 20,
    },
    date: {
      max: new Date(2017, 3, 1),
      min: new Date(2016, 1, 2)
    },
    string: {
      size: 4,
      maxSize: 8,
      rx: /[a-k]/
    }
  };
  
  show('getting grid seed 1', Lucky.getGrid(options));
  show('getting grid seed 2', Lucky.getGrid(options));
  
  var options = {
    size: 4,
    seed: 'a seed',
    fixed: true,
    list: ["number", "string", "date"],
    number: {
      max: 100,
      min: 20,
    },
    date: {
      max: new Date(2017, 3, 1),
      min: new Date(2016, 1, 2)
    },
    string: {
      size: 4,
      maxSize: 8,
      rx: /[a-k]/,
      inheritSeed:false
    }
  };
  show('getting grid seed 3 - no string inheritance', Lucky.getGrid(options));
  
  
}

function show(div, stuff) {
  //------ browser version
  /**
  var id = div.replace(/\s/g, "-");
  var el = document.getElementById(id) || createElement(document.body, "div", id);
  el.innerHTML = "<strong>" + div + "</strong><br>"
  el.innerHTML += typeof stuff === "object" ? JSON.stringify(stuff) : stuff;
  
  function createElement(parent, type, id) {
  var elem = document.createElement(type);
  if (typeof id !== typeof undefined) {
  elem.id = id;
  }
  parent.appendChild(elem);
  return elem;
  }
  */
  //-----------------------
  
  //-----apps script version
  Logger.log("\n" + div + "\n" + (typeof stuff === "object" ? JSON.stringify(stuff) : stuff));
  //------
  return stuff
}

