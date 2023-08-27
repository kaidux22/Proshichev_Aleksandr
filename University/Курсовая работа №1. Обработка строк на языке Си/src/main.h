#include <wchar.h>
#include <locale.h>
#include <stdlib.h>
#include <wctype.h>

#define MEM_STEP 5

struct Sentence{
    wchar_t *snt;
    int size;
    int cnt;
    wchar_t  *spec_sym;
    int ln;
    int odd;
};

struct Text{
    struct Sentence **text;
    int size;
    int cnt;
};