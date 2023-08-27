#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <stdarg.h>
#include <math.h>
#include <getopt.h>
#include <png.h>

#define MAX_PATH 261

typedef struct{
    int width, height;
    png_byte color_type;
    png_byte bit_depth;

    png_structp png_ptr;
    png_infop info_png;
    int number_of_passes;
    png_bytep *row_pointers;
} png;

typedef struct{
    int Ref, Pnt, Sqr, Hex, type;
    int in, out;
    int dir; // false (vertical/not fill) - true (horizontal/fill)
    int xl, yl; // coords of the left top angle
    int xr, yr; // coords of the right bottom angle
    int r; // radius and coords of the center of the circle
    int bold, inform;
    char input_file[MAX_PATH], output_file[MAX_PATH];
    png_byte clr_line[4], clr_object[4];
} config;

void print_help(){
    printf("Руководство по использованию программы:\n");
    printf("-Программа обрабатывает PNG-файлы.\n");
    printf("-Для запуска программы необходимо передать следующие аргументы:\n");
    printf("\t./a.out  -- имя исполняемого файла.\n");
    printf("\tОсновная функция обработки изображения вводиться сразу же после имени исполняемого файла с заглавной буквы!\n");
    printf("-Список функций:\n");
    printf("\t--Reflect/-R -- функция отзеркаливания прямоугольной области, заданной в границах обрабатываемого изображения.\n");
    printf("\t\tP.S. Чтобы задать вертикальное или горизонтальное отражение, следует использовать флаги --vertical и --horizontal соответственно.\n");
    printf("\t--Pentagram/-P -- функция рисования пентаграммы в квадратной области.\n");
    printf("\t\tP.S. Может задаваться левой верхней и правой нижней вершинами квадрата через флаги --start и --end, а также окружностью через флаги --center и --radius.\n");
    printf("\t\tP.S. Может изменять цвет звезды с помощью флага --fill/-f.\n");
    printf("\t--Square/-S -- функция рисования прямоугольника.\n");
    printf("\t\tP.S. Может быть залит с помощью флага --fill/-f.\n");
    printf("\t--Hexagon/-H -- функция рисования шестиугольника в квадратной области.\n");
    printf("\t\tP.S. Может задаваться левой верхней и правой нижней вершинами квадрата через флаги --start и --end, а также окружностью через флаги --center и --radius.\n");
    printf("\t\tP.S. Может быть залит с помощью флага --fill/-f.\n");
    printf("\t--Information/-I -- функция вывода информации о изображении.\n");
    printf("\t<arg1>,<arg2> ... -- аргументы к ключу, если требуются (указаны в списке ключей, аргументы разделяются запятой).\n");
    printf("-Список ключей и их аргументы:\n");
    printf("\t--input/-i <имя файла> -- имя PNG-файла, который необходимо обработать. Он должен находиться в текущей директории.\n");
    printf("\t--output/-o <имя файла> -- имя PNG-файла, в который необходимо сохранить изменения. Он должен находиться в текущей директории.\n");
    printf("\t--help/-h -- вывод руководства по использованию программы.\n");
    printf("\t--bold/-b <целое число> -- установка значения толщины линий для функций с рисованием.\n");
    printf("\t--start/-s <челое число,целое число> -- установка значений координат левого верхнего угла прямоугольника.\n");
    printf("\t--end/-e <целое число,целое число> -- установка значений координат правого нижнего угла прямоугольника.\n");
    printf("\t--radius/-r <целое число> -- установка значения радиуса для функций, который могут работать в окружностью.\n");
    printf("\t--center/-c <целое число,целое число> -- установка значений координат центра окружности для функций, которые могут её обрабатывать.\n");
    printf("\t--color/-p <целое число,целое число,целое число,целое число> -- установка цвета линии для красного, зелёного, синего и альфа канала соответсвенно для фукнций рисования.\n");
    printf("\t--fill/-f <целое число,целое число,целое число,целое число> -- установка цвета заливки или второго цвета для красного, зелёного, синего и альфа канала соответсвенно для фукнций рисования.\n");
    printf("\t--vertical -- установка вертикальной оси для отражения.\n");
    printf("\t--horizontal -- установка горизонтальной оси для отражения.\n");
    printf("Пример рисования шестиугольника:\n");
    printf("\t ./a.out -H -c 0,0 -r 100 -b 10 -p 255,0,0,255 -f 255,255,0,255 -i img1.png -o img2.png\n");
}

