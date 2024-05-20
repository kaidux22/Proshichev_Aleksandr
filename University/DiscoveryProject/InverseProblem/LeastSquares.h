#ifndef COMPMATH_LEASTSQUARES
#define COMPMATH_LEASTSQUARES

#include <iostream>
#include <cmath>
#include <cstdlib>

#include "../Math/Matrix.h"
#include "../NumIntegrate/IntegrateFunc.h"
#include "DistanceOrbits.h"

/* Юлианская дата */
#define JD 2451545.0

/* Шаг в 1 минуту */
#define STEP 30.0 //с

/* G * m */
#define GM 398600.4415 // км^3 / с^2

/* радиус Земли + 500 км */
#define START_POINT 6878.0 //км


/* Метод наименьших квадратов */
class LeastSquare{
public:

    /* Иницилизация начальных параметров */
    LeastSquare(double *measure, int measureCnt);

    /* Один шаг метода Ньютона-Гаусса */
    void Iteration(int staps = 1);

    ~LeastSquare();
private:
    Matrix<double> *MatrixdGdX();
    Matrix<double> *CholeskyDecomposition(Matrix<double> *MatrixA, Matrix<double> *Vectorb);

    int mMeasureCount;

    double *mMeasure;
    double *mVec;
    Matrix<double> *mStates;
    Matrix<double> *mParams;

    // Невязки
    Matrix<double> *mResiduals;
    Matrix<double> *mMatrixA;
    Matrix<double> *mTruth;
    char* mSymb[UNKNOWN_PARAM] = {"C02", "C12", "C22", 
                                  "C03", "C13", "C23", "C33", 
                                  "C04", "C14", "C24", "C34", "C44", 
                                  "S12", "S22", 
                                  "S13", "S23", "S33", 
                                  "S14", "S24", "S34", "S44"};
};

#endif //COMPMATH_LEASTSQUARES