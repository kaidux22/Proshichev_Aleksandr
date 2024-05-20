#include "Converter.h"

void Transposition(double(*matrix)[3]) {
	for (int i = 0; i < 3; i++) {
		for (int j = i; j < 3; j++) {
			double tmp = matrix[i][j];
			matrix[i][j] = matrix[j][i];
			matrix[j][i] = tmp;
		}
	}
}

void changeCoords(double(*rotateMatrix)[3], double* vec, int idx) {
	double* newCoords = new double[3];
	for (int i = 0; i < 3; i++) {
		newCoords[i] = rotateMatrix[i][0] * vec[idx] + rotateMatrix[i][1] * vec[idx + 1] + rotateMatrix[i][2] * vec[idx + 2];
	}
	
	for(int i = 0; i < 3; i++)
		vec[idx + i] = newCoords[i];
	delete newCoords;
}