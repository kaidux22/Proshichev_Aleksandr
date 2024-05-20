#ifndef COMPMATH_CONVERTER
#define COMPMATH_CONVERTER

#include <iostream>

using namespace std;

/*
Функция транспонирует матрицу 3х3
*/
void Transposition(double(*matrix)[3]);

/*
Функция применяет матрицу для смены координат
*/
void changeCoords(double(*rotateMatrix)[3], double* vec, int idx);

#endif //COMPMATH_CONVERTER