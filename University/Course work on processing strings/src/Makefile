all: main.o read_text.o tasks.o communicate.o
	gcc main.o read_text.o tasks.o communicate.o -o main
main.o: main.c main.h read_text.h tasks.h communicate.h
	gcc -c main.c
read_text.o: read_text.c main.h read_text.h
	gcc -c read_text.c
tasks.o: tasks.c main.h tasks.h
	gcc -c tasks.c
communicate.o: communicate.c main.h communicate.h
	gcc -c communicate.c
clean:
	rm *.o