void information(png *img){
    printf("Длина изображения: %d\nШирина изображения: %d\n", img->width, img->height);
}

int proc_comms(config *data, int opt){
    switch(opt){
        case 'h':
            printf("При необходимости инструкцию следует вызывать без каких-либо других флагов!\n");
            return 4;
        case 'i':
            data->in = sscanf(optarg, "%s", data->input_file);
            return 0;
        case 'o':
            data->out = sscanf(optarg, "%s", data->output_file);
            return 0;
        case 's':
            if(sscanf(optarg, "%d,%d", &data->xl, &data->yl) < 2){
                printf("Не удалось считать координаты левой верхней точки!\n");
                return 1;
            }
            data->type = 1;
            return 0;
        case 'e':
            if(sscanf(optarg, "%d,%d", &data->xr, &data->yr) < 2){
                printf("Не удалось считать координаты правой нижней точки!\n");
                return 1;
            }
            data->type = 1;
            return 0;
        case 'r':
            if(!data->Hex && !data->Pnt)
                return 2;
            if(sscanf(optarg, "%d", &data->r) == 0) {
                printf("Не удалось считать значение радиуса!\n");
                return 1;
            }
            if(data->r < 1){
                printf("Для корректной работы программы радиус должен быть положительным целым числом!\n");
                return 4;
            }
            return 0;
        case 'c':
            if(!data->Hex && !data->Pnt)
                return 2;
            if(sscanf(optarg, "%d,%d", &data->xr, &data->yr) < 2){
                printf("Не удалось считать координаты центра окружности!\n");
                return 1;
            }
            return 0;
        case 'p':
            if(data->Ref)
                return 2;

            if(sscanf(optarg, "%hhd,%hhd,%hhd,%hhd",
                      &data->clr_line[0],
                      &data->clr_line[1],
                      &data->clr_line[2],
                      &data->clr_line[3]) < 4){
                printf("Не удалось считать значения компонент переданного цвета линий!\n");
                return 1;
            }
            for(int i = 0; i < 4; i++)
                if(data->clr_line[i] < 0 || data->clr_line[i] > 255){
                    printf("Для корректной работы компоненты, задающие цвет, должны находиться в диапазоне от 0 до 255");
                    return 4;
                }
            for(int i = 0; i < 4; i++){
                data->clr_object[i] = data->clr_line[i];
            }
            return 0;
        case 'f':
            if(data->Ref)
                return 2;
            if(sscanf(optarg, "%hhd,%hhd,%hhd,%hhd",
                      &data->clr_object[0],
                      &data->clr_object[1],
                      &data->clr_object[2],
                      &data->clr_object[3]) < 4){
                printf("Не удалось считать значения компонент переданного цвета заливки!\n");
                return 1;
            }
            for(int i = 0; i < 4; i++)
                if(data->clr_line[i] < 0 || data->clr_line[i] > 255){
                    printf("Для корректной работы компоненты, задающие цвет, должны находиться в диапазоне от 0 до 255");
                    return 4;
                }
            data->dir = 1;
            return 0;
        case 'b':
            if(data->Ref)
                return 2;
            if(sscanf(optarg, "%d", &data->bold) == 0){
                printf("Не удалось считать значение толщины!\n");
                return 1;
            }
            if(data->bold < 1){
                printf("Для корректной работы программы толщина должена быть положительным целым числом!\n");
                return 4;
            }
            return 0;
        case 'v':
            if(!data->Ref)
                return 2;
            data->dir = 0;
            return 0;
        case 'l':
            if(!data->Ref)
                return 2;
            data->dir = 1;
            return 0;
        case 'R':
            return 3;
        case 'H':
            return 3;
        case 'P':
            return 3;
        case 'S':
            return 3;
        case 'I':
            return 0;
        default:
            return 1;
    }
}

