#include "IntegrateFunc.h"

void DormandPrince(double JD, double h, const int N, double* vec, double a[7][7], double b[7], double** k, double c[7], Matrix<double> *params, void (*f)(double*, double*, double, Matrix<double>*)) {

    double* x = new double[N];

    for (int i = 0 ; i < 7; i++) {
        for (int j = 0; j < N; j++) {
            
            x[j] = vec[j];
            for (int t = 0; t < 7; t++) {
                x[j] += a[i][t] * h * k[t][j];
            }
        }
        f(x, k[i], JD + c[i]* (h / 86400.0), params);
    }

    for (int i = 0; i < N; i++) {
        for (int j = 0; j < 7; j++) {
            vec[i] += b[j] * k[j][i] *h ;
        }
    }

    delete[] x;

}

double** Integrate(double JD, double h, const int N, double* vec) {

    double a[7][7] = { {0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 },
                       {1.0 / 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0},
                       {3.0 / 40.0, 9.0 / 40.0, 0.0, 0.0, 0.0, 0.0, 0.0},
                       {44.0 / 45.0, -56.0 / 15.0, 32.0 / 9.0, 0.0, 0.0, 0.0, 0.0 },
                       {19372.0 / 6561.0, -25360.0 / 2187.0, 64448.0 / 6561.0, -212.0 / 729.0, 0.0, 0.0, 0.0 },
                       {9017.0 / 3168.0, -355.0 / 33.0, 46732.0 / 5247.0, 49.0 / 176.0, -5103.0 / 18656.0, 0.0, 0.0},
                       {35.0 / 384.0, 0.0, 500.0 / 1113.0, 125.0 / 192.0, -2187.0 / 6784.0, 11.0 / 84.0, 0.0},
    };
    double c[7] = {0.0, 1.0 / 5.0, 3.0/10.0, 4.0/5.0, 8.0/9.0, 1.0, 1.0 };

    double b[7] = { 5179.0 / 57600.0, 0.0, 7571.0 / 16695.0, 393.0 / 640.0, -92097.0 / 339200.0, 187.0 / 2100.0, 1.0 / 40.0 };

    double** k = new double* [7];
    for (int i = 0; i < 7; i++) {
        k[i] = new double[N];
        for (int j = 0; j < N; j++) {
            k[i][j] = 0;
        }
    }

    int cnt = GENERAL_TIME / h;
    double** orbit = new double* [cnt];
    // 86400 секунд в сутках
    for (int i = 0; i < cnt; i++) {
        DormandPrince(JD, h, N, vec, a, b, k, c, nullptr, GradV);
        orbit[i] = new double[1 + N];
        orbit[i][0] = JD;
        for(int j = 0; j < N; j++)
            orbit[i][j + 1] = vec[j];
        JD += h / 86400.0;
    }

    return orbit;

}

double** ConditionVectorIntegrate(double JD, double h, const int N, double* vec, Matrix<double> *params) {

    double a[7][7] = { {0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 },
                       {1.0 / 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0},
                       {3.0 / 40.0, 9.0 / 40.0, 0.0, 0.0, 0.0, 0.0, 0.0},
                       {44.0 / 45.0, -56.0 / 15.0, 32.0 / 9.0, 0.0, 0.0, 0.0, 0.0 },
                       {19372.0 / 6561.0, -25360.0 / 2187.0, 64448.0 / 6561.0, -212.0 / 729.0, 0.0, 0.0, 0.0 },
                       {9017.0 / 3168.0, -355.0 / 33.0, 46732.0 / 5247.0, 49.0 / 176.0, -5103.0 / 18656.0, 0.0, 0.0},
                       {35.0 / 384.0, 0.0, 500.0 / 1113.0, 125.0 / 192.0, -2187.0 / 6784.0, 11.0 / 84.0, 0.0},
    };
    double c[7] = {0.0, 1.0 / 5.0, 3.0/10.0, 4.0/5.0, 8.0/9.0, 1.0, 1.0 };

    double b[7] = { 5179.0 / 57600.0, 0.0, 7571.0 / 16695.0, 393.0 / 640.0, -92097.0 / 339200.0, 187.0 / 2100.0, 1.0 / 40.0 };

    double** k = new double* [7];
    for (int i = 0; i < 7; i++) {
        k[i] = new double[N];
        for (int j = 0; j < N; j++) {
            k[i][j] = 0;
        }
    }

    int cnt = GENERAL_TIME / h;
    double** states = new double* [cnt];
    // 86400 секунд в сутках
    for (int i = 0; i < cnt; i++) {
        DormandPrince(JD, h, N, vec, a, b, k, c, params, RightPart);
        states[i] = new double[1 + N];
        states[i][0] = JD;
        for(int j = 1; j < N + 1; j++)
            states[i][j] = vec[j - 1];
        
        JD += h / 86400.0;
    }

    return states;

}