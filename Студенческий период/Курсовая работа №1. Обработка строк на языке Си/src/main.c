#include "main.h"
#include "communicate.h"
#include "tasks.h"
#include "read_text.h"

int main() {
    setlocale(LC_ALL, "");
    wprintf(L"Здравствуйте, уважаемый пользователь! Вас приветствует программа обработки текста.\n");
    wprintf(L"Сейчас Вам будет предложенно ввести свой текст для обработки, после чего Вы можете выбрать действие из списка.\n");
    wprintf(L"Предложения следует разделять одним пробелом. Текст считается завершённым после  переноса строки.\n");
    wprintf(L"------------------------------------------------------------------------------------------------\n");
    wprintf(L"Введите свой текст:\n");
    struct Text *exp = read_text();
    if(exp == NULL) {
        return 0;
    }
    wprintf(L"------------------------------------------------------------------------------------------------\n");
    wprintf(L"Список возможных действий:\n");
    wprintf(L"\t1: Сделать транслитерацию всех кириллических символов в тексте.\n");
    wprintf(L"\t2: Для каждого предложения вывести все специальные символы в порядке уменьшения их кода.\n");
    wprintf(L"\t3: Заменить все цифры в тексте их двоичным кодом.\n");
    wprintf(L"\t4: Удалить все предложения в которых есть нечетные цифры.\n");
    wprintf(L"\t0: Завершить обработку.\n");
    int action;
    do {
        wprintf(L"------------------------------------------------------------------------------------------------\n");
        wprintf(L"Введите номер команды: ");
        action = getwchar() - L'0';
        getwchar();
        switch (action) {
            case 1:
                translit(exp);
                wprintf(L"------------------------------------------------------------------------------------------------\n");
                wprintf(L"Полученные результат:\n");
                print_text(exp);
                break;
            case 2:
                wprintf(L"------------------------------------------------------------------------------------------------\n");
                wprintf(L"Полученные результат:\n");
                special_sym(exp);
                break;
            case 3:
		bin_digit(exp);
                wprintf(L"------------------------------------------------------------------------------------------------\n");
                wprintf(L"Полученные результат:\n");
                print_text(exp);
                break;
            case 4:
                delete_snt(exp);
                wprintf(L"------------------------------------------------------------------------------------------------\n");
                wprintf(L"Полученные результат:\n");
                print_text(exp);
                break;
            case 0:
                wprintf(L"Приятного Вам дня!\n");
                break;
            default:
                wprintf(L"Неизвестная команда! Проверь наличие такой команды в списке.\n");
        }
    } while (action);
    clean_memory(exp->text, exp->cnt);
}