int read_png_file(char *file_name, png *image){
    char header[8];
    FILE *fp = fopen(file_name, "rb");
    if(!fp){
        printf("Файл с именем <%s> не найден!\n", file_name);
        return 1;
    }
    fread(header, 1, 8, fp);
    if(png_sig_cmp(header, 0, 8)){
        printf("Файл не определён, как файл типа PNG!\nСледует проверить тип передаваемого файла!\n");
        fclose(fp);
        return 1;
    }
    image->png_ptr = png_create_read_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
    if(!image->png_ptr){
        printf("Не удалось считать структуру предлагаемого файла!\n");
        fclose(fp);
        return 1;
    }
    image->info_png = png_create_info_struct(image->png_ptr);
    if(!image->info_png){
        printf("Не удалось считать информацию об изображении!\n");
        fclose(fp);
        return 1;
    }
    if(setjmp(png_jmpbuf(image->png_ptr))){
        printf("Ошибка получения данных!\n");
        fclose(fp);
        return 1;
    }
    png_init_io(image->png_ptr, fp);
    png_set_sig_bytes(image->png_ptr, 8);

    png_read_info(image->png_ptr, image->info_png);

    image->width = png_get_image_width(image->png_ptr, image->info_png);
    image->height = png_get_image_height(image->png_ptr, image->info_png);
    image->color_type = png_get_color_type(image->png_ptr, image->info_png);
    image->bit_depth = png_get_bit_depth(image->png_ptr, image->info_png);

    image->number_of_passes = png_set_interlace_handling(image->png_ptr);

    png_read_update_info(image->png_ptr, image->info_png);

    if(setjmp(png_jmpbuf(image->png_ptr))){
        printf("Ошибка обработки цветов!\n");
        fclose(fp);
        return 1;
    }
    image->row_pointers = (png_bytep *)malloc(sizeof(png_bytep) * image->height);
    for(int y = 0; y < image->height; y++){
        image->row_pointers[y] = (png_byte *) malloc(png_get_rowbytes(image->png_ptr, image->info_png));
    }
    png_read_image(image->png_ptr, image->row_pointers);
    fclose(fp);
    return 0;
}

void write_png_file(char *file_name, png *image){
    FILE *fp = fopen(file_name, "wb");
    if(!fp){
        printf("Файл с именем <%s> не найден!\n", file_name);
        return;
    }
    image->png_ptr = png_create_write_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
    if(!image->png_ptr){
        printf("Не удалось записать структуру предлагаемого файла!\n");
        for(int y = 0; y < image->height; y++){
            free(image->row_pointers[y]);
        }
        free(image->row_pointers);
        fclose(fp);
        return;
    }

    image->info_png = png_create_info_struct(image->png_ptr);
    if(!image->info_png){
        printf("Не удалось записать информацию об обработонном файле!\n");
        for(int y = 0; y < image->height; y++){
            free(image->row_pointers[y]);
        }
        free(image->row_pointers);
        fclose(fp);
        return;
    }
    if(setjmp(png_jmpbuf(image->png_ptr))){
        printf("Не удалось передать информацию о изображение!\n");
        for(int y = 0; y < image->height; y++){
            free(image->row_pointers[y]);
        }
        free(image->row_pointers);
        fclose(fp);
        return;
    }
    png_init_io(image->png_ptr, fp);

    if (setjmp(png_jmpbuf(image->png_ptr))){
        printf("Не удалось составить загаловок файла!\n");
        for(int y = 0; y < image->height; y++){
            free(image->row_pointers[y]);
        }
        free(image->row_pointers);
        fclose(fp);
        return;
    }
    png_set_IHDR(image->png_ptr, image->info_png, image->width, image->height,
                 image->bit_depth, image->color_type, PNG_INTERLACE_NONE,
                 PNG_COMPRESSION_TYPE_BASE, PNG_FILTER_TYPE_BASE );
    png_write_info(image->png_ptr, image->info_png);

    if(setjmp(png_jmpbuf(image->png_ptr))){
        printf("Не удалось передать информацию о цветах\n");
        for(int y = 0; y < image->height; y++){
            free(image->row_pointers[y]);
        }
        free(image->row_pointers);
        fclose(fp);
        return;
    }

    png_write_image(image->png_ptr, image->row_pointers);

    if(setjmp(png_jmpbuf(image->png_ptr))){
        printf("Некорректное завершение записи!\n");
        for(int y = 0; y < image->height; y++){
            free(image->row_pointers[y]);
        }
        free(image->row_pointers);
        fclose(fp);
        return;
    }

    png_write_end(image->png_ptr, NULL);

    for(int y = 0; y < image->height; y++){
        free(image->row_pointers[y]);
    }
    free(image->row_pointers);
    fclose(fp);
}

