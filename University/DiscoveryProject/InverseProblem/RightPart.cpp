#include "RightPart.h"

double GravPotWithParams(double* vec, Matrix<double> *params, ComplexNum(*func)(LegFunc&, int, int, double*)) {

	int N = N_CONST;
	double R = R_CONST;
	//первый индекс - m, второй индекс - n
	//С[0][n] = Jn
	double Cmn[5][5] = { { -1.0, 0.0, 0.1082635854e-2, -0.2532435346e-5, -0.1619331205e-5 },
					   {0.0, 0.0, -0.3504890360e-9, 0.2192798802e-5, -0.5087253036e-6},
					   {0.0, 0.0, 0.1574536043e-5, 0.3090160446e-6, 0.7841223074e-7},
					   {0.0, 0.0, 0.0, 0.1005588574e-6, 0.5921574319e-7},
					   {0.0, 0.0, 0.0, 0.0, -0.3982395740e-8} };
	// первый индекс - m, второй индекс - n
	double Smn[5][5] = { {0.0, 0.0, 0.0, 0.0, 0.0},
					   {0.0, 0.0, 0.1635406077e-8, 0.2680118938e-6, -0.4494599352e-6},
					   {0.0, 0.0, -0.9038680729e-6, -0.2114023978e-6, 0.1481554569e-6},
					   {0.0, 0.0, 0.0, 0.1972013239e-6, -0.1201129183e-7},
					   {0.0, 0.0, 0.0, 0.0, 0.6525605810e-8} };
	
	int cnt = 0;
    //Cmn
    for(int n = 2; n <= 4; n++){
        for(int m = 0; m <= n; m++){
            Cmn[m][n] = params->Get(cnt, 0);
            cnt++;
        }
    }

    //Smn
    for(int n = 2; n <= 4; n++){
        for(int m = 1; m <= n; m++){
            Smn[m][n] = params->Get(cnt, 0);
            cnt++;
        }
    }
	
	//Создаю таблицу значений полиномов Лежандра до N + 2 степени и порядка
	LegFunc Pmn = LegFunc(N + MAX_ORD, N + MAX_ORD, vec[2] / sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]));
	//Pmn.PrintMaxtrix();
	ComplexNum res = ComplexNum(0, 0);


	for (int n = 0; n <= N; n++) {
		if (n == 1) {
			continue;
		}
		for (int m = 0; m <= n; m++) {
			res = res + (ComplexNum(R, 0).Pow(n) * ComplexNum(Cmn[m][n], -Smn[m][n])) * func(Pmn, n, m, vec);
		}
	}

	return NU_CONST * res.Real();
}

Matrix<double> *MatrixdFdX(double *x, Matrix<double> *params, double JD){
    Matrix<double> *dFdX = new Matrix<double>(12, 12);
    for(int i = 0; i < 6; i++){
        dFdX->Set(i, i + 6, 1);
    }

	double matrix[3][3];

    iauC2t06a(JD + (37.0 + 32.184) / 86400.0, 0, JD, 0, 0, 0, matrix);

	Transposition(matrix);

	Matrix<double> *rotateMatrix = new Matrix<double>(3, 3);
	for(int i = 0; i < 3; i++){
		for(int j = 0; j < 3; j++){
			rotateMatrix->Set(i, j, matrix[i][j]);
		}
	} 

	Matrix<double> *direvMatrix = new Matrix<double>(3, 3);
	direvMatrix->Set(0, 0, -GravPotWithParams(x, params, Vdxdx)), direvMatrix->Set(0, 1, -GravPotWithParams(x, params, Vdxdy)), direvMatrix->Set(0, 2, -GravPotWithParams(x, params, Vdxdz));
	direvMatrix->Set(1, 0, -GravPotWithParams(x, params, Vdxdy)), direvMatrix->Set(1, 1, -GravPotWithParams(x, params, Vdydy)), direvMatrix->Set(1, 2, -GravPotWithParams(x, params, Vdydz));
    direvMatrix->Set(2, 0, -GravPotWithParams(x, params, Vdxdz)), direvMatrix->Set(2, 1, -GravPotWithParams(x, params, Vdydz)), direvMatrix->Set(2, 2, -GravPotWithParams(x, params, Vdzdz));

	Matrix<double> saveRes = (*rotateMatrix * *direvMatrix * rotateMatrix->Transposition());

	for(int i = 0; i < 3; i++){
		for(int j = 0; j < 3; j++){
			dFdX->Set(6 + i, j, saveRes.Get(i, j));
			dFdX->Set(6 + i, 3 + j, 0);
		}
	}

	direvMatrix->Set(0, 0, -GravPotWithParams(x + 3, params, Vdxdx)), direvMatrix->Set(0, 1, -GravPotWithParams(x + 3, params, Vdxdy)), direvMatrix->Set(0, 2, -GravPotWithParams(x + 3, params, Vdxdz));
    direvMatrix->Set(1, 0, -GravPotWithParams(x + 3, params, Vdxdy)), direvMatrix->Set(1, 1, -GravPotWithParams(x + 3, params, Vdydy)), direvMatrix->Set(1, 2, -GravPotWithParams(x + 3, params, Vdydz));
    direvMatrix->Set(2, 0, -GravPotWithParams(x + 3, params, Vdxdz)), direvMatrix->Set(2, 1, -GravPotWithParams(x + 3, params, Vdydz)), direvMatrix->Set(2, 2, -GravPotWithParams(x + 3, params, Vdzdz));

	saveRes = (*rotateMatrix * *direvMatrix * rotateMatrix->Transposition());

	for(int i = 0; i < 3; i++){
		for(int j = 0; j < 3; j++){
			dFdX->Set(9 + i, j, 0);
			dFdX->Set(9 + i, 3 + j, saveRes.Get(i, j));
		}
	}
	delete rotateMatrix;
	delete direvMatrix;

	return dFdX;
}

