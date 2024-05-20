#ifndef COMPMATH_COMPLEXNUMS
#define COMPMATH_COMPLEXNUMS

#include <iostream>
#include <cmath>

using namespace std;

/* Новый тип числовых данных: комплексные числа */
class ComplexNum {
public:

	/* 	Конструктор комплесного числа a + bi задаётся в формате ComplexNum(a, b) */
	ComplexNum(double real, double img) : mReal(real), mImg(img) {}

	/* преобразования double в ComplexNum */
	explicit ComplexNum(double realNum) : ComplexNum(realNum, 0) {}

	/* Вещественная часть комплексного числа*/
	double Real() const { return mReal; }

	/* Мнимая часть комплексного числа */
	double Img() const { return mImg; }

	/* Отрицание комплескного числа */
	ComplexNum operator -() const {
		return ComplexNum(-mReal, -mImg);
	}

	/* Сумма комплексных чисел */
 	ComplexNum operator +(const ComplexNum& other) const {
		return ComplexNum(mReal + other.Real(), mImg + other.Img());
	}

	/* Разность комплексных чисел */
	ComplexNum operator -(const ComplexNum& other) const {
		return ComplexNum(mReal - other.Real(), mImg - other.Img());
	}

	/* Произведение комплексных чисел */
	ComplexNum operator *(const ComplexNum& other) {
		return ComplexNum(mReal * other.Real() - mImg * other.Img(), mReal * other.Img() + mImg * other.Real());
	}
	
	/* Модуль комплексного числа */
	double Module() {
		return sqrt(mReal * mReal + mImg * mImg);
	}

	/* Агрумент комплексного числа */
	double Arg() {
		return atan(mImg / mReal);
	}

	/* Сопряжённое комплексное число */
	ComplexNum Conj() {
		return ComplexNum(mReal, -mImg);
	}
	
	/* Формула НеМуавра */
	ComplexNum Pow(double k) {
		ComplexNum res = ComplexNum(1, 0);
		for(int i = 0; i < k; i++){
			res = res * ComplexNum(mReal, mImg);
		}
		return res;
	}

	/* Вывод комплексного числа в формате a+bi */
	friend std::ostream& operator <<(std::ostream& out, const ComplexNum& num) {
		out << num.Real() << "+" << num.Img() << "i";
		return out;
	}

private:
	double mReal, mImg;
};

#endif //COMPMATH_COMPLEXNUMS