void Reflect(int line, int x0, int y0, int x1, int y1, png *img){
    int wdth = x1 - x0, hght = y1 - y0;
    if(line){
        for(int y = y0; y < y0 + hght / 2; y++){
            png_byte *row_str = img->row_pointers[y];
            png_byte *row_fnsh = img->row_pointers[y0 + y1 - y - 1];
            for(int x = x0; x < x1; x++){
                png_bytep ptr_str = &(row_str[x * 4]);
                png_bytep ptr_fnsh = &(row_fnsh[x * 4]);
                for(int i = 0; i < 4; i++){
                    png_byte sw = ptr_str[i];
                    ptr_str[i] = ptr_fnsh[i];
                    ptr_fnsh[i] = sw;
                }
            }
        }
    }
    else{
        for(int y = y0; y < y1; y++){
            png_byte *row = img->row_pointers[y];
            for(int x = x0; x < x0 + wdth / 2; x++){
                png_bytep ptr_str = &(row[x * 4]);
                png_bytep ptr_fnsh = &(row[(x0 + x1 - x - 1) * 4 ]);

                for(int i = 0; i < 4; i++){
                    png_byte sw = ptr_str[i];
                    ptr_str[i] = ptr_fnsh[i];
                    ptr_fnsh[i] = sw;
                }
            }
        }
    }
}



void DrawPixel(png* img, int x0, int y0, png_bytep color, int **mask){
    if(x0 < 0 || x0 >= img->width || y0 < 0 || y0 >= img->height)
        return;
    img->row_pointers[y0][x0 * 4] = color[0];
    img->row_pointers[y0][x0 * 4 + 1] = color[1];
    img->row_pointers[y0][x0 * 4 + 2] = color[2];
    img->row_pointers[y0][x0 * 4 + 3] = color[3];
    mask[y0 + 1][x0 + 1] = 1;
}

void DrawLine(png *img, int x0, int y0, int x1, int y1, int bold, png_bytep color, int **mask){
    int dx, dy, flag, flagx, flagy;
    dy = y1 - y0;
    dx = x0 - x1;
    flag = abs(dy) > abs(dx) ? 1 : -1;
    flagx = dx < 0 ? -1 : 1;
    flagy = dy < 0 ? -1 : 1;
    int derr = 0;
    for(int y = y0 - bold / 2; y <= y0 + bold / 2; y++){
        for(int x = x0 - bold / 2; x <= x0 + bold / 2; x++){
            if((x - x0) * (x - x0) + (y - y0) * (y - y0) <= (bold / 2) * (bold / 2)){
                DrawPixel(img, x, y, color, mask);
            }
        }
    }
    int xt = x0, yt = y0;
    if(flag == -1){
        while(xt != x1 || yt != y1){
            derr += dy * flagy;
            if(derr > 0){
                derr -= dx * flagx;
                yt += flagy;
            }
            xt -= flagx;
            for(int y = yt - bold / 2; y <= yt + bold / 2; y++){
                for(int x = xt - bold / 2; x <= xt + bold / 2; x++){
                    if((x - xt) * (x - xt) + (y - yt) * (y - yt) <= (bold / 2) * (bold / 2)){
                        DrawPixel(img, x, y, color, mask);
                    }
                }
            }
        }
    }
    else{
        while(xt != x1 || yt != y1){
            derr += dx * flagx;
            if(derr > 0){
                derr -= dy * flagy;
                xt -= flagx;
            }
            yt += flagy;
            for(int y = yt - bold / 2; y <= yt + bold / 2; y++){
                for(int x = xt - bold / 2; x <= xt + bold / 2; x++){
                    if((x - xt) * (x - xt) + (y - yt) * (y - yt) <= (bold / 2) * (bold / 2)){
                        DrawPixel(img, x, y, color, mask);
                    }
                }
            }
        }
    }
}

