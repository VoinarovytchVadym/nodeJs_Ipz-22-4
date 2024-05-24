// Load the full build
var _ = require('lodash');

// ділить масив на частини
let array =
    _.chunk(['1','2','3','4'], 2);
console.log(array)

// видаляє false елементи
let array_with_false = [1,2,3,4,0,5];
console.log(_.compact(array_with_false));

// додає елементи в кінець
let empty_array= [];
console.log(_.concat(empty_array,[1,2,3,4]));

// видаляє елементи в першому масиві якщо вони містяться в другому
let array_with_A = [1,2,3,'A'];
console.log(_.difference(array_with_A, ['A']));

// видаляє всі елементи починаючи з початку до вказаного елементу включно
let array_with_5_elements = [1,2,3,4,5];
console.log(_.drop(array_with_5_elements, 3))