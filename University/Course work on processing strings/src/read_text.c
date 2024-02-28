#include "main.h"
#include "communicate.h"

int cmp(const void *a, const void *b){
    return *((const int *)a) - *((const int *)b);
}

char compare(struct Sentence **buf, struct Sentence *nw, int cnt){
    for(int idx = 0; idx < cnt; idx++){
        if(buf[idx]->cnt != nw->cnt)
            continue;
        char flag = 0;
        for(int j = 0; j < buf[idx]->cnt; j++){
            if(towlower(buf[idx]->snt[j]) != towlower(nw->snt[j])){
                flag = 1;
                break;
            }
        }
        if(!flag){
            return 1;
        }
    }
    return 0;
}

struct Sentence *read_snt(){
    int size = MEM_STEP, spec_size = MEM_STEP;
    wchar_t *sp_syms = L"\",{}|[]()+-/%\\;\'.:?<=>_!&*#~^";
    wchar_t *buf = (wchar_t *)malloc(size * sizeof(wchar_t));
    wchar_t *spbuf = (wchar_t *) malloc(spec_size * sizeof(wchar_t));
    int idx = 0, spec_idx = 0, odd = 0;
    wchar_t sym;
    while((sym = getwchar()) != L'.'){
        if(wcschr(L"13579", sym))
            odd = 1;
        if(idx == size - 2){
            size += MEM_STEP;
            wchar_t *nw = (wchar_t *) realloc(buf, size * sizeof(wchar_t));
            if(nw == NULL){
                err(1);
                free(buf);
                free(spbuf);
                return NULL;
            }
            buf = nw;
        }
        if(spec_idx == spec_size - 2){
            spec_size += MEM_STEP;
            wchar_t *nw = (wchar_t *) realloc(spbuf, spec_size* sizeof(wchar_t));
            if(nw == NULL){
                err(1);
                free(buf);
                free(spbuf);
                return NULL;
            }
            spbuf = nw;
        }
        if(sym == L'\n')
            break;
        buf[idx++] = sym;
        if(wcschr(sp_syms, sym)){
            spbuf[spec_idx++] = sym;
        }
    }
    buf[idx++] = sym;
    spbuf[spec_idx++] = L'.';
    buf[idx] = L'\0';
    spbuf[spec_idx] = L'\0';
    qsort(spbuf, spec_idx, sizeof(wchar_t), cmp);
    struct Sentence *beg = (struct Sentence*) malloc(sizeof(struct Sentence));
    beg->snt = buf;
    beg->cnt = idx;
    beg->size = size;
    beg->spec_sym = spbuf;
    beg->ln = spec_idx;
    beg->odd = odd;
    return beg;
}

struct Text *read_text(){
    int size = MEM_STEP;
    struct Sentence **buf = (struct Sentence **) malloc(size* sizeof(struct Sentence *));
    int idx = 0;
    struct Sentence *snt;
    wchar_t sym;
    do{
        if(size - 2 == idx){
            size += MEM_STEP;
            struct Sentence **nw = (struct Sentence **) realloc(buf, size * sizeof(struct Sentence *));
            if(nw == NULL){
                err(1);
                clean_memory(buf, idx);
                return NULL;
            }
            buf = nw;
        }
        snt = read_snt();
        if(snt == NULL){
            err(1);
            clean_memory(buf, idx);
            return NULL;
        }
        else if(snt->snt[snt->cnt - 1] == L'\n'){
            snt->snt[snt->cnt - 1] = L'.';
            buf[idx++] = snt;
            break;
        }
        if(!compare(buf, snt, idx))
            buf[idx++] = snt;
        sym = getwchar();
        if(sym != L'\n' && sym != L' '){
            err(2);
            clean_memory(buf, idx);
            return NULL;
        }
    }while(sym != L'\n');
    struct Text *beg = (struct Text *)malloc(sizeof(struct Text));
    beg->text = buf;
    beg->size = size;
    beg->cnt = idx;
    return beg;
}