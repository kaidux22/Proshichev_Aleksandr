#ifndef COMPMATH_GRAVPOT
#define COMPMATH_GRAVPOT

#include <cmath>
#include <cassert>
#include <iostream>

#include "../Math/LegFunc.h"
#include "../Math/ComplexNums.h"
#include "DerivativesV.h"
#include "Converter.h"
#include "../sofa/sofa.h"
#include "../Math/Matrix.h"

#define N_CONST 4
#define NU_CONST 398600.4415 // км^3/с^2
#define R_CONST 6378.1363 // км
#define M_CONST 5,972e24 // кг
#define MAX_ORD 2 //наибольшая степень производной
#define GENERAL_TIME 5.0 * 86400.0 //сутки в секундах
#define ANGLE 89.0 //наклон орбиты

#define UNKNOWN_PARAM 21

using namespace std;

/* Вычисление гравитационного потенциала */
double GravPot(double* vec, ComplexNum(*func)(LegFunc&, int, int, double*));

/* Гравитационный потенцил с кастомизацией параметров */
double GravPotWithParams(double* vec, Matrix<double> *params, ComplexNum(*func)(LegFunc&, int, int, double*));

/* Производная по Cnm */
double DerivativedVdC(double* vec, Matrix<double> *params, int n, int m, ComplexNum(*func)(LegFunc&, int, int, double*));

/* Производная по Snm */
double DerivativedVdS(double* vec, Matrix<double> *params, int n, int m, ComplexNum(*func)(LegFunc&, int, int, double*));

/* Производная по M */
double DerivativedVdGM(double* vec, Matrix<double> *params, ComplexNum(*func)(LegFunc&, int, int, double*));

/* Подсчёт градиента гравитационного потенциала */
void GradV(double* x, double* vec, double JD, Matrix<double> *params);

#endif //COMPMATH_GRAVPOT