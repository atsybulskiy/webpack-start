export default function storage(length, width, height, weight) {
    let storage = 6;
    let longestSide = length;
    let medianSide = width;
    let shortestSide = height;

    if (length >= width && width >= height) {
        longestSide = length;
        medianSide = width;
        shortestSide = height;
    } else if (length >= height && height >= width) {
        longestSide = length;
        medianSide = height;
        shortestSide = width;
    } else if (width >= length && length >= height) {
        longestSide = width;
        medianSide = length;
        shortestSide = height;
    } else if (width >= height && height >= length) {
        longestSide = width;
        medianSide = height;
        shortestSide = length;
    } else if (height >= length && length >= width) {
        longestSide = height;
        medianSide = width;
        shortestSide = length;
    } else {
        longestSide = height;
        medianSide = length;
        shortestSide = width;
    }

    console.log(`longestSide: ${longestSide}, medianSide: ${medianSide}, shortestSide: ${shortestSide}`);

    if (longestSide < 15 && medianSide < 12 && shortestSide < 0.75 && weight < 0.75)
        storage = 1;
    else if (longestSide < 18 && medianSide < 14 && shortestSide < 8 && weight < 20)
        storage = 2;
    else if (longestSide < 60 && medianSide < 30 && shortestSide * 2 + medianSide * 2 + longestSide < 130 && weight < 70)
        storage = 3;
    else if (longestSide < 108 && medianSide * 2 + shortestSide * 2 + longestSide < 130 && weight < 150)
        storage = 4;
    else if (longestSide < 108 && medianSide * 2 + shortestSide * 2 + longestSide < 165 && weight < 150)
        storage = 5;

    return storage;
}
