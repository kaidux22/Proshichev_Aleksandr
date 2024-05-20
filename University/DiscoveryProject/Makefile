all: CompMath

CompMath: sofa.a main.o GravPot.o Converter.o DerivativesV.o DistanceOrbits.o LeastSquares.o IntegrateFunc.o RightPart.o
	g++ main.o GravPot.o Converter.o DerivativesV.o DistanceOrbits.o LeastSquares.o IntegrateFunc.o RightPart.o sofa/libsofa_c.a -o CompMath

main.o: main.cpp main.h Math/ComplexNums.h Formule/Converter.h Math/Matrix.h
	g++ -c main.cpp

GravPot.o: Formule/GravPot.cpp Formule/GravPot.h Math/LegFunc.h Math/ComplexNums.h Formule/DerivativesV.h Formule/Converter.h Math/Matrix.h
	g++ -c Formule/GravPot.cpp
 
Converter.o: Formule/Converter.cpp Formule/Converter.h
	g++ -c Formule/Converter.cpp

DerivativesV.o: Formule/DerivativesV.cpp Formule/DerivativesV.h Math/ComplexNums.h Math/LegFunc.h
	g++ -c Formule/DerivativesV.cpp

DistanceOrbits.o: InverseProblem/DistanceOrbits.cpp InverseProblem/DistanceOrbits.h
	g++ -c InverseProblem/DistanceOrbits.cpp

LeastSquares.o: InverseProblem/LeastSquares.cpp InverseProblem/LeastSquares.h Math/Matrix.h NumIntegrate/IntegrateFunc.h
	g++ -c InverseProblem/LeastSquares.cpp

IntegrateFunc.o: NumIntegrate/IntegrateFunc.cpp NumIntegrate/IntegrateFunc.h Math/Matrix.h InverseProblem/RightPart.h
	g++ -c NumIntegrate/IntegrateFunc.cpp

RightPart.o: InverseProblem/RightPart.h InverseProblem/RightPart.cpp Math/Matrix.h sofa/sofa.h Formule/Converter.h Formule/GravPot.h
	g++ -c InverseProblem/RightPart.cpp

sofa.a:
	$(MAKE) -C ./sofa

clean:
	rm -rf *.o
	rm CompMath
	$(MAKE) clean -C ./sofa
