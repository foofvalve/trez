var a = [ { "test-a": "Passed" } , { "test-b":"Failed"} , { "test-c": "Passed"} ]
var b = [ { "test-n": "Failed" } , { "test-b":"Failed"} , { "test-c": "Passed"} ]
var c = [ { "test-a": "Failed" } , { "test-b":"Failed"} ]

var tests = ['test-a','test-b','test-c', 'test-k', 'test-n']

var summary = [];
var expected = [
  {"test_name":"test-a", "a": "Passed", "b": "", "c": "Failed"},
  {"test_name":"test-b", "a": "Failed", "b": "Failed", "c": "Failed"},
  {"test_name":"test-c", "a": "Passed", "b": "Passed", "c": ""},  
  {"test_name":"test-k", "a": "", "b": "", "c": ""},
  {"test_name":"test-n", "a": "", "b": "Failed", "c": ""}
];

var getResult = function(testName, results) {
  var result = results.filter((e) => {
    return e[testName];
  });

  if (typeof result !== 'undefined' && result.length > 0) {
    return result[0][testName]
  } else {
    return '';
  }
}

tests.forEach((test) => {
  summary.push({
    "test_name" : test,
    "a": getResult(test, a),
    "b": getResult(test, b),
    "c": getResult(test, c)
  })
})

console.table(expected);
console.table(summary);
