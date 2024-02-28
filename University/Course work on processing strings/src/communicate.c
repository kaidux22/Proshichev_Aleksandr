#include "main.h"

void err(int a){
    switch (a) {
        case 1:
            wprintf(L"Ошибка! Выделение памяти невозможно!\n");
            break;
        case 2:
            wprintf(L"Ошибка! Некорректные входные данные! Пожалуйста, разделяйте предложения пробелом.\n");
            break;
    }
}

void print_text(struct Text *txt) {
    for (int idx = 0; idx < txt->cnt; idx++) {
        wprintf(L"%ls ", txt->text[idx]->snt);
    }
    if(!txt->cnt)
        wprintf(L"Все предложения были удалены.");
    wprintf(L"\n");
}

void clean_memory(struct Sentence **del, int n){
    // del[i]->snt = **(del + i).snt
    for(int i = 0; i < n; i++){
        free(del[i]->snt);
        free(del[i]->spec_sym);
        free(del[i]);
    }
    free(del);
}