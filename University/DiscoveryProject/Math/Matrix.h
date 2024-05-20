#ifndef COMPMATH_MATRIX
#define COMPMATH_MATRIX

#include <cassert>
#include <iostream>

using namespace std;

/* тип данных: матрицы, хранящая Type-элементы */
template <typename Type>
class Matrix {
public:

	/* конструктор, задающий размеры матрицы */
	Matrix(int n, int m) {
		mRows = n;
		mColumn = m;
		mMatrix = new Type[n * m];
		
		for (int i = 0; i < n * m; i++)
			mMatrix[i] = 0;
	}

	Matrix(Type *vec, int n, int m){
		mRows = n;
		mColumn = m;
		mMatrix = new Type[n * m];

		for(int i = 0; i < n * m; i++){
			mMatrix[i] = vec[i];
		}

	}

	/* получить элемент по строке и столбцу */
	Type Get(int i, int j) const{
		assert(i < mRows && j < mColumn);
		return mMatrix[j * mRows + i];
	}

	/* записать элемент по строке и столбцу */
	void Set(int i, int j, Type value) {
		assert(i < mRows && j < mColumn);
		mMatrix[j * mRows + i] = value;
	}

	/* транспонирование матрицы */
	Matrix<double> Transposition() {
		Matrix<double> newMatrix(mColumn, mRows);

		for(int i = 0; i < mRows; i++){
			for(int j = 0; j < mColumn; j++){
				newMatrix.Set(j, i, Get(i, j));
			}
		}

		return newMatrix;
	}

	/* вывод матрицы */
	void Print() {
		for (int i = 0; i < mRows; i++) {
			for (int j = 0; j < mColumn; j++) {
				cout << mMatrix[j * mRows + i] << " ";
			}
			cout << endl;
		}
		cout << endl;
	}

	/* произведение матриц */
	Matrix<Type> operator *(const Matrix<Type>& other) {
		assert(mColumn == other.mRows);

		Matrix<Type> newMatrix(mRows, other.mColumn);

		for (int i = 0; i < mRows; i++) {
			for (int j = 0; j < other.mColumn; j++) {

				newMatrix.Set(i, j, 0);
				for (int k = 0; k < mColumn; k++) {
					newMatrix.Set(i, j, newMatrix.Get(i, j) + Get(i, k) * other.Get(k, j));
				}
			}
		}

		return newMatrix;
	}

	/* сумма матриц */
	Matrix<Type> operator +(const Matrix<Type> &other) {
		assert(mRows == other.mRows && mColumn == other.mColumn);

		Matrix<Type> newMatrix(mRows, mColumn);
		
		for (int i = 0; i < mRows; i++) {
			for (int j = 0; j < mColumn; j++) {
				newMatrix.Set(i, j, Get(i, j) + other.Get(i, j));
			}
		}
		return newMatrix;

	}

	/* домножение на скаляр */
	void Product(double num) {

		for (int i = 0; i < mRows; i++) {
			for (int j = 0; j < mColumn; j++) {
				mMatrix[j * mRows + i] *= num;
			}
		}
	}
		
	/* перегрузка оператора присваивания */
	Matrix<double>& operator=(Matrix<double> matrix) {
		assert(mRows == matrix.mRows && mColumn == matrix.mColumn);

		for (int i = 0; i < mRows; i++) {
			for (int j = 0; j < mColumn; j++) {
				mMatrix[j * mRows + i] = matrix.Get(i, j);
			}
		}
		return *this;
	}

	/* извлечение строки */
	Matrix<Type> *ExtractRow(int rowNum) {
		Matrix<Type> *vector = new Matrix<Type>(1, mColumn);

		for (int i = 0; i < mColumn; i++) {
			vector->Set(0, i, Get(rowNum, i));
		}

		return vector;
	}

	/* извлечение столбца */
	Matrix<Type> *ExctractColunm(int columnNum) {
		Matrix<Type> *vector = new Matrix<Type>(1, mRows);

		for (int i = 0; i < mRows; i++) {
			vector->Set(0, i, Get(i, columnNum));
		}
		
		return vector;
	}
	
	Type *TransToVector(){
		return mMatrix;
	}

	int RowsCount() const{
		return mRows;
	}

	int ColumnCount() const{
		return mColumn;
	}

	~Matrix() {
		delete[] mMatrix;
	}

private:
	Type* mMatrix;
	int mRows, mColumn;
};

#endif //COMPMATH_MATRIX
