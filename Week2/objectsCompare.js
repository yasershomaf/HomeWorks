//This function compares between 2 objects, the third parameter (comp) decides to use "===" or "==" in comparison, "true" for "===" and "false" for "==".
function compareObjects (obj1, obj2, comp) {
    if (objectLength(obj1) == objectLength(obj2)) {
        var result = true;
        for (var i in obj1) {
            //Procedures for comparing properties of none (array or object) types.
            if (typeof(obj1[i]) == "string" || typeof(obj1[i]) == "number" || typeof(obj1[i]) == "boolean") {
                if (lookForProperty(obj2, i, obj1[i], comp) == false)
                    return false;
            }
            //Procedures for comparing properties of object type.
            else if (typeof(obj1[i]) == "object") {
                if (obj2.hasOwnProperty(i)) {
                    if (typeof(obj2[i]) == "object") {
                        result = compareObjects (obj1[i], obj2[i], comp);
                    }
                    else
                        return false;
                }
                else 
                    return false;
            }
            //Procedures for comparing properties of array type.
            else if (typeof(obj1[i]) == "array") {
                if (obj2.hasOwnProperty(i)) {
                    if (typeof(obj2[i]) == "array") {
                        result = compareArrays (obj1[i], obj2[i], comp);
                    }
                    else
                        return false;
                }
                else
                    return false;
            }
        }
        return result;
    }
    else
        return false;
}

//A function that gives length of an object.
function objectLength(obj) {
    var counter = 0;
    for (var i in obj) {
        counter++;
    }
    return counter;
}

//This function takes a property of object and looks for an equal property in another object, the third parameter (comp) decides to use "===" or "==" in comparison, "true" for "===" and "false" for "==".
function lookForProperty(obj, proName, proValue, comp) {
    if (obj.hasOwnProperty(proName)) {
        if ((comp && obj[proName] === proValue) || (!comp && obj[proName] == proValue))
            return true;
    }
    return false;
}

//This function compares between 2 arrays, the third parameter (comp) decides to use "===" or "==" in comparison, "true" for "===" and "false" for "==".
function compareArrays (array1, array2, comp) {
    if (array1.length == array2.length) {
        var result = true;
        for (var i=0; i<array1.length; i++) {
            //Procedures for comparing items of none (array or object) types.
            if (typeof(array1[i]) == "string" || typeof(array1[i]) == "number" || typeof(array1[i]) == "boolean") {
                if ((comp && array1[i] !== array2[i]) || (!comp && array1[i] != array2[i]))
                    return false;
            }
            //Procedures for comparing items of object type.
            else if (typeof(array1[i]) == "object") {
                if (typeof(array2[i]) == "object")
                    result = compareObjects (array1[i], array2[i], comp);
                else 
                    return false;
            }
            //Procedures for comparing items of array type.
            else if (typeof(array1[i]) == "array") {
                if (typeof(array2[i]) == "array")
                    result = compareArrays (array1[i], array2[i], comp);
                else
                    return false;
            }
        }
        return result;
    }
    else
        return false;
}

var obj1 = {
    a: 1,
    b: 'this is the letter b',
    c: {
        foo: 'what is a foo anyway',
        bar: [1,2,3,4]
    }
}
var obj2 = {
    a: '1',
    b: 'this is the letter b',
    c: {
        foo: 'what is a foo anyway',
        bar: [1,2,3,4]
    }
}

console.log(compareObjects(obj1, obj2, true));