void DrawCircle(png *img, int x0, int y0, int R, png_bytep color, int **mask){
    int delta = 1 - 2 * R, err = 0, x = 0, y = R;
    while(y >= x){
        DrawPixel(img, x0 + x, y0 + y, color, mask);
        DrawPixel(img, x0 + x, y0 - y, color, mask);
        DrawPixel(img, x0 - x, y0 + y, color, mask);
        DrawPixel(img, x0 - x, y0 - y, color, mask);
        DrawPixel(img, x0 + y, y0 + x, color, mask);
        DrawPixel(img, x0 + y, y0 - x, color, mask);
        DrawPixel(img, x0 - y, y0 + x, color, mask);
        DrawPixel(img, x0 - y, y0 - x, color, mask);
        err = 2 * (delta + y) - 1;
        if((delta < 0) && (err <= 0)){
            delta += 2 * ++x + 1;
            continue;
        }
        if((delta > 0) && (err > 0)){
            delta -= 2 * --y + 1;
            continue;
        }
        delta += 2 * (++x - --y);
    }
}

void DrawPentogram(png *img, int typeio, int x0, int y0, int x1, int y1, int R, int bold, png_bytep clr1, png_bytep clr2, int **mask){
    if(typeio){
        R = (x1 - x0)/2;
        x0 = x1 - R;
        y0 = y1 - R;
    }
    else{
        x0 = x1, y0 = y1;
    }
    if(bold > R/2) // error
        return;
    DrawCircle(img, x0, y0, R, clr1, mask);
    DrawCircle(img, x0, y0, R + bold, clr1, mask);
    for(int y = y0 - R - bold; y <= y0 + R + bold; y++){
        for(int x = x0 - R - bold; x <= x0 + R + bold; x++){
            if((x - x0) * (x - x0) + (y - y0)  * (y - y0) < R * R)
                continue;
            else if((x - x0) * (x - x0) + (y - y0) * (y - y0) <= (R + bold) * (R + bold)){
                DrawPixel(img, x, y, clr1, mask);
            }
        }
    }
    int xt = (int)ceil((R + bold / 2) * sinl(72.0 / 180.0 * M_PI)),
            yt = (int)ceil( (R + bold / 2)  * cosl(72.0 / 180.0 * M_PI)),
            xb = (int)ceil((R + bold / 2) * sinl(144.0 / 180.0 * M_PI)),
            yb = (int)ceil((R + bold / 2) * cos(144.0 / 180.0 * M_PI));
    DrawLine(img, x0 - xt, y0 - yt, x0 + xt, y0 - yt, bold / 2, clr2, mask);
    DrawLine(img, x0 + xt, y0 - yt, x0 - xb, y0 - yb, bold / 2, clr2, mask);
    DrawLine(img, x0 - xb, y0 - yb, x0, y0 - R - bold / 2, bold / 2, clr2, mask);
    DrawLine(img, x0, y0 - R - bold / 2, x0 + xb, y0 - yb, bold / 2, clr2, mask);
    DrawLine(img, x0 + xb, y0 - yb, x0 - xt, y0 - yt, bold / 2, clr2, mask);
}

int PtrInside(int x0, int y0, int ptr1[], int ptr2[], int ptr3[]){
    int size1 = (ptr1[0] - x0) * (ptr2[1] - ptr1[1]) - (ptr2[0] - ptr1[0]) * (ptr1[1] - y0),
    size2 = (ptr2[0] - x0) * (ptr3[1] - ptr2[1]) - (ptr3[0] - ptr2[0]) * (ptr2[1] - y0),
    size3 = (ptr3[0] - x0) * (ptr1[1] - ptr3[1]) - (ptr1[0] - ptr3[0]) * (ptr3[1] - y0);
    return (size1 > 0 && size2 > 0 && size3 > 0) || (size1 < 0 && size2 < 0 && size3 < 0);
}

