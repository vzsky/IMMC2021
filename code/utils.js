const printSortedDict = async (dict, transformKey = (k)=>(k), amount) => {
  var items = Object.keys(dict).map((key) => {
    return [key, dict[key]];
  });
  
  items.sort(function(first, second) {
    return second[1] - first[1];
  });

  if (amount) items = items.slice(0, amount);
  
  for (let item of items) {
    console.log(await transformKey(item[0]), item[1])
  }
}

const unique = (list) => (
  list.filter((value, index, self) => self.indexOf(value) === index)
)

const nCr = (n, r) => {
  let ans = 1
  for(let i = r+1; i <= n; i++){
    ans *= i
  }
  for(let i = 1; i <= n-r; i++){
    ans /= i
  }
  return ans
}

const erfinv = (x) => {
  var z;
  var a  = 0.147;                                                   
  var the_sign_of_x;
  if(0==x) {
      the_sign_of_x = 0;
  } else if(x>0){
      the_sign_of_x = 1;
  } else {
      the_sign_of_x = -1;
  }

  if(0 != x) {
      var ln_1minus_x_sqrd = Math.log(1-x*x);
      var ln_1minusxx_by_a = ln_1minus_x_sqrd / a;
      var ln_1minusxx_by_2 = ln_1minus_x_sqrd / 2;
      var ln_etc_by2_plus2 = ln_1minusxx_by_2 + (2/(Math.PI * a));
      var first_sqrt = Math.sqrt((ln_etc_by2_plus2*ln_etc_by2_plus2)-ln_1minusxx_by_a);
      var second_sqrt = Math.sqrt(first_sqrt - ln_etc_by2_plus2);
      z = second_sqrt * the_sign_of_x;
  } else { // x is zero
      z = 0;
  }
return z;
}

module.exports = { printSortedDict, nCr, erfinv, unique }