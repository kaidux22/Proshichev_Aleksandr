#ifndef COMPMATH_INTEGRATEFUNC
#define COMPMATH_INTEGRATEFUNC

#include "../Math/Matrix.h"
#include "../InverseProblem/RightPart.h"

/* Численное интегрирование методом Дорманда-Принца */
void DormandPrince(double JD, double h, const int N, double* vec, double a[7][7], double b[7], double** k, double c[7], Matrix<double> *params, void (*f)(double*, double*, double, Matrix<double>*));

/* Решение систему ОДУ */
double **Integrate(double JD_start, double h, const int N, double *vec);

/* Решение систему ОДУ с вектором состояний*/
double **ConditionVectorIntegrate(double JD_start, double h, const int N, double *vec, Matrix<double> *params);

#endif //COMPMATH_INTEGRATEFUNC