void filling(png *img, int x0, int y0, png_bytep color, int **mask){
    int x = x0, y = y0;
    if(mask[y][x])
        return;
    int **stack = (int **) malloc(sizeof(int *) * img->height * img->width);
    int idx = 0;
    stack[idx++] = (int *) malloc(sizeof(int) * 4);
    stack[idx - 1][0] = x, stack[idx - 1][1] = x, stack[idx - 1][2] = y, stack[idx - 1][3] = 1;
    stack[idx++] = (int *) malloc(sizeof(int) * 4);
    stack[idx - 1][0] = x, stack[idx - 1][1] = x, stack[idx - 1][2] = y - 1, stack[idx - 1][3] = -1;
    while(idx > 0){
        y = stack[idx - 1][2];
        int x1 = stack[idx - 1][0], x2 = stack[idx - 1][1], dy = stack[idx - 1][3];
        x = x1;
        free(stack[--idx]);
        if(!mask[y][x])
            while(!mask[y][x - 1]) {
                DrawPixel(img, x - 2, y - 1, color, mask);
                x--;
            }
        if(x < x1){
            stack[idx++] = (int *)malloc(sizeof(int) * 4);
            stack[idx - 1][0] = x, stack[idx - 1][1] = x1 - 1, stack[idx - 1][2] = y - dy, stack[idx - 1][3] = -dy;
        }
        while(x1 <= x2){
            while(!mask[y][x1]){
                DrawPixel(img, x1 - 1, y - 1, color, mask);
                x1++;
                stack[idx++] = (int *)malloc(sizeof(int) * 4);
                stack[idx - 1][0] = x, stack[idx - 1][1] = x1 - 1, stack[idx - 1][2] = y + dy, stack[idx - 1][3] = dy;
                if(x1 - 1 > x2){
                    stack[idx++] = (int *)malloc(sizeof(int) * 4);
                    stack[idx - 1][0] = x2 + 1, stack[idx - 1][1] = x1 - 1, stack[idx - 1][2] = y - dy, stack[idx - 1][3] = -dy;
                }
            }
            x1++;
            while(x1 < x2 && mask[y][x1])
                x1++;
            x = x1;
        }
    }
    free(stack);
}

void DrawSquare(png *img, int fill, int x0, int y0, int x1, int y1, int bold, png_bytep clr_line, png_bytep clr_fill, int **mask) {
    if (bold > img->height / 2 || bold > img->width / 2)
        return;
    for (int i = 0; i < bold; i++) {
        DrawLine(img, x0 - i, y0 - i, x1 + i, y0 - i, 1, clr_line, mask);
        DrawLine(img, x1 + i, y0 - i, x1 + i, y1 + i, 1, clr_line, mask);
        DrawLine(img, x1 + i, y1 + i, x0 - i, y1 + i, 1, clr_line, mask);
        DrawLine(img, x0 - i, y1 + i, x0 - i, y0 - i, 1, clr_line, mask);
    }

    if (fill)

        for (int y = y0 + 1; y < y1; y++) {
            for (int x = x0 + 1; x < x1; x++){
                if(x >= 0 && x < img->width && y >= 0 && y < img->height && !mask[y][x]) {
                    filling(img, x, y, clr_fill, mask);
                    return;
                }
        }
    }
}

