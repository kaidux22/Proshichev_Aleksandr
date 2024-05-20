#ifndef COMPMATH_VNM
#define COMPMATH_VNM

#include "../Math/ComplexNums.h"
#include "../Math/LegFunc.h"

/* функция, для подсчёта градиента */
ComplexNum Vnm(LegFunc& Pmn, int n, int m, double* vec);

/* производная по х */
ComplexNum Vdx(LegFunc& Pmn, int n, int m, double* vec);

/* производная по y */
ComplexNum Vdy(LegFunc& Pmn, int n, int m, double* vec);

/* производная по z */
ComplexNum Vdz(LegFunc& Pmn, int n, int m, double* vec);

ComplexNum Vdxdx(LegFunc& Pmn, int n, int m, double* vec);

ComplexNum Vdydy(LegFunc& Pmn, int n, int m, double* vec);

ComplexNum Vdzdz(LegFunc& Pmn, int n, int m, double* vec);

ComplexNum Vdxdy(LegFunc& Pmn, int n, int m, double* vec);

ComplexNum Vdxdz(LegFunc& Pmn, int n, int m, double* vec);

ComplexNum Vdydz(LegFunc& Pmn, int n, int m, double* vec);

#endif //COMPMATH_VNM