Matrix<double> *MatrixdFdParam(double *x, Matrix<double> *params, double JD){
	Matrix<double> *dFdParam = new Matrix<double>(12, UNKNOWN_PARAM);

	double matrix[3][3], vec[3];

    iauC2t06a(JD + (37.0 + 32.184) / 86400.0, 0, JD, 0, 0, 0, matrix);

	Transposition(matrix);

	int cnt = 0;
    //Cmn
    for(int n = 2; n <= 4; n++){
        for(int m = 0; m <= n; m++){
			vec[0] = -DerivativedVdC(x, params, n, m, Vdx), vec[1] = -DerivativedVdC(x, params, n, m, Vdy), vec[2] = -DerivativedVdC(x, params, n, m, Vdz);
			changeCoords(matrix, vec, 0);
            dFdParam->Set(6, cnt, vec[0]), dFdParam->Set(7, cnt, vec[1]), dFdParam->Set(8, cnt, vec[2]);
			
			vec[0] = -DerivativedVdC(x + 3, params, n, m, Vdx), vec[1] = -DerivativedVdC(x + 3, params, n, m, Vdy), vec[2] = -DerivativedVdC(x + 3, params, n, m, Vdz);
			changeCoords(matrix, vec, 0);
			dFdParam->Set(9, cnt, vec[0]), dFdParam->Set(10, cnt, vec[1]), dFdParam->Set(11, cnt, vec[2]);
            cnt++;
        }
    }

    //Smn
    for(int n = 2; n <= 4; n++){
        for(int m = 1; m <= n; m++){
            vec[0] = -DerivativedVdS(x, params, n, m, Vdx), vec[1] = -DerivativedVdS(x, params, n, m, Vdy), vec[2] = -DerivativedVdS(x, params, n, m, Vdz);
			changeCoords(matrix, vec, 0);
            dFdParam->Set(6, cnt, vec[0]), dFdParam->Set(7, cnt, vec[1]), dFdParam->Set(8, cnt, vec[2]);
			
			vec[0] = -DerivativedVdS(x + 3, params, n, m, Vdx), vec[1] = -DerivativedVdS(x + 3, params, n, m, Vdy), vec[2] = -DerivativedVdS(x + 3, params, n, m, Vdz);
			changeCoords(matrix, vec, 0);
			dFdParam->Set(9, cnt, vec[0]), dFdParam->Set(10, cnt, vec[1]), dFdParam->Set(11, cnt, vec[2]);
            cnt++;
        }
    }
	

    return dFdParam;
}

void RightPart(double* x, double* vec, double JD, Matrix<double> *params) {
    vec[0] = x[6];
    vec[1] = x[7];
    vec[2] = x[8];
    vec[3] = x[9];
    vec[4] = x[10];
    vec[5] = x[11];

	vec[6] = 0;
	vec[7] = 0;
	vec[8] = 0;
	vec[9] = 0;
	vec[10] = 0;
	vec[11] = 0;

	/*
	for(int i = 0; i < 12; i++){
		cout << vec[i] << endl;
	}
	cout << endl;
	*/

    double rotateMatrix[3][3];

    iauC2t06a(JD + (37.0 + 32.184) / 86400.0, 0, JD, 0, 0, 0, rotateMatrix);

    changeCoords(rotateMatrix, x, 0);
	changeCoords(rotateMatrix, x, 3);

    double *grad = new double[6];
	
    grad[0] = -GravPotWithParams(x, params, Vdx);
    grad[1] = -GravPotWithParams(x, params, Vdy);
    grad[2] = -GravPotWithParams(x, params, Vdz);
	
	grad[3] = -GravPotWithParams(x + 3, params, Vdx);
	grad[4] = -GravPotWithParams(x + 3, params, Vdy);
	grad[5] = -GravPotWithParams(x + 3, params, Vdz);
	
	Matrix<double> *dFdX = MatrixdFdX(x, params, JD);
	Matrix<double> *dXdParam = new Matrix<double>(x + 12, 12, UNKNOWN_PARAM);
    Matrix<double> *dFdParam = MatrixdFdParam(x, params, JD);
	Matrix<double> prod = *dFdX * *dXdParam + *dFdParam;
	//prod.Print();


	double *res = prod.TransToVector();

	for(int i = 12; i < 12 + 12 * UNKNOWN_PARAM; i++){
		vec[i] = res[i - 12];
	}

	delete dFdX;
	delete dXdParam;
	delete dFdParam;

    Transposition(rotateMatrix);

	changeCoords(rotateMatrix, grad, 0);
	changeCoords(rotateMatrix, grad, 3);
    for (int i = 0; i < 6; i++) {
        vec[i + 6] = grad[i];
    }

}