void DrawHexagon(png* img, int typeio, int fill, int x0, int y0, int x1, int y1, int R, int bold, png_bytep color, png_bytep clr_fill, int **mask) {
    //need square
    int ptrs[6][2];
    if(typeio){
        R = (x1 - x0)/2;
        x1 -= R;
        y1 -= R;
    }

    x0 = x1 + ((R + bold / 2) * cosl(30.0 / 180.0 * M_PI));
    y0 = y1 + ((R + bold / 2) * sinl(30.0 / 180.0 * M_PI));
    for (int i = 1; i <= 6; i++) {
        double angl = (60.0 * i + 30.0) / 180.0 * M_PI;
        DrawLine(img, x0, y0, x1 + (R + bold / 2) * cosl(angl), y1 + (R + bold / 2) * sinl(angl), bold, color, mask);
        x0 = x1 + ((R + bold / 2) * cosl(angl));
        y0 = y1 + ((R + bold / 2) * sinl(angl));
        ptrs[i - 1][0] = x0 - (bold / 2) * cosl(angl),
        ptrs[i - 1][1] = y0 - (bold / 2) * sinl(angl);
    }
    if(fill)
        for(int y = ptrs[3][1] + 1; y < ptrs[0][1]; y++)
            for(int x = ptrs[1][0] + 1; x < ptrs[4][0]; x++)
                for(int i = 1; i < 5; i++)
                    if(x >= 0 && y >= 0 && x < img->width && y < img->height && !mask[y][x]
                    && PtrInside(x, y, ptrs[0], ptrs[i], ptrs[i + 1]))
                        filling(img, x, y, clr_fill, mask);


}



