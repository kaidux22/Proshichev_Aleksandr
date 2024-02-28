#include "main.h"
#include "communicate.h"

void translit(struct Text *aim){
    wchar_t *trans_up = L"ABVGDEŽZIJKLMNOPRSTUFHCČŠŜʺYʹÈÛÂ";
    wchar_t *trans_lw = L"abvgdežzijklmnoprstufhcčšŝʺyʹèûâ";
    for(int idx = 0; idx < aim->cnt; idx++){
        for(int smidx = 0; smidx < aim->text[idx]->cnt; smidx++){
            wchar_t *sym = &aim->text[idx]->snt[smidx];
            for(wchar_t letter = L'А'; letter <= L'Я'; letter++){
                if(letter == *sym) {
                    *sym = trans_up[letter - L'А'];
                    break;
                }
                else if(*sym == towlower(letter)) {
                    *sym = trans_lw[letter - L'А'];
                    break;
                }
                else if(*sym == L'Ё'){
                    *sym = trans_up[6];
                }
                else if(*sym == L'ё'){
                    *sym = trans_lw[6];
                }
            }
        }
    }
}

void special_sym(struct Text *aim){
    for(int idx = 0; idx < aim->cnt; idx++){
        wprintf(L"%ld предложение: ", idx + 1);
        for(int smidx = 0; smidx < aim->text[idx]->ln; smidx++){
            wprintf(L"%lc ", aim->text[idx]->spec_sym[smidx]);
        }
        wprintf(L"%lc", L'\n');
    }
    if(!aim->cnt)
        wprintf(L"Все предложения были удалены.\n");
}

int bin_digit(struct Text *aim){
    for(int idx = 0; idx < aim->cnt; idx++){
        for(int elem = 0; elem < aim->text[idx]->cnt;){
            if(!iswdigit(aim->text[idx]->snt[elem]) || aim->text[idx]->snt[elem] < L'2') {
                elem++;
                continue;
            }
            aim->text[idx]->odd = 1;
            if(aim->text[idx]->cnt >= aim->text[idx]->size - 4){
                aim->text[idx]->size += MEM_STEP;
                wchar_t *nw = (wchar_t *) realloc(aim->text[idx]->snt, aim->text[idx]->size * sizeof(wchar_t));
                if(nw == NULL){
                    err(1);
                    clean_memory(aim->text, aim->size);
                    return 1;
                }
                aim->text[idx]->snt = nw;
            }
            int num = aim->text[idx]->snt[elem] - L'0';
            int step, ind;
            if(num < 4){
                step = 1;
            }
            else if(num < 8){
                step = 2;
            }
            else{
                step = 3;
            }
            aim->text[idx]->cnt += step;
            for(ind = aim->text[idx]->cnt; elem + step < ind; ind--){
                aim->text[idx]->snt[ind] = aim->text[idx]->snt[ind - step];
            }
            for(ind; elem <= ind; ind--){
                aim->text[idx]->snt[ind] = (num % 2) + L'0';
                num >>= 1;
            }
            elem += step;
        }
    }
    return 0;
}

void delete_snt(struct Text *aim){
    int cnt = 0;
    for(int idx = 0; idx < aim->cnt;){
        if(aim->text[idx]->odd){
            free(aim->text[idx]->snt);
            free(aim->text[idx]->spec_sym);
            aim->cnt--;
            cnt++;
        }
        else{
            idx++;
        }
        aim->text[idx] = aim->text[idx + cnt];
    }
}