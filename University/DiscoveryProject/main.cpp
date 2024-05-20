#include "main.h"

using namespace std;

int main(){
	double JD_start = JD;
	double *vec = new double[12];
	int cnt =  GENERAL_TIME / STEP;
         
	//начальное положение в НСК первого спутника
	vec[0] = 6887.11, vec[1] = -3.63094, vec[2] = -190.193;

	//начальное положение в НСК второго спутника
	vec[3] = 6890.03, vec[4] = 0.342606, vec[5] = 38.0388;

	// начальная скорость в НСК первого спутника
	vec[6] = 0.223331, vec[7] = 0.13241, vec[8] = 7.60563;

	//начальная скорость в НСК второго спутника
	vec[9] = -0.0289007, vec[10] = 0.132469, vec[11] = 7.60842;

	double** orbits = Integrate(JD, STEP, 12, vec); 

	/*
	for(int i = 0; i < cnt; i++){
		cout << "time: " << orbit1[i][0] << " x: " << orbit1[i][1] << " y: " << orbit1[i][2] << " z: " << orbit1[i][3] << endl;
		cout << "Vx: " << orbit1[i][4] << " Vy: " << orbit1[i][5] << " Vz: " << orbit1[i][6] << endl;
		cout << endl;	
	}
	*/
	
	fstream orbit("orbit.txt", ios::out);
	for(int i = 0; i < cnt; i++){
		orbit << orbits[i][1] << " " << orbits[i][2] << " " << orbits[i][3] << endl;
	}
	orbit.close();

	/*
	По программе GRACE между спутниками соблюдалось расстояние ~220 +- 50 км
	После построение первой орбиты заметили, что через шаг расстояние от начальной точки примерно такое
	Поэтому за начальную точку второй орбиты возьмём координаты после этого шага
	*/
	
	/*
	fstream file("orbit.txt", ios::out);
	for(int i = 0; i < cnt; i++){
		file << orbit2[i][1] << " " << orbit2[i][2] << " " << orbit2[i][3] << endl;
	}
	file.close();
	*/

	double* res = OrbitDistance(orbits, cnt);
	
	/*
	for(int i = 0; i < cnt; i++){
		cout << res[i][0] << " " << res[i][1] << endl;
	}
	*/

	for(int i = 0; i < cnt; i++){
		res[2 * i + 1] *= (1 + (rand() % (int)2e5 - 1e5) / 1e8);
	}

	fstream dist("distance.txt", ios::out);
	for(int i = 0; i < cnt; i++){
		dist << res[2 * i] - JD << " " << res[2 * i + 1] << endl;
	}
	dist.close();
	
	LeastSquare* solve = new LeastSquare(res, cnt);
	solve->Iteration(5);
	delete solve;

	for(int i = 0; i < cnt; i++){
		delete[] orbits[i];
	}
	delete[] vec;			
}