int main(int argc, char **argv){
    config values = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 1, 0, "\0", "\0"};
    for(int i = 0; i < 4; i++){
        values.clr_line[i] = 0;
        values.clr_object[i] = 0;
    }
    char *opts = "hi:o:b:s:e:r:c:p:f:vlRPHSI";
    struct option longOpts[]={
            {"input", required_argument, NULL, 'i'},
            {"output", required_argument, NULL, 'o'},
            {"start", required_argument, NULL, 's'},
            {"end", required_argument, NULL, 'e'},
            {"radius", required_argument, NULL, 'r'},
            {"center", required_argument, NULL, 'c'},
            {"color", required_argument, NULL, 'p'},
            {"fill", required_argument, NULL, 'f'},
            {"vertical", no_argument, NULL, 'v'},
            {"horizontal", no_argument, NULL, 'l'},
            {"help", no_argument, NULL, 'h'},
            {"thickness", required_argument, NULL, 'b'},
            {"Reflect", no_argument, NULL, 'R'},
            {"Square", no_argument, NULL, 'S'},
            {"Hexagon", no_argument, NULL, 'H'},
            {"Pentagram", no_argument, NULL, 'P'},
            {"Information", no_argument, NULL, 'I'}
    };
    int long_idx;
    int opt = getopt_long(argc, argv, opts, longOpts, &long_idx);
    if(opt == -1){
        printf("Не обнаруженно корректных флагов!\n");
        return 0;
    }
    int code_func;
    switch(opt){
        case 'R':
            values.Ref = 1;
            break;
        case 'S':
            values.Sqr = 1;
            break;
        case 'H':
            values.Hex = 1;
            break;
        case 'P':
            values.Pnt = 1;
            break;
        case 'I':
            values.inform = 1;
            break;
        case 'h':
            print_help();
            return 0;
        default:
            printf("Не обнаружено флага функции обработки изображения!\n");
            printf("Для корректной работы первым флагом следует подавать флаг на такую функцию!\n");
            return 0;
    }
    opt = getopt_long(argc, argv, opts, longOpts,&long_idx);
    while(opt != -1){
        code_func = proc_comms(&values, opt);
        if(code_func){
            switch(code_func){
                case 1:
                    printf("Проверьте корректность формата ввода.\n");
                    return 0;
                case 2:
                    printf("Для вызванной функции были добавлены лишние аргументы!\n");
                    return 0;
                case 3:
                    printf("Ошибка при попытке вызвать несколько функций обработки изображения!\n");
                    printf("Для корректной работы программы требуется ввести флаг одной функции!\n");
                    return 0;
                default:
                    return 0;
            }
        }
        opt = getopt_long(argc, argv, opts, longOpts, &long_idx);
    }
    if(!values.in){
        printf("Не удалось получить название считываемого файла!\n");
        return 0;
    }
    png *img = (png*)malloc(sizeof(png));
    code_func = read_png_file(values.input_file, img);
    if(code_func){
        for(int y = 0; y < img->height; y++){
            free(img->row_pointers[y]);
        }
        free(img->row_pointers);
       free(img);
       return 0;
    }
    if(values.inform){
        information(img);
        for(int y = 0; y < img->height; y++){
            free(img->row_pointers[y]);
        }
        free(img->row_pointers);
        free(img);
        return 0;
    }
    if(!values.out){
        printf("Не удалось получить название файла для записи!\n");
        for(int y = 0; y < img->height; y++){
            free(img->row_pointers[y]);
        }
        free(img->row_pointers);
        free(img);
        return 0;
    }
    int **mask = (int **) malloc(sizeof(int *) * (img->height + 2));
    for(int y = 0; y < (img->height + 2); y++){
        mask[y] = (int *) calloc((img->width + 2), sizeof(int));
        mask[y][0] = 1, mask[y][img->width + 1] = 1;
    }
    for(int x = 0; x < (img->width + 2); x++){
        mask[0][x] = 1, mask[img->height + 1][x] = 1;
    }

    if(values.Ref){
        if(values.xl > values.xr || values.yl > values.yr){
            printf("Введённые точки не могут являться координатами левого верхнего и правого нижнего угла прямоугольника!\n");
            for(int x = 0; x < img->height + 2; x++)
                free(mask[x]);
            free(mask);
            for(int y = 0; y < img->height; y++){
                free(img->row_pointers[y]);
            }
            free(img->row_pointers);
            free(img);
            return 0;
        }
        if(values.xl < 0 || values.xr >= img->width || values.yl < 0 || values.yr >= img->height){
            printf("Невозможно отразить область, выходящую за пределы изображения!\n");
            for(int x = 0; x < img->height + 2; x++)
                free(mask[x]);
            free(mask);
            for(int y = 0; y < img->height; y++){
                free(img->row_pointers[y]);
            }
            free(img->row_pointers);
            free(img);
            return 0;
        }
        Reflect(values.dir, values.xl, values.yl, values.xr, values.yr, img);
    }
    else if(values.Pnt){
        if(values.type && (values.xl > values.xr || values.yl > values.yr || values.xr - values.xl != values.yr - values.yl)){
            printf("Введённые точки не могут являться координатами левого верхнего и правого нижнего угла квадрата!\n");
            for(int x = 0; x < img->height + 2; x++)
                free(mask[x]);
            free(mask);
            for(int y = 0; y < img->height; y++){
                free(img->row_pointers[y]);
            }
            free(img->row_pointers);
            free(img);
            return 0;
        }
        DrawPentogram(img, values.type, values.xl, values.yl,
                      values.xr, values.yr, values.r, values.bold,
                      values.clr_line, values.clr_object, mask);
    }
    else if(values.Hex){
        if(values.type && (values.xl > values.xr || values.yl > values.yr || values.xr - values.xl != values.yr - values.yl) ){
            printf("Введённые точки не могут являться координатами левого верхнего и правого нижнего угла квадрата!\n");
            for(int x = 0; x < img->height + 2; x++)
                free(mask[x]);
            free(mask);
            for(int y = 0; y < img->height; y++){
                free(img->row_pointers[y]);
            }
            free(img->row_pointers);
            free(img);
            return 0;
        }

        DrawHexagon(img, values.type, values.dir, values.xl, values.yl,
                    values.xr, values.yr, values.r, values.bold,
                    values.clr_line, values.clr_object, mask);
    }
    else if(values.Sqr){
        if(values.xl > values.xr || values.yl > values.yr){
            printf("Введённые точки не могут являться координатами левого верхнего или правого нижнего угла прямоугольника!\n");
            for(int x = 0; x < img->height + 2; x++)
                free(mask[x]);
            free(mask);
            for(int y = 0; y < img->height; y++){
                free(img->row_pointers[y]);
            }
            free(img->row_pointers);
            free(img);
            return 0;
        }
        DrawSquare(img, values.dir, values.xl, values.yl, values.xr, values.yr,
                   values.bold, values.clr_line, values.clr_object, mask);
    }
    write_png_file(values.output_file, img);
    for(int x = 0; x < img->height + 2; x++)
        free(mask[x]);
    free(mask);
    free(img